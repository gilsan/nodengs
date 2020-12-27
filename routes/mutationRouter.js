const express = require('express');
const router = express.Router();

 const mutationController = require('../controller/mutation');

// 검진자 필터링된 리스스
router.post('/insert', mutationController.saveMutation);
router.post('/update', mutationController.updateMutation);
router.post('/delete', mutationController.deleteMutation);
// 

module.exports = router;