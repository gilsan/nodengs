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

const  prevalentInsertHandler = async (pathologyNum, prevalent) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    console.log('[29][prevalentdata]', pathologyNum, prevalent);

    let sql = "delete from prevalent where  pathologyNum = @pathologyNum ";
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = await request.query(sql)       
        //return result;
      } catch (err) {
        console.error('SQL error', err);
    } 
    
    const len = prevalent.length;


    if ( len > 0 ) {
       prevalent.forEach( async(item) => {
        const prevalent = item;
        const qry = "insert into prevalent (pathologyNum, prevalent) values(@pathologyNum, @prevalent)"; 

        try {
            const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('prevalent', mssql.VarChar, prevalent);
            result = await request.query(qry);
        } catch (err) {
            console.error('SQL error', err);
        }
       });

    }
 

    return result;
}

exports.prevalentdata = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const prevalent = req.body.prevalent;

    const result = prevalentInsertHandler(pathologyNum, prevalent);
    result.then(data => {
   
        console.log('[72][prevalentdata]', data);
          res.json({message:'SUCCESS'});
     })
     .catch( err  => res.sendStatus(500));

 };


 const  prevalentSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    	//insert Query 생성
    const qry = "select prevalent  from prevalent   where pathologyNum = @pathologyNum ";
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (err) {
            console.error('SQL error', err);
        }
  }

  exports.prevalentList = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;
    const result = prevalentSelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[100][prevalentList]', data);
          res.send(data.map(item => item.prevalent));
     })
     .catch( err  => res.sendStatus(500));; 

 };