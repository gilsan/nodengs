const express = require('express');
const router = express.Router();

//msiscore => 보고서 내용을 저장하는 소스
const  msiscoreController = require('../controller/msiscore');
      
//병리 msiscore 보고서 입력
//msiscore 소스내의 msiscore() 함수
router.post('/insert', msiscoreController.msiscoreData);
router.post('/list', msiscoreController.msiscoreList);

module.exports = router;