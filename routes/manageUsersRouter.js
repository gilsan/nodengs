const express = require('express');
const router = express.Router();

const usersController = require('../controller/manageUsersMapper');

// ����� ���� 
router.post('/list',   usersController.listUsers);
router.post('/insert', usersController.insertUsers);
router.post('/update', usersController.updateUsers);
router.post('/delete', usersController.deleteUsers); 

module.exports = router;