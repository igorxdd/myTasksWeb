const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

const getValidationResponse = (req) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return null;
  }

  return {
    success: false,
    message: 'Dados inválidos',
    errors: errors.array()
  };
};

class TaskController {
  async createTask(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { title, description, dueDate, urgency } = req.body;
      
      const task = await taskService.createTask(
        { title, description, dueDate, urgency },
        req.userId
      );

      return res.status(201).json({
        success: true,
        message: 'Tarefa criada com sucesso',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao criar tarefa'
      });
    }
  }

  async getAllTasks(req, res) {
    try {
      const { status, urgency } = req.query;
      
      const tasks = await taskService.getAllTasks(req.userId, { status, urgency });

      return res.status(200).json({
        success: true,
        message: 'Tarefas recuperadas com sucesso',
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao listar tarefas'
      });
    }
  }

  async getTaskById(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { id } = req.params;
      
      const task = await taskService.getTaskById(id, req.userId);

      return res.status(200).json({
        success: true,
        message: 'Tarefa recuperada com sucesso',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao buscar tarefa'
      });
    }
  }

  async updateTask(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { id } = req.params;
      const { title, description, dueDate, urgency, status } = req.body;
      
      const task = await taskService.updateTask(id, req.userId, {
        title,
        description,
        dueDate,
        urgency,
        status
      });

      return res.status(200).json({
        success: true,
        message: 'Tarefa atualizada com sucesso',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao atualizar tarefa'
      });
    }
  }

  async markAsCompleted(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { id } = req.params;
      
      const task = await taskService.markAsCompleted(id, req.userId);

      return res.status(200).json({
        success: true,
        message: 'Tarefa marcada como concluída',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao marcar tarefa como concluída'
      });
    }
  }

  async markAsPending(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { id } = req.params;
      
      const task = await taskService.markAsPending(id, req.userId);

      return res.status(200).json({
        success: true,
        message: 'Tarefa reaberta com sucesso',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao reabrir tarefa'
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const validation = getValidationResponse(req);
      if (validation) {
        return res.status(400).json(validation);
      }

      const { id } = req.params;
      
      const result = await taskService.deleteTask(id, req.userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao excluir tarefa'
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await taskService.getTaskStats(req.userId);

      return res.status(200).json({
        success: true,
        message: 'Estatísticas recuperadas com sucesso',
        data: stats
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao obter estatísticas'
      });
    }
  }
}

module.exports = new TaskController();
