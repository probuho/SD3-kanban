import { Router } from "express";
import Task from "../models/Task.js";
import { createTask, updateTaskStatus } from "../controllers/task.controller.js";

const router = Router();

export const renderBoard = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).lean();
  
  // Agrupar tareas por estado
  const columns = {
    todo: tasks.filter(task => task.status === 'todo'),
    inProgress: tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };
  
  res.render("kanban/board", { columns });
};

router.get("/board", renderBoard);
router.post("/tasks/add", createTask);
router.put("/tasks/update-status", updateTaskStatus);

export default router;