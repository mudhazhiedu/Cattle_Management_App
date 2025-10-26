const express = require('express');
const router = express.Router();
const { HeatRecord, AIRecord, PregnancyRecord, CalvingRecord, Cow, Reminder } = require('../models');
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
    
    // Auto-create reminder for next heat (21 days)
    const nextHeatDate = new Date(record.observation_date);
    nextHeatDate.setDate(nextHeatDate.getDate() + 21);
    await Reminder.create({
      cow_id: record.cow_id,
      reminder_type: 'heat',
      reminder_date: nextHeatDate,
      message: 'Expected heat detection - observe for signs',
      priority: 'high'
    });
    
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
    
    // Auto-create reminder for pregnancy check (30 days)
    const pregnancyCheckDate = new Date(record.ai_date);
    pregnancyCheckDate.setDate(pregnancyCheckDate.getDate() + 30);
    await Reminder.create({
      cow_id: record.cow_id,
      reminder_type: 'pregnancy_check',
      reminder_date: pregnancyCheckDate,
      message: 'Pregnancy check due (30 days post-AI)',
      priority: 'high'
    });
    
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
    
    // Auto-create reminders if pregnancy confirmed
    if (record.pregnancy_status === 'confirmed' && record.expected_calving_date) {
      // Calving reminder (7 days before)
      const calvingReminderDate = new Date(record.expected_calving_date);
      calvingReminderDate.setDate(calvingReminderDate.getDate() - 7);
      await Reminder.create({
        cow_id: record.cow_id,
        reminder_type: 'calving',
        reminder_date: calvingReminderDate,
        message: 'Calving expected in 7 days - prepare',
        priority: 'urgent'
      });
      
      // Dry-off reminder (60 days before calving)
      const dryOffDate = new Date(record.expected_calving_date);
      dryOffDate.setDate(dryOffDate.getDate() - 60);
      if (dryOffDate > new Date()) {
        await Reminder.create({
          cow_id: record.cow_id,
          reminder_type: 'dry_off',
          reminder_date: dryOffDate,
          message: 'Dry-off cow (60 days before calving)',
          priority: 'high'
        });
      }
    }
    
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
    
    // Auto-create reminder for next heat (21 days after calving)
    const nextHeatDate = new Date(record.calving_date);
    nextHeatDate.setDate(nextHeatDate.getDate() + 21);
    await Reminder.create({
      cow_id: record.cow_id,
      reminder_type: 'heat',
      reminder_date: nextHeatDate,
      message: 'First heat expected post-calving',
      priority: 'medium'
    });
    
    res.status(201).json(record);
  } catch (err) { next(err); }
});

module.exports = router;
