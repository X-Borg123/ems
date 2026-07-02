import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Phone from "../models/Phone.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    let {
      name,
      email,
      nrc,
      current_address,
      permanent_address,
      workStartDay,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      annualLeave,
      casualLeave,
      medicalLeave,
      maternityLeave,
      employeeType,
      duration,
      password,
      role,
      phones // Array of phone objects: [{type, number, note}]
    } = req.body;
    // Parse phones if sent as JSON string (FormData)
    if (typeof phones === 'string') {
      try {
        phones = JSON.parse(phones);
      } catch (e) {
        phones = [];
      }
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "user already registered in employee" });
    }

    const startDuration = new Date();
    let endDuration;
    const durationType = Number(duration);

    if (durationType === 0) {
      endDuration = new Date(startDuration);
      endDuration = startDuration.setFullYear(startDuration.getFullYear() + 10);
    } else {
      endDuration = new Date(
        startDuration.getFullYear(),
        startDuration.getMonth() + Number(duration),
        startDuration.getDate()
      );
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter and one special character.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      nrc,
      current_address,
      permanent_address,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();

    // Save phones
    if (Array.isArray(phones)) {
      for (const phone of phones) {
        if (phone.number && phone.type) {
          await Phone.create({
            userId: savedUser._id,
            type: phone.type,
            number: phone.number,
            note: phone.note || ""
          });
        }
      }
    }

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      annualLeave,
      casualLeave,
      medicalLeave,
      maternityLeave,
      employeeType,
      duration,
      startDuration,
      endDuration,
      workStartDay,
    });

    await newEmployee.save();
    return res.status(200).json({ success: true, message: "employee created" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "server error in adding employee" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employees server error" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employees server error" });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    let {
      name,
      email,
      nrc,
      current_address,
      permanent_address,
      workStartDay,
      maritalStatus,
      dob,
      gender,
      designation,
      department,
      salary,
      annualLeave,
      casualLeave,
      medicalLeave,
      maternityLeave,
      employeeType,
      duration,
      phones // Array of phone objects: [{_id, type, number, note}]
    } = req.body;
    // Parse phones if sent as JSON string (FormData)
    if (typeof phones === 'string') {
      try {
        phones = JSON.parse(phones);
      } catch (e) {
        phones = [];
      }
    }

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "employee not found" });
    }

    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    const updatedUserData = { name, email, nrc, current_address, permanent_address };
    if (req.file) {
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", "public", "uploads", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedUserData.profileImage = req.file.filename;
    }

    const updatedAt = new Date();
    const startDuration = new Date();
    let endDuration;
    if (Number(duration) === 0) {
      endDuration = new Date(startDuration);
      endDuration = startDuration.setFullYear(startDuration.getFullYear() + 10);
    } else {
      endDuration = new Date(
        startDuration.getFullYear(),
        startDuration.getMonth() + Number(duration),
        startDuration.getDate()
      );
    }

    await User.findByIdAndUpdate(employee.userId, updatedUserData);

    // Sync phones
    if (Array.isArray(phones)) {
      // Get existing phones
      const existingPhones = await Phone.find({ userId: employee.userId });
      const incomingIds = phones.filter(p => p._id).map(p => p._id);
      // Delete removed phones
      for (const phone of existingPhones) {
        if (!incomingIds.includes(phone._id.toString())) {
          await Phone.findByIdAndDelete(phone._id);
        }
      }
      // Add or update phones
      for (const phone of phones) {
        if (phone._id) {
          // Update
          await Phone.findByIdAndUpdate(phone._id, {
            type: phone.type,
            number: phone.number,
            note: phone.note || ""
          });
        } else if (phone.number && phone.type) {
          // Add new
          await Phone.create({
            userId: employee.userId,
            type: phone.type,
            number: phone.number,
            note: phone.note || ""
          });
        }
      }
    }

    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      salary,
      department,
      dob,
      gender,
      annualLeave,
      casualLeave,
      medicalLeave,
      maternityLeave,
      employeeType,
      duration,
      startDuration,
      endDuration,
      workStartDay,
      updatedAt,
    });

    return res.status(200).json({ success: true, message: "employee updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "update employees server error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesbyDepId server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found.",
      });
    }

    // Delete all phones for this user
    await Phone.deleteMany({ userId: employee.userId });

    await employee.deleteOne(); // This triggers the pre("deleteOne") hook

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while deleting employee.",
    });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  deleteEmployee,
};
