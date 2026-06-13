const express = require('express');
const cors = require('cors');
const executionRoutes = require('./routes/executionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', executionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Execution server is running.' });
});

module.exports = app;
