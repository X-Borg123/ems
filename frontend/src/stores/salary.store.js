import { makeAutoObservable, override, runInAction, toJS } from "mobx";
import api from "../utils/axios";
import { employeeStore } from "./employee.store";
import { toast } from "react-toastify";
import dayjs from "dayjs";

class SalaryStore {
  // Salary data
  salaries = [];
  employees = [];
  employeeSalaries = {};
  defaultAllowances = {
    kumoCareAllowance: 0,
    homageDeduction: 0,
    payDate: new Date(),
  };
  formData = {};
  salaryCollections = [];
  salariesByPayDate = [];

  // Status
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  handleDefaultChange = (field, value) => {
    this.defaultAllowances[field] = Number(value);
  };

  handlePayDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    this.defaultAllowances["payDate"] = formattedDate;
  };

  handleEmployeeSalaryChange = (id, field, value) => {
    const valNum = Number(value);
    this.formData.employeeId = id;
    this.formData[id] = {
      ...this.formData[id],
      [field]: isNaN(valNum) ? 0 : valNum,
    };
  };

  resetForm = async () => {
    this.formData = {};
    this.defaultAllowances = {
      kumoCareAllowance: 0,
      homageDeduction: 0,
      payDate: new Date(),
    };
  };

  handleSubmit = (navigate, payDate) => async (e) => {
    e.preventDefault();

    const isEdit = Boolean(payDate); // Explicitly use payDate

    const salariesToSend = employeeStore.employeeList.map((emp) => {
      const empSalary = this.formData[emp._id] || {};

      return {
        employeeId: emp._id,
        basicSalary: empSalary.basicSalary || 0,
        overtime: empSalary.overtime || 0,
        advanceSalary: empSalary.advanceSalary || 0,
        absentDeduction: empSalary.absentDeduction || 0,
        yearEndBonus: empSalary.yearEndBonus || 0,
        birthdayBonus: empSalary.birthdayBonus || 0,
        sgdAllowance: empSalary.sgdAllowance || 0,
        kumoCareAllowance: this.defaultAllowances.kumoCareAllowance,
        homageDeduction: this.defaultAllowances.homageDeduction,
        payDate: this.defaultAllowances.payDate,
      };
    });

    try {
      const endpoint = isEdit ? `/salary/update/${payDate}` : "/salary/add";

      const response = await api[isEdit ? "put" : "post"](
        endpoint,
        { salaries: salariesToSend },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success(
          isEdit
            ? "Salaries updated successfully!"
            : "Salaries added successfully!"
        );
        this.resetForm();
        navigate("../salary/collections");
      }
    } catch (err) {
      toast.error("Failed to save salaries.");
      console.error(err);
    }
  };

  // Fetch all salaries with pagination
  fetchSalaries = async (id) => {
    this.loading = true;
    this.error = null;
    this.salaries = [];
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/salary/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.salaries = response.data.salary;
        } else {
          this.error = response.data.error || "Failed to fetch salaries";
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  // Fetch salary collection
  fetchSalaryCollections = async () => {
    this.loading = true;
    this.error = null;
    this.salaryCollections = [];

    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/salary/salaryCollections", {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.salaryCollections = response.data.salaryCollections;
        } else {
          this.error =
            response.data.error || "Failed to fetch salary collection list";
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  fetchSalariesByPayDate = async (payDate) => {
    this.loading = true;
    this.error = null;
    this.salariesByPayDate = [];
    this.formData = {};

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/salary/collection/${payDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.salariesByPayDate = response.data.salaries;

          // Map salaries to formData by employee _id
          this.salariesByPayDate.forEach((salary) => {
            const { employeeId, ...rest } = salary;
            this.formData[employeeId._id] = rest;
          });

          const first = this.salariesByPayDate[0];
          if (first) {
            this.defaultAllowances.kumoCareAllowance = first.kumoCareAllowance;
            this.defaultAllowances.homageDeduction = first.homageDeduction;
          }

          // Also set default payDate to disable in form
          this.defaultAllowances.payDate = new Date(payDate);
        } else {
          this.error =
            response.data.error || "Failed to fetch salaries by pay date";
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error.response?.data?.error || error.message || "Server error";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteSalariesByPayDate = async (payDate) => {
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/salary/delete/${payDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          // Remove entries with the same payDate
          this.salariesByPayDate = this.salariesByPayDate.filter(
            (salary) => salary.payDate !== payDate
          );
          toast.success(response.data.message || "Salary data deleted");
        } else {
          this.error = response.data.error || "Failed to delete salary data";
          toast.error(this.error);
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
      toast.error(this.error);
      return false;
    }
  };
}

export const salaryStore = new SalaryStore();
