const express = require('express');
const router = express.Router();
const { HeatRecord, AIRecord, PregnancyRecord, CalvingRecord, Cow } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Heat Records
router.get('/heat', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    const records = await HeatRecord.findAll({ where, order: [['observation_date', 'DESC']] });
    res.json(records);
  } catch (err) { next(err); }
});

router.post('/heat', authenticateToken, async (req, res, next) => {
  try {
    const record = await HeatRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
});

// AI Records
router.get('/ai', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    const records = await AIRecord.findAll({ where, order: [['ai_date', 'DESC']] });
    res.json(records);
  } catch (err) { next(err); }
});

router.post('/ai', authenticateToken, async (req, res, next) => {
  try {
    const record = await AIRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
});

// Pregnancy Records
router.get('/pregnancy', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    const records = await PregnancyRecord.findAll({ where, order: [['check_date', 'DESC']] });
    res.json(records);
  } catch (err) { next(err); }
});

router.post('/pregnancy', authenticateToken, async (req, res, next) => {
  try {
    const record = await PregnancyRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
});

// Calving Records
router.get('/calving', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    const records = await CalvingRecord.findAll({ where, order: [['calving_date', 'DESC']] });
    res.json(records);
  } catch (err) { next(err); }
});

router.post('/calving', authenticateToken, async (req, res, next) => {
  try {
    const record = await CalvingRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) { next(err); }
});

module.exports = router;
