const express = require('express');
const router = express.Router();

 const searchPatientDiagController = require('../controller/patientslist_path');

// 
router.post('/list', searchPatientDiagController.getPatientPathLists);

module.exports = router;