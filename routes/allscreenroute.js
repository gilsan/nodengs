const express = require('express');
const router = express.Router();

 const allScreenController = require('../controller/allscreenLists');

// 검진자 필터링된 리스스
router.post('/find',  allScreenController.patientLists);
router.post('/query',  allScreenController.screenLists);
router.post('/comments', allScreenController.commentLists);  // 코멘트 가져오기
router.post('/insert', allScreenController.insertScreen);
router.post('/finish', allScreenController.finishScreen);
module.exports = router;