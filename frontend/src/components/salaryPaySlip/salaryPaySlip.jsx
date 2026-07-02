import React from "react";

const SalarySlip = ({ data }) => {
  const {
    payDate,
    employeeId,
    basicSalary,
    revenueTotal,
    deductionTotal,
    netSalary,
    kumoCareAllowance,
    sgdAllowance,
    overtime,
    homageDeduction,
    yearEndBonus,
    birthdayBonus,
    advanceSalary,
    absentDeduction,
  } = data;

  const name = employeeId?.userId?.name || "-";
  const empId = employeeId?.employeeId || "-";
  const position = employeeId?.designation || "-";

  let salaryComponent;
  if (sgdAllowance > 0) {
    salaryComponent = parseFloat(((basicSalary || 0) * (sgdAllowance || 1)) / 2000 - basicSalary);
  } else {
    salaryComponent = basicSalary;
  }

  return (
    <div id="salary-slip" className="w-[600px] p-6 bg-white border border-gray-300 text-sm">
      <h2 className="text-center text-lg font-bold mb-1">
        Employee Salary for{" "}
        {new Date(payDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <p className="text-center font-semibold text-gray-700 mb-4">
        SGD rate 1SGD = 2400Ks
      </p>

      {/* Employee Info */}
      <table className="w-full mb-4">
        <tbody>
          <tr>
            <td className="font-semibold">Date:</td>
            <td>{new Date(payDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="font-semibold">Employee ID:</td>
            <td>{empId}</td>
          </tr>
          <tr>
            <td className="font-semibold">Employee Name:</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td className="font-semibold">Position:</td>
            <td>{position}</td>
          </tr>
        </tbody>
      </table>

      {/* Revenue Section */}
      <h3 className="bg-orange-200 px-2 py-1 font-semibold">Revenue</h3>
      <table className="w-full mb-4">
        <tbody>
          <tr>
            <td>Basic Salary</td>
            <td>{basicSalary}</td>
          </tr>
          <tr>
            <td>Kumo Care Allowance</td>
            <td>{kumoCareAllowance || 0}</td>
          </tr>
          <tr>
            <td>SGD rate Allowance</td>
            <td>{salaryComponent || "-"}</td>
          </tr>
          {overtime > 0 && (
            <tr>
              <td>Overtime</td>
              <td>{overtime}</td>
            </tr>
          )}
          {birthdayBonus > 0 && (
            <tr>
              <td>Birthday Bonus</td>
              <td>{birthdayBonus}</td>
            </tr>
          )}
          {yearEndBonus > 0 && (
            <tr>
              <td>Year End Bonus</td>
              <td>{yearEndBonus}</td>
            </tr>
          )}
          <tr className="font-semibold">
            <td>Revenue Total</td>
            <td>{revenueTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Deduction Section */}
      <h3 className="bg-orange-200 px-2 py-1 font-semibold">Deduction</h3>
      <table className="w-full mb-4">
        <tbody>
          {advanceSalary > 0 && (
            <tr>
              <td>Advanced Salary</td>
              <td>{advanceSalary}</td>
            </tr>
          )}
          {homageDeduction > 0 && (
            <tr>
              <td>Paying Homage</td>
              <td>{homageDeduction}</td>
            </tr>
          )}
          {absentDeduction > 0 && (
            <tr>
              <td>Absent Deduction</td>
              <td>{absentDeduction}</td>
            </tr>
          )}
          <tr className="font-semibold">
            <td>Deduction Total</td>
            <td>{deductionTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Net Salary */}
      <div className="bg-blue-100 px-4 py-3 font-bold text-md">
        Total Net Salary: {netSalary}
      </div>
    </div>
  );
};

export default SalarySlip;
