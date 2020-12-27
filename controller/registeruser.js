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

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  const user     = req.body.user;
  const password = req.body.password;

  const uuid = uuidv4();

 // console.log('uuid:', uuid);

  const sql = "insert into users (user_id, pwd, uuid)   "
  sql = sql + " values(@user, @password, @uuid)";
       
  try {
      const request = pool.request()
        .input('user', mssql.VarChar, user)
        .input('password', mssql.VarChar, password)
        .input('uuid', mssql.VarChar, uuid); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

exports.register = (req,res, next) => {
  const result = messageHandler(req);
  result.then(data => {

     console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}
