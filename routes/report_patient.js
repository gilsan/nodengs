const express = require('express');
const router = express.Router();

 const reportPatientController = require('../controller/report_patient');

// 검진자 리스트
router.post('/list', reportPatientController.getList);
router.post('/count', reportPatientController.getCount);
router.post('/insert', reportPatientController.insetList);

module.exports = router;