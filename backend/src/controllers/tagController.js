const { validationResult } = require('express-validator');
const Tag = require('../models/Tag');
const { Task } = require('../models/Task');
const taskService = require('../services/taskService');

class TagController {
  async createTag(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { name, color } = req.body;
      const tag = await Tag.create({ name, color, user: req.userId });

      return res.status(201).json({
        success: true,
        data: tag
      });
    } catch (error) {
      const code = error.code === 11000 ? 409 : 500;
      return res.status(code).json({
        success: false,
        message: code === 409 ? 'Tag ja existe para este usuario' : (error.message || 'Erro ao criar tag')
      });
    }
  }

  async getTags(req, res) {
    try {
      const tags = await Tag.find({ user: req.userId }).sort({ name: 1 }).lean();
      return res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar tags'
      });
    }
  }

  async updateTag(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { name, color } = req.body;
      const tag = await Tag.findOneAndUpdate(
        { _id: id, user: req.userId },
        { $set: { name, color } },
        { new: true, runValidators: true }
      );

      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag nao encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      const code = error.code === 11000 ? 409 : 500;
      return res.status(code).json({
        success: false,
        message: code === 409 ? 'Tag ja existe para este usuario' : (error.message || 'Erro ao atualizar tag')
      });
    }
  }

  async deleteTag(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const tag = await Tag.findOneAndDelete({ _id: id, user: req.userId });

      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag nao encontrada'
        });
      }

      await Task.updateMany({ user: req.userId }, { $pull: { tags: tag._id } });

      return res.status(200).json({
        success: true,
        message: 'Tag excluida com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir tag'
      });
    }
  }

  async attachTagToTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { taskId, tagId } = req.params;
      const task = await taskService.addTag(taskId, req.userId, tagId);

      return res.status(200).json({
        success: true,
        message: 'Tag vinculada a tarefa',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao vincular tag'
      });
    }
  }

  async detachTagFromTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { taskId, tagId } = req.params;
      const task = await taskService.removeTag(taskId, req.userId, tagId);

      return res.status(200).json({
        success: true,
        message: 'Tag removida da tarefa',
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao remover tag'
      });
    }
  }
}

module.exports = new TagController();
