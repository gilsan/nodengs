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
   // console.log('[getDiagLists] ', sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result.recordset);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
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
     .catch( err  => res.sendStatus(500)); 
}


const messageHandler2 = async (start, end, patientID, pathology_num) => {
    await poolConnect; // ensures that the pool has been created
   
    let sql = "select * from [dbo].[patientinfo_path] \
               where left(prescription_date, 8) >= '" + start + "' \
               and left(prescription_date, 8) <= '" + end + "' ";

    console.log('qry start',start,end, patientID, pathology_num);

    let patient =  nvl(patientID, "");
    console.log('patient 0');
    let pathology =  nvl(pathology_num, "");

    console.log('patient 1');

    if(patient.length > 0 )
    {
        sql = sql +  " and patientID = '" +  patient + "'";
    }

    console.log('patientid');

    if(pathology.length > 0 )
    {
        //20-12-26 = -> like 변경
        //sql = sql +  " and pathology_num = '" +  pathology + "'";
        sql = sql +  " and pathology_num like '%" +  pathology + "%'";
    }

    sql = sql + " order by prescription_date desc   ";
   
    console.log("sql last=",sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
  }

exports.getPatientPathLists = (req, res,next) => {

console.log(req.body);
   let start           =  req.body.start; //.replace("-", "");
   let end             =  req.body.end; //.replace("-", "");
   let patientID       =  req.body.patientID.trim(); // 환자 id
   let pathology_num   =  req.body.pathologyNo.trim(); // 겸재 번호

   console.log(start,end, patientID, pathology_num);

   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   //const requestTime = new Date(end).getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   //console.log('qry before',start,end, patientID, pathology_num);

   const result = messageHandler2(start, end, patientID, pathology_num);
   result.then(data => {
 
    //  console.log(data);
      res.json(data);

      res.end();
   })
   .catch( err  => res.sendStatus(500)); 
}

/**
 * 
 * @param 병리 검체자 검사자 기록
 * @param {*} res 
 * @param {*} next 
 */

const  changeExaminer = async (pathologyNum, part, name) => {
    let sql;
    if ( part === 'exam') {
        sql =`update patientInfo_path set examin=@name where pathology_num=@pathologyNum`;
    } else if (part === 'recheck') {
        sql =`update patientInfo_path set recheck=@name where pathology_num=@pathologyNum`;
    }

    try {
        const request = pool.request()
        .input('name', mssql.NVarChar, name)
        .input('pathology_num', mssql.VarChar, pathologyNum);
        
        const result = await request.query(sql);       
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }    
}

exports.updateExaminer = (req, res, next) => {
    let pathologyNum   =  req.body.pathologyNum.trim(); 
    let part =  req.body.part;  
    let name   =  req.body.name;  
    const result = changeExaminer(pathologyNum, part, name);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    }). err( err => console.log('[219][patinetslist_path][err] ', err));
}



// 병리 "수정" 버튼 누르면 screenstatus 상태를 변경
const resetscreenstatusPath = async (pathologyNum, seq) =>{
    await poolConnect; // ensures that the pool has been created

    console.log('==[257][resetscreenstatus]', pathologyNum, seq);
    sql =`update patientInfo_path set screenstatus=@seq where pathology_Num=@pathologyNum`;
    try {

        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('pathologyNum', mssql.VarChar, pathologyNum);
        const result = await request.query(sql);       
                 return result;        
      
    } catch(err) {
        console.error('SQL error', err);
    }
}

exports.resetScreenStatusPath = (req, res, next) => {
    let pathologyNum = req.body.pathologyNum.trim();
    let num        = req.body.num;
    console.log('=== [271][patientslist_path] ', pathologyNum);
    const result = resetscreenstatusPath(pathologyNum, num);
    result.then(data => {
         res.json({message: "SUCCESS"});
    });   
}

//병리의 screenstatus 상태 알애내기
const getscreenstatusPath = async (pathologyNum) =>{
    await poolConnect; // ensures that the pool has been created
    sql =`select  screenstatus from patientInfo_path where pathology_Num=@pathologyNum`;
    try {
        const request = pool.request()
                 .input('pathologyNum', mssql.VarChar, pathologyNum);
        const result = await request.query(sql);       
                 return result.recordset[0];             
    } catch(err) {
        console.error('SQL error', err);
    }
}

exports.getScreenStatusPath = (req, res, next) => {
    let pathologyNum = req.body.pathologyNum.trim();
    console.log('=== [283][patientslist_path] ', pathologyNum);
    const result = getscreenstatusPath(pathologyNum);
    result.then(data => {
         res.json(data);
    });    
}

