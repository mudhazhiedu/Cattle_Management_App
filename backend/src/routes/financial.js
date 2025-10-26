const express = require('express');
const router = express.Router();
const { FinancialTransaction, Cow } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all transactions
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.transaction_type) where.transaction_type = req.query.transaction_type;
    if (req.query.category) where.category = req.query.category;
    if (req.query.start_date && req.query.end_date) {
      where.transaction_date = { [Op.between]: [req.query.start_date, req.query.end_date] };
    }
    
    const transactions = await FinancialTransaction.findAll({ 
      where,
      include: [{ model: Cow, as: 'cow', attributes: ['id', 'tag_id', 'name'], required: false }],
      order: [['transaction_date', 'DESC']]
    });
    res.json(transactions);
  } catch (err) { next(err); }
});

// Get financial summary
router.get('/summary', authenticateToken, async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const where = {};
    if (start_date && end_date) {
      where.transaction_date = { [Op.between]: [start_date, end_date] };
    }
    
    const income = await FinancialTransaction.sum('amount', { 
      where: { ...where, transaction_type: 'income' } 
    }) || 0;
    
    const expense = await FinancialTransaction.sum('amount', { 
      where: { ...where, transaction_type: 'expense' } 
    }) || 0;
    
    res.json({
      income: parseFloat(income),
      expense: parseFloat(expense),
      profit: parseFloat(income) - parseFloat(expense)
    });
  } catch (err) { next(err); }
});

// Create transaction
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const transaction = await FinancialTransaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) { next(err); }
});

// Update transaction
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const transaction = await FinancialTransaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    await transaction.update(req.body);
    res.json(transaction);
  } catch (err) { next(err); }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const transaction = await FinancialTransaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    await transaction.destroy();
    res.json({ message: 'Transaction deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
