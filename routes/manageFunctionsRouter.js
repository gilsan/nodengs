const express = require('express');
const router = express.Router();

const functionsController = require('../controller/manageFunctionsMapper');

// 함수 관리 
router.post('/list',     functionsController.listFunctions); 
router.post('/insert',   functionsController.insertFunctions); 
router.post('/update',   functionsController.updateFunctions); 
router.post('/delete',   functionsController.deleteFunctions); 

module.exports = router;