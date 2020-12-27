const express = require('express');
const router = express.Router();

 const screenController = require('../controller/patientslist');

// 검진자 리스트
router.get('/list', screenController.getLists);

module.exports = router;