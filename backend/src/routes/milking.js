const express = require('express');
const router = express.Router();
const { MilkingRecord, Cow } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    const records = await MilkingRecord.findAll({ where, order: [['record_date', 'DESC']] });
    res.json(records);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { cow_id, record_date, record_time, yield_liters } = req.body;
    if (!cow_id || !record_date || !record_time || !yield_liters) {
      return res.status(400).json({ error: 'cow_id, record_date, record_time and yield_liters are required' });
    }
    const cow = await Cow.findByPk(cow_id);
    if (!cow) return res.status(400).json({ error: 'Cow does not exist' });
    const record = await MilkingRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
});

module.exports = router;
