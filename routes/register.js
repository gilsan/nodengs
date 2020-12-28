const express = require('express');
const router = express.Router();

const registerController = require('../controller/registeruser');


// 검진자 리스트
router.post('/registeruser', registerController.register);


module.exports = router;