const authService = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>'
      });
    }
    
    const token = parts[1];
    
    const decoded = authService.verifyToken(token);
    
    const user = await authService.getUserById(decoded.userId);
    
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Falha na autenticação'
    });
  }
};

module.exports = authMiddleware;
