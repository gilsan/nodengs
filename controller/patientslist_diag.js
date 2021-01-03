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
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }
        
    return st ;
}

const  messageHandler = async (today) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info('[82][patientinfo_diag list]today=' + today);

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
    logger.info('[82][patientinfo_diag list]sql=' + sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result.recordset);
        
        return result.recordset;
    } catch (error) {
        logger.info('[110][patientinfo_diag list]err=' + error.message);
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
     .catch( error  => {
        logger.info('[82][patientinfo_diag list]err=' + error.message);
        res.sendStatus(500)
    }); 
}

const  messageHandler2 = async (start, end, patientID, specimenNo) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info('[134][patientinfo_diag list2]start=' + start);
    logger.info('[134][patientinfo_diag list2]end=' + end);

    let patient =  nvl(patientID, "");
    let specimen_no =  nvl(specimenNo, "");
    
    logger.info('[140][patientinfo_diag list2]patient=' + patient);
    logger.info('[140][patientinfo_diag list2]specimen_no=' + specimen_no);

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
            ,isnull (report_date, '') report_date \
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

    logger.info('[177][patientinfo_diag list2]sql=' + sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql);
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
        logger.error('[186][patientinfo_diag list2]err=' + error.message);
    }
  }

// diag 날자별 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagLists = (req, res,next) => {
    logger.info('[192][patientinfo_diag list]data=' + JSON.stringify(req.body));

   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID.trim(); // 환자 id
   let specimenNo   =  req.body.specimenNo.trim(); // 검채 번호

   logger.info('[194][patientinfo_diag list]start=' + start);
   logger.info('[194][patientinfo_diag list]patientID=' + patientID);
   logger.info('[194][patientinfo_diag list]specimenNo=' + specimenNo);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       //console.log('end=', end);
   }
   logger.info('[194][patientinfo_diag list]end=' + end);

   const result = messageHandler2(start, end, patientID, specimenNo);
   result.then(data => {
 
      console.log('[203][검색결과][]', data);
      res.json(data);

      res.end();
   })
   .catch( error  => {
        logger.info('[224][patientinfo_diag list]err=' + error.message);
        res.sendStatus(500)
    }); 
}

/**
 * 
 * @param 검체자 검사자 기록
 * @param {*} res 
 * @param {*} next 
 */
const changeExaminer = async (specimenNo, part, name) => {
    logger.info('[236][patientinfo_diag updateExaminer]specimenNo=' + specimenNo);
    logger.info('[236][patientinfo_diag updateExaminer]part=' + part);
    logger.info('[236][patientinfo_diag updateExaminer]name=' + name);

    let sql;
    if ( part === 'exam') {
        sql =`update patientInfo_diag set examin=@name where specimenNo=@specimenNo`;
    } else if (part === 'recheck') {
        sql =`update patientInfo_diag set recheck=@name where specimenNo=@specimenNo`;
    }

    logger.info('[247][patientinfo_diag updateExaminer]sql=' + sql);

    try {
        const request = pool.request()
        .input('name', mssql.NVarChar, name)
        .input('specimenNo', mssql.VarChar, specimenNo);
        
        const result = await request.query(sql);       
        return result;
    } catch (error) {
        logger.info('[257][patientinfo_diag updateExaminer]err=' + error.message);
    }    
}

exports.updateExaminer = (req, res, next) => {
    let specimenNo   =  req.body.specimenNo.trim(); 
    let part =  req.body.part;  
    let name   =  req.body.name;  
    const result = changeExaminer(specimenNo, part, name);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.info('[270][patientinfo_diag updateExaminer]err=' + error.message);
    });
}

// 진검 "수정" 버튼 누르면 screenstatus 상태를 변경
const resetscreenstatus = async (specimenNo, seq) =>{
    await poolConnect; // ensures that the pool has been created

    logger.info('[277][patientinfo_diag resetScreen]specimenNo=' + specimenNo);
    logger.info('[277][patientinfo_diag resetScreen]seq=' + seq);
    let sql =`update patientInfo_diag set screenstatus=@seq where specimenNo=@specimenNo`;
    logger.info('[281][patientinfo_diag resetScreen]sql=' + sql);
    try {

        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql);       
        return result;        
      
    } catch(error) {
        logger.info('[291][patientinfo_diag resetScreen]err=' + specimenNo);
    }
}

exports.resetScreenStatus = (req, res, next) => {
    let specimenNo = req.body.specimenNo.trim();
    let num        = req.body.num;
    logger.info('[298][patientinfo_diag resetScreen]specimenNo=' + specimenNo);
    logger.info('[298][patientinfo_diag resetScreen]num=' + num);

    const result = resetscreenstatus(specimenNo, num);
    result.then(data => {
         res.json({message: "SUCCESS"});
    })
    .catch( error => {
        logger.info('[270][patientinfo_diag resetScreen]err=' + error.message);
    })
}

//진검의 screenstatus 상태 알애내기
const getscreenstatus = async (specimenNo) =>{
    await poolConnect; // ensures that the pool has been created
    logger.info('[313][patientinfo_diag getScreen]specimenNo=' + specimenNo);
    let sql =`select screenstatus from patientInfo_diag where specimenNo=@specimenNo`;
    logger.info('[313][patientinfo_diag getScreen]sql=' + sql);
    try {
        const request = pool.request()
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql);       
        return result.recordset;             
    } catch(error) {
        logger.error('[321][patientinfo_diag getScreen]err=' + error.message);
    }
}

exports.getScreenStatus = (req, res, next) => {
    let specimenNo = req.body.specimenNo.trim();
    logger.info('[327][patientinfo_diag getScreen]specimenNo=' + specimenNo);
    const result = getscreenstatus(specimenNo);
    result.then(data => {
        console.log('[331][검색결과][]', data);
         res.json(data);
    })
    .catch( error => {
        logger.info('[270][patientinfo_diag getScreen]err=' + error.message);
    });
}

// EMR로 보낸 전송 횟수 기록
const setEMRcount = async (specimenNo, sendEMR) => {
    await poolConnect; // ensures that the pool has been created
    let sql;
    logger.info('[298][patientinfo_diag sendEMRcount]specimenNo=' + specimenNo);
    logger.info('[298][patientinfo_diag sendEMRcount]sendEMR=' + sendEMR );
    if ( Number(sendEMR) === 1 ) {  // 검사보고일
        sql =`update patientInfo_diag set sendEMR=@sendEMR , sendEMRDate=getdate(), report_date=getdate() where specimenNo=@specimenNo`;
    } else if (Number(sendEMR) > 1 ) {  // 수정 보고일
        sql =`update patientInfo_diag set sendEMR=@sendEMR , report_date=getdate() where specimenNo=@specimenNo`;
    }
    logger.info('[298][patientinfo_diag sendEMrcount]sql=' + sql);

    try {
        const request = pool.request()
        .input('sendEMR', mssql.VarChar, sendEMR)
        .input('specimenNo', mssql.VarChar, specimenNo);

        const result = await request.query(sql);
        return result;

    } catch(error) {
        logger.info('[298][patientinfo_diag sendEMRcount]err=' + error.message);
    }
}

exports.setEMRSendCount = (req, res, next) => {
    const specimenNo = req.body.specimenNo.trim();
    const sendEMR    = req.body.sendEMR;  // 전송 횟수

    logger.info('[367][patientinfo_diag sendEMRcount]specimenNo=' + specimenNo);
    logger.info('[367][patientinfo_diag sendEMRcount]sendEMR=' + sendEMR );
    
    const result = setEMRcount(specimenNo, sendEMR);
    result.then(data => {
           console.log(data);
           res.json({message: 'SUCCESS', count: sendEMR});
    })
    .catch( error => {
        logger.info('[376][patientinfo_diag sendEMRcount]err=' + error.message);
    });
}


 

 


