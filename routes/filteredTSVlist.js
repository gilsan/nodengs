const express = require('express');
const router = express.Router();

 const filteredController = require('../controller/filteredTSVlist');

// 검진자 필터링된 리스스
router.get('/list', filteredController.getTSVLists);

module.exports = router;