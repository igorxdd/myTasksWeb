const { validationResult } = require('express-validator');
const UserProfile = require('../models/UserProfile');

class ProfileController {
  async getProfile(req, res) {
    try {
      const profile = await UserProfile.findOne({ user: req.userId }).lean();

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Perfil nao encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar perfil'
      });
    }
  }

  async upsertProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          errors: errors.array()
        });
      }

      const { fullName, phone, bio } = req.body;

      const profile = await UserProfile.findOneAndUpdate(
        { user: req.userId },
        { $set: { fullName, phone, bio } },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: profile
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar perfil'
      });
    }
  }
}

module.exports = new ProfileController();
