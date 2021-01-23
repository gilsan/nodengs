// 검체번호와 화일명으로 화일저장 경로 가져오기

const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  const gene     = req.body.gene;
  const filename =  req.body.filename;
  const testedID = req.body.testedID;
  
  logger.info('[38][save_file_path]gene=' + gene);
  logger.info('[38][save_file_path]filename=' + filename);
  logger.info('[38][save_file_path]testedID=' + testedID);
   
   const sql ="select top 1 path   "
   sql = sql + " where gene=@gene   "
   sql = sql + " and filename=@filename   "
   sql = sql + " and testedID =@testedID   "
   sql = sql + " order by id";

   logger.info('[48][save_file_path]sql=' + sql);
       
  try {
      const request = pool.request()
        .input('gene', sql.VarChar, gene)
        .input('filename', sql.VarChar, filename)
        .input('testedID', sql.VarChar, testedID); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[60][save-file_path]err=' + error.message);
  }
}

 exports.getsavedFilePathList = (req,res, next) => {

    logger.info('[66][get_save_file_path]data=' + JSON.stringify( req.body));

    const result = messageHandler(req);
    result.then(data => {
  
       console.log(json.stringfy());
       res.json(data);
    })
    .catch( error  => {
        logger.error('[75][get_save_file_path]err=' + error.message);
        res.sendStatus(500);
    }); 
 }