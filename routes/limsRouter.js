const express = require('express');
const router = express.Router();

 const limsController = require('../controller/lims');

// 검진자 리스트
router.post('/lists', limsController.limsList);
router.post('/save', limsController.limsSave);

module.exports = router;