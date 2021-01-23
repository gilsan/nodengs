// 검사자 필털이된 리스트 가져오기

const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (testedID) => {
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[15][getTSVLists]data=' + testedID);
 
  const sql ="select * from filtered_raw_tsv where testedID = '" + testedID + "'";
  logger.info('[19][getTSVLists]sql=' + sql);

  try {
      const request = pool.request(); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[15]getTSVLists err=' + error.message);
  }
}

// getTSVLists
exports.getTSVLists = (req,res, next) => {
    
  const testedID =  req.query.testedID;

  const result = messageHandler(testedID);
  result.then(data => {

    console.log('[40][getTSVLists][response]',data);
    res.json(data);
  })
  .catch( error  => {
    logger.error('[44]getTSVLists err=' + error.message);
    res.sendStatus(500);
  });
}
