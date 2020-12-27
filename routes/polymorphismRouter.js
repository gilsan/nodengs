// polymorphism
 
 let express = require('express');
 const router = express.Router();
const  polymorphism = require('../controller/polymorphism');
      
//병리   
//polymorphism 소스내의   함수
router.get('/list', polymorphism.select);
// router.post('/update', polymorphism.update);

module.exports = router;


