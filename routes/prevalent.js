// prevalent
const express = require('express');
const router = express.Router();

// prevalent => 보고서 내용을 저장하는 소스
const  prevalentController = require('../controller/prevalent');
      
//병리   
//clinically 소스내의   함수
router.post('/insert', prevalentController.prevalentdata);
router.post('/insert2',prevalentController.prevalentdata2)
router.post('/list', prevalentController.prevalentList);

module.exports = router;