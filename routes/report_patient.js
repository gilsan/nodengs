const express = require('express');
const router = express.Router();

 const reportPatientController = require('../controller/report_patient');

// 검진자 리스트
router.get('/list', reportPatientController.getList);
router.get('/count', reportPatientController.getCount);
router.get('/insert', reportPatientController.insetList);

module.exports = router;