const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const profileValidation = [
  body('fullName').optional().trim().isLength({ min: 2, max: 120 }),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('bio').optional().trim().isLength({ max: 500 })
];

router.get('/', profileController.getProfile.bind(profileController));
router.put('/', profileValidation, profileController.upsertProfile.bind(profileController));

module.exports = router;
