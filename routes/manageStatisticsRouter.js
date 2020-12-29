const express = require('express');
const router = express.Router();

const statisticsController = require('../controller/manageStatisticsMapper');

// 사용자 관리 
router.post('/list',   statisticsController.listStatistics); 

module.exports = router;