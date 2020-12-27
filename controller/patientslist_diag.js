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
   
    const sql ="select isnull(name, '') name  ,isnull(patientID, '') patientID \
                ,isnull(age,  '') age ,isnull(gender, '') gender \
                ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion \
                ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease \
                ,isnull(method, '') method ,isnull(specimen, '') specimen \
                ,isnull(request, '') request ,isnull(appoint_doc, '')  appoint_doc \
                ,isnull(worker, '') worker \
                ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date \
                ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code \
                ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion \
                ,isnull(tsvFilteredFilename, '') tsvFilteredFilename ,isnull(createDate, '') createDate \
                ,isnull(tsvFilteredStatus, '') tsvFilteredStatus ,isnull(tsvFilteredDate, '') tsvFilteredDate \
                ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR \
                ,isnull(sendEMRDate, '') sendEMRDate  \
                ,isnull(convert(varchar(10), cast(stuff(stuff(stuff(accept_date, 9, 0, ' '), 12, 0, ':'), 15, 0, ':') as datetime), 102), '') accept_date \
                ,isnull(test_code, '') test_code ,isnull (report_date, '') report_date \
                ,isnull(screenstatus, '')  screenstatus \
                from [dbo].[patientinfo_diag] where left(prescription_date, 8) = '" + today + "'";
    console.log('[getDiagLists] ', sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result.recordset);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
  }

  // diag 오늘 검사자 조회
 exports.getDiagLists = (req,res, next) => {
    
	 const  now = new Date();
     const today = getFormatDate2(now);
     const result = messageHandler(today);
     result.then(data => {
   
        console.log('[getDiagLists 환자목록]', data);
        res.json(data);
     })
     .catch( err  => res.sendStatus(500)); 
}

const  messageHandler2 = async (start, end, patientID, specimenNo) => {
    await poolConnect; // ensures that the pool has been created
   
  //  console.log('qry start',start,end, patientID, specimenNo)

    let patient =  nvl(patientID, "");
    console.log('patient 0');
    let specimen_no =  nvl(specimenNo, "");

    let sql = "select isnull(name, '') name  ,isnull(patientID, '') patientID \
            ,isnull(age,  '') age ,isnull(gender, '') gender \
            ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion \
            ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease \
            ,isnull(method, '') method ,isnull(specimen, '') specimen \
            ,isnull(request, '') request ,isnull(appoint_doc, '')  appoint_doc \
            ,isnull(worker, '') worker \
            ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date \
            ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code \
            ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion \
            ,isnull(tsvFilteredFilename, '') tsvFilteredFilename ,isnull(createDate, '') createDate \
            ,isnull(tsvFilteredStatus, '') tsvFilteredStatus ,isnull(tsvFilteredDate, '') tsvFilteredDate \
            ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR \
            ,isnull(sendEMRDate, '') sendEMRDate \
            ,isnull(convert(varchar(10), cast(stuff(stuff(stuff(accept_date, 9, 0, ' '), 12, 0, ':'), 15, 0, ':') as datetime), 102), '') accept_date \
            ,isnull(test_code, '') test_code  \
            ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected \
            from [dbo].[patientinfo_diag] \
            where left(prescription_date, 8) >= '" + start + "'" 
             + " and left(prescription_date, 8) <= '" + end + "'"; 

    if(patient.length > 0 )
    {
        sql = sql +  " and patientID = '" +  patient + "'";
    }

    if(specimen_no.length > 0 )
    {
        sql = sql +  " and specimenNo = '" +  specimen_no + "'";
    }

     
    sql = sql + " order by prescription_date desc   ";

    console.log("sql="+sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
  }

// diag 날자별 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagLists = (req, res,next) => {

//console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID.trim(); // 환자 id
   let specimenNo   =  req.body.specimenNo.trim(); // 검채 번호

   console.log('[187][patientslist_diag][getPatientDiagLists] 검색', start,end, patientID, specimenNo);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo);
   result.then(data => {
 
      console.log('[203][검색결과][]', data);
      res.json(data);

      res.end();
   })
   .catch( err  => res.sendStatus(500)); 
}

/**
 * 
 * @param 검체자 검사자 기록
 * @param {*} res 
 * @param {*} next 
 */

const  changeExaminer = async (specimenNo, part, name) => {
    let sql;
    if ( part === 'exam') {
        sql =`update patientInfo_diag set examin=@name where specimenNo=@specimenNo`;
    } else if (part === 'recheck') {
        sql =`update patientInfo_diag set recheck=@name where specimenNo=@specimenNo`;
    }

    try {
        const request = pool.request()
        .input('name', mssql.NVarChar, name)
        .input('specimenNo', mssql.VarChar, specimenNo);
        
        const result = await request.query(sql);       
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }    
}

exports.updateExaminer = (req, res, next) => {
    let specimenNo   =  req.body.specimenNo.trim(); 
    let part =  req.body.part;  
    let name   =  req.body.name;  
    const result = changeExaminer(specimenNo, part, name);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    }). err( err => console.log('[250][patinetslist_diag][err] ', err));
}

// 진검 "수정" 버튼 누르면 screenstatus 상태를 변경
const resetscreenstatus = async (specimenNo, seq) =>{
    await poolConnect; // ensures that the pool has been created

    console.log('==[257][resetscreenstatus]', specimenNo, seq);
    sql =`update patientInfo_diag set screenstatus=@seq where specimenNo=@specimenNo`;
    try {

        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql);       
                 return result;        
      
    } catch(err) {
        console.error('SQL error', err);
    }
}

exports.resetScreenStatus = (req, res, next) => {
    let specimenNo = req.body.specimenNo.trim();
    let num        = req.body.num;
    console.log('=== [271][patientslist_diag] ', specimenNo);
    const result = resetscreenstatus(specimenNo, num);
    result.then(data => {
         res.json({message: "SUCCESS"});
    });   
}

//진검의 screenstatus 상태 알애내기
const getscreenstatus = async (specimenNo) =>{
    await poolConnect; // ensures that the pool has been created
    sql =`select  screenstatus from patientInfo_diag where specimenNo=@specimenNo`;
    try {
        const request = pool.request()
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql);       
                 return result.recordset[0];             
    } catch(err) {
        console.error('SQL error', err);
    }
}

exports.getScreenStatus = (req, res, next) => {
    let specimenNo = req.body.specimenNo.trim();
    console.log('=== [283][patientslist_diag] ', specimenNo);
    const result = getscreenstatus(specimenNo);
    result.then(data => {
         res.json(data);
    });    
}


 

 


