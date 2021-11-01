const express = require('express');
const router = express.Router();

// 2021-11-01
const excelDvPathController = require('../controller/excelDvPath');

// 검진자 excel 리스트
// router.post('/insert', excelDvPathController.excelDvPathSave);
// router.get('/list', excelDvController.excelDvList);
router.post('/lists', excelDvPathController.excelDvPathList);
module.exports = router;