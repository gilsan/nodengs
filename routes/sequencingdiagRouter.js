const express = require('express');
const router = express.Router();

 const sequencingController = require('../controller/sequencingdiag');

// 병리 sequencing
 
router.post('/insert', sequencingController.insertsequencing);
 
module.exports = router;