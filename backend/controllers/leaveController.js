import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import dayjs from "dayjs";

const calculateDaysRequested = (startDate, endDate, halfDay = {}) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  let days = end.diff(start, "day") + 1;

  if (halfDay.type === "start" || halfDay.type === "end") {
    days -= 0.5;
  }

  return days;
};

const leaveTypeMap = {
  "Annual Leave": "annualLeave",
  "Casual Leave": "casualLeave",
  "Medical Leave": "medicalLeave",
  "Maternity, and Paternity Leave": "maternityLeave",
};

const addLeave = async (req, res) => {
  try {
    const {
      userId,
      leaveType,
      startDate,
      endDate,
      description,
      halfDay = { type: "none", session: "morning" },
    } = req.body;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start)) {
      return res.status(400).json({
        success: false,
        error: "End date cannot be before start date",
      });
    }

    // Calculate requested leave days
    const daysRequested = calculateDaysRequested(startDate, endDate, halfDay);

    // Check if employee has enough balance
    const balanceKey = leaveTypeMap[leaveType];
    if (leaveType !== "Unpaid Leave") {
      if (
        !balanceKey ||
        employee[balanceKey] === undefined ||
        employee[balanceKey] < daysRequested
      ) {
        return res.status(400).json({
          success: false,
          error: `Insufficient ${leaveType} balance. Requested: ${daysRequested}, Available: ${
            employee[balanceKey] || 0
          }`,
        });
      }
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      description,
      halfDay, // Save the half-day type & session info
    });

    await newLeave.save();
    return res.status(200).json({ success: true, leave: newLeave });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Server error adding leave" });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;
    let leaves = await Leave.find({ employeeId: id });
    if (!leaves || leaves.length === 0) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(200).json({ success: true, leaves: [] });
      }
      leaves = await Leave.find({ employeeId: employee._id });
    }
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get leave server error" });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name" },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get leaves server error" });
  }
};

const getLeaveDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        { path: "department", select: "dep_name" },
        { path: "userId", select: "name , profileImage" },
      ],
    });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get leave details server error" });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      leaveType,
      startDate,
      endDate,
      description,
      halfDay = { type: "none", session: "morning" },
    } = req.body;

    const leave = await Leave.findById(id);

    if (leave.status == "Approved") {
      return res.status(400).json({
        success: false,
        error: "This leave cannot be updated because it has already been approved by admin.",
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        leaveType,
        startDate,
        endDate,
        description,
        halfDay,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, leave: updatedLeave });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "edit leave server error" });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);
    if (leave.status == "Approved") {
      return res.status(400).json({
        success: false,
        error: "This leave cannot be deleted because it has already been approved by admin.",
      });
    }

    // If no employees, proceed with deletion
    await Leave.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Leave deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "delete leave server error" });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ success: false, error: "Leave has already been decided" });
    }

    const alreadyVoted = leave.votes.some(
      (vote) => vote.adminId.toString() === adminId.toString()
    );
    if (alreadyVoted) {
      return res.status(400).json({ success: false, error: "You have already voted on this leave" });
    }

    leave.votes.push({ adminId, status });

    const rejected = leave.votes.some((vote) => vote.status === "Rejected");
    const approvedCount = leave.votes.filter((vote) => vote.status === "Approved").length;

    if (rejected) {
      leave.status = "Rejected";
    } else if (approvedCount >= 2) {
      leave.status = "Approved";

      const employee = await Employee.findById(leave.employeeId);
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }

      const daysRequested = calculateDaysRequested(
        leave.startDate,
        leave.endDate,
        leave.halfDay
      );

      const balanceKey = leaveTypeMap[leave.leaveType];
      if (leave.leaveType !== "Unpaid Leave") {
        if (
          !balanceKey ||
          employee[balanceKey] === undefined ||
          employee[balanceKey] < daysRequested
        ) {
          return res.status(400).json({
            success: false,
            error: `Insufficient ${leave.leaveType} balance`,
          });
        }

        employee[balanceKey] -= daysRequested;
        await employee.save();
      }
    }

    leave.updatedAt = new Date();
    await leave.save();

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "leave status update server error" });
  }
};

export { addLeave, getLeave, getLeaves, getLeaveDetails, updateLeaveStatus, updateLeave, deleteLeave };
