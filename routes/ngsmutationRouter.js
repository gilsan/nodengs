const express = require('express');
const router = express.Router();

const mutationController = require('../controller/mutation');

 
// 검진자 필터링된 리스트
router.post('/list',   mutationController.listMutation);
router.post('/insert', mutationController.saveMutation);
router.post('/update', mutationController.updateMutation);
router.post('/delete', mutationController.deleteMutation);
// 
router.post('/searchbygene', mutationController.searchMutaionbygene);
router.post('/list',   mutationController.listMutation);

// sequencing
router.get('/seqlists', mutationController.seqlistMutation);
router.post('/seqcall', mutationController.seqcallMutation);
router.post('/seqinsert', mutationController.saveseqMutation);
router.post('/sequpdate', mutationController.updateseqMutation);
router.post('/seqdelete', mutationController.deleteseqMutation);

// 유전성 유전질환
router.get('/geneticlists', mutationController.geneticlistMutation);
router.post('/geneticcall2', mutationController.geneticcallMutation2);
router.post('/geneticcall1', mutationController.geneticcallMutation1);
router.post('/geneticinsert', mutationController.savegeneticMutation);
router.post('/geneticupdate', mutationController.updategeneticMutation);
router.post('/geneticdelete', mutationController.deletegeneticMutation);


//  essentialDNAMent
router.get('/esslists', mutationController.listEssential);
router.post('/essinsert', mutationController.insertEssential);
router.post('/essupdate', mutationController.updateEssential);
router.post('/essdelete', mutationController.deleteEssential);
router.get('/esstitleonly', mutationController.listEssentialTitle);

module.exports = router;