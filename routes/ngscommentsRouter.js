const express = require('express');
const router = express.Router();

 const geneInfoController = require('../controller/geneInfolists');

//  
router.post('/list', geneInfoController.getCommentInfoLists);
router.post('/count', geneInfoController.getCommentCounts);
router.post('/insert', geneInfoController.getCommentInsert);

module.exports = router;