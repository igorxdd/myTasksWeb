const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 1, max: 200 })
    .withMessage('Título deve ter entre 1 e 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Descrição deve ter no máximo 2000 caracteres'),
  body('dueDate')
    .notEmpty()
    .withMessage('Prazo é obrigatório')
    .isISO8601()
    .withMessage('Prazo deve ser uma data válida'),
  body('urgency')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Nível de urgência inválido. Use: LOW, MEDIUM, HIGH ou CRITICAL')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Título não pode ser vazio')
    .isLength({ min: 1, max: 200 })
    .withMessage('Título deve ter entre 1 e 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Descrição deve ter no máximo 2000 caracteres'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Prazo deve ser uma data válida'),
  body('urgency')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Nível de urgência inválido. Use: LOW, MEDIUM, HIGH ou CRITICAL'),
  body('status')
    .optional()
    .isIn(['PENDING', 'DONE'])
    .withMessage('Status inválido. Use: PENDING ou DONE')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarefa inválido')
];

router.get('/stats', taskController.getStats.bind(taskController));
router.get('/', taskController.getAllTasks.bind(taskController));
router.get('/:id', idValidation, taskController.getTaskById.bind(taskController));
router.post('/', taskValidation, taskController.createTask.bind(taskController));
router.put('/:id', [...idValidation, ...updateTaskValidation], taskController.updateTask.bind(taskController));
router.patch('/:id/complete', idValidation, taskController.markAsCompleted.bind(taskController));
router.patch('/:id/reopen', idValidation, taskController.markAsPending.bind(taskController));
router.delete('/:id', idValidation, taskController.deleteTask.bind(taskController));

module.exports = router;
