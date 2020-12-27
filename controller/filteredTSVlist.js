// 검사자 필털이된 리스트 가져오기

const { json } = require('body-parser');
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

const  messageHandler = async (testedID) => {
  await poolConnect; // ensures that the pool has been created
  
  //const testedID =  req.query.testedID;
 
  const sql ="select * from filtered_raw_tsv where testedID = '" + testedID + "'";
  // console.log('[32][getTSVLists]', sql);
  try {
      const request = pool.request(); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
  }
}

 exports.getTSVLists = (req,res, next) => {
    
    const testedID =  req.query.testedID;
 
     const result = messageHandler(testedID);
     result.then(data => {

       // console.log('[52][getTSVLists]',data);
        res.json(data);
   })
   .catch( err  => res.sendStatus(500));
 }
