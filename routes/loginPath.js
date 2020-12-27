const express = require('express');
const router = express.Router();

 const loginController = require('../controller/loginuser');

// 검진자 리스트
router.post('/loginpath', loginController.loginPath);
router.post('/listPath', loginController.listPath);
router.post('/listPathUpdate', loginController.listPathUpdate);

module.exports = router;