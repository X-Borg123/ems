import { makeAutoObservable, runInAction, toJS } from "mobx";
import { toast } from "react-toastify";
import api from "../utils/axios";
import {
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "../components/constants/Constants";
import { BiCaretUpSquare } from "react-icons/bi";
import moment from "moment";

class EmployeeStore {
  employeeList = [];
  phones = [];
  loading = false;
  error = null;
  formData = {
    current_address: "",
    permanent_address: "",
    phones: [{ type: "", number: "", note: "" }],
  };
  employee = null;
  showLeaves = false;
  showDuration = false;
  showSalary = false;
  errorMessage = {};
  updateData = {
    current_address: "",
    permanent_address: "",
    phones: [{ type: "", number: "", note: "" }],
  };
  // Dynamic phone logic for Add
  handlePhoneChange = (idx, field, value) => {
    this.formData.phones[idx][field] = value;
    // Validate number
    if (field === "number") {
      this.formData.phones[idx][field] = value.replace(/\D/g, "").slice(0, 15);
    }
  };
  addPhoneRow = () => {
    this.formData.phones.push({ type: "", number: "", note: "" });
  };
  removePhoneRow = (idx) => {
    if (this.formData.phones.length > 1) this.formData.phones.splice(idx, 1);
  };

  // Dynamic phone logic for Update
  handleUpdatePhoneChange = (idx, field, value) => {
    this.updateData.phones[idx][field] = value;
    if (field === "number") {
      this.updateData.phones[idx][field] = value
        .replace(/\D/g, "")
        .slice(0, 15);
    }
  };
  addUpdatePhoneRow = () => {
    this.updateData.phones.push({ type: "", number: "", note: "" });
  };
  removeUpdatePhoneRow = (idx) => {
    if (this.updateData.phones.length > 1)
      this.updateData.phones.splice(idx, 1);
  };
  totalUpdateEmployee = [];
  showUniqueEmployee = false;

  constructor() {
    makeAutoObservable(this);
  }

  handleChange = (e) => {
    if (e?.target) {
      const { name, value, files } = e.target;
      if (value) {
        delete this.errorMessage[name];
      }
      if (name === "image") {
        this.formData[name] = files[0];
      } else {
        this.formData[name] = value;
      }
      if (name === "employeeType") {
        if (value === "Permanent") {
          this.showLeaves = true;
          this.showDuration = false;
        } else {
          this.showLeaves = false;
          this.showDuration = true;
          const leaveFields = [
            "annualLeave",
            "casualLeave",
            "medicalLeave",
            "maternityLeave",
          ];
          leaveFields.forEach((leave) => (this.formData[leave] = 0));
        }

        if (value === "Internship") {
          this.showSalary = false;
          this.formData["salary"] = 0;
        } else {
          this.showSalary = true;
        }
        const date = new Date();
        this.formData["duration"] = 0;
      }
    } else if (e instanceof Date) {
      this.formData["dob"] = e;
    }
  };

  handleUpdateChange = (e) => {
    if (e?.target) {
      const { name, value, files } = e.target;
      if (value) {
        this.errorMessage[name] = "";
      }
      if (name === "image") {
        this.updateData[name] = files[0];
      } else {
        this.updateData[name] = value;
      }
      if (name === "employeeType") {
        if (value === "Permanent") {
          this.showLeaves = true;
          this.showDuration = false;
        } else {
          this.showLeaves = false;
          this.showDuration = true;
          const leaveFields = [
            "annualLeave",
            "casualLeave",
            "medicalLeave",
            "maternityLeave",
          ];
          leaveFields.forEach((leave) => (this.updateData[leave] = 0));
        }

        if (value === "Internship") {
          this.showSalary = false;
          this.updateData["salary"] = 0;
        } else {
          this.showSalary = true;
        }
        const date = new Date(this.employee.createdAt);
        this.updateData["duration"] = 0;
        // this.updateData["endDuration"] = date.setFullYear(date.getFullYear()+10);
      }
    }
  };

  handleDateChange = (name, value) => {
    this.formData[name] = value;
    this.errorMessage[name] = "";
  };

  handleDurationChange = (e) => {
    const value = Number(e.target.value);
    const { name } = e.target;
    if (value <= 3) {
      this.formData[name] = e.target.value;
      this.errorMessage[name] = "";
    } else {
      this.errorMessage[name] = "Please fill under 4 months";
    }
  };

  handleUpdateDurationChange = (e) => {
    const value = Number(e.target.value);
    const { name } = e.target;
    const startDate = new Date(this.employee.createdAt);
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + value,
      startDate.getDate() - 1
    );
    this.updateData[name] = e.target.value;
    this.errorMessage[name] = "";
  };

  createEmployeeId = () => {
    const startWord = "Kumo-";
    let maxId = 0;
    this.employeeList.forEach((emp) => {
      const idNumber = parseInt(emp.employeeId?.replace(startWord, ""));
      if (!isNaN(idNumber) && idNumber > maxId) {
        maxId = idNumber;
      }
    });

    this.formData.employeeId = startWord + (maxId + 1);
  };

  validateField(field, message) {
    if (field === "" || field === null || field === undefined) {
      return message;
    }
    return null;
  }

  validateForm = (data) => {
    // Reset all error messages before validation
    this.errorMessage = {};
    // List of required fields
    const requiredFields = {
      name: "Please fill name!",
      email: "Please fill email!",
      nrc: "Please fill nrc!",
      current_address: "Please fill current address!",
      permanent_address: "Please fill permanent address!",
      password: "Please fill password!",
      maritalStatus: "Please select maritalStatus!",
      dob: "Please fill date of birth!",
      gender: "Please select gender!",
      employeeId: "Please fill employeeId!",
      employeeType: "Please select employee type!",
      role: "Please select role!",
      department: "Please fill department!",
      designation: "Please fill designation!",
    };
    Object.entries(requiredFields).forEach(([key, message]) => {
      const error = this.validateField(data[key], message);
      if (error) this.errorMessage[key] = error;
      else delete this.errorMessage[key];
    });
    // Validate phones
    if (!Array.isArray(data.phones) || data.phones.length === 0) {
      this.errorMessage.phones = "At least one phone number is required!";
    } else {
      data.phones.forEach((phone, idx) => {
        if (!phone.type || !phone.number) {
          this.errorMessage[`phones_${idx}`] =
            "Phone type and number required!";
        } else if (!/^\d{1,15}$/.test(phone.number)) {
          this.errorMessage[`phones_${idx}`] =
            "Phone number must be numeric and max 15 digits!";
        }
      });
    }

    // Conditional fields
    if (data.employeeType === "Permanent") {
      const error = this.validateField(
        data.workStartDay,
        "Please fill workStartDay!"
      );
      if (error) this.errorMessage.workStartDay = error;
      else delete this.errorMessage.workStartDay;
    }
    if (["Internship", "Probation"].includes(data.employeeType)) {
      const error = this.validateField(data.duration, "Please fill Duration!");
      if (error) this.errorMessage.duration = error;
      else delete this.errorMessage.duration;
    }
    if (["Probation", "Permanent"].includes(data.employeeType)) {
      const error = this.validateField(data.salary, "Please fill salary!");
      if (error) this.errorMessage.salary = error;
      else delete this.errorMessage.salary;
    }
    if (data.employeeType === "Permanent") {
      const leaveFields = {
        annualLeave: "Please fill annualLeave!",
        casualLeave: "Please fill casualLeave!",
        medicalLeave: "Please fill medicalLeave!",
        maternityLeave: "Please fill maternityLeave!",
      };
      Object.entries(leaveFields).forEach(([key, message]) => {
        const error = this.validateField(data[key], message);
        if (error) this.errorMessage[key] = error;
        else delete this.errorMessage[key];
      });
    }
  };

    fetchPhones = async (userId) => {
    this.phones = [];
    if (!userId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/employee/${userId}/phones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        runInAction(() => {
          this.phones = res.data.phones;
        });
      }
    } catch (err) {
      runInAction(() => {
        this.phones = [];
      });
    }
  }

  updateValidateForm = (data) => {
    const {
      name,
      email,
      nrc,
      current_address,
      permanent_address,
      maritalStatus,
      designation,
      department,
      employeeType,
      workStartDay,
      duration,
      salary,
      annualLeave,
      casualLeave,
      medicalLeave,
      maternityLeave,
    } = data;
    if (name === "" || !name) {
      this.errorMessage["name"] = "Please fill name!";
    } else {
      delete this.errorMessage["name"];
    }
    if (email === "" || !email) {
      this.errorMessage.email = "Please fill email!";
    } else {
      delete this.errorMessage.email;
    }
    // Remove phone validation for update
    if (nrc === "" || !nrc) {
      this.errorMessage.nrc = "Please fill nrc!";
    } else {
      delete this.errorMessage.nrc;
    }
    if (current_address === "" || !current_address) {
      this.errorMessage.current_address = "Please fill current address!";
    } else {
      delete this.errorMessage.current_address;
    }
    if (permanent_address === "" || !permanent_address) {
      this.errorMessage.permanent_address = "Please fill permanent address!";
    } else {
      delete this.errorMessage.permanent_address;
    }
    if (maritalStatus === "" || !maritalStatus) {
      this.errorMessage.maritalStatus = "Please select maritalStatus!";
    } else {
      delete this.errorMessage.maritalStatus;
    }

    if (employeeType === "" || !employeeType) {
      this.errorMessage.employeeType = "Please select employee type!";
    } else {
      delete this.errorMessage.employeeType;
    }
    if (employeeType === "Permanent") {
      if (workStartDay === "" || !workStartDay) {
        this.errorMessage.duration = "Please fill workStartDay!";
      } else {
        delete this.errorMessage.duration;
      }
    }
    if (employeeType === "Internship" || employeeType === "Probation") {
      if (duration === 0 || !duration) {
        this.errorMessage.duration = "Please fill Duration!";
      } else {
        delete this.errorMessage.duration;
      }
    }
    if (employeeType === "Probation" || employeeType === "Permanent") {
      if (salary === 0 || !salary) {
        this.errorMessage.salary = "Please fill salary!";
      } else {
        delete this.errorMessage.salary;
      }
    }
    if (employeeType === "Permanent") {
      if (annualLeave === 0 || !annualLeave) {
        this.errorMessage.annualLeave = "Please fill annualLeave!";
      } else {
        delete this.errorMessage.annualLeave;
      }
      if (casualLeave === 0 || !casualLeave) {
        this.errorMessage.casualLeave = "Please fill casualLeave!";
      } else {
        delete this.errorMessage.casualLeave;
      }
      if (medicalLeave === 0 || !medicalLeave) {
        this.errorMessage.medicalLeave = "Please fill medicalLeave!";
      } else {
        delete this.errorMessage.medicalLeave;
      }
      if (maternityLeave === 0 || !maternityLeave) {
        this.errorMessage.maternityLeave = "Please fill maternityLeave!";
      } else {
        delete this.errorMessage.maternityLeave;
      }
    }

    if (department === null || !department) {
      this.errorMessage.department = "Please fill department!";
    } else {
      delete this.errorMessage.department;
    }
    if (designation === null || !designation) {
      this.errorMessage.designation = "Please fill designation!";
    } else {
      delete this.errorMessage.designation;
    }
  };

  fetchEmployees = async () => {
    this.loading = true;
    try {
      const response = await api.get("/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      runInAction(() => {
        if (response.data.success) {
          this.employeeList = response.data.employees;
        } else {
          this.error = response.data.error || "Failed to fetch employees";
          toast.error(this.error);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error?.response?.data?.error || error.message || "Server Error";
        toast.error(this.error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  handleSubmit = (navigate) => async (e) => {
    e.preventDefault();
    this.validateForm(this.formData);
    if (Object.keys(this.errorMessage).length > 0) {
      console.log("Form has error!", this.errorMessage);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(this.formData).forEach((key) => {
      if (key === "phones") {
        formDataObj.append("phones", JSON.stringify(this.formData.phones));
        return;
      }

      const value = this.formData[key];
      if (value === undefined || value === null) return;
      formDataObj.append(key, value);
    });

    try {
      const response = await api.post("/employee/add", formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success(CREATE_EMPLOYEE);
        this.fetchEmployees();
        this.resetFormData();
        navigate(-1);
        return;
      }

      toast.error(response.data.error || "Failed to create employee");
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Server Error");
    }
  };

  handleCancel = (navigate) => (e) => {
    e.preventDefault();
    navigate("../employees");
  };

  fetchEmployee = async (id) => {
    try {
      const response = await api.get(`/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        this.employee = response.data.employee;
        const user = this.employee.userId;
        this.updateData.name = user.name;
        this.updateData.email = user.email;
        this.updateData.nrc = user.nrc;
        this.updateData.current_address = user.current_address;
        this.updateData.permanent_address = user.permanent_address;
        this.updateData.role = user.role;
        this.updateData.profile = user.profileImage;
        this.updateData.departmentId = this.employee.department._id;
        this.updateData.department = this.employee.department._id;
        this.updateData.maritalStatus = this.employee.maritalStatus;
        this.updateData.salary = this.employee.salary;
        this.updateData.designation = this.employee.designation;
        this.updateData.employeeType = this.employee.employeeType;
        this.updateData.workStartDay = this.employee.workStartDay;
        this.updateData.duration = this.employee.duration;
        this.updateData.annualLeave = this.employee.annualLeave;
        this.updateData.casualLeave = this.employee.casualLeave;
        this.updateData.medicalLeave = this.employee.medicalLeave;
        this.updateData.maternityLeave = this.employee.maternityLeave;
        // Fetch phones using MobX state and set updateData.phones
        await this.fetchPhones(user._id);
        this.updateData.phones = this.phones.length > 0 ? toJS(this.phones) : [{ type: "", number: "", note: "" }];
      }
    } catch (error) {
      console.log("error,", error);
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.error);
      }
    }
  };

  updateEmployee = (id, key, navigate) => async (e) => {
    e.preventDefault();
    let data = null;

    this.updateValidateForm(this.updateData);
    if (key === "updateProfileImage") {
      if (this.updateData["image"] === "" || !this.updateData["image"]) {
        this.errorMessage.image = "Please choose Image!";
      } else {
        delete this.errorMessage.image;
        const formDataObj = new FormData();
        Object.keys(this.updateData).forEach((key) => {
          formDataObj.append(key, this.updateData[key]);
        });
        data = formDataObj;
      }
    } else {
      // Send phones as JSON in FormData (like AddEmployee)
      const formDataObj = new FormData();
      Object.keys(this.updateData).forEach((key) => {
        if (key === 'phones') {
          formDataObj.append('phones', JSON.stringify(this.updateData.phones));
        } else {
          formDataObj.append(key, this.updateData[key]);
        }
      });
      data = formDataObj;
    }

    if (Object.keys(this.errorMessage).length === 0) {
      try {
        const response = await api.put(`/employee/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          toast.success(UPDATE_EMPLOYEE);
          navigate("../employees");
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.error);
        }
      }
      this.resetFormData();
      this.fetchEmployee(id);
    } else {
      console.log("this.errorMessage", toJS(this.errorMessage));
    }
  };

  deleteEmployee = async (id) => {
    this.error = null;

    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      runInAction(() => {
        if (response.data.success) {
          this.employeeList = this.employeeList.filter((emp) => emp._id !== id);
        } else {
          this.error = response.data.error || "Failed to delete employee";
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
      return false;
    }
  };

  resetFormData = () => {
    this.formData = {
      name: "",
      email: "",
      nrc: "",
      current_address: "",
      permanent_address: "",
      password: "",
      maritalStatus: "",
      dob: new Date(),
      gender: "",
      employeeId: "",
      employeeType: "",
      workStartDay: new Date(),
      duration: 0,
      endDuration: null,
      role: "",
      department: "",
      designation: "",
      salary: 0,
      image: null,
      annualLeave: 0,
      casualLeave: 0,
      medicalLeave: 0,
      maternityLeave: 0,
      phones: [{ type: "", number: "", note: "" }],
    };
  };

  resetErrorMessage = () => {
    const resetError = [
      "name",
      "email",
      "phone",
      "emergencyPhone",
      "nrc",
      "address",
      "password",
      "maritalStatus",
      "dob",
      "gender",
      "employeeId",
      "employeeType",
      "role",
      "department",
      "designation",
      "workStartDay",
      "duration",
      "salary",
      "annualLeave",
      "casualLeave",
      "medicalLeave",
      "maternityLeave",
    ];
    resetError.forEach((key) => (this.errorMessage[key] = ""));
  };

  countEmployee = () => {
    const currentDate = moment().startOf("day");
    this.totalUpdateEmployee = this.employeeList.filter((emp) => {
      const localDate = new Date(emp.endDuration);
      const utcDate = new Date(
        localDate.getTime() + localDate.getTimezoneOffset() * 60000
      );
      const endDate = moment(utcDate).startOf("day");
      const isSameDate = currentDate.isSame(endDate);
      const isEndBeforeCurrent = endDate.isBefore(currentDate);
      return isSameDate || isEndBeforeCurrent;
    });
    this.employeeList = this.totalUpdateEmployee;
  };

  handleShowUniqueEmployee = (value) => {
    runInAction(() => {
      this.showUniqueEmployee = value;
    });
  };
}

export const employeeStore = new EmployeeStore();
