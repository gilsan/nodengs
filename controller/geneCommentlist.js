// 유전체정보로 코멘트 정보 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

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

const  commentMessageHandler = async (gene, type) => {
  await poolConnect; // ensures that the pool has been created

  logger.info("[30][getCommentLists]gene=" + gene );
  logger.info("[30][getCommentLists]type=" + type );
  
  const sql ="select * from comments where gene = '" + gene + "' and type = '" + type + "'";

  logger.info("[30][getCommentLists]sql=" + sql );

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
	const type =  req.body.type;
	 
    const result = commentMessageHandler(gene);
    result.then(data => {

     //  console.log(json.stringfy());
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));
 }