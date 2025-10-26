const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const cowsRouter = require('./routes/cows');
const milkingRouter = require('./routes/milking');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Cattle Management API' }));

app.use('/api/cows', cowsRouter);
app.use('/api/milking', milkingRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
