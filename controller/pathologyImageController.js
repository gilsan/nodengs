//================================================
//
//    병리 결과지, 보고서 조회 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  cntHandler_pathology_image = async (pathologynum) => { 
    await poolConnect; // ensures that the pool has been created
    
    logger.info('[17][Pathology_image]pathologyNum=' + pathologynum);
  
    const sql = "select count(1) as count  \
              from  Pathology_image \
              where pathology_id=@pathologynum ";
  
      logger.info('[25][Pathology_image]sql=' + sql);
              
      try {
          const request = pool.request()
              .input('pathologynum', mssql.VarChar, pathologynum); 
                  
          const result = await request.query(sql)
              
          const data = result.recordset[0];
          return data;      
          
      } catch (error) {
          logger.error('[55][Pathology_image]]err=' + error.message);
      }
  }
  
  const  messageHandler_pathology_image = async (pathologynum) => { 
      await poolConnect; // ensures that the pool has been created

      logger.info('[44][Pathology_image]pathologyNum=' + pathologynum);
            
        //select Query 생성
        const sql = "select pathology_id, filepath, seq \
              from  Pathology_image \
              where pathology_id=@pathologynum \
              order by seq ";
  
      logger.info('[54][Pathology_image]sel sql=' + sql);
              
      try {
          const request = pool.request()
              .input('pathologynum', mssql.VarChar, pathologynum) ; 
                  
          const result = await request.query(sql)
              
          return result.recordset;
      } catch (error) {
          logger.error('[65][Pathology_image]sel err=' + error.message);
      }
  }

  //병리 Pathology_image count 조회
  exports.checkpathologyImage = (req,res, next) => {
  
    logger.info('[109][search Pathology_image]data=' + JSON.stringify(req.body));
  
    let pathologynum = req.body.pathologynum;
    
    const resultC = cntHandler_pathology_image(pathologynum);
    resultC.then(data => {
  
      console.log('[Pathology_image][109]', data);
      if ( data.count > 0) {

           res.json({count:data.count});
      } else { 
           //console.log(json.stringfy());
           res.json({count:0});
      }
    })
    .catch( error  =>{ 
      logger.error('[130][search Pathology_image]err=' + error.message);
      res.sendStatus(500);
    });
  
  }
  
  //병리 Pathology_image 보고서 조회
  exports.searchpathologyImage = (req,res, next) => {
  
    logger.info('[109][search Pathology_image]data=' + JSON.stringify(req.body));
  
    let pathologynum = req.body.pathologynum;
    
    const resultC = cntHandler_pathology_image(pathologynum);
    resultC.then(data => {
  
      console.log('[Pathology_image][109]', data);
      if ( data.count > 0) {
  
           const result = messageHandler_pathology_image(pathologynum);
            result.then(data => {
  
           //console.log(json.stringfy());
           res.json(data);
          });
      } else { 
           //console.log(json.stringfy());
           res.json({message:"no data"});
      }
    })
    .catch( error  =>{ 
      logger.error('[130][search Pathology_image]err=' + error.message);
      res.sendStatus(500);
    });
  
  }