import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton, SubmitLink } from "../common/Button";
import { Table } from "../common/Table";
import { observer } from "mobx-react-lite";
import PageLayout from "../layout/PageLayout";
import { leaveStore } from "../../stores/leave.store";
import { SearchInput } from "../common/Input";
import { CheckCircle, ClipboardList, Clock, UserPen, XCircle } from "lucide-react";
import { ADMIN_LEAVE_LIST_HEADER } from "../constants/Constants";
import { toJS } from "mobx";

const AdminLeaveList = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const usersPerPage = 10;

  const { leaves, loading, activeStatus, filteredByStatus, fetchAdminLeaves } = leaveStore;

  useEffect(() => {
    if (activeStatus) {
      filteredByStatus(activeStatus);
    }
  }, [activeStatus]);

  useEffect(() => {
    if(leaves){
      setFilteredLeaves(leaves);
    }
  },[leaves])

  // Calculate Days
  const getDays = (start, end, halfDay = { type: "none" }) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const fullDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // If it's a half day, subtract 0.5
    const adjustedDays =
      halfDay && halfDay.type !== "none" ? fullDays - 0.5 : fullDays;

    return adjustedDays;
  };

  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
    const searchValue = e.target.value.toLowerCase();
    const results = leaves?.filter((leave) => 
      leave?.employeeId?.userId?.name.toLowerCase()
      .includes(searchValue) ||
      leave?.status.toLowerCase().includes(searchValue)
    );

    setFilteredLeaves(results);
    setCurrentPage(1);  
  }

  const sortedLeaves = [...filteredLeaves].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentLeaves = sortedLeaves.slice(
    indexOfFirstUser,
    indexOfLastUser
  )

   // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <PageLayout title={"Manage Leaves"}>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 w-full">
        <SearchInput
          placeholder="Search Employee..."
          handleChange={(e) => handleFilter(e)}
          value={searchTerm}
          isLoading={loading}
        />
        <div className="flex flex-col sm:flex-row sm:gap-0 gap-2 rounded-md shadow-xs w-full sm:w-auto" role="group">
  <button
    type="button"
    className={`flex items-center px-4 py-3 text-sm font-medium border focus:z-10 focus:ring-2 
      dark:border-gray-700
      ${activeStatus === "All"
        ? "bg-indigo-600 text-white dark:bg-indigo-700"
        : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      }
      rounded-t-md sm:rounded-l-md sm:rounded-tr-none`}
    onClick={() => filteredByStatus("All")}
  >
    <ClipboardList
      size={20}
      className={`mr-2 ${activeStatus === "All" ? "text-white" : "text-indigo-500"}`}
    />
    All Leaves
  </button>

  <button
    type="button"
    className={`flex items-center px-4 py-3 text-sm font-medium border focus:z-10 focus:ring-2 
      dark:border-gray-700
      ${activeStatus === "Approved"
        ? "bg-green-600 text-white dark:bg-green-700"
        : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      }`}
    onClick={() => filteredByStatus("Approved")}
  >
    <CheckCircle
      size={20}
      className={`mr-2 ${activeStatus === "Approved" ? "text-white" : "text-green-500"}`}
    />
    Approved
  </button>

  <button
    type="button"
    className={`flex items-center px-4 py-3 text-sm font-medium border focus:z-10 focus:ring-2 
      dark:border-gray-700
      ${activeStatus === "Pending"
        ? "bg-yellow-600 text-white dark:bg-yellow-700"
        : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      }`}
    onClick={() => filteredByStatus("Pending")}
  >
    <Clock
      size={20}
      className={`mr-2 ${activeStatus === "Pending" ? "text-white" : "text-yellow-500"}`}
    />
    Pending
  </button>

  <button
    type="button"
    className={`flex items-center px-4 py-3 text-sm font-medium border focus:z-10 focus:ring-2 
      dark:border-gray-700
      ${activeStatus === "Rejected"
        ? "bg-red-600 text-white dark:bg-red-700"
        : "bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      }
      rounded-b-md sm:rounded-r-md sm:rounded-bl-none`}
    onClick={() => filteredByStatus("Rejected")}
  >
    <XCircle
      size={20}
      className={`mr-2 ${activeStatus === "Rejected" ? "text-white" : "text-red-500"}`}
    />
    Rejected
  </button>
</div>

      </div>
      <Table
        headings={ADMIN_LEAVE_LIST_HEADER}
        data={currentLeaves}
        isLoading={loading}
        isSerialNo={true}
        renderRow={(item) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {item.employeeId.employeeId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {item?.employeeId?.userId?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {item.leaveType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {item?.employeeId?.department?.dep_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-m text-gray-300">
              {getDays(item.startDate, item.endDate, item.halfDay)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
              <div
                className={`text-m ${
                  item.status === "Pending"
                    ? "text-yellow-500"
                    : item.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.status}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
              <ActionButton
                onClick={() => navigate(`../leaves/details/${item._id}`)}
                name={"View"}
                className={"bg-indigo-600 hover:bg-indigo-700"}
                isLoading={loading}
              />
            </td>
          </>
        )}
      />
    </PageLayout>
  );
});

export default AdminLeaveList;
