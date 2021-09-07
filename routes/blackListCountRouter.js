const express = require('express');
const router = express.Router();

 const blackListController = require('../controller/blackListMapper');

// 검진자 필터링된 리스스
router.post('/count', blackListController.blackListInfoCount);

module.exports = router;