const express = require('express');
const router = express.Router();

const functionsController = require('../controller/manageFunctionsMapper');

// 함수 관리 
router.post('/list',   functionsController.listFunctions); 
router.post('/update',   functionsController.updateFunctions); 

module.exports = router;