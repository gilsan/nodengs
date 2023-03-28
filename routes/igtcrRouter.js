const express = require('express');
const router = express.Router();

 const igtcrontroller = require('../controller/igtcr');

// 검진정보가 있는지 확인
router.post('/list', igtcrontroller.igtcrList);
router.post('/save', igtcrontroller.saveScreenigtcr);
router.post('/report', igtcrontroller.reportigtcr);
router.post('/report2', igtcrontroller.reportigtcr2);

module.exports = router;