const express = require('express');
const router = express.Router();

 const materialController = require('../controller/patientslist');

// 검진자 리스트
router.get('/list', materialController.getLists);

module.exports = router;