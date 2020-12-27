const express = require('express');

const router = express.Router();

const sql = require('mssql');
const config = {
    user: 'saint',
    password: 'saint13%&',
    server: 'localhost',
    database: 'sainthospital',  
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


const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

const  messageHandler = async () => {
  await poolConnect; // ensures that the pool has been created
  try {
      const request = pool.request(); // or: new sql.Request(pool1)
      const result = await request.query('select count(*) as cnt from mutation')
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}



exports.lists = (req, res, next) => {
    const result = messageHandler();
     result.then(data => {
        res.json(data.recordset[0].cnt);
   })
   .catch( err  => res.sendStatus(500));
  
}