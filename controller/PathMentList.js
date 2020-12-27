// 

//================================================
//
//    병리 결과지, 보고서 조회 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const config = {
    user: 'ngs',
    password: 'ngs12#$',
    server: 'localhost',
    database: 'ngs_data',  
    pool: {
        max: 200,
        min: 100,
        idleTimeoutMillis: 30000
    },
    enableArithAbort: true,
    options: {
        encrypt:false
    }
}

const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

// 'yyyy-mm-dd' -> 'yyyyMMdd'
function getFormatDate2(date){

   var year = date.getFullYear();
   var month = (1 + date.getMonth());
   month = month >= 10 ? month : '0' + month;
   var day = date.getDate();
   day = day >= 10 ? day : '0' + day;
   var arr = new Array (year, month, day);
   const today = arr.join("");
  // console.log('[today]', today);
   return today;
}

const  cntHandler_path_ment = async (pathologyNum) => { 
    await poolConnect; // ensures that the pool has been created
    
    console.log("pathologyNum", pathologyNum);
  
    let reportGb  = "C"
  
    const sql = "select count(1) as count  \
              from  path_comment \
              where pathology_num=@pathologyNum ";
  
      console.log('[55][path_ment]', sql);
              
      try {
          const request = pool.request()
              .input('pathologyNum', mssql.VarChar, pathologyNum); 
                  
          const result = await request.query(sql)
              
          const data = result.recordset[0];
          return data;      
          
      } catch (err) {
          console.error('SQL error', err);
      }
  }
  
  const  messageHandler_path_ment = async (pathologyNum) => { 
      await poolConnect; // ensures that the pool has been created
            
        //select Query 생성
        const sql = "select pathology_num, notement, \
                generalReport, specialment  \
              from  path_comment \
              where pathology_num=@pathologyNum  ";
  
      console.log('[84][path_ment]', sql);
              
      try {
          const request = pool.request()
              .input('pathologyNum', mssql.VarChar, pathologyNum) ; 
                  
          const result = await request.query(sql)
              
          return result.recordset;
      } catch (err) {
          console.error('SQL error', err);
      }
  }
  
  //병리 Mutation c형 보고서 조회
  exports.selPathMentList = (req,res, next) => {
  
    console.log (req.body);
  
    let pathologyNum = req.body.pathologyNum;
    
    const resultC = cntHandler_path_ment(pathologyNum);
    resultC.then(data => {
  
      console.log('[path_ment][109]', data);
      if ( data.count > 0) {
  
           const result = messageHandler_path_ment(pathologyNum);
            result.then(data => {
  
           //console.log(json.stringfy());
           res.json(data);
          });
      } else { 
           //console.log(json.stringfy());
           res.json({message:"no data"});
      }
  })
    .catch( err  => res.sendStatus(500)); 
  
  }