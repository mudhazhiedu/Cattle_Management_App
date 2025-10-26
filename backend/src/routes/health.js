const express = require('express');
const router = express.Router();
const { HealthRecord, Cow, FinancialTransaction, Reminder } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all health records
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    if (req.query.record_type) where.record_type = req.query.record_type;
    
    const records = await HealthRecord.findAll({ 
      where,
      include: [{ model: Cow, as: 'cow', attributes: ['id', 'tag_id', 'name'] }],
      order: [['record_date', 'DESC']]
    });
    res.json(records);
  } catch (err) { next(err); }
});

// Get health record by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id, {
      include: [{ model: Cow, as: 'cow' }]
    });
    if (!record) return res.status(404).json({ error: 'Health record not found' });
    res.json(record);
  } catch (err) { next(err); }
});

// Create health record (auto-creates expense & reminder)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const record = await HealthRecord.create(req.body);
    
    // Auto-create financial expense if cost provided
    if (record.cost && record.cost > 0) {
      await FinancialTransaction.create({
        transaction_date: record.record_date,
        transaction_type: 'expense',
        category: 'Veterinary',
        amount: record.cost,
        description: `${record.record_type}: ${record.disease_name || record.medication_name || 'Health service'}`,
        related_cow_id: record.cow_id,
        payment_status: 'paid',
        notes: `Auto-created from health record #${record.id}`
      });
    }
    
    // Auto-create reminder if next_due_date provided
    if (record.next_due_date) {
      await Reminder.create({
        cow_id: record.cow_id,
        reminder_type: record.record_type === 'vaccination' ? 'vaccination' : 'health_checkup',
        reminder_date: record.next_due_date,
        message: `${record.record_type} due: ${record.disease_name || record.medication_name || 'Follow-up'}`,
        priority: 'medium'
      });
    }
    
    res.status(201).json(record);
  } catch (err) { next(err); }
});

// Update health record
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Health record not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) { next(err); }
});

// Delete health record
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Health record not found' });
    await record.destroy();
    res.json({ message: 'Health record deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
