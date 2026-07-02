import React, { useEffect, useState } from "react";
import PageLayout from "../layout/PageLayout";
import { observer } from "mobx-react-lite";
import { SearchInput } from "../common/Input";
import { Table } from "../common/Table";
import { ActionButton, SubmitLink } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { departmentStore } from "../../stores/department.store";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { DEPARTMENT_TABLE_HEADER } from "../constants/Constants";

const DepartmentList = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { departments, loading, fetchDepartments, deleteDepartment } =
    departmentStore;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = (departments || []).filter((dep) =>
    dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (!selectedDepartment) return;
    if (selectedDepartment) {
      const success = deleteDepartment(selectedDepartment._id);
      if (success) {
        fetchDepartments();
        setShowModal(false);
        setSelectedDepartment(null);
      }
    }
  };

  return (
    <PageLayout title="Department List" maxWidth={"max-w-6xl"}>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 w-full">
        <SearchInput
          placeholder="Search Department..."
          handleChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          isLoading={loading}
        />
        <SubmitLink urlLink="../add-department" name="Add New Department" />
      </div>
      <Table
        headings={DEPARTMENT_TABLE_HEADER}
        data={filteredDepartments}
        isLoading={loading}
        isSerialNo={true}
        renderRow={(item) => (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-m">{item.dep_name}</td>
            <td className="px-6 py-4 whitespace-nowrap space-x-3">
              <ActionButton
                onClick={() => navigate(`../department/${item._id}`)}
                name="Edit"
                className="bg-yellow-600 hover:bg-yellow-700"
              />
              <ActionButton
                onClick={() => confirmDelete(item)}
                name="Delete"
                className="bg-red-600 hover:bg-red-700"
              />
            </td>
          </>
        )}
      />

      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
        itemName={selectedDepartment?.dep_name}
      />
    </PageLayout>
  );
});

export default DepartmentList;
