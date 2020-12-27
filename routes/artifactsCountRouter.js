const express = require('express');
const router = express.Router();

 const artifactController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/count', artifactController.getArtifactsInfoCount);

module.exports = router;