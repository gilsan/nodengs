// tumortype
const express = require('express');
const router = express.Router();

//tumortype => 보고서 내용을 저장하는 소스
const  tumortypeController = require('../controller/tumortype');
      
//병리 filteredOriginData 보고서 입력
//tumorcellpercentageController 소스내의 tumorcellpercentagedata() 함수
router.post('/insert', tumortypeController.tumortypedata);
router.post('/list', tumortypeController.tumortypeList);

module.exports = router;