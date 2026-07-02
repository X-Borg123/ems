
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getEmployees,
  addEmployee,
  upload,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  deleteEmployee,
} from "../controllers/employeeController.js";
import Phone from "../models/Phone.js";

const router = express.Router();


// Phone endpoints
router.get("/:id/phones", authMiddleware, async (req, res) => {
  try {
    const phones = await Phone.find({ userId: req.params.id });
    res.json({ success: true, phones });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch phones" });
  }
});

router.get("/phone/:phoneId", authMiddleware, async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.phoneId);
    res.json({ success: true, phone });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch phone" });
  }
});

router.get("/", authMiddleware, getEmployees);
router.post("/add", authMiddleware, upload.single("image"), addEmployee);
router.get("/:id", authMiddleware, getEmployee);
router.put('/:id', upload.single('image'), updateEmployee);
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
