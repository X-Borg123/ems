import React, { useEffect, useState } from "react";
import { Table } from "../common/Table";
import { observer } from "mobx-react-lite";
import PageLayout from "../layout/PageLayout";
import { SearchInput } from "../common/Input";
import { ActionButton, SubmitLink } from "../common/Button";
import { EMPLOYEE_TABLE_HEADER } from "../constants/Constants";
import { employeeStore } from "../../stores/employee.store";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const EmployeeList = observer(() => {
  const {
    employeeList,
    employee,
    loading,
    totalUpdateEmployee,
    showUniqueEmployee,
    fetchEmployees,
    countEmployee,
    deleteEmployee,
  } = employeeStore;
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchValue, setSearchedValue] = useState(null);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (showUniqueEmployee) {
      countEmployee();
    } else {
      fetchEmployees();
    }
  }, []);

  useEffect(() => {
    if (employeeList) {
      setFilteredEmployees(employeeList);
    } else if (totalUpdateEmployee) {
      setFilteredEmployees(totalUpdateEmployee);
    }
  }, [employeeList, totalUpdateEmployee]);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchedValue(e.target.value);

    const records = employeeList.filter(
      (emp) =>
        emp?.employeeId.toLowerCase().includes(searchValue) ||
        emp?.userId?.name.toLowerCase().includes(searchValue) ||
        emp?.department?.dep_name.toLowerCase().includes(searchValue) ||
        emp?.employeeType.toLowerCase().includes(searchValue)
    );

    setFilteredEmployees(records);
  };

  // Sort filteredEmployees
  const sortedEmployeeList = [...filteredEmployees].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const confirmDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedEmployee) return;
    try {
      const success = await deleteEmployee(selectedEmployee._id);
      if (success) {
        toast.success("Employee deleted successfully");
        await fetchEmployees();
      } else {
        toast.error(error || "Failed to delete employee");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the employee");
    } finally {
      setShowModal(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <PageLayout title={"Employee List"} maxWidth={"max-w-8xl"}>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 w-full">
        <SearchInput
          placeholder={"Search employee..."}
          handleChange={handleFilter}
          value={searchValue ?? ""}
        />
        <SubmitLink urlLink={"../add-employee"} name={"Add New Employee"} />
      </div>
      <Table
        headings={EMPLOYEE_TABLE_HEADER}
        data={sortedEmployeeList}
        isLoading={loading}
        isSerialNo={true}
        renderRow={(emp) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {emp?.employeeId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {emp?.userId.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
              <img
                src={`${baseURL}/${emp?.userId.profileImage}`}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                alt="Profile Image"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {emp?.department.dep_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {emp?.employeeType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
              <div className="flex space-x-3">
                <ActionButton
                  onClick={() => navigate(`../employees/${emp._id}`)}
                  name={"View"}
                  className={"bg-cyan-600 hover:bg-cyan-700"}
                />
                <ActionButton
                  onClick={() => navigate(`../employees/edit/${emp._id}`)}
                  name={"Edit"}
                  className={"bg-yellow-600 hover:bg-yellow-700"}
                />
                <ActionButton
                  onClick={() => navigate(`../salary/employee/${emp._id}`)}
                  name={"Salary"}
                  className={"bg-green-600 hover:bg-green-700"}
                />
                <ActionButton
                  onClick={() => navigate(`../employees/leaves/${emp._id}`)}
                  name={"Leave"}
                  className={"bg-violet-600 hover:bg-violet-700"}
                />
                <ActionButton
                  onClick={() => confirmDelete(emp)}
                  name={"Delete"}
                  className={"bg-red-600 hover:bg-red-700"}
                />
              </div>
            </td>
          </>
        )}
      />
      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
        itemName={selectedEmployee?.userId?.name}
      />
    </PageLayout>
  );
});

export default EmployeeList;
