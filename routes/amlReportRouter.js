const express = require('express');
const router = express.Router();

const amlReportInsertController = require('../controller/amlReportInsert');      //amlReportInsert => 보고서 내용을 저장하는 소스

//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
router.post('/insert', amlReportInsertController.insertReportAML);               //amlReportInsert 소스내의 insertReportAML() 함수

module.exports = router;