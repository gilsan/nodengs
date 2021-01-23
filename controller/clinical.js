
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { clinicallyList } = require('./clinically');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  clinicalInsertHandler = async (pathologyNum, clinical) => {
    await poolConnect; // ensures that the pool has been created
    let result;
   
    logger.info('[15][clinicaldata] pathologyNum=' +  pathologyNum);
    let sql = "delete from clinical where  pathologyNum = @pathologyNum ";
    logger.info('[15][clinicaldata] sql='+ sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = await request.query(sql)       
        //return result;
      } catch (error) {
        logger.error('[26][clinical]SQL error =' + error.message);
    } 
    
    const len = clinical.length;

    logger.info("[clinical][32]len=" + len);
     
    if (len > 0) {
        for (let i =0; i < len; i++) {

            const frequency = clinical[i].frequency;
            const gene      = clinical[i].gene;
            const tier      = clinical[i].tier;
            logger.info( '[39][clinicaldata]' + pathologyNum  + " " + frequency + " " + gene + " " + tier);
            const qry = "insert into clinical (pathologyNum, frequency, gene, tier) values(@pathologyNum,  @frequency, @gene, @tier)"; 
            logger.info('[40][clinicaldata] sql='+ qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('frequency', mssql.VarChar, frequency)
                .input('gene', mssql.VarChar, gene)
                .input('tier', mssql.VarChar, tier);
    
                result = await request.query(qry);
    
            } catch (error) {
                logger.error('SQL error='+ error.message);
            }
        }

        return result;
    }

    
}

exports.clinicaldata = (req, res, next) => {
     
    logger.info('[64][clinicaldata]req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const clinical = req.body.clinical;
     
    const result = clinicalInsertHandler(pathologyNum, clinical);
    result.then(data => {  
      //  console.log('[72][clinicaldata]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( err  => {
        logger.error('[75][clinical]err= ' + err);
        res.sendStatus(500);
     });

};

const  clinicalSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[84]clinicalSelect data=' + pathologyNum);
    //insert Query 생성
    const qry = "select frequency, gene, tier  from clinical   where pathologyNum = @pathologyNum ";
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[97]clinicalSelectHandler err=' + error.message);
    }
}

// get clinically List
exports.clinicalList = (req, res, next) => {
    logger.info('[103]clinicalList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = clinicalSelectHandler(pathologyNum);
    result.then(data => {  
        //  console.log('[437][benignInfoCount]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[112]clinicalList err=' + error.message);
        res.sendStatus(500)
    }); 
 };