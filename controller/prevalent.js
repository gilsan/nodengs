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

const  prevalentInsertHandler = async (pathologyNum, prevalent) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    logger.info('[28][prevalentdata insert]pathologyNum=' + pathologyNum);
    logger.info('[29][prevalentdata insert]prevalent=' + prevalent);

    let sql = "delete from prevalent where  pathologyNum = @pathologyNum ";
    logger.info("[32][prevalentdata insert]sql=" + sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = await request.query(sql)       
        //return result;
      } catch (error) {
        logger.error('[41][prevalentdata delete]error=' + error.message);
    } 
    
    const len = prevalent.length;

    if ( len > 0 ) {
       prevalent.forEach( async(item) => {
        const prevalent = item;
        const qry = "insert into prevalent (pathologyNum, prevalent) values(@pathologyNum, @prevalent)"; 
        logger.info('[41][prevalentdata insert]qry=' + qry);

        try {
            const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('prevalent', mssql.VarChar, prevalent);
            result = await request.query(qry);
        } catch (error) {
            logger.error('[58][prevalentdata insert]error=' + error.message);
        }
       });
    }
 
    return result;
}

exports.prevalentdata = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const prevalent = req.body.prevalent;

    logger.info('[71][prevalentdata ]pathologyNum=' + pathologyNum);
    logger.info('[71][prevalentdata ]prevalent=' + prevalent);

    const result = prevalentInsertHandler(pathologyNum, prevalent);
    result.then(data => {
   
        console.log('[72][prevalentdata]', data);
          res.json({message:'SUCCESS'});
     })
     .catch( error  => {
        logger.error('[80][prevalentdata]error=' + error.message);
        res.sendStatus(500)
    });

 };

 const  prevalentSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[89][prevalentdata select]pathologyNum=' + pathologyNum);

    //select Query 생성
    const qry = "select prevalent from prevalent where pathologyNum = @pathologyNum ";
    logger.info('[91][prevalentdata select]sql=' + qry);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[102][prevalentdata select]error=' + error.message);
    }
}

exports.prevalentList = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;

    logger.error('[109][prevalentlist]pathologyNum=' + pathologyNum);
    const result = prevalentSelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[100][prevalentList]', data);
          res.send(data.map(item => item.prevalent));
     })
     .catch( error  => {
        logger.error('[116][prevalentlist]error=' + error.message);
        res.sendStatus(500);
    })
 };