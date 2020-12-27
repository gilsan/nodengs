// tumorMutationalBurden
const express = require('express');
const router = express.Router();

//tumorMutationalBurden => 보고서 내용을 저장하는 소스
const  tumorMutationalBurdenController = require('../controller/tumorMutationalBurden');
      
//병리 filteredOriginData 보고서 입력
//tumorcellpercentageController 소스내의 tumorcellpercentagedata() 함수
router.post('/insert', tumorMutationalBurdenController.tumorMutationalBurdendata);
router.post('/list', tumorMutationalBurdenController.tumorMutationalBurdenList);

module.exports = router;