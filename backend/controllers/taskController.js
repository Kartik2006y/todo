const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");

const getTasks = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = { userId: req.user._id };

  if (status && status !== "all") {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Task title is required");
  }

  const task = await Task.create({
    title,
    description,
    status,
    dueDate: dueDate || null,
    userId: req.user._id,
  });

  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.status = req.body.status ?? task.status;
  task.dueDate =
    req.body.dueDate === ""
      ? null
      : req.body.dueDate !== undefined
        ? req.body.dueDate
        : task.dueDate;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
