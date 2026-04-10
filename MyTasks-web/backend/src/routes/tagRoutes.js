const express = require('express');
const { body, param } = require('express-validator');
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const idValidation = [
  param('id').isMongoId().withMessage('ID invalido')
];

const linkValidation = [
  param('taskId').isMongoId().withMessage('ID da tarefa invalido'),
  param('tagId').isMongoId().withMessage('ID da tag invalido')
];

const createValidation = [
  body('name').trim().notEmpty().isLength({ min: 1, max: 40 }),
  body('color').optional().trim().isLength({ max: 20 })
];

const updateValidation = [
  body('name').optional().trim().notEmpty().isLength({ min: 1, max: 40 }),
  body('color').optional().trim().isLength({ max: 20 })
];

router.get('/', tagController.getTags.bind(tagController));
router.post('/', createValidation, tagController.createTag.bind(tagController));
router.put('/:id', [...idValidation, ...updateValidation], tagController.updateTag.bind(tagController));
router.delete('/:id', idValidation, tagController.deleteTag.bind(tagController));
router.post('/link/:taskId/:tagId', linkValidation, tagController.attachTagToTask.bind(tagController));
router.delete('/link/:taskId/:tagId', linkValidation, tagController.detachTagFromTask.bind(tagController));

module.exports = router;
