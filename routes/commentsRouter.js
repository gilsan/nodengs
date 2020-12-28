const express = require('express');
const router = express.Router();

 const commentsController = require('../controller/commentsMapper');

//   
// ������ ���͸��� ������
router.post('/list',   commentsController.listComments);
router.post('/insert', commentsController.insertComments);
router.post('/update', commentsController.updateComments);
router.post('/delete', commentsController.deleteComments);

module.exports = router;