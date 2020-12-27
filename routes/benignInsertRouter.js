const express = require('express');
const router = express.Router();

 const artifactInsertController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/insert', artifactInsertController.insertBenign);

module.exports = router;