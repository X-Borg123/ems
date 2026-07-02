import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, default: Date.now, required: true },
  endDate: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
  votes: [
    {
      adminId: { type: Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["Approved", "Rejected"] },
      votedAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  halfDay: {
    type: {
      type: String, // "start" | "end" | "none"
      default: "none",
    },
    session: {
      type: String, // "morning" | "evening"
      default: "morning",
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
