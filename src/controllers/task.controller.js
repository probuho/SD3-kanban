import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  const newTask = new Task({
    title,
    description,
    status,
    priority,
    user: req.user._id
  });
  await newTask.save();
  req.flash("success_msg", "Task Created");
  res.redirect("/board");
};

export const updateTaskStatus = async (req, res) => {
  const { taskId, newStatus, newOrder } = req.body;
  await Task.findByIdAndUpdate(taskId, {
    status: newStatus,
    order: newOrder
  });
  res.json({ success: true });
};