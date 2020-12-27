const express = require('express');
const router = express.Router();

 const artifactController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/list', artifactController.getArtifactInfoLists);
router.post('/insert', artifactController.insertArtifacts);
module.exports = router;