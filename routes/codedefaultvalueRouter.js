//  
const express = require('express');
const router = express.Router();

 
const  codeController = require('../controller/codedefaultvalue');
      
router.post('/lists', codeController.getLists);
router.post('/list',  codeController.getList);
router.post('/insert', codeController.itemInsert );
router.post('/update', codeController.itemUpdate );
router.post('/delete', codeController.itemDelete);

router.get('/codelists', codeController.getcodeLists);
router.get('/codelist', codeController.getcodeList);
router.post('/codeinsert', codeController.codeitemInsert);
router.post('/codeupdate', codeController.codeitemUpdate );
router.post('/codedelete', codeController.codeitemDelete);
module.exports = router;