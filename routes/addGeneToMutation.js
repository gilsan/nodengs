const express = require('express');
const router = express.Router();

 const geneInfoController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/addGene', geneInfoController.addGeneToMutation);

// 

module.exports = router;