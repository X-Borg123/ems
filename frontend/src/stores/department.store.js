import { makeAutoObservable, runInAction } from "mobx";
import api from "../utils/axios";
import { toast } from "react-toastify";
class DepartmentStore {
  //Data
  departments = [];
  department = "";
  formData = {
    dep_name: "",
    description: "",
  };

  //status
  loading = false;
  error = null;
  errorMessage = {};

  constructor() {
    makeAutoObservable(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.formData[name] = value;
    if (value) {
      delete this.errorMessage[name];
    }
  };

  validateForm = (data) => {
    const { dep_name } = data;

    if (!dep_name || dep_name.trim() === "") {
      this.errorMessage.dep_name = "Department name is required!";
    }
  };

  resetForm = () => {
    this.formData = {
      dep_name: "",
      description: "",
    };
    this.errorMessage = {};
  };

  fetchDepartments = async () => {
    this.loading = true;
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/department", {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.departments = response.data.departments;
        } else {
          this.error = response.data.error || "Failed to fetch departments";
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
        this.loading = false;
      });
    }
  };

  fetchDepartment = async (id) => {
    this.loading = true;
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/department/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.department = response.data.department;
          this.formData = {
            dep_name: response.data.department.dep_name || "",
            description: response.data.department.description || "",
          };
        } else {
          this.error = response.data.error || "Failed to fetch department";
        }
        this.loading = false;
      });

      return this.department;
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
          this.loading = false;
      });
    }
  };

  createDepartment = async (departmentData) => {
    this.loading = true;
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/department/add", departmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.departments.push(response.data.department);
        } else {
          this.error = response.data.error || "Failed to create department";
        }
        this.loading = false;
        toast.success("Department created successfully!");
        this.resetForm();
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
        this.loading = false;
      });
    }
  };

  updateDepartment = async (id, updatedData) => {
    this.loading = true;
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/department/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          const updatedDepartment = response.data.department;
          this.departments = this.departments.map((dep) =>
            dep.id === id ? updatedDepartment : dep
          );
        } else {
          this.error = response.data.error || "Failed to update department";
        }
        this.loading = false;
        toast.success("Department updated successfully!");
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
        this.loading = false;
      });
    }
  };

  deleteDepartment = async (id) => {
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/department/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.departments = this.departments.filter((dep) => dep._id !== id);
          toast.success(response.data.message)
        } else {
          this.error = response.data.error || "Failed to delete department";
          toast.error(this.error)
        }
      });

      return response.data.success;
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Server error";
      });
      toast.error(this.error)
      return false;
    }
  };
}

export const departmentStore = new DepartmentStore();
