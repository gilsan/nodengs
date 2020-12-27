const express = require('express');
const router = express.Router();

 const geneInfoController = require('../controller/geneInfolists');

// 검진정보가 있는지 확인
router.post('/list', geneInfoController.getGeneExist);

// 

module.exports = router;