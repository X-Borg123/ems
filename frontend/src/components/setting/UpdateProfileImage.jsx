import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileInput } from "flowbite-react";
import { SubmitButton } from "../common/Button";
import { employeeStore } from "../../stores/employee.store";
import { useAuth } from "../../context/authContext";
import { authStore } from "../../stores/auth.store";
import { toJS } from "mobx";

const UpdateProfileImage = observer(() => {
  const { user } = authStore;
  const baseURL = import.meta.env.VITE_API_URL;

  const {
    employee,
    handleUpdateChange,
    fetchEmployee,
    updateEmployee,
    loading,
    errorMessage
  } = employeeStore;

  useEffect(() => {
    fetchEmployee(user._id);
  }, [user._id]);


  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-gray-300 shadow">
          <img
            src={
             `${baseURL}/${employee?.userId?.profileImage}`
            }
            alt={employee?.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <form className="space-y-5">
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload New Image
          </label>
          <FileInput
            id="file-upload"
            name="image"
            onChange={handleUpdateChange}
            className="w-full"
            accept="image/*"
          />
          <span className="text-sm text-red-500">{errorMessage.image}</span>
        </div>
      </form>
      <div className="text-center">
          <SubmitButton
            onClick={updateEmployee(employee?._id,"updateProfileImage")}
            name="Update Profile"
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6"
          />
        </div>
    </div>
  );
});

export default UpdateProfileImage;
