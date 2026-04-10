const { Task, TASK_STATUS } = require('../models/Task');
const Tag = require('../models/Tag');

class TaskService {
  async createTask(taskData, userId) {
    const task = new Task({
      ...taskData,
      user: userId,
      status: TASK_STATUS.PENDING
    });

    await task.save();
    return task;
  }

  async getAllTasks(userId, filters = {}) {
    const query = { user: userId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.urgency) {
      query.urgency = filters.urgency;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, urgency: -1 }).lean();
    return tasks;
  }

  async getTaskById(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async updateTask(taskId, userId, updateData) {
    delete updateData.user;
    delete updateData.completedAt;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async markAsCompleted(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (task.status === TASK_STATUS.DONE) {
      const error = new Error('Esta tarefa ja esta concluida');
      error.statusCode = 400;
      throw error;
    }

    task.status = TASK_STATUS.DONE;
    task.completedAt = new Date();
    await task.save();

    return task;
  }

  async markAsPending(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (task.status === TASK_STATUS.PENDING) {
      const error = new Error('Esta tarefa ja esta pendente');
      error.statusCode = 400;
      throw error;
    }

    task.status = TASK_STATUS.PENDING;
    task.completedAt = null;
    await task.save();

    return task;
  }

  async deleteTask(taskId, userId) {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Tarefa excluida com sucesso', task };
  }

  async addTag(taskId, userId, tagId) {
    const tag = await Tag.findOne({ _id: tagId, user: userId });

    if (!tag) {
      const error = new Error('Tag nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $addToSet: { tags: tag._id } },
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async removeTag(taskId, userId, tagId) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $pull: { tags: tagId } },
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Tarefa nao encontrada');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async getTaskStats(userId) {
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      pending: 0,
      done: 0
    };

    stats.forEach((stat) => {
      if (stat._id === TASK_STATUS.PENDING) {
        result.pending = stat.count;
      } else if (stat._id === TASK_STATUS.DONE) {
        result.done = stat.count;
      }
      result.total += stat.count;
    });

    return result;
  }
}

module.exports = new TaskService();
