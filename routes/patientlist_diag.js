const express = require('express');
const router = express.Router();

 const patientDiagController = require('../controller/patientslist_diag');

// 검진자 리스트
router.get('/list', patientDiagController.getDiagLists);
// 검사자 변경시 저장
router.post('/updateExaminer', patientDiagController.updateExaminer);
// 진검 수정 버튼 누를 때 screenstatus 1로 설정
router.post('/reset', patientDiagController.resetScreenStatus);
//
router.post('/screenstatus', patientDiagController.getScreenStatus);
// EMR로 보낸 횟수 저장
router.post('/setEMRSendCount', patientDiagController.setEMRSendCount);
router.post('/getEMRSendCount', patientDiagController.getEMRSendCount);
// 개인 검사자 정보 찿기
router.post('/patientinfo', patientDiagController.getPatientinfo)
module.exports = router;