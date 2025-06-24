const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  dueDate: {
    type: Date,
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
