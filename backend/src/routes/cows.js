const express = require('express');
const router = express.Router();
const { getAllCows, getCowById, createCow, updateCow, deleteCow } = require('../controllers/cowsController');

router.get('/', getAllCows);
router.get('/:id', getCowById);
router.post('/', createCow);
router.put('/:id', updateCow);
router.delete('/:id', deleteCow);

module.exports = router;
