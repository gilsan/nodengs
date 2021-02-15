
// 병리 emr 전송
const app = require('express');
const querystring = require('querystring');
const router = app.Router();
const axios = require('axios');
const logger = require('../common/winston');

// 교육
//let url = 'http://emr012edu.cmcnu.or.kr/cmcnu/.live';
//운영
let url = 'http://emr012.cmcnu.or.kr/cmcnu/.live';
 
router.post('/redirectEMR', (req, res, next) => {  
   console.log('[웹에서 받은 데이타]', req.body);
   logger.info ('[웹에서 받은 데이타]url=' + url);
   //logger.info ('[웹에서 받은 데이타]data=' + req.body);
   axios({
       method: 'post',
       url,
       data: querystring.stringify(req.body) 
   })
   .then(function(response) {
      res.json(response.data)
      console.log('[ response from EMR ] \n  ', response.data);     
   });
   
});

module.exports = router;