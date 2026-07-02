import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoutes from "./utils/PrivateRoutes";

// Dashboard
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// Setting
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import Setting from "./components/setting/Setting";

// Overview
import AdminOverview from "./components/adminDashboard/AdminOverview";
import EmployeeOverview from "./components/employeeDashboard/EmployeeOverview";

// Department
import DepartmentForm from "./components/department/DepartmentForm";
import DepartmentList from "./components/department/DepartmentList";

// Leave
import LeaveForm from "./components/leave/LeaveForm";
import LeaveList from "./components/leave/LeaveList";
import AdminLeaveList from "./components/leave/AdminLeaveList";
import LeaveDetails from "./components/leave/LeaveDetails";

//Employee 
import AddEmployee from "./components/employee/AddEmployee"
import EmployeeList from "./components/employee/EmployeeList"
import ViewEmployee from "./components/employee/ViewEmployee"
import UpdateEmployee from "./components/employee/UpdateEmployee"

//Salary
import ViewSalary from "./components/salary/ViewSalary";
import SalaryCollectionList from "./components/salary/SalaryCollectionList";
import SalaryForm from "./components/salary/SalaryForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleBaseRoutes />}></Route>
        <Route path="login" element={<Login />} />
        {/* Admin Dashboard */}
        <Route
          path="admin-dashboard"
          element={
            <PrivateRoutes allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminOverview />} />

          {/* Department */}
          <Route path="departments" element={<DepartmentList />}></Route>
          <Route path="add-department" element={<DepartmentForm />}></Route>
          <Route path="department/:id" element={<DepartmentForm />}></Route>

          {/* Employee */}
          <Route path="employees" element={<EmployeeList />}></Route>
          <Route path="add-employee" element={<AddEmployee />}></Route>
          <Route path="employees/:id" element={<ViewEmployee />}></Route>
          <Route path="employees/edit/:id" element={<UpdateEmployee />}></Route>

          {/* Leave */}
          <Route path="leaves" element={<AdminLeaveList />}></Route>
          <Route path="leaves/details/:id" element={<LeaveDetails />}></Route>
          <Route path="employees/leaves/:id" element={<LeaveList />}></Route>

          {/* Salary */}
          <Route path="salary/employee/:id" element={<ViewSalary />}></Route>
          <Route path="salary/add" element={<SalaryForm/>}></Route>
          <Route path="salary/edit/:payDate" element={<SalaryForm/>} />
          <Route path="salary/collections" element={<SalaryCollectionList />}></Route>
          <Route path="salary/collections/:payDate" element={<ViewSalary />}></Route>

          {/* Setting */}
          <Route path="setting" element={<Setting />}></Route>
        </Route>
        {/* Employee Dashboard */}
        <Route
          path="employee-dashboard"
          element={
            <PrivateRoutes allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </PrivateRoutes>
          }
        >

          <Route index element={<EmployeeOverview />} />
          <Route path="profile/:id" element={<ViewEmployee />}></Route>

          {/* Leave */}
          <Route path="leaves/:id" element={<LeaveList />}></Route>
          <Route path="add-leave" element={<LeaveForm />}></Route>
          <Route path="leave/:id" element={<LeaveForm />}></Route>

          {/* Salary */}
          <Route path="salary/employee/:id" element={<ViewSalary />}></Route>

          {/* Setting */}
          <Route path="setting" element={<Setting />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
