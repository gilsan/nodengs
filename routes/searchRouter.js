const express = require('express');
const router = express.Router();

 const searchPatientController = require('../controller/patientslist');

// 검진자 필터링된 리스스
router.post('/list', searchPatientController.patientSearch);

module.exports = router;