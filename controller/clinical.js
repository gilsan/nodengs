
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
 function nvl(st, defaultStr){
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }
        
    return st ;
}

const  clinicalInsertHandler = async (pathologyNum, clinical) => {
    await poolConnect; // ensures that the pool has been created

    const len = clinical.length;

    let result;

    logger.info("[clinical][17]len=" + len);
     
    if (len > 0) {
        for (let i =0; i < len; i++) {

            const frequency         = clinical[i].frequency;
            const gene              = clinical[i].gene;
            const aminoAcidChange   = nvl (clinical[i].aminoAcidChange, '');
            const tier              = clinical[i].tier;
            logger.info( '[25][clinicaldata]' + pathologyNum  + " " + frequency + " " + gene + " " + tier + " " + aminoAcidChange);
            const qry = "insert into clinical (pathologyNum, frequency, gene, tier, aminoAcidChange) values(@pathologyNum,  @frequency, @gene, @tier, @aminoAcidChange)"; 
            logger.info('[27][clinicaldata] sql='+ qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('frequency', mssql.VarChar, frequency)
                .input('gene', mssql.VarChar, gene)
                .input('aminoAcidChange', mssql.VarChar, aminoAcidChange)
                .input('tier', mssql.VarChar, tier);
    
                result = await request.query(qry);
    
            } catch (error) {
                logger.error('[38][clinical ins]err='+ error.message);
            }
        }
    }

    return result;
}

const  clinicalSaveHandler = async (pathologyNum, clinical) => {
    await poolConnect; // ensures that the pool has been created
    let result;
   
    logger.info('[50][clinicaldata] pathologyNum=' +  pathologyNum);
    let sql = "delete from clinical where  pathologyNum = @pathologyNum ";
    logger.info('[52][clinicaldata] sql='+ sql);

    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum); 
            
        result = request.query(sql)  ;
        
        result.then(data => {

            console.log(data);

            const result_ins = clinicalInsertHandler(pathologyNum, clinical);

            result_ins.then(data_ins => {
                console.log(data_ins);
            })
        });

        //return result;
      } catch (error) {
        logger.error('[75][clinical del]err=' + error.message);
    } 

    return result;
}

exports.clinicaldata = (req, res, next) => {
     
    logger.info('[84][clinicaldata]req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const clinical = req.body.clinical;
     
    const result = clinicalSaveHandler(pathologyNum, clinical);
    result.then(data => {  
      //  console.log('[92][clinicaldata]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( error  => {
        logger.error('[95][clinical]err= ' + error.message);
        res.sendStatus(500);
     });

};

const  clinicalSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[105]clinicalSelect data=' + pathologyNum);
    //insert Query 생성
    const qry = "select frequency, gene, tier, aminoAcidChange  from clinical   where pathologyNum = @pathologyNum ";
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[117]clinicalSelectHandler err=' + error.message);
    }
}

// get clinically List
exports.clinicalList = (req, res, next) => {
    logger.info('[123]clinicalList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = clinicalSelectHandler(pathologyNum);
    result.then(data => {  
        //  console.log('[108][clinicalList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[132]clinicalList err=' + error.message);
        res.sendStatus(500)
    }); 
 };