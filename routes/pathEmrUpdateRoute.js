const express = require('express');
const router = express.Router();

//PathologyReportInsert => 보고서 내용을 저장하는 소스
const  emrSendUpdateController = require('../controller/screenLists');
      
//병리 Pathology 보고서 입력
//PathologyReportInsert 소스내의 insertReportPathology() 함수
router.post('/pathEmrSendUpdate', emrSendUpdateController.emrSendUpdate);  // 처음          
router.post('/pathologyEmrSendUpdate', emrSendUpdateController.finishPathologyScreen);
router.post('/finishPathologyEMRScreen', emrSendUpdateController.finishPathologyEMRScreen); // 마지막
router.post('/pathologyReportUpdate', emrSendUpdateController.pathologyReportUpdate); // 2번으로 변경
router.get('/finishPathologyEMR', emrSendUpdateController.finishPathologyEMR); // 마지막

module.exports = router;