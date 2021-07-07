const express = require('express');
const router = express.Router();

//PathologyReportInsert => 보고서 내용을 저장하는 소스
const statecontrolController = require('../controller/statecontrol');
      
//병리 statecontrol 보고서 입력
router.post('/list', statecontrolController.statecontrolList);

module.exports = router;