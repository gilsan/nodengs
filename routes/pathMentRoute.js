const express = require('express');
const router = express.Router();

//PathMentList => 보고서 내용을 저장하는 소스
const PathMentListController = require('../controller/PathMentList');
      
//병리 Pathology Ment 보고서 입력
//PathMentList 소스내의 PathMentList() 함수
router.post('/list', PathMentListController.selPathMentList);              

module.exports = router;