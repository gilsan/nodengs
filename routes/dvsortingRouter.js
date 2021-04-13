const express = require('express');
const router = express.Router();

const dvsortingController = require('../controller/dvsorting');

// 검진자 필터링된 리스스
router.post('/beforsorting', dvsortingController.dvbeforsorting);
router.post('/aftersorting', dvsortingController.dvaftersorting);

module.exports = router;