const express = require('express');
const router = express.Router();
const executionController = require('../controllers/executionController');

router.post('/execute', executionController.runCode);

module.exports = router;
