const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validator');
const controller = require('../controllers/customerController');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', [param('id').isInt(), validate], controller.getById);
router.post('/', [ body('name').notEmpty(), body('phone_number').notEmpty().isMobilePhone('any'), validate ], controller.create);
router.put('/:id', [ param('id').isInt(), body('name').notEmpty(), body('phone_number').notEmpty().isMobilePhone('any'), validate ], controller.update);
router.delete('/:id', [param('id').isInt(), validate], controller.remove);

module.exports = router;
