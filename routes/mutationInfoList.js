const express = require('express');
const router = express.Router();

 const mutationInfoController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/list', mutationInfoController.getMutationInfoLists);

// 

module.exports = router;