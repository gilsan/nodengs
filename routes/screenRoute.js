const express = require('express');
const router = express.Router();

 const screenController = require('../controller/screenLists');

// 검진자 필터링된 리스스
router.post('/find',  screenController.patientLists);
router.post('/query',  screenController.screenLists);
router.post('/comments', screenController.commentLists);  // 코멘트 가져오기
router.post('/insert', screenController.insertScreen);
router.post('/tempsave', screenController.saveScreen);
router.post('/tempsave2', screenController.saveScreen2);
router.post('/findRefId', screenController.findRefId);

router.post('/tempsave6', screenController.saveScreen6); // 선천성 면역결핍증 임시저장
router.post('/query6',  screenController.screenLists6);
router.post('/listScreen6', screenController.listImmundefi); // 선천성 면역결핍증 내역

router.post('/tempsave7', screenController.saveScreen7); // sequential 임시저장
router.post('/listScreen7', screenController.listSequntial); // sequential 내역
router.post('/listPatientSequential', screenController.listPatientSequntial); // sequential patient 내역

router.post('/tempsave_mlpa', screenController.saveScreenMlpa); // MLPA 임시저장
router.post('/listMlpa', screenController.listMlpa); // MLPA 내역
router.post('/listReportMLPA', screenController.listReportMlpa); // MLPA report 내역

router.post('/finish', screenController.finishScreen);

module.exports = router;