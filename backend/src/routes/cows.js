const express = require('express');
const router = express.Router();
const { getAllCows, getCowById, createCow, updateCow, deleteCow } = require('../controllers/cowsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', getAllCows);
router.get('/:id', getCowById);
router.post('/', authenticateToken, requireAdmin, createCow);
router.put('/:id', authenticateToken, requireAdmin, updateCow);
router.delete('/:id', authenticateToken, requireAdmin, deleteCow);

module.exports = router;
