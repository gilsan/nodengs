const express = require('express');
const router = express.Router();

 const loginController = require('../controller/loginuser');

// 검진자 리스트
router.post('/loginuser', loginController.loginDiag);
router.post('/listDiag',  loginController.listDiag);
module.exports = router;