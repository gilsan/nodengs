const express = require('express');
const router = express.Router();

 const sequencingController = require('../controller/sequencingdiag');

// 병리 sequencing
router.post('/list',  sequencingController.listsequencing);
router.post('/insert', sequencingController.insertsequencing);

// 유전자 이동내역
router.post('/listMoveHistory',    sequencingController.listMoveHistory);
router.post('/insertMoveHistory',  sequencingController.insertMoveHistory);
router.post('/updateMoveHistory',  sequencingController.updateMoveHistory);
router.post('/deleteMoveHistory',  sequencingController.deleteMoveHistory);

module.exports = router;