// 

//================================================
//
//    병리 결과지, 보고서 조회 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
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
    
    logger.info("[54][cnt_path_ment]pathologyNum=", pathologyNum);
  
    const sql = "select count(1) as count  \
              from  path_comment \
              where pathology_num=@pathologyNum ";
  
    logger.info('[60][cnt_path_ment]sql=' + sql);
              
    try {
          const request = pool.request()
              .input('pathologyNum', mssql.VarChar, pathologyNum); 
                  
          const result = await request.query(sql)
              
          const data = result.recordset[0];
          return data;      
          
    } catch (error) {
        logger.error('[72][cnt_path_ment]err=' + error.message);
    }
  }
  
  const  messageHandler_path_ment = async (pathologyNum) => { 
      await poolConnect; // ensures that the pool has been created
            
      logger.info('[79][sel_path_ment]pathologyNum=' + pathologyNum);
      
      //select Query 생성
      const sql = "select pathology_num, notement, \
                generalReport, specialment  \
              from  path_comment \
              where pathology_num=@pathologyNum  ";
  
      logger.info('[87][sel_path_ment]sql=' + sql);
              
      try {
          const request = pool.request()
              .input('pathologyNum', mssql.VarChar, pathologyNum) ; 
                  
          const result = await request.query(sql)
              
          return result.recordset;
      } catch (error) {
        logger.error('[97][sel_path_ment]err=' + error.message);
      }
  }
  
  //병리 Mutation c형 보고서 조회
  exports.selPathMentList = (req,res, next) => {
  
    logger.info('[104][sel_path_ment]data=' + JSON.stringify( req.body));
  
    let pathologyNum = req.body.pathologyNum;
    
    const resultC = cntHandler_path_ment(pathologyNum);
    resultC.then(data => {
  
      console.log('[path_ment][109]', data);
      if ( data.count > 0) {
  
           const result = messageHandler_path_ment(pathologyNum);
            result.then(data => {
  
           //console.log(json.stringfy());
           res.json(data);
          })
          .catch( error  => {
            logger.error('[102][sel_path_ment]err=' + error.message);
            res.sendStatus(500)}); 
      } else { 
           //console.log(json.stringfy());
           res.json({message:"no data"});
      }
  })
  .catch( error => {
    logger.error('[110][cnt_path_ment]err=' + error.message);
    res.sendStatus(500);
  }); 
  
  }