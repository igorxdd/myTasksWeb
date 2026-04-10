const { Task } = require('../models/Task');
const User = require('../models/User');
const taskService = require('../services/taskService');
const authService = require('../services/authService');

const ensureAuthenticated = (context) => {
  if (!context || !context.userId) {
    const error = new Error('Acesso negado. Usuário não autenticado.');
    error.statusCode = 401;
    throw error;
  }
};

const toIsoString = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString();
};

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      ensureAuthenticated(context);
      return context.user;
    },

    tasks: async (_, { filters }, context) => {
      ensureAuthenticated(context);
      return taskService.getAllTasks(context.userId, filters || {});
    },

    task: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return taskService.getTaskById(id, context.userId);
    },

    taskStats: async (_, __, context) => {
      ensureAuthenticated(context);
      return taskService.getTaskStats(context.userId);
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      return authService.register(input);
    },

    login: async (_, { input }) => {
      return authService.login(input.email, input.password);
    },

    createTask: async (_, { input }, context) => {
      ensureAuthenticated(context);

      const taskData = {
        title: input.title,
        description: input.description,
        dueDate: input.deadline,
        urgency: input.urgency
      };

      return taskService.createTask(taskData, context.userId);
    },

    updateTask: async (_, { id, input }, context) => {
      ensureAuthenticated(context);

      const updateData = {};

      if (typeof input.title === 'string') {
        updateData.title = input.title;
      }

      if (typeof input.description === 'string') {
        updateData.description = input.description;
      }

      if (typeof input.deadline === 'string') {
        updateData.dueDate = input.deadline;
      }

      if (input.urgency) {
        updateData.urgency = input.urgency;
      }

      if (input.status) {
        updateData.status = input.status;
      }

      return taskService.updateTask(id, context.userId, updateData);
    },

    deleteTask: async (_, { id }, context) => {
      ensureAuthenticated(context);
      await taskService.deleteTask(id, context.userId);
      return true;
    },

    markTaskAsCompleted: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return taskService.markAsCompleted(id, context.userId);
    },

    markTaskAsPending: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return taskService.markAsPending(id, context.userId);
    }
  },

  Task: {
    id: (task) => task.id || task._id.toString(),
    deadline: (task) => toIsoString(task.dueDate),
    owner: async (task) => {
      const userId = task.user || (task.user && task.user._id);
      if (!userId) return null;
      return User.findById(userId);
    },
    createdAt: (task) => toIsoString(task.createdAt),
    updatedAt: (task) => toIsoString(task.updatedAt)
  },

  User: {
    id: (user) => user.id || user._id.toString()
  },

  AuthPayload: {
    user: (payload) => payload.user
  }
};

module.exports = resolvers;

