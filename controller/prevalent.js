const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { json } = require('body-parser');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  prevalentInsertHandler = async (pathologyNum, prevalent) => {
    await poolConnect; // ensures that the pool has been created

    const len = prevalent.length;

    if ( len > 0 ) {
       prevalent.forEach( async(item) => {
        const prevalent = item;
        const qry = "insert into prevalent (pathologyNum, prevalent) values(@pathologyNum, @prevalent)"; 
        logger.info('[17][prevalentdata insert]qry=' + qry);

        try {
            const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('prevalent', mssql.VarChar, prevalent);
            result = await request.query(qry);
        } catch (error) {
            logger.error('[25][prevalentdata insert]error=' + error.message);
        }
       });
    }
}

const prevalentSaveHandler = async (pathologyNum, prevalent) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    logger.info('[28][prevalentdata insert]pathologyNum=' + pathologyNum);
    logger.info('[29][prevalentdata insert]prevalent=' + prevalent);

    let sql = "delete from prevalent where  pathologyNum = @pathologyNum ";
    logger.info("[32][prevalentdata insert]sql=" + sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = request.query(sql)   ;
        
        result.then(data => {
            console.log(data);

            result_ins = prevalentInsertHandler(pathologyNum, prevalent);

            result_ins.then(data_ins => {
                console.log(data_ins);
            })
            .catch(error => {
                logger.error('[56][prevalentdata ins]err=' + error.message);
            })
        })
        
        //return result;
      } catch (error) {
        logger.error('[63][prevalentdata delete]err=' + error.message);
    } 
 
    return result;
}

exports.prevalentdata = (req, res, next) => {

    logger.info('[71][prevalentdata ]req=' + JSON.stringify(req.body));
     
    const pathologyNum = req.body.pathologyNum;
    const prevalent = req.body.prevalent;

    logger.info('[71][prevalentdata ]pathologyNum=' + pathologyNum);
    logger.info('[71][prevalentdata ]prevalent=' + prevalent);

    const result = prevalentSaveHandler(pathologyNum, prevalent);
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
    const qry = "select prevalent, seq from prevalent where pathologyNum = @pathologyNum ";
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

    logger.info('[109][prevalentlist]pathologyNum=' + pathologyNum);
    const result = prevalentSelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[100][prevalentList]', data);
          res.json(data);
          // res.send(data.map(item => item.prevalent));
     })
     .catch( error  => {
        logger.error('[116][prevalentlist]error=' + error.message);
        res.sendStatus(500);
    })
 };


 const  prevalentInsertHandler2 = async (pathologyNum, prevalent) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    logger.info('[126][prevalentdata2 insert]pathologyNum=' + pathologyNum);
    logger.info('[127][prevalentdata2 insert]prevalent2=' + prevalent);

    let sql = "delete from prevalent where  pathologyNum = @pathologyNum ";
    logger.info("[130][prevalentdata insert]sql=" + sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = await request.query(sql)       
        //return result;
      } catch (error) {
        logger.error('[41][prevalentdata2 delete]error=' + error.message);
    } 
    
    const len = prevalent.length;

    if ( len > 0 ) {
       prevalent.forEach( async(item) => {
        logger.info('======== [146][item]'+  item);   
        const geneinfo = item.gene;
        const seq = item.seq;
        logger.info('======== [146][item]seq='+  seq);   
        const qry = "insert into prevalent (pathologyNum, prevalent, seq) values(@pathologyNum, @geneinfo, @seq)"; 
        logger.info('[149][prevalentdata2 insert]qry=' + qry);
        logger.info('[150][prevalentdata2]' + geneinfo + ' ' + seq);
        try {
            const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('seq', mssql.VarChar, seq)
            .input('geneinfo', mssql.VarChar, geneinfo);
            result = await request.query(qry);
        } catch (error) {
            logger.error('[158][prevalentdata2 insert]error=' + error.message);
        }
       });
    }
 
    return result;
}

exports.prevalentdata2 = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const prevalent = req.body.prevalent;

    logger.info('[171][prevalentdata ]pathologyNum=' + pathologyNum);
   // logger.info('[172][prevalentdata ]prevalent=' + prevalent);

    const result = prevalentInsertHandler2(pathologyNum, prevalent);
    result.then(data => {
   
        console.log('[177][prevalentdata]', data);
          res.json({message:'SUCCESS'});
     })
     .catch( error  => {
        logger.error('[180][prevalentdata]error=' + error.message);
        res.sendStatus(500)
    });

 };