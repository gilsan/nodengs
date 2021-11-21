const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslist_path');

// 
router.post('/list', searchPatientDiagController.getPatientPathLists);

// seqencing 검진자 리스트
router.get('/listSeq', searchPatientDiagController.getPatientPathSeqLists);

module.exports = router;