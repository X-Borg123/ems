import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "../common/Table";
import { useAuth } from "../../context/authContext";
import { observer } from "mobx-react-lite";
import PageLayout from "../layout/PageLayout";
import { salaryStore } from "../../stores/salary.store";
import { SALARY_HEADER } from "../constants/Constants";
import { Download } from "lucide-react";
import SalarySlip from "../salaryPaySlip/salaryPaySlip";
import html2canvas from "html2canvas";
import { toJS } from "mobx";


const ViewSalary = observer(() => {
  const { id, payDate } = useParams();
  const { user } = useAuth();

  const { salaries, loading, salariesByPayDate, fetchSalariesByPayDate, fetchSalaries } = salaryStore;

   useEffect(() => {
    if (payDate) {
      fetchSalariesByPayDate(payDate);
    } else if (id) {
      fetchSalaries(id);
    }
  }, [id, payDate]);

   const salaryData = payDate ? salariesByPayDate : salaries;

   const handleDownload = async (item) => {
  // Create a temporary container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  document.body.appendChild(container);

  // Render React component inside it
  const tempRoot = document.createElement("div");
  container.appendChild(tempRoot);

  import("react-dom/client").then(({ createRoot }) => {
    const root = createRoot(tempRoot);
    root.render(<SalarySlip data={item} />);

    setTimeout(async () => {
      const canvas = await html2canvas(tempRoot);
      const link = document.createElement("a");
      link.download = `salary-slip-${item.employeeId?.employeeId}-${item.employeeId?.userId?.name}.png`;
      link.href = canvas.toDataURL();
      link.click();

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    }, 500); // Wait a moment to ensure rendering
  });
};


  return (
    <PageLayout
      title={
        payDate
          ? "Salary by Pay Date"
          : user.role === "employee"
          ? "My Salary"
          : "Employee Salary"
      }
    >
      <Table
        headings={SALARY_HEADER}
        data={salaryData}
        isLoading={loading}
        isSerialNo={true}
        renderRow={(item) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.employeeId.employeeId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item?.employeeId?.userId?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.basicSalary}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.revenueTotal}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.deductionTotal}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.netSalary}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {new Date(item.payDate).toLocaleDateString()}
            </td>
            <td className="px-14 py-6 whitespace-nowrap text-green-600 hover:text-green-700 cursor-pointer" onClick={() => handleDownload(item)}>
              <Download size={20}/>
            </td>
          </>
        )}
      />
    </PageLayout>
  );
});

export default ViewSalary;
