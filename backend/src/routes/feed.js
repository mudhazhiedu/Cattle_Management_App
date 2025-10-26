const express = require('express');
const router = express.Router();
const { FeedInventory, FeedConsumption, Cow, FinancialTransaction } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all feed inventory
router.get('/inventory', authenticateToken, async (req, res, next) => {
  try {
    const inventory = await FeedInventory.findAll({ order: [['feed_name', 'ASC']] });
    res.json(inventory);
  } catch (err) { next(err); }
});

// Get low stock alerts
router.get('/inventory/alerts', authenticateToken, async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const lowStock = await FeedInventory.findAll({
      where: {
        current_stock_kg: { [Op.lte]: sequelize.col('low_stock_threshold') }
      }
    });
    res.json(lowStock);
  } catch (err) { next(err); }
});

// Create feed inventory (auto-creates expense)
router.post('/inventory', authenticateToken, async (req, res, next) => {
  try {
    const feed = await FeedInventory.create(req.body);
    
    // Auto-create financial expense
    if (feed.cost_per_kg && feed.current_stock_kg) {
      await FinancialTransaction.create({
        transaction_date: feed.purchase_date || new Date(),
        transaction_type: 'expense',
        category: 'Feed',
        amount: parseFloat(feed.cost_per_kg) * parseFloat(feed.current_stock_kg),
        quantity: feed.current_stock_kg,
        price_per_unit: feed.cost_per_kg,
        description: `Feed purchase: ${feed.feed_name}`,
        payment_status: 'paid',
        notes: `Auto-created from feed inventory #${feed.id}`
      });
    }
    
    res.status(201).json(feed);
  } catch (err) { next(err); }
});

// Update feed inventory
router.put('/inventory/:id', authenticateToken, async (req, res, next) => {
  try {
    const feed = await FeedInventory.findByPk(req.params.id);
    if (!feed) return res.status(404).json({ error: 'Feed not found' });
    await feed.update(req.body);
    res.json(feed);
  } catch (err) { next(err); }
});

// Get feed consumption records
router.get('/consumption', authenticateToken, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.cow_id) where.cow_id = req.query.cow_id;
    
    const records = await FeedConsumption.findAll({
      where,
      include: [
        { model: Cow, as: 'cow', attributes: ['id', 'tag_id', 'name'] },
        { model: FeedInventory, as: 'feed', attributes: ['id', 'feed_name', 'feed_type'] }
      ],
      order: [['consumption_date', 'DESC']]
    });
    res.json(records);
  } catch (err) { next(err); }
});

// Create feed consumption (auto-updates stock & creates expense)
router.post('/consumption', authenticateToken, async (req, res, next) => {
  try {
    const { feed_inventory_id, quantity_kg, cow_id, consumption_date } = req.body;
    
    const feed = await FeedInventory.findByPk(feed_inventory_id);
    if (!feed) return res.status(404).json({ error: 'Feed not found' });
    
    // Calculate cost
    const cost = parseFloat(feed.cost_per_kg || 0) * parseFloat(quantity_kg);
    
    // Create consumption record
    const consumption = await FeedConsumption.create({
      ...req.body,
      cost
    });
    
    // Update feed stock
    await feed.update({
      current_stock_kg: parseFloat(feed.current_stock_kg) - parseFloat(quantity_kg)
    });
    
    // Auto-create financial expense
    await FinancialTransaction.create({
      transaction_date: consumption_date,
      transaction_type: 'expense',
      category: 'Feed',
      amount: cost,
      quantity: quantity_kg,
      price_per_unit: feed.cost_per_kg,
      description: `Feed consumption: ${feed.feed_name}`,
      related_cow_id: cow_id,
      payment_status: 'paid',
      notes: `Auto-created from feed consumption #${consumption.id}`
    });
    
    res.status(201).json(consumption);
  } catch (err) { next(err); }
});

module.exports = router;
