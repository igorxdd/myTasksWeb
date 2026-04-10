const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { name, email, password } = req.body;
      
      const result = await authService.register({ name, email, password });

      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao registrar usuário'
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      
      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao fazer login'
      });
    }
  }

  async getMe(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Dados do usuário recuperados com sucesso',
        data: req.user
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erro ao obter dados do usuário'
      });
    }
  }
}

module.exports = new AuthController();
