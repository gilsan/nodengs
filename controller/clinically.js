
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
/*
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
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  clinicallyInsertHandler = async (pathologyNum, clinically) => {
    await poolConnect; // ensures that the pool has been created
    let result2;
    logger.info('[27][clinically]pathologyNum=' + pathologyNum);
    const query = "delete from clinically where  pathologyNum = @pathologyNum ";
    logger.info('[27][clinically]query=' + query);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (err) {
        logger.error('==== SQL error ======='+ err);
      }
 
    const len = clinically.length;

    if (len > 0) {
        
        clinically.forEach( async (item) => {
            const clinically = item;
            logger.info('[51][clinically]data=' +  pathologyNum + "," + clinically);
            const qry = "insert into clinically (pathologyNum, clinically) values(@pathologyNum, @clinically)"; 
            logger.info('[27][clinically]query=' + qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('clinically', mssql.VarChar, clinically);
    
                result2 = await request.query(qry);
    
            } catch (err) {
                logger.error('SQL error'+ err);
            }            
        })
     
        return result2;
    }

}
 
exports.clinicallydata = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const clinically = req.body.clinically;
    logger.info('[67][clinicallydata]data=' + clinically);

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
    const qry = "select clinically, seq  from clinically   where pathologyNum = @pathologyNum ";
    logger.info("[95][clinicallySelectHandler]sql=" + qry );
    logger.info("[95][clinicallySelectHandler] pathologyNum" + pathologyNum);
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (err) {
        logger.error('[clinicallySelectHandler]error=' + err);
    }
  }

  exports.clinicallyList = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;
    const result = clinicallySelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[437]clinicallyList]data=' + data);
          res.json(data);
         // res.send(data.map(item => item.clinically));
     })
     .catch( err  => res.sendStatus(500));; 

 };

 /////////////////////////////////////////////////////////////////
 // clinicallydata2 { gene: string , seq: string} 형식
 const  clinicallyInsertHandler2 = async (pathologyNum, clinically) => {
    await poolConnect; // ensures that the pool has been created
    let result2;
    logger.info('[122][clinically2]pathologyNum=' + pathologyNum);
    const query = "delete from clinically where  pathologyNum = @pathologyNum ";
    logger.info('[124][clinically2]query=' + query);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (err) {
        logger.error('==== SQL error ======='+ err);
      }
 
    const len = clinically.length;

    if (len > 0) {
        
        clinically.forEach( async (item) => {
            const clinically = item.gene;
            const seq        = item.seq;
            logger.info('[143][clinically2]data=' +  pathologyNum + "," + clinically);
            const qry = "insert into clinically (pathologyNum, clinically, seq) values(@pathologyNum, @clinically, @seq)"; 
            logger.info('[145][clinically2]query=' + qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input ('seq', mssql.VarChar, seq)
                .input('clinically', mssql.VarChar, clinically);
    
                result2 = await request.query(qry);
    
            } catch (err) {
                logger.error('SQL error'+ err);
            }            
        })
     
        return result2;
    }

}

 exports.clinicallydata2 = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const clinically = req.body.clinically;

    logger.info('[169][clinicallydata2] data=' + clinically);

    const result = clinicallyInsertHandler2(pathologyNum, clinically);
    result.then(data => {
   
        console.log('[174][clinicallydata2 ]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( err  => res.sendStatus(500));

 };