const { Cow } = require('../models');

async function getAllCows(req, res, next) {
  try {
    const cows = await Cow.findAll({ order: [['id', 'ASC']] });
    res.json(cows);
  } catch (err) { next(err); }
}

async function getCowById(req, res, next) {
  try {
    const cow = await Cow.findByPk(req.params.id);
    if (!cow) return res.status(404).json({ error: 'Cow not found' });
    res.json(cow);
  } catch (err) { next(err); }
}

async function createCow(req, res, next) {
  try {
    const cow = await Cow.create(req.body);
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
