// polymorphism
 
 let express = require('express');
 const router = express.Router();
const  polymorphism = require('../controller/polymorphism');
      
//병리   
//polymorphism 소스내의   함수
router.get('/list', polymorphism.select);
// router.post('/update', polymorphism.update);

// 검진자 필터링된 리스스
router.post('/search', polymorphism.listBlackList);
router.post('/insert', polymorphism.insertBlackList);
router.post('/update', polymorphism.updateBlackList);
router.post('/delete', polymorphism.deleteBlackList);

module.exports = router;


