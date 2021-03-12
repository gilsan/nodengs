const express = require('express');
const router = express.Router();

const mutationController = require('../controller/mutation');

// 검진자 필터링된 리스스
router.post('/list',   mutationController.listMutation);
router.post('/insert', mutationController.saveMutation);
router.post('/update', mutationController.updateMutation);
router.post('/delete', mutationController.deleteMutation);
// 
router.post('/searchbygene', mutationController.searchMutaionbygene);
router.post('/list',   mutationController.listMutation);

module.exports = router;