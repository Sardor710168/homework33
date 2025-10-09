const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validator');
const controller = require('../controllers/phoneController');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', [param('id').isInt(), validate], controller.getById);
router.get('/model/:model_id', [param('model_id').isInt(), validate], controller.getByModel);
router.post('/', [
  body('name').notEmpty(),
  body('price').isInt({ min: 0 }),
  body('brand_id').isInt(),
  body('model_id').optional().isInt(),
  validate
], controller.create);
router.put('/:id', [
  param('id').isInt(),
  body('name').notEmpty(),
  body('price').isInt({ min: 0 }),
  body('brand_id').isInt(),
  validate
], controller.update);
router.delete('/:id', [param('id').isInt(), validate], controller.remove);

module.exports = router;
