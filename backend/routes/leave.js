import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addLeave, getLeave, getLeaves, getLeaveDetails, updateLeaveStatus, updateLeave, deleteLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/add", authMiddleware, addLeave);

router.get("/details/:id", authMiddleware, getLeaveDetails);

router.get("/:id", authMiddleware, getLeave);

router.get("/", authMiddleware, getLeaves);

router.put("/details/:id", authMiddleware, updateLeaveStatus);

router.put("/:id", authMiddleware, updateLeave);

router.delete("/:id", authMiddleware, deleteLeave);

export default router;
