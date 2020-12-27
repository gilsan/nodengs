const express = require('express');
const router = express.Router();

//filteredOriginData => 보고서 내용을 저장하는 소스
const  filteredOriginDataController = require('../controller/filteredOriginData');
      
//병리 filteredOriginData 보고서 입력
//filteredOriginDataController 소스내의 filteredOriginData() 함수
router.post('/insert', filteredOriginDataController.filteredOrigindata);
router.post('/list', filteredOriginDataController.filteredOriginList);

module.exports = router;