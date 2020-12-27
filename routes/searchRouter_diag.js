const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslist_diag');

// 환자 정보 검색  getPatientDiagLists
router.post('/list', searchPatientDiagController.getPatientDiagLists); 

module.exports = router;