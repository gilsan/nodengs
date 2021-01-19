const express = require('express');
const router = express.Router();

//PathologyReportList => 보고서 내용을 조회하는 소스
const pathologyImageController = require('../controller/pathologyImageController');      

//pathologyImageController 소스내의 pathologyImageController() 함수 => pathology Image 조회
router.post('/lists', pathologyImageController.searchpathologyImage);  

module.exports = router;