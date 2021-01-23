// 유전체정보로 코멘트 정보 가져오기

const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  commentMessageHandler = async (gene, type) => {
  await poolConnect; // ensures that the pool has been created

  logger.info("[15][getCommentLists]gene=" + gene );
  logger.info("[15][getCommentLists]type=" + type );
  
  const sql ="select * from comments where gene = '" + gene + "' and type = '" + type + "'";

  logger.info("[20][getCommentLists]sql=" + sql );

  try {
      const request = pool.request(); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (err) {
      logger.error('[30][getCommentLists]error=' + err);
  }
}

exports.getCommentLists = (req,res, next) => {

    const gene =  req.body.gene;
	 
    const result = commentMessageHandler(gene);
    result.then(data => {

     //  console.log(json.stringfy());
       res.json(data);
  })
  .catch( error => {
    logger.error('[45][getCommentLists]err=' + error.message);
      res.sendStatus(500)
  });
}