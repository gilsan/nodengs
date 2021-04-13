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
router.post('/finish', screenController.finishScreen);
module.exports = router;