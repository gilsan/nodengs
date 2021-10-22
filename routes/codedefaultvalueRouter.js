//  
const express = require('express');
const router = express.Router();

 
const  codeController = require('../controller/codedefaultvalue');
      
router.post('/lists', codeController.getLists);
router.post('/insert', codeController.itemInsert );
router.post('/update', codeController.itemUpdate );
router.post('/delete', codeController.itemDelete);
 

module.exports = router;