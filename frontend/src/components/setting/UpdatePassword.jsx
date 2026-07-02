import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../stores/auth.store";
import ErrorMessage from "../common/ErrorMessage";
import PageLayout from "../layout/PageLayout";
import { Input } from "../common/Input";
import { settingStore } from "../../stores/setting.store";
import { SubmitButton } from "../common/Button";
import { toast } from "react-toastify";

const UpdatePassword = observer(() => {
  const navigate = useNavigate();
  const { user } = authStore;

  useEffect(() => {
    if (user?._id) {
      settingStore.setUserId(user._id);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    settingStore.setField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingStore.updatePassword(() => {
        toast.success("Password changed successfully");
        navigate("../");
      });
    } catch (err) {
      toast.error(settingStore.error || "Failed to change password");
    }
  };

  const { loading, error } = settingStore;

  return (
    <div>
      {error && <ErrorMessage message={error} className="mb-6" />}
      <div className="items-center mb-6">
        <form className="relative space-y-4">
          <Input
            name="oldPassword"
            title="Old Password"
            type="password"
            placeholder="Enter Old Password"
            handleChange={handleChange}
            isLoading={loading}
            required={true}
          />
          <Input
            name="newPassword"
            title="New Password"
            type="password"
            placeholder="Enter New Password"
            handleChange={handleChange}
            isLoading={loading}
            required={true}
          />
          <Input
            name="confirmPassword"
            title="Confirm Password"
            type="password"
            placeholder="Confirm Your Password"
            handleChange={handleChange}
            isLoading={loading}
            required={true}
          />
        </form>
        <div className="text-center">
          <SubmitButton
            onClick={handleSubmit} 
            name={"Change Password"}
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          />
        </div>
      </div>
    </div>
  );
});

export default UpdatePassword;
