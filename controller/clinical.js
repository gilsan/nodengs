
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

const  clinicalInsertHandler = async (pathologyNum, clinical) => {
    await poolConnect; // ensures that the pool has been created
    let result;
   
    logger.info('[28][clinicaldata] pathologyNum=' +  pathologyNum);
    let sql = "delete from clinical where  pathologyNum = @pathologyNum ";
    logger.info('[30][clinicaldata] sql=', sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        const result = await request.query(sql)       
        //return result;
      } catch (err) {
        logger.error('[clinical]SQL error =' + err);
    } 
    
    const len = clinical.length;

    logger.info("[clinical][42]len=" + len);
     
    if (len > 0) {
        for (let i =0; i < len; i++) {

            const frequency = clinical[i].frequency;
            const gene      = clinical[i].gene;
            const tier      = clinical[i].tier;
            logger.info( '[49][clinicaldata]' + pathologyNum  + " " + frequency + " " + gene + " " + tier);
            const qry = "insert into clinical (pathologyNum, frequency, gene, tier) values(@pathologyNum,  @frequency, @gene, @tier)"; 
            console.log('[51][clinicaldata]', qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('frequency', mssql.VarChar, frequency)
                .input('gene', mssql.VarChar, gene)
                .input('tier', mssql.VarChar, tier);
    
                result = await request.query(qry, (error, result)=> {
                    if (error)
                    {
                        logger.error('[59][clinical][][error= ' + error);
                    }
                    logger.info("result=" + result);
                });
    
            } catch (err) {
                logger.error('SQL error', err);
            }
             
        }

        // clinical.forEaach( async(item) => {
        //     const frequency = item.frequency.slice(0, -1);
        //     const gene      = item.gene;
        //     const tier      = item.tier;
        //     console.log('[47][clinicaldata]', pfrequency,gene, tier);
        //     const qry = "insert into clinical (pathologyNum, frequency, gene, tier) values(@pathologyNum,  @frequency, @gene, @tier)"; 
        //     console.log('[49][clinicaldata]', qry);
        //     try {
        //         const request = pool.request()
        //         .input('pathologyNum', mssql.VarChar, pathologyNum)
        //         .input('frequency', mssql.VarChar, frequency)
        //         .input('gene', mssql.Variant, gene)
        //         .input('tier', mssql.Variant, tier);
    
        //         result = await request.query(qry);
    
        //     } catch (err) {
        //         console.error('SQL error', err);
        //     }
        // })
        return result;
    }

    
}

exports.clinicaldata = (req, res, next) => {
     
    const pathologyNum = req.body.pathologyNum;
    const clinical = req.body.clinical;
     
    const result = clinicalInsertHandler(pathologyNum, clinical);
    result.then(data => {  
      //  console.log('[72][clinicaldata]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( err  => {
         logger.info('[105][clinical]err= ' + err);
        res.sendStatus(500);
     });

 };


 const  clinicalSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    	//insert Query 생성
    const qry = "select frequency, gene, tier  from clinical   where pathologyNum = @pathologyNum ";
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (err) {
            console.error('SQL error', err);
        }
  }

  exports.clinicalList = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;
    const result = clinicalSelectHandler(pathologyNum);
    result.then(data => {  
        //  console.log('[437][benignInfoCount]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));; 

 };