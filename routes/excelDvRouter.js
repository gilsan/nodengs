const express = require('express');
const router = express.Router();

// 2021-06-02
const excelDvController = require('../controller/excelDv');

// 검진자 excel 리스트
router.post('/insert', excelDvController.excelDvSave);
router.post('/list', excelDvController.excelDvList);

module.exports = router;