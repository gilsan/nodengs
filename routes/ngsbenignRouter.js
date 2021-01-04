const express = require('express');
const router = express.Router();

 const benignController = require('../controller/geneInfolists');

// 검진자 필터링된 리스스
router.post('/list',   benignController.benignInfolists);
router.post('/insert', benignController.insertBenign);
module.exports = router;