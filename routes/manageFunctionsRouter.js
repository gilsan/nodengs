const express = require('express');
const router = express.Router();

const functionsController = require('../controller/manageFunctionsMapper');

// �Լ� ���� 
router.post('/list',   functionsController.listFunctions); 
router.post('/update',   functionsController.updateFunctions); 

module.exports = router;