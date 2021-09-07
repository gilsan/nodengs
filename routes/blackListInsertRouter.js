const express = require('express');
const router = express.Router();

 const blackListInsertController = require('../controller/blackListMapper');

// 검진자 필터링된 리스스
router.post('/insert', blackListInsertController.insertBlackList);

module.exports = router;