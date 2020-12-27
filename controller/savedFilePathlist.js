// 검체번호와 화일명으로 화일저장 경로 가져오기

const express = require('express');
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

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  
  const gene     = req.body.gene;
  const filename =  req.body.filename;
  const testedID = req.body.testedID;
   
   const sql ="select path   "
   sql = sql + " where gene=@gene   "
   sql = sql + " and filename=@filename   "
   sql = sql + " and testedID =@testedID   "
   sql = sql + " order by id limit 1";
       
  try {
      const request = pool.request()
        .input('gene', sql.VarChar, gene)
        .input('filename', sql.VarChar, filename)
        .input('testedID', sql.VarChar, testedID); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

 exports.getsavedFilePathList = (req,res, next) => {
    const result = messageHandler(req);
    result.then(data => {
  
       console.log(json.stringfy());
       res.json(data);
    })
    .catch( err  => res.sendStatus(500)); 
 }