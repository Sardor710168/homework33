const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validator');
const controller = require('../controllers/modelController');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', [param('id').isInt(), validate], controller.getById);
router.get('/brand/:brand_id', [param('brand_id').isInt(), validate], controller.getByBrand);
router.post('/', [ body('brand_id').isInt(), body('name').notEmpty(), validate ], controller.create);
router.put('/:id', [param('id').isInt(), body('brand_id').isInt(), body('name').notEmpty(), validate], controller.update);
router.delete('/:id', [param('id').isInt(), validate], controller.remove);

module.exports = router;
