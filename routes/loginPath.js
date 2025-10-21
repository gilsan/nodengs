const express = require('express');
const router = express.Router();

 const loginController = require('../controller/loginuser');

// 검진자 리스트
router.post('/loginpath', loginController.loginPath);
router.post('/listPath', loginController.listPath);
router.post('/listPathUpdate', loginController.listPathUpdate);

// 25.09.12 암호 변경
router.post('/pwChange', loginController.pwChange);

module.exports = router;