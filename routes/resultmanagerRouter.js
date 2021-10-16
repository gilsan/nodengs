const express = require('express');
const router = express.Router();

 const resultController = require('../controller/resultmanager');

// 저장된 화일의 경로 가져오기 
router.post('/list', resultController.list);
router.post('/update', resultController.update);
router.get('/lists', resultController.lists);
module.exports = router;