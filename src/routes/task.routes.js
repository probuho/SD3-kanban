import { Router } from "express";
import { createTask, updateTaskStatus } from "../controllers/task.controller.js";

const router = Router();

router.post("/tasks/add", createTask);
router.put("/tasks/update-status", updateTaskStatus);

export default router;