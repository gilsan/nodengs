const express = require('express');
const router = express.Router();

 const limsController = require('../controller/lims');

// 검진자 리스트
router.post('/lists', limsController.limsList);
router.post('/limslists', limsController.limsList2);
router.post('/limscombo', limsController.limsList3);
router.post('/save', limsController.limsSave);
router.post('/tumorTypeSave', limsController.limsTumorSave);
router.post('/tmorCellSave', limsController.limsCellPerSave);
router.post('/keyBlockSave', limsController.limsKeyblockSave);
router.post('/organSave', limsController.limsOrganSave);
router.post('/dnaCtSave', limsController.limsDnactSave);
router.post('/rnaCtSave', limsController.limsRnactSave);

module.exports = router;