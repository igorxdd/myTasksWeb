const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

class AuthService {
  getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.trim().length < 32) {
      const error = new Error('JWT_SECRET invalido. Defina um segredo forte no backend.env');
      error.statusCode = 500;
      throw error;
    }

    return secret;
  }

  async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('Este email já está em uso');
      error.statusCode = 400;
      throw error;
    }
    
    const user = new User({
      name,
      email,
      password
    });
    
    await user.save();

    await UserProfile.create({
      user: user._id,
      fullName: user.name
    });
    
    const token = this.generateToken(user._id);
    
    return {
      user: user.toJSON(),
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    const token = this.generateToken(user._id);
    
    return {
      user: user.toJSON(),
      token
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return user;
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      this.getJwtSecret(),
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.getJwtSecret());
    } catch (error) {
      const err = new Error('Token inválido ou expirado');
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = new AuthService();
