const { Cow, FinancialTransaction, MilkingRecord, HeatRecord, AIRecord, PregnancyRecord, CalvingRecord, HealthRecord, Reminder, FeedConsumption } = require('../models');

async function getAllCows(req, res, next) {
  try {
    const cows = await Cow.findAll({ order: [['id', 'ASC']] });
    res.json(cows);
  } catch (err) { next(err); }
}

async function getCowById(req, res, next) {
  try {
    const cow = await Cow.findByPk(req.params.id, {
      include: [
        { model: MilkingRecord, as: 'milking_records', limit: 10, order: [['record_date', 'DESC']] },
        { model: HeatRecord, as: 'heat_records', limit: 5, order: [['observation_date', 'DESC']] },
        { model: AIRecord, as: 'ai_records', limit: 5, order: [['ai_date', 'DESC']] },
        { model: PregnancyRecord, as: 'pregnancy_records', limit: 5, order: [['check_date', 'DESC']] },
        { model: CalvingRecord, as: 'calving_records', limit: 5, order: [['calving_date', 'DESC']] },
        { model: HealthRecord, as: 'health_records', limit: 10, order: [['record_date', 'DESC']] },
        { model: FinancialTransaction, as: 'transactions', limit: 10, order: [['transaction_date', 'DESC']] },
        { model: Reminder, as: 'reminders', where: { status: 'pending' }, required: false },
        { model: FeedConsumption, as: 'feed_consumption', limit: 10, order: [['consumption_date', 'DESC']] }
      ]
    });
    if (!cow) return res.status(404).json({ error: 'Cow not found' });
    res.json(cow);
  } catch (err) { next(err); }
}

async function createCow(req, res, next) {
  try {
    const cow = await Cow.create(req.body);
    
    // Auto-create purchase expense if price provided
    if (cow.purchase_price && cow.purchase_price > 0) {
      await FinancialTransaction.create({
        transaction_date: cow.purchase_date || new Date(),
        transaction_type: 'expense',
        category: 'Animal Purchase',
        amount: cow.purchase_price,
        description: `Cow purchase: ${cow.tag_id} - ${cow.name || 'Unnamed'}`,
        related_cow_id: cow.id,
        payment_status: 'paid',
        notes: `Auto-created from cow #${cow.id}`
      });
    }
    
    res.status(201).json(cow);
  } catch (err) { next(err); }
}

async function updateCow(req, res, next) {
  try {
    const cow = await Cow.findByPk(req.params.id);
    if (!cow) return res.status(404).json({ error: 'Cow not found' });
    await cow.update(req.body);
    res.json(cow);
  } catch (err) { next(err); }
}

async function deleteCow(req, res, next) {
  try {
    const cow = await Cow.findByPk(req.params.id);
    if (!cow) return res.status(404).json({ error: 'Cow not found' });
    await cow.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAllCows, getCowById, createCow, updateCow, deleteCow };
