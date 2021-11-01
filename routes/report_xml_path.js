const express = require('express');
const router = express.Router();

 const reportXmlPathController = require('../controller/report_xml_Path');

// 검진자 리스트
router.post('/list', reportXmlPathController.getList);

module.exports = router;