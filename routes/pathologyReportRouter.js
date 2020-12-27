const express = require('express');
const router = express.Router();

//PathologyReportInsert => 보고서 내용을 저장하는 소스
const PathologyReportInsertController = require('../controller/pathologyReportInsert');
      
//병리 Pathology 보고서 입력
//PathologyReportInsert 소스내의 insertReportPathology() 함수
router.post('/insert', PathologyReportInsertController.insertReportPathology);               
router.post('/update', PathologyReportInsertController.updateReportPathology);               

module.exports = router;