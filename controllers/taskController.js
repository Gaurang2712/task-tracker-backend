const Task = require('../models/taskModel');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Get Tasks Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addTask = async (req, res) => {
  const { title, description, priority = 'Low', dueDate } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ error: 'Title is required (min 3 characters)' });
  }

  // Due date must not be in the past
  if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ error: 'Due date cannot be in the past' });
  }

  try {
    const task = new Task({
      userId: req.user._id,
      title,
      description,
      priority,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Add Task Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { dueDate } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  // Due date must not be in the past
  if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ error: 'Due date cannot be in the past' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Update Task Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete Task Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
