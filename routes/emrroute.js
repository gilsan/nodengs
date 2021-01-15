const app = require('express');
const querystring = require('querystring');
const router = app.Router();
const axios = require('axios');
 
let url = 'http://emr012edu.cmcnu.or.kr/cmcnu/.live';
 
router.post('/redirectEMR', (req, res, next) => {  
   console.log(req.query.data);
   // const data = req.params.data;
   //  const submit_id   = req.params.submit_id;
   //  const business_id = req.params.business_id;
   //  const instcd      = req.params.instcd;
   //  const spcno       = req.params.spcno;
   //  const formcd      = req.params.formcd;
   //  const rsltflag    = req.params.rsltflag;
   //  const pid         = req.params.pid;
   //  const examcd      = req.params.examcd;
   //  const examflag    = req.params.eamflag;
   //  const infflag     = req.params.infflag;
   //  const userid      = req.params.userid;
   //  const rsltdesc    = req.params.rsltdesc;
    
   //  url =  `http://emr012edu.cmcnu.or.kr/cmcnu/.live?submit_id=${submit_id}?business_id=${business_id}?instcd=${instcd}?
   //  spcno=${spcno}&formcd=${formcd}?rsltflag=${rsltflag}?pid=${pid}?examcd=${examcd}?examflag=${examflag}?
   //  infflag=${infflag}&userid=${userid}&rsltdesc=${rsltdesc}`;
   
    // const url = url+data;
   // const url = req.query.data;
   // urlData = escape(url)
    console.log('[웹에서 받은 데이타]', req.body);
    res.json({msg:'SUCCESS'});
   // axios({
   //     method: 'post',
   //     url ,
   //     data: querystring.stringify(req.body) 
   // })
   // .then(function(response) {
   //    res.json(response.data)
   //    console.log('[ response from EMR ] \n  ', response);      
   // });
   
});

module.exports = router;