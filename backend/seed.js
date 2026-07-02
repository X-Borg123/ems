import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

import User from "./models/User.js";
import Department from "./models/Department.js";
import Employee from "./models/Employee.js";
import Leave from "./models/Leave.js";
import Salary from "./models/Salary.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Employee.deleteMany({});
    await Leave.deleteMany({});
    await Salary.deleteMany({});
    console.log("Cleared existing data");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create Admin Users
    const admin1 = await User.create({
      name: "Pyae Sone Phyo",
      email: "admin1@ems.com",
      nrc: "12/TaMaNa(N)123456",
      current_address: "Yangon, Myanmar",
      permanent_address: "Yangon, Myanmar",
      password: hashedPassword,
      role: "admin",
    });

    const admin2 = await User.create({
      name: "Aung Kyaw",
      email: "admin2@ems.com",
      nrc: "12/TaMaNa(N)789012",
      current_address: "Mandalay, Myanmar",
      permanent_address: "Mandalay, Myanmar",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Created admin users");

    // Create Departments
    const departments = await Department.insertMany([
      { dep_name: "Engineering", description: "Software development and IT infrastructure" },
      { dep_name: "Marketing", description: "Brand, campaigns, and growth" },
      { dep_name: "Human Resources", description: "People operations and recruitment" },
      { dep_name: "Finance", description: "Accounting and financial planning" },
      { dep_name: "Design", description: "UI/UX and graphic design" },
    ]);

    console.log("Created departments");

    // Create Employee Users
    const employeeData = [
      { name: "Htet Aung", email: "htet@ems.com", nrc: "12/BaHaNa(N)100001", current_address: "Yangon", permanent_address: "Bago" },
      { name: "Su Mon", email: "sumon@ems.com", nrc: "12/BaHaNa(N)100002", current_address: "Yangon", permanent_address: "Yangon" },
      { name: "Zaw Lin", email: "zawlin@ems.com", nrc: "12/BaHaNa(N)100003", current_address: "Mandalay", permanent_address: "Mandalay" },
      { name: "Aye Chan", email: "ayechan@ems.com", nrc: "12/BaHaNa(N)100004", current_address: "Yangon", permanent_address: "Monywa" },
      { name: "Min Thu", email: "minthu@ems.com", nrc: "12/BaHaNa(N)100005", current_address: "Yangon", permanent_address: "Yangon" },
      { name: "Nwe Nwe", email: "nwenwe@ems.com", nrc: "12/BaHaNa(N)100006", current_address: "Mandalay", permanent_address: "Sagaing" },
      { name: "Kyaw Zin", email: "kyawzin@ems.com", nrc: "12/BaHaNa(N)100007", current_address: "Yangon", permanent_address: "Yangon" },
      { name: "Thida Win", email: "thida@ems.com", nrc: "12/BaHaNa(N)100008", current_address: "Yangon", permanent_address: "Pathein" },
      { name: "Myo Naing", email: "myonaing@ems.com", nrc: "12/BaHaNa(N)100009", current_address: "Mandalay", permanent_address: "Mandalay" },
      { name: "Hnin Si", email: "hninsi@ems.com", nrc: "12/BaHaNa(N)100010", current_address: "Yangon", permanent_address: "Yangon" },
    ];

    const employeeUsers = [];
    for (const emp of employeeData) {
      const user = await User.create({
        ...emp,
        password: hashedPassword,
        role: "employee",
      });
      employeeUsers.push(user);
    }

    console.log("Created employee users");

    // Create Employee records
    const designations = ["Software Engineer", "Marketing Specialist", "HR Manager", "Accountant", "UI/UX Designer", "Senior Developer", "Content Writer", "Finance Analyst", "Frontend Developer", "Backend Developer"];
    const genders = ["male", "female", "male", "female", "male", "female", "male", "female", "male", "female"];
    const maritalStatuses = ["single", "single", "married", "single", "married", "single", "single", "married", "single", "single"];
    const employeeTypes = ["Full-Time", "Full-Time", "Full-Time", "Part-Time", "Full-Time", "Contract", "Full-Time", "Full-Time", "Contract", "Full-Time"];
    const salaries = [800000, 600000, 900000, 500000, 750000, 700000, 650000, 850000, 720000, 780000];

    const employees = [];
    for (let i = 0; i < employeeUsers.length; i++) {
      const emp = await Employee.create({
        userId: employeeUsers[i]._id,
        employeeId: `EMP${String(i + 1).padStart(4, "0")}`,
        dob: new Date(1990 + (i % 8), i % 12, 10 + i),
        gender: genders[i],
        maritalStatus: maritalStatuses[i],
        designation: designations[i],
        department: departments[i % departments.length]._id,
        salary: salaries[i],
        annualLeave: 12,
        casualLeave: 6,
        medicalLeave: 14,
        maternityLeave: genders[i] === "female" ? 90 : 0,
        employeeType: employeeTypes[i],
        duration: employeeTypes[i] === "Contract" ? 12 : 0,
        startDuration: employeeTypes[i] === "Contract" ? new Date(2026, 0, 1) : undefined,
        endDuration: employeeTypes[i] === "Contract" ? new Date(2026, 11, 31) : undefined,
        workStartDay: new Date(2024, i % 12, 1),
      });
      employees.push(emp);
    }

    console.log("Created employees");

    // Create Leave requests (mix of statuses)
    const leaveRequests = [
      { empIdx: 0, leaveType: "Annual Leave", startDate: new Date(2026, 6, 10), endDate: new Date(2026, 6, 12), description: "Family vacation trip", status: "Pending", votes: [] },
      { empIdx: 1, leaveType: "Casual Leave", startDate: new Date(2026, 6, 5), endDate: new Date(2026, 6, 5), description: "Personal errand", status: "Approved", votes: [{ adminId: admin1._id, status: "Approved" }, { adminId: admin2._id, status: "Approved" }] },
      { empIdx: 2, leaveType: "Medical Leave", startDate: new Date(2026, 6, 7), endDate: new Date(2026, 6, 9), description: "Doctor appointment and recovery", status: "Pending", votes: [{ adminId: admin1._id, status: "Approved" }] },
      { empIdx: 3, leaveType: "Annual Leave", startDate: new Date(2026, 6, 14), endDate: new Date(2026, 6, 16), description: "Attending a wedding", status: "Rejected", votes: [{ adminId: admin2._id, status: "Rejected" }] },
      { empIdx: 4, leaveType: "Casual Leave", startDate: new Date(2026, 6, 20), endDate: new Date(2026, 6, 20), description: "Moving to new apartment", status: "Pending", votes: [] },
      { empIdx: 5, leaveType: "Maternity, and Paternity Leave", startDate: new Date(2026, 7, 1), endDate: new Date(2026, 9, 28), description: "Maternity leave", status: "Approved", votes: [{ adminId: admin1._id, status: "Approved" }, { adminId: admin2._id, status: "Approved" }] },
      { empIdx: 6, leaveType: "Annual Leave", startDate: new Date(2026, 6, 25), endDate: new Date(2026, 6, 28), description: "Holiday trip to Bagan", status: "Pending", votes: [] },
      { empIdx: 0, leaveType: "Medical Leave", startDate: new Date(2026, 5, 20), endDate: new Date(2026, 5, 21), description: "Dental surgery", status: "Approved", votes: [{ adminId: admin1._id, status: "Approved" }, { adminId: admin2._id, status: "Approved" }] },
      { empIdx: 7, leaveType: "Unpaid Leave", startDate: new Date(2026, 7, 5), endDate: new Date(2026, 7, 10), description: "Extended personal travel", status: "Pending", votes: [{ adminId: admin1._id, status: "Approved" }] },
      { empIdx: 8, leaveType: "Casual Leave", startDate: new Date(2026, 6, 3), endDate: new Date(2026, 6, 3), description: "Urgent family matter", status: "Rejected", votes: [{ adminId: admin1._id, status: "Rejected" }] },
    ];

    for (const lr of leaveRequests) {
      await Leave.create({
        employeeId: employees[lr.empIdx]._id,
        leaveType: lr.leaveType,
        startDate: lr.startDate,
        endDate: lr.endDate,
        description: lr.description,
        status: lr.status,
        votes: lr.votes,
        halfDay: { type: "none", session: "morning" },
      });
    }

    console.log("Created leave requests");

    // Create Salary records (last 3 months for a few employees)
    const months = [new Date(2026, 3, 28), new Date(2026, 4, 28), new Date(2026, 5, 28)];

    for (let i = 0; i < 5; i++) {
      for (const payDate of months) {
        const base = salaries[i];
        const overtime = Math.floor(Math.random() * 100000);
        const kumoCare = 50000;
        const sgd = 30000;
        const revenueTotal = base + overtime + kumoCare + sgd;
        const advance = i % 3 === 0 ? 100000 : 0;
        const absent = i % 4 === 0 ? 50000 : 0;
        const deductionTotal = advance + absent;
        const netSalary = revenueTotal - deductionTotal;

        await Salary.create({
          employeeId: employees[i]._id,
          basicSalary: base,
          kumoCareAllowance: kumoCare,
          sgdAllowance: sgd,
          overtime,
          birthdayBonus: 0,
          yearEndBonus: 0,
          revenueTotal,
          advanceSalary: advance,
          homageDeduction: 0,
          absentDeduction: absent,
          deductionTotal,
          netSalary,
          payDate,
        });
      }
    }

    console.log("Created salary records");

    console.log("\n=== Seed Complete ===");
    console.log("\nLogin credentials (all use password: Admin@123):");
    console.log("  Admin 1: admin1@ems.com");
    console.log("  Admin 2: admin2@ems.com");
    console.log("  Employee: htet@ems.com (or any employee email)");
    console.log("\nAll employee emails:", employeeData.map(e => e.email).join(", "));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
