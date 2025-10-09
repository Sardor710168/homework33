const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validator');
const controller = require('../controllers/orderController');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', [param('id').isInt(), validate], controller.getById);
router.get('/customer/:customer_id', [param('customer_id').isInt(), validate], controller.getByCustomer);
router.post('/', [
  body('customer_id').isInt(),
  body('order_date').isISO8601(),
  body('order_status').optional().isIn(['pending','processing','completed','cancelled','shipped']),
  body('order_items').isArray({ min:1 }),
  body('order_items.*.phone_id').isInt(),
  body('order_items.*.quantity').isInt({ min:1 }),
  validate
], controller.create);
router.put('/:id', [
  param('id').isInt(),
  body('order_status').optional().isIn(['pending','processing','completed','cancelled','shipped']),
  validate
], controller.update);
router.patch('/:id/status', [ param('id').isInt(), body('order_status').isIn(['pending','processing','completed','cancelled','shipped']), validate ], controller.updateStatus);
router.delete('/:id', [ param('id').isInt(), validate ], controller.remove);

module.exports = router;
