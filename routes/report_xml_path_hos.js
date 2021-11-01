const express = require('express');
const router = express.Router();

 const reportXmlPathHosController = require('../controller/report_xml_Path_hos');

// 검진자 리스트
router.post('/list', reportXmlPathHosController.getList);

module.exports = router;