const express = require('express');
const router = express.Router();

// 2021-06-02
const excelDvController = require('../controller/excelDv');

// 검진자 excel 리스트
router.post('/insert', excelDvController.excelDvSave);
// router.get('/list', excelDvController.excelDvList);
router.post('/lists', excelDvController.excelDvList);
module.exports = router;