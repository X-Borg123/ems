import { makeAutoObservable, runInAction } from "mobx";
import api from "../utils/axios";

class AdminOverviewStore {
  // Overview data
  overviewData = {
    leaveSummary: { appliedFor: 0, approved: 0, pending: 0, rejected: 0 },
    totalDepartments: 0,
    totalEmployees: 0,
    totalSalary: 0,
    totalPromoteEmployees: 0,
  };

  // Status
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch overview data
  fetchOverviewData = async() => {
    this.loading = true;
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.overviewData = {
            totalEmployees: response.data.totalEmployees,
            totalDepartments: response.data.totalDepartments,
            totalSalary: response.data.totalSalary,
            leaveSummary: response.data.leaveSummary,
            totalPromoteEmployees: response.data.totalPromoteEmployees,
          };
          this.loading = false;
        } else {
          this.error = response.data.error || "Failed to fetch overview data";
          this.loading = true;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error
          error.response?.data?.error || error.message || "Server error";
          this.loading = false;
      });
    }
  }

}

export const adminOverviewStore = new AdminOverviewStore();
