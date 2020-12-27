
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

const  clinicallyInsertHandler = async (pathologyNum, clinically) => {
    await poolConnect; // ensures that the pool has been created
    let result2;
    const query = "delete from clinically where  pathologyNum = @pathologyNum ";
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (err) {
        console.error('==== SQL error =======', err);
      }
 
    const len = clinically.length;

    if (len >  0) {
        
        clinically.forEach( async (item) => {
            const clinically = item;
            const qry = "insert into clinically (pathologyNum, clinically) values(@pathologyNum, @clinically)"; 
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('clinically', mssql.VarChar, clinically);
    
                result2 = await request.query(qry);
    
            } catch (err) {
                console.error('SQL error', err);
            }            
        })
     
        return result2;
    }

}

exports.clinicallydata = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const clinically = req.body.clinically;
    console.log('[67][clinicallydata]', clinically);

    const result = clinicallyInsertHandler(pathologyNum, clinically);
    result.then(data => {
   
        console.log('[72][clinicallydata]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( err  => res.sendStatus(500));

 };


 const  clinicallySelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    	//insert Query 생성
    const qry = "select clinically  from clinically   where pathologyNum = @pathologyNum ";
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (err) {
            console.error('SQL error', err);
        }
  }

  exports.clinicallyList = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;
    const result = clinicallySelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[437][benignInfoCount]', data);
          res.send(data.map(item => item.clinically));
     })
     .catch( err  => res.sendStatus(500));; 

 };