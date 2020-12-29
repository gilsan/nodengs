const express = require('express');
const router = express.Router();

const statisticsController = require('../controller/manageStatisticsMapper');

// ����� ���� 
router.post('/list',   statisticsController.listStatistics); 

module.exports = router;