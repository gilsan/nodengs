// mentlists
const express = require('express');
const router = express.Router();

//mentlists => 보고서 내용을 저장하는 소스
const  mentlistsController = require('../controller/mentlists');
      
//mentlists 입력/수정/삭제/조회
//mentlistsController 소스내의 mentlistsinsert() 함수
router.post('/insert', mentlistsController.mentlistsInsert);
router.post('/update', mentlistsController.mentlistsUpdate);
router.post('/delete', mentlistsController.mentlistsDelete);
//mentlistsController 소스내의 mentlistsList() 함수
router.post('/list', mentlistsController.mentlistsList);

module.exports = router;