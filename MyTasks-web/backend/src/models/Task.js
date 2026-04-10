const mongoose = require('mongoose');

const TASK_STATUS = {
  PENDING: 'PENDING',
  DONE: 'DONE'
};

const URGENCY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    minlength: [1, 'Título deve ter pelo menos 1 caractere'],
    maxlength: [200, 'Título deve ter no máximo 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres'],
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Prazo é obrigatório']
  },
  urgency: {
    type: String,
    enum: {
      values: Object.values(URGENCY_LEVELS),
      message: 'Nível de urgência inválido. Use: LOW, MEDIUM, HIGH ou CRITICAL'
    },
    default: URGENCY_LEVELS.MEDIUM
  },
  status: {
    type: String,
    enum: {
      values: Object.values(TASK_STATUS),
      message: 'Status inválido. Use: PENDING ou DONE'
    },
    default: TASK_STATUS.PENDING
  },
  completedAt: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    default: []
  }
}, {
  timestamps: true
});

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

taskSchema.virtual('isOverdue').get(function() {
  return this.status === TASK_STATUS.PENDING && this.dueDate < new Date();
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = {
  Task,
  TASK_STATUS,
  URGENCY_LEVELS
};
