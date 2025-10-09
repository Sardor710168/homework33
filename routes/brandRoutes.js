const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validator');
const brandController = require('../controllers/brandController');

router.get('/', brandController.getAll);
router.get('/:id', [ param('id').isInt().withMessage('Invalid id') , validate ], brandController.getById);
router.post('/', [ body('name').notEmpty().withMessage('name is required'), validate ], brandController.create);
router.put('/:id', [ param('id').isInt(), body('name').notEmpty(), validate ], brandController.update);
router.delete('/:id', [ param('id').isInt(), validate ], brandController.remove);

module.exports = router;
