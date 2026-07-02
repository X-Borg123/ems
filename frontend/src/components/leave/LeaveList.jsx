import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton, SubmitLink } from "../common/Button";
import { Table } from "../common/Table";
import { useAuth } from "../../context/authContext";
import { observer } from "mobx-react-lite";
import PageLayout from "../layout/PageLayout";
import { leaveStore } from "../../stores/leave.store";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { LEAVE_LIST_HEADER_ADMIN, LEAVE_LIST_HEADER_EMPLOYEE } from "../constants/Constants";

const LeaveList = observer(() => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const { leaves, loading, fetchLeaves, deleteLeave } = leaveStore;

  const sortedLeaves = leaves
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  useEffect(() => {
    fetchLeaves(id);
  }, [id]);

  const confirmDelete = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

    const handleDeleteConfirmed = () => {
    if (!selectedLeave) return;
    if (selectedLeave) {
      const success = deleteLeave(selectedLeave._id);
      if (success) {
        fetchLeaves(id);
        setShowModal(false);
        setSelectedLeave(null);
      }
    }
  };

  let TABLE_HEADER;
  if(user.role === "admin") {
    TABLE_HEADER = LEAVE_LIST_HEADER_ADMIN
  } else {
    TABLE_HEADER = LEAVE_LIST_HEADER_EMPLOYEE
  }

  return (
    <PageLayout
      title={`${
        user.role === "employee" ? "My Leave Requests" : "Leave Management"
      }`}
    >
      {user.role === "employee" && (
        <div className="flex justify-end items-center mb-6">
          <SubmitLink urlLink={"../add-leave"} name={"Add New Leave"} />
        </div>
      )}
      <Table
        headings={TABLE_HEADER}
        data={sortedLeaves}
        isLoading={loading}
        isSerialNo={true}
        renderRow={(item) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.leaveType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {new Date(item.startDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {new Date(item.endDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.halfDay?.type === "none" ? "-" : item.halfDay?.session}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {item.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              <div
                className={`text-sm ${
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
            {user.role === "employee" && (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex space-x-3">
                  <ActionButton
                    onClick={() => navigate(`../leave/${item._id}`)}
                    name={"Edit"}
                    className={"bg-yellow-600 hover:bg-yellow-700"}
                    disabled={item.status === "Approved" || item.status === "Rejected"}
                  />
                  <ActionButton
                    onClick={() => confirmDelete(item)}
                    name={"Delete"}
                    className={"bg-red-600 hover:bg-red-700"}
                    disabled={item.status === "Approved" || item.status === "Rejected"}
                  />
                </div>
              </td>
            )}
          </>
        )}
      />
      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
        itemName={selectedLeave?.leaveType}
      />
    </PageLayout>
  );
});

export default LeaveList;
