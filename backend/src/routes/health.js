const express = require('express');
const router = express.Router();
const { HealthRecord, Cow } = require('../models');
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

// Create health record
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const record = await HealthRecord.create(req.body);
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
