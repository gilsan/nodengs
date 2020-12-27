const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslists_diag');

// 검진자 필터링된 리스스
router.get('list', searchPatientDiagController.patientDiagSearch);

module.exports = router;