const express = require('express');
const router = express.Router();

//PathologyReportList => 보고서 내용을 조회하는 소스
const PathologySearchController = require('../controller/PathologyReportList');      

//PathologyReportList 소스내의 searchReportMutation_c() 함수 => report_mutation (C 유형) 조회
router.post('/mutationC', PathologySearchController.searchReportMutationC);        

//PathologyReportList 소스내의 searchReportAmplification_c() 함수 => report_amplification (c) 조회
router.post('/amplificationC', PathologySearchController.searchReportAmplificationC);        

//PathologyReportList 소스내의 searchReportFusion_c() 함수 => report_fusion (c) 조회
router.post('/fusionC', PathologySearchController.searchReportFusionC);        

//PathologyReportList 소스내의 searchReportMutation_p() 함수 => report_mutation (p 유형) 조회
router.post('/mutationP', PathologySearchController.searchReportMutationP);        

//PathologyReportList 소스내의 searchReportAmplification() 함수 => report_amplification (p) 조회
router.post('/amplificationP', PathologySearchController.searchReportAmplificationP);

//PathologyReportList 소스내의 searchReportFusion_p() 함수 => report_fusion (p) 조회
router.post('/fusionP', PathologySearchController.searchReportFusionP);        


module.exports = router;