const express = require('express');
const router = express.Router();

 const blackListController = require('../controller/blackListMapper');

// 검진자 필터링된 리스스
router.post('/list',   blackListController.listBlackList);
router.post('/insert', blackListController.insertBlackList);
router.post('/update', blackListController.updateBlackList);
router.post('/delete', blackListController.deleteBlackList);

module.exports = router;