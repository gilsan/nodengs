const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
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
   
    const sql ="select isnull(FLT3ITD, '') FLT3ITD, \
    isnull(accept_date, '') accept_date, \
    isnull(age, '') age, \
    isnull(appoint_doc, '') appoint_doc, \
    isnull(bamFilename, '') bamFilename, \
    case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  \
        then '' \
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate, \
    isnull(dna_rna_ext, '') dna_rna_ext, \
    isnull(examin, '') examin, \
    isnull(gender, '') gender, \
    isnull(id, '') id, \
    isnull(irpath, '') irpath, \
    isnull(key_block, '') key_block, \
    isnull(management, '') management, \
    isnull(msiscore, '') msiscore, \
    isnull(name, '') name, \
    isnull(organ, '') organ, \
    isnull(orpath, '')  orpath, \
    isnull(pathological_dx, '') pathological_dx, \
    isnull(pathology_num, '') pathology_num, \
    isnull(patientID, '') patientID, \
    isnull(prescription_code, '') prescription_code, \
    isnull(prescription_date, '') prescription_date, \
    isnull(prescription_no, '') prescription_no, \
    isnull(recheck, '') recheck, \
    isnull(rel_pathology_num, '') rel_pathology_num, \
    case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  \
        then '' \
        else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date, \
    isnull(screenstatus, '') screenstatus, \
    isnull(sendEMR, '') sendEMR, \
    case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 126 ), '' ) = '1900'  \
        then '' \
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 126 ), '' ) end sendEMRDate, \
    isnull(test_code, '') test_code, \
    case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  \
        then '' \
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 126 ), '' ) end tsvFilteredDate, \
    isnull(tsvFilteredFilename, '') tsvFilteredFilename, \
    isnull(tsvFilteredStatus, '') tsvFilteredStatus, \
    isnull(tsvirfilename, '') tsvirfilename, \
    isnull(tsvorfilename, '') tsvorfilename, \
    isnull(tumor_cell_per, '') tumor_cell_per, \
    isnull(tumor_type, '') tumor_type, \
    isnull(tumorburden, '') tumorburden, \
    isnull(worker, '') worker, isnull(sw_ver, '1') sw_ver \
     from [dbo].[patientinfo_path] \
     where isnull(Research_yn, 'N') = 'N' \
     and  left(prescription_date, 8) = '" + today + "'";
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

// 병리 환자 검색
const messageHandler2 = async (start, end, patientID, pathology_num) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info("[112][patientinfo_path select]start=" + start);
    logger.info("[112][patientinfo_path select]end=" + end);
    
    let sql = `select isnull(FLT3ITD, '') FLT3ITD, 
    isnull(accept_date, '') accept_date, 
    isnull(age, '') age, 
    isnull(appoint_doc, '') appoint_doc, 
    isnull(bamFilename, '') bamFilename, 
    case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate, 
    isnull(dna_rna_ext, '') dna_rna_ext,     isnull(examin, '') examin, 
    isnull(gender, '') gender,     isnull(id, '') id, 
    isnull(irpath, '') irpath,  isnull(key_block, '') key_block, 
    isnull(management, '') management,     isnull(msiscore, '') msiscore, 
    isnull(name, '') name, 
    isnull(organ, '') organ, 
    isnull(orpath, '')  orpath, 
    isnull(pathological_dx, '') pathological_dx, 
    isnull(pathology_num, '') pathology_num, 
    isnull(patientID, '') patientID, 
    isnull(prescription_code, '') prescription_code, 
    isnull(prescription_date, '') prescription_date, 
    isnull(prescription_no, '') prescription_no, 
    isnull(recheck, '') recheck, 
    isnull(rel_pathology_num, '') rel_pathology_num, 
    isnull(img1, '') img1,
    isnull(img2, '') img2,
    isnull(img3, '') img3,
    case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date, 
    isnull(screenstatus, '') screenstatus, 
    isnull(sendEMR, '') sendEMR, 
    case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 126 ), '' ) end sendEMRDate, 
    isnull(test_code, '') test_code, \
    case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 126 ), '' ) end tsvFilteredDate, 
    isnull(tsvFilteredFilename, '') tsvFilteredFilename, 
    isnull(tsvFilteredStatus, '') tsvFilteredStatus, 
    isnull(tsvirfilename, '') tsvirfilename, 
    isnull(tsvorfilename, '') tsvorfilename, 
    isnull(tumor_cell_per, '') tumor_cell_per, 
    isnull(tumor_type, '') tumor_type, 
    isnull(tumorburden, '') tumorburden, 
    isnull(worker, '') worker, isnull(sw_ver, '1') sw_ver  from [dbo].[patientinfo_path] 
               where isnull(Research_yn, 'N') = 'N' 
               and left(prescription_date, 8) >= '` + start + `' 
               and left(prescription_date, 8) <= '` + end + "' ";
    
    sql = sql + ` and prescription_code  not in ('PMO11007',	'PMO11017',	'PMO11019',
                        'PMO11020',	'PMO11042',	'PMO12054',	
                        'PMO12057',	'PMO12059',	'PMO12060', 
                        'PMO12071',	'PMO12098') `;

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

    sql = sql + " order by prescription_date desc, pathology_num desc ";
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

// 병리 Sequencing 환자 검색
const messageSeqHandler2 = async (start, end, patientID, pathology_num) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info("[293][messageSeqHandler2 select]start=" + start);
    logger.info("[293][messageSeqHandler2 select]end=" + end);
    
    let sql = `select isnull(FLT3ITD, '') FLT3ITD, 
    isnull(accept_date, '') accept_date, 
    isnull(age, '') age, 
    isnull(appoint_doc, '') appoint_doc, 
    isnull(bamFilename, '') bamFilename, 
    case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate, 
    isnull(dna_rna_ext, '') dna_rna_ext,     isnull(examin, '') examin, 
    isnull(gender, '') gender,     isnull(id, '') id, 
    isnull(irpath, '') irpath,  isnull(key_block, '') key_block, 
    isnull(management, '') management,     isnull(msiscore, '') msiscore, 
    isnull(name, '') name, 
    isnull(organ, '') organ, 
    isnull(orpath, '')  orpath, 
    isnull(pathological_dx, '') pathological_dx, 
    isnull(pathology_num, '') pathology_num, 
    isnull(patientID, '') patientID, 
    isnull(prescription_code, '') prescription_code, 
    isnull(prescription_date, '') prescription_date, 
    isnull(prescription_no, '') prescription_no, 
    isnull(recheck, '') recheck, 
    isnull(rel_pathology_num, '') rel_pathology_num, 
    isnull(img1, '') img1,
    isnull(img2, '') img2,
    isnull(img3, '') img3,
    case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date, 
    isnull(screenstatus, '') screenstatus, 
    isnull(sendEMR, '') sendEMR, 
    case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 126 ), '' ) end sendEMRDate, 
    isnull(test_code, '') test_code, \
    case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 126 ), '' ) end tsvFilteredDate, 
    isnull(tsvFilteredFilename, '') tsvFilteredFilename, 
    isnull(tsvFilteredStatus, '') tsvFilteredStatus, 
    isnull(tsvirfilename, '') tsvirfilename, 
    isnull(tsvorfilename, '') tsvorfilename, 
    isnull(tumor_cell_per, '') tumor_cell_per, 
    isnull(tumor_type, '') tumor_type, 
    isnull(tumorburden, '') tumorburden, 
    isnull(worker, '') worker, isnull(sw_ver, '1') sw_ver  from [dbo].[patientinfo_path] 
               where isnull(Research_yn, 'N') = 'N' 
               and left(prescription_date, 8) >= '` + start + `' 
               and left(prescription_date, 8) <= '` + end + "' ";

    sql = sql + `and prescription_code  in ('PMO11007',	'PMO11017',	'PMO11019',
                        'PMO11020',	'PMO11042',	'PMO12054',	
                        'PMO12057',	'PMO12059',	'PMO12060', 
                        'PMO12071',	'PMO12098') `;

    let patient =  nvl(patientID, "");
    let pathology =  nvl(pathology_num, "");

    logger.info("[349][messageSeqHandler2 select]patient=" + patient);
    logger.info("[349][messageSeqHandler2 select]pathology=" + pathology);
    
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

    sql = sql + " order by prescription_date desc, pathology_num desc ";
    logger.info("[365][messageSeqHandler2 select]sql=" + sql);
        
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
        logger.error("[374][messageSeqHandler2 select]err=" + error.message);
    }
}

exports.getPatientPathSeqLists = (req, res,next) => {

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

   const result = messageSeqHandler2(start, end, patientID, pathology_num);
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

// 검체로 환자정보 알아오기
const getPatientInfo = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created
    
    let sql = `select isnull(FLT3ITD, '') FLT3ITD, 
    isnull(accept_date, '') accept_date, 
    isnull(age, '') age, 
    isnull(appoint_doc, '') appoint_doc, 
    isnull(bamFilename, '') bamFilename, 
    case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate, 
    isnull(dna_rna_ext, '') dna_rna_ext,     isnull(examin, '') examin, 
    isnull(gender, '') gender,     isnull(id, '') id, 
    isnull(irpath, '') irpath,  isnull(key_block, '') key_block, 
    isnull(management, '') management,     isnull(msiscore, '') msiscore, 
    isnull(name, '') name, 
    isnull(organ, '') organ, 
    isnull(orpath, '')  orpath, 
    isnull(pathological_dx, '') pathological_dx, 
    isnull(pathology_num, '') pathology_num, 
    isnull(patientID, '') patientID, 
    isnull(prescription_code, '') prescription_code, 
    isnull(prescription_date, '') prescription_date, 
    isnull(prescription_no, '') prescription_no, 
    isnull(recheck, '') recheck, 
    isnull(rel_pathology_num, '') rel_pathology_num, 
    case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date, 
    isnull(screenstatus, '') screenstatus, 
    isnull(sendEMR, '') sendEMR, 
    case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 126 ), '' ) end sendEMRDate, 
    isnull(test_code, '') test_code, \
    case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 126 ), '' ) end tsvFilteredDate, 
    isnull(tsvFilteredFilename, '') tsvFilteredFilename, 
    isnull(tsvFilteredStatus, '') tsvFilteredStatus, 
    isnull(tsvirfilename, '') tsvirfilename, 
    isnull(tsvorfilename, '') tsvorfilename, 
    isnull(tumor_cell_per, '') tumor_cell_per, 
    isnull(tumor_type, '') tumor_type, 
    isnull(tumorburden, '') tumorburden, 
    isnull(worker, '') workerr, isnull(sw_ver, '1') sw_ver  from [dbo].[patientinfo_path] 
               where  pathology_num=@pathologyNum 
               and screenstatus != '5'`;

    try {
        const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset[0];
    } catch (error) {
        logger.error("[459][patientinfo_path select]err=" + error.message);
    }
}

exports.getPatientByPathNo = (req, res, next) => {
    let pathologyNum = req.body.pathologyNum.trim();
    const result = getPatientInfo(pathologyNum);
    result.then(data => {
         res.json(data);
    }); 

}

// Testcode로 결과지 타이틀 알아오기
const getReportTestcode = async (prescription_code) => {
    await poolConnect; // ensures that the pool has been created

    let sql = `select 
            isnull(report_title, '') report_title  
                from [dbo].[path_testcode] 
                where  test_code=@prescription_code `;

    try {
        const request = pool.request()
         .input('prescription_code', mssql.VarChar, prescription_code); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset[0];
    } catch (error) {
        logger.error("[459][patientinfo_path select]err=" + error.message);
    }
}

// 2021.11.02
// getReportByTestcode
exports.getReportByTestcode = (req, res, next) => {
    let prescription_code = req.body.prescription_code.trim();
    const result = getReportTestcode(prescription_code);
    result.then(data => {
         res.json(data);
    }); 

}