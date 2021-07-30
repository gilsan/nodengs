const express = require('express');
const router = express.Router();

//PathResearchReportInsert => 보고서 내용을 저장하는 소스
const PathResearchReportInsertController = require('../controller/pathResearchReportInsert');
      
//병리 Pathology 연구용 보고서 입력
//PathResearcReportInsert 소스내의 insertReportPathResearch() 함수
router.post('/insert', PathResearchReportInsertController.insertReportPathResearch);               
router.post('/update', PathResearchReportInsertController.updateReportPathResearch);               

module.exports = router;