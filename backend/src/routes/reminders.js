const express = require('express');
const router = express.Router();
const { Reminder, Cow } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all reminders
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    
    const reminders = await Reminder.findAll({ 
      where, 
      include: [{ model: Cow, as: 'cow', attributes: ['id', 'tag_id', 'name'] }],
      order: [['reminder_date', 'ASC'], ['priority', 'DESC']]
    });
    res.json(reminders);
  } catch (err) { next(err); }
});

// Get pending reminders count
router.get('/count', authenticateToken, async (req, res, next) => {
  try {
    const count = await Reminder.count({ where: { status: 'pending' } });
    res.json({ count });
  } catch (err) { next(err); }
});

// Create reminder
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) { next(err); }
});

// Update reminder status
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    
    if (req.body.status === 'completed') {
      req.body.completed_at = new Date();
    }
    
    await reminder.update(req.body);
    res.json(reminder);
  } catch (err) { next(err); }
});

// Delete reminder
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    await reminder.destroy();
    res.json({ message: 'Reminder deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
