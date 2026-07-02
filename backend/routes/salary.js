import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSalary, getSalary, getSalaryCollections, getSalariesByPayDate, updateSalaryByPayDate, deleteSalariesByPayDate } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addSalary);

// GET salary records for specific employee
router.get("/employee/:id", authMiddleware, getSalary);

// PUT to update salary record by pay date
router.put("/update/:payDate", updateSalaryByPayDate);

// GET salary collections (monthly group)
router.get("/salaryCollections", authMiddleware, getSalaryCollections);

// GET salary by pay date
router.get("/collection/:payDate", authMiddleware, getSalariesByPayDate);

router.delete("/delete/:payDate", authMiddleware, deleteSalariesByPayDate)

export default router;
