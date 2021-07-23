const express = require('express');
const router = express.Router();

 const patientResearchController = require('../controller/patientslist_Research');

// 검진자 리스트
router.get('/list', patientResearchController.getResearchLists);
// 검진자 리스트 변경시 저장
router.post('/insert', patientResearchController.setResearchList);
// 진검 수정 버튼 누를 때 screenstatus 1로 설정
router.post('/resetResearch', patientResearchController.resetScreenStatusResearch);
//
router.post('/screenstatusResearch', patientResearchController.getScreenStatusResearch);
router.post('/Research',   patientResearchController.getResearchByPathNo);

module.exports = router;