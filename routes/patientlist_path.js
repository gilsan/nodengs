const express = require('express');
const router = express.Router();

 const patientDiagController = require('../controller/patientslist_path');

// 검진자 리스트
router.get('/list', patientDiagController.getPathLists);
// 검사자 변경시 저장
router.post('/updateExaminer', patientDiagController.updateExaminer);
// 진검 수정 버튼 누를 때 screenstatus 1로 설정
router.post('/resetPath', patientDiagController.resetScreenStatusPath);
//
router.post('/screenstatusPath', patientDiagController.getScreenStatusPath);
module.exports = router;