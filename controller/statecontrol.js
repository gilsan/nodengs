
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
    
  console.log('st=', st);
  if(st === undefined || st == null || st == "") {
      st = defaultStr ;
  }
      
  return st ;
}

const  statecontrolSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    //select Query 생성
        const qry = `SELECT
            isnull( dnaRnasep, '') dnaRnasep
            , isnull(rna18s, '') rna18s
            , isnull(averageBase, '') averageBase
            , isnull(uniformity, '') uniformity
            , isnull(meanRead, '') meanRead
            , isnull(meanRaw, '') meanRaw
            , isnull(mapd, '') mapd
        FROM NGS_DATA.dbo.statecontrol 
        where pathology_num=@pathologyNum`;

        logger.info('[50]statecontrolSelect sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        return result.recordset; 
    }catch (error) {
        logger.error('[60]statecontrolSelectHandler err=' + error.message);
    }
}

// get statecontrol List
exports.statecontrolList = (req, res, next) => {
    logger.info('[67]statecontrolList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = statecontrolSelectHandler(pathologyNum);
    result.then(data => {  
        //  console.log('[108][statecontrolList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[76]statecontrolList err=' + error.message);
        res.sendStatus(500)
    }); 
 };

