// clinical
const express = require('express');
const router = express.Router();

// clinical => 보고서 내용을 저장하는 소스
const  clinicalController = require('../controller/clinical');
      
//병리 유전체 정보 보고서 입력
//clinically 소스내의   함수
router.post('/insert', clinicalController.clinicaldata);
router.post('/list', clinicalController.clinicalList);

module.exports = router;