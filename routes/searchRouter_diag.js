const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslist_diag');

// 환자 정보 검색  getPatientDiagLists
router.post('/list', searchPatientDiagController.getPatientDiagLists); 
// AML/ALL 검진자 리스트
router.get('/listAml', searchPatientDiagController.getPatientDiagListsAml);
// MDS/MPN  검진자 리스트
router.get('/listMdsMpn', searchPatientDiagController.getPatientDiagListsMdsMpn);
// 악성림프종/형질세포종 검진자 리스트
router.get('/listLymphoma', searchPatientDiagController.getPatientDiagListsLymphoma);
// 유전성유전질환 검진자 리스트
router.get('/listGenetic', searchPatientDiagController.getPatientDiagListsGenetic);
// Sequencing
router.get('/listSequencing', searchPatientDiagController.getPatientDiagListsSequencing);
// MLPA
router.get('/listMlpa', searchPatientDiagController.getPatientDiagListsMlpa);
 

module.exports = router;