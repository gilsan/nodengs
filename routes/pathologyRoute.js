
// 병리 emr 전송
const app = require('express');
const querystring = require('querystring');
const router = app.Router();
const axios = require('axios');
const logger = require('../common/winston');
const configEnv = require('../common/config.js');

// 교육
let url = configEnv.emr_path; //'http://emr012edu.cmcnu.or.kr/cmcnu/.live
//운영
//let url = 'http://emr012.cmcnu.or.kr/cmcnu/.live';
 
router.post('/redirectEMR', (req, res, next) => {  
   console.log('[웹에서 받은 데이타]', req.body);
   logger.info ('[웹에서 받은 데이타]url=' + url);
   logger.info ('[웹에서 받은 데이타]data=' + JSON.stringify (req.body));
   axios({
       method: 'post',
       timeout: 3000,
       url,
       data: querystring.stringify(req.body) 
   })
   .then(function(response) {
      res.json(response.data)
      console.log('[ response from EMR ] \n  ', response.data);     
   })
   .catch((err) => {
     // 여기서 axios 에러, xml 파싱 에러 다 잡음
     logger.error('getList error:', err.message);
     res.status(200).json({});
   });
   
});

module.exports = router;