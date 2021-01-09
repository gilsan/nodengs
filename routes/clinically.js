// clinically
const express = require('express');
const router = express.Router();

//clinically => 보고서 내용을 저장하는 소스
const  clinicallyController = require('../controller/clinically');
      
//병리 filteredOriginData 보고서 입력
//clinically 소스내의   함수
router.post('/insert', clinicallyController.clinicallydata );
router.post('/insert2', clinicallyController.clinicallydata2 );
router.post('/list', clinicallyController.clinicallyList);
 

module.exports = router;