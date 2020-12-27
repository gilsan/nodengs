const express = require('express');
const router = express.Router();

 const accessdb = require('../inputdb');

// 검진자 리스트
router.get('', accessdb.lists);

module.exports = router;