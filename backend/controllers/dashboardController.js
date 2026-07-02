import moment from "moment";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    // const totalSalaries = await Employee.aggregate([
    //   { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    // ]);

    // const employeeAppliedForLeave = await Leave.distinct("employeeId");
    const employeeAppliedForLeave = await Leave.find();

    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved:
        leaveStatus.find((item) => item._id === "Approved")?.count || 0,
      rejected:
        leaveStatus.find((item) => item._id === "Rejected")?.count || 0,
      pending:
        leaveStatus.find((item) => item._id === "Pending")?.count || 0,
    };
  
      const employeeList = await Employee.find();

      const currentDate = moment().startOf('day');

      const promoteEmployees = employeeList.filter((emp) => {
        const localDate = new Date(emp.endDuration);
        const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
        const endDate = moment(utcDate).startOf('day');

        return endDate.isSame(currentDate) || endDate.isBefore(currentDate);
      });

      const totalPromoteEmployees  = promoteEmployees?.length || 0;

    return res
      .status(200)
      .json({
        success: true,
        totalEmployees,
        totalDepartments,
        // totalSalary: totalSalaries[0]?.totalSalary || 0,
        leaveSummary,
        totalPromoteEmployees,
      });
  } catch (error) {
    return res.status(500).json({ success: false, error: "dashboard summary server error" });
  }
};

export { getSummary };
