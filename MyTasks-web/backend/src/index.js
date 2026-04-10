require('dotenv').config({ path: './backend.env' });

const express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const profileRoutes = require('./routes/profileRoutes');
const tagRoutes = require('./routes/tagRoutes');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const authService = require('./services/authService');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem nao permitida pelo CORS'));
  },
  credentials: true
}));
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MyTasks API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tags', tagRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    await apolloServer.start();

    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req }) => {
          let user = null;
          let userId = null;

          const authHeader = req.headers.authorization;

          if (authHeader) {
            const parts = authHeader.split(' ');

            if (parts.length === 2 && parts[0] === 'Bearer') {
              const token = parts[1];

              try {
                const decoded = authService.verifyToken(token);
                user = await authService.getUserById(decoded.userId);
                userId = user._id.toString();
              } catch (error) {
                console.error('Erro ao autenticar token no GraphQL:', error.message);
              }
            }
          }

          return {
            user,
            userId
          };
        }
      })
    );

    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    });

    app.use((err, req, res, next) => {
      console.error('Error:', err);

      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🚀 MyTasks API Server                        ║
║                                                ║
║   Port: ${PORT}                                  ║
║   Mode: ${process.env.NODE_ENV || 'development'}                        ║
║   Status: Running                              ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
