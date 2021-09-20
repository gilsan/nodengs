const express = require('express');
const router = express.Router();

//mentlists => 보고서 내용을 저장하는 소스
const  mlpaController = require('../controller/mlpa');
      
router.post('/saveScreenMlpa', mlpaController.saveScreenMlpa);
router.post('/mlpaData', mlpaController.mlpaDatas);
router.post('/mlpaList', mlpaController.mlpaContent);
module.exports = router;