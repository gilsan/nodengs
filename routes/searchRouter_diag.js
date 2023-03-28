const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslist_diag');

// 환자 정보 검색  getPatientDiagLists
router.post('/list', searchPatientDiagController.getPatientDiagLists); 
// 환자 정보 엑셀 검색  getPatientDiagLists
router.post('/list_excel', searchPatientDiagController.getPatientDiagLists_Excel); 
// AML/ALL 검진자 리스트
router.post('/listAml', searchPatientDiagController.getPatientDiagListsAml);
// MDS/MPN  검진자 리스트
router.post('/listMdsMpn', searchPatientDiagController.getPatientDiagListsMdsMlpn);
// 악성림프종/형질세포종 검진자 리스트
router.post('/listLymphoma', searchPatientDiagController.getPatientDiagListsLymphoma);
// 유전성유전질환 검진자 리스트
router.post('/listGenetic', searchPatientDiagController.getPatientDiagListsGenetic);
// Sequencing
router.post('/listSequencing', searchPatientDiagController.getPatientDiagListsSequencing);
// MLPA
router.post('/listMlpa', searchPatientDiagController.getPatientDiagListsMlpa);
// igtcr
router.post('/listigtcr', searchPatientDiagController.getPatientDiagListsigtcr);
// Mutatio gene count 검색 
router.post('/count', searchPatientDiagController.count);
 

module.exports = router;