const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const config = require('./config.js');
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
*/

const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

function getFormatDate(date){

    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

// 'yyyy-mm-dd' -> 'yyyyMMdd'
function getFormatDate2(date){

   var year = date.getFullYear();
   var month = (1 + date.getMonth());
   month = month >= 10 ? month : '0' + month;
   var day = date.getDate();
   day = day >= 10 ? day : '0' + day;
   var arr = new Array (year, month, day);
   const today = arr.join("");
  // console.log('[today]', today);
   return today;
}

/*
 * yyyyMMdd 날짜문자열을 Date형으로 반환
 */
function getFormatDate3(date_str)
{
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(4,6);
    var sDate = yyyyMMdd.substring(6,8);

    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
}

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

const  messageHandler = async (today) => {
    await poolConnect; // ensures that the pool has been created
   
    const sql ="select * from [dbo].[patientinfo_path] where left(prescription_date, 8) = '" + today + "'";
    logger.info("[81][patientinfo_path select]sql=" + sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result.recordset);
        
        return result.recordset;
    } catch (error) {
        logger.error("[81][patientinfo_path select]err=" + error.message);    
    }
  }

 exports.getPathLists = (req,res, next) => {
    
	 const  now = new Date();
     const today = getFormatDate2(now);
     const result = messageHandler(today);
     result.then(data => {
   
      //  console.log('[getDiagLists]', data);
        res.json(data);
     })
     .catch( error  => {
        logger.error("[104][patientinfo_path select]err=" + error.message);
         res.sendStatus(500)
     }); 
}

const messageHandler2 = async (start, end, patientID, pathology_num) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info("[112][patientinfo_path select]start=" + start);
    logger.info("[112][patientinfo_path select]end=" + end);
    
    let sql = "select * from [dbo].[patientinfo_path] \
               where left(prescription_date, 8) >= '" + start + "' \
               and left(prescription_date, 8) <= '" + end + "' ";

    let patient =  nvl(patientID, "");
    let pathology =  nvl(pathology_num, "");

    logger.info("[112][patientinfo_path select]patient=" + patient);
    logger.info("[112][patientinfo_path select]pathology=" + pathology);
    
    if(patient.length > 0 )
    {
        sql = sql +  " and patientID = '" +  patient + "'";
    }

    if(pathology.length > 0 )
    {
        //20-12-26 = -> like 변경
        //sql = sql +  " and pathology_num = '" +  pathology + "'";
        sql = sql +  " and pathology_num like '%" +  pathology + "%'";
    }

    sql = sql + " order by prescription_date desc, pathology_num ";
    logger.info("[137][patientinfo_path select]sql=" + sql);
        
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
        logger.error("[112][patientinfo_path select]err=" + error.message);
    }
  }

exports.getPatientPathLists = (req, res,next) => {

console.log(req.body);
   let start           =  req.body.start; //.replace("-", "");
   let end             =  req.body.end; //.replace("-", "");
   let patientID       =  req.body.patientID.trim(); // 환자 id
   let pathology_num   =  req.body.pathologyNo.trim(); // 겸재 번호

   logger.info("[159][patientinfo_path list]start=" + start);
   logger.info("[159][patientinfo_path select]end=" + end);
   logger.info("[159][patientinfo_path select]patientID=" + patientID);
   logger.info("[159][patientinfo_path select]pathology_num=" + pathology_num);

   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, pathology_num);
   result.then(data => {
 
      res.json(data);
      res.end();
   })
   .catch( error  => {
      logger.error("[112][patientinfo_path select]err=" + error.message);
      res.sendStatus(500)
    }); 
}

/**
 * 
 * @param 병리 검체자 검사자 기록
 * @param {*} res 
 * @param {*} next 
 */

const  changeExaminer = async (pathologyNum, part, name) => {
    
    logger.info("[196][patientinfo_path update]part=" + part);
    logger.info("[196][patientinfo_path update]name=" + name);
    logger.info("[196][patientinfo_path select]pathologyNum=" + pathologyNum);
    
    let sql;
    if ( part === 'exam') {
        sql =`update patientInfo_path set examin=@name where pathology_num=@pathologyNum`;
    } else if (part === 'recheck') {
        sql =`update patientInfo_path set recheck=@name where pathology_num=@pathologyNum`;
    }

    logger.info("[207][patientinfo_path update]sql=" + sql);
    
    try {
        const request = pool.request()
        .input('name', mssql.NVarChar, name)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result = await request.query(sql);       
        return result;
    } catch (error) {
        logger.error("[220][patientinfo_path select]err=" + error.message);
    }    
}

exports.updateExaminer = (req, res, next) => {
    let pathologyNum   =  req.body.pathologyNum.trim(); 
    let part =  req.body.part;  
    let name   =  req.body.name;  
    
    logger.info("[226][patientinfo_path updateExaminer]pathologyNum=" + pathologyNum);
    logger.info("[226][patientinfo_path updateExaminer]name=" + name);
    logger.info("[226][patientinfo_path updateExaminer]part=" + part);
    
    const result = changeExaminer(pathologyNum, part, name);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[238][patinetslist_path updateExaminer]err=' + error.message);
    });
}

// 병리 "수정" 버튼 누르면 screenstatus 상태를 변경
const resetscreenstatusPath = async (pathologyNum, seq) =>{
    await poolConnect; // ensures that the pool has been created

    logger.info("[226][patientinfo_path reset screen]pathologyNum=" + pathologyNum);
    logger.info("[226][patientinfo_path reset screen]seq=" + seq);
    
    let sql =`update patientInfo_path set screenstatus=@seq where pathology_Num=@pathologyNum`;
    logger.info("[226][patientinfo_path reset screen]sql=" + sql);
    
    try {
        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('pathologyNum', mssql.VarChar, pathologyNum);
        const result = await request.query(sql);       
        return result;        
    } catch(error) {
        logger.error("[226][patientinfo_path reset screen]err=" + error.message);
    }
}

exports.resetScreenStatusPath = (req, res, next) => {

    logger.info("[226][patientinfo_path reset screen]data=" + JSON.stringify(req.body));
    
    let pathologyNum = req.body.pathologyNum.trim();
    let num        = req.body.num;

    logger.info("[226][patientinfo_path reset screen]pathologyNum=" + pathologyNum);
    logger.info("[226][patientinfo_path reset screen]num=" + num);
    
    const result = resetscreenstatusPath(pathologyNum, num);
    result.then(data => {
         res.json({message: "SUCCESS"});
    })
    .catch( error => {
        logger.error('[219][patinetslist_path reset screen]err=' + error.message);
    });
}

//병리의 screenstatus 상태 알애내기
const getscreenstatusPath = async (pathologyNum) =>{
    await poolConnect; // ensures that the pool has been created

    logger.info("[283][patientinfo_path get screen]pathologyNum=" + pathologyNum);
    sql =`select  screenstatus from patientInfo_path where pathology_Num=@pathologyNum`;
    logger.info("[283][patientinfo_path get screen]sql=" + sql);
    try {
        const request = pool.request()
                 .input('pathologyNum', mssql.VarChar, pathologyNum);
        const result = await request.query(sql);       
                 return result.recordset[0];             
    } catch(error) {
        logger.error("[292][patientinfo_path get screen]pathologyNum=" + error.message);
    }
}

exports.getScreenStatusPath = (req, res, next) => {
    let pathologyNum = req.body.pathologyNum.trim();
    logger.info("[298][patientinfo_path get screen]pathologyNum=" + pathologyNum);
    
    const result = getscreenstatusPath(pathologyNum);
    result.then(data => {
         res.json(data);
    });    
}