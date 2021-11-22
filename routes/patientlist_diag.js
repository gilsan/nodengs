const express = require('express');
const router = express.Router();

 const patientDiagController = require('../controller/patientslist_diag');

// 전체 리스트
router.get('/allLists', patientDiagController.allLists);
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
router.post('/patientinfo', patientDiagController.getPatientinfo);
// 진검 screenstatus 변경
router.post('/changestatus', patientDiagController.changestatus)




// 연구용 진검 환자 등록
router.post('/insertPatientinfo', patientDiagController.insertPatientinfo);

// 연구용 검진 삭제
router.post('/deletePatientinfoBySepecimenno', patientDiagController.deletePatientinfoBySepecimenno);
// 연구용 검진 환자 specimenNo 로 등록
router.post('/insertPatientinfoBySepecimenno', patientDiagController.insertPatientinfoBySepecimenno);
// 연구용 검진 환자 specimenNo 로 갱신
router.post('/updatePatientinfoBySepecimenno', patientDiagController.updatePatientinfoBySepecimenno);

// 연구용 진검 환자 불러오기 gnb 필드로 구분
router.get('/getResearchLists', patientDiagController.getResearchLists);




module.exports = router;