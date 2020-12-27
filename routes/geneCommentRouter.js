const express = require('express');
const router = express.Router();

 const geneCommentController = require('../controller/geneCommentlist');

// 검진자 리스트
router.post('/list', geneCommentController.getCommentLists);

module.exports = router;