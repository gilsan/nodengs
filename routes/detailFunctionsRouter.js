const express = require('express');
const router = express.Router();

const detailController = require('../controller/detailFunctionsMapper');

// 함수 관리 
router.post('/list',   detailController.listDetails); 
router.post('/info',   detailController.functionInfo); 

router.post('/insert', detailController.insertDetails); 
router.post('/update', detailController.updateDetails); 
router.post('/delete', detailController.deleteDetails); 

module.exports = router;