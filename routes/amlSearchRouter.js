const express = require('express');
const router = express.Router();

//amlReportList => 보고서 내용을 조회하는 소스
const amlSearchController = require('../controller/amlReportList');      

//amlReportList 소스내의 searchReportDetected() 함수 => report_detected_variants 조회
router.post('/detected', amlSearchController.searchReportDetected);        

//amlReportList 소스내의 searchReportComments() 함수 => report_comments 조회
router.post('/comments', amlSearchController.searchReportComments);              

module.exports = router;