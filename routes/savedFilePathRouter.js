const express = require('express');
const router = express.Router();

 const savedFilePathController = require('../controller/savedFilePathlist');

// 저장된 화일의 경로 가져오기 
router.post('/list', savedFilePathController.getsavedFilePathList);

module.exports = router;