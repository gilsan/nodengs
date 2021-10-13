const express = require('express');
const router = express.Router();

 const reportXmlController = require('../controller/report_xml');

// 검진자 리스트
router.post('/list', reportXmlController.getList);

module.exports = router;