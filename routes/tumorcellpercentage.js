// tumorcellpercentage
const express = require('express');
const router = express.Router();

//tumorcellpercentage => 보고서 내용을 저장하는 소스
const  tumorcellpercentageController = require('../controller/tumorcellpercentage');
      
//병리 filteredOriginData 보고서 입력 
//tumorcellpercentageController 소스내의 tumorcellpercentagedata() 함수
router.post('/insert', tumorcellpercentageController.tumorcellpercentagedata);
router.post('/list', tumorcellpercentageController.tumorcellpercentageList);

module.exports = router;