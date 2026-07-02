import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { departmentStore } from "../../stores/department.store";
import PageLayout from "../../components/layout/PageLayout";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loading from "../common/Loading";
import { Input, Textarea } from "../common/Input";
import { CancelButton, SubmitButton } from "../common/Button";
import { toast } from "react-toastify";

const DepartmentForm = observer(() => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const {
    loading,
    error,
    formData,
    errorMessage,
    handleChange,
    validateForm,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    resetForm,
  } = departmentStore;

  useEffect(() => {
    if (isEditMode) {
      fetchDepartment(id).then((data) => {
        if (data) {
          formData.dep_name = data.dep_name || "";
          formData.description = data.description || "";
        }
      });
    } else {
      resetForm();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateForm(formData);
    if (Object.keys(errorMessage).length > 0) return;

    try {
      if (isEditMode) {
        await updateDepartment(id, formData);
      } else {
        await createDepartment(formData);
      }
      navigate("/admin-dashboard/departments");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (isEditMode && loading) return <Loading />;

  return (
    <PageLayout
      title={isEditMode ? "Update Department" : "Add Department"}
      maxWidth={"max-w-3xl"}
    >
      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="items-center mb-6">
        <form className="relative">
          <Input
            name="dep_name"
            title="Department"
            type="text"
            placeholder="Enter Department Name"
            value={formData.dep_name}
            isLoading={loading}
            handleChange={handleChange}
            required={true}
            error={errorMessage.dep_name}
          />
          <Textarea
            name="description"
            title="Description"
            placeholder="Enter Description"
            value={formData.description}
            isLoading={loading}
            handleChange={handleChange}
          />
        </form>
        <div className="text-end">
          <CancelButton
            loading={loading}
            onClick={() => {
              resetForm();
              navigate(-1);
            }}
          />
          <SubmitButton
            name={
              loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Department"
                : "Add Department"
            }
            loading={loading}
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 ml-5"
          />
        </div>
      </div>
    </PageLayout>
  );
});

export default DepartmentForm;
