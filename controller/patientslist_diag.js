const express = require('express');
const router = express.Router();
const mssql = require('mssql');
//const config = require('./config.js');
const logger = require('../common/winston');
const fs = require('fs');

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
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }
        
    return st ;
}

////////////////////////////////////////////////////////////
// 2021.04.15 진검 환자 검색
const getPatientDiagHandler = async (specimenNo) => {
    logger.info('[86][screenList][find patient]specimenNo=' + specimenNo);
    const sql =`select isnull(name, '') name  ,isnull(patientID, '') patientID 
                ,isnull(age,  '') age ,isnull(gender, '') gender 
                ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion 
                ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease 
                ,isnull(method, '') method ,isnull(specimen, '') specimen 
                ,case when IsNULL( gbn, '' ) = ''  
                    then isnull(request, '')
                    when IsNULL( gbn, '' ) = 'cmc'
                    then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') 
                    when IsNULL( gbn, '' ) = '인터넷'
                    then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') + '/' + isnull(path_comment, '') 
                    else isnull(request, '') end request 
                ,isnull(appoint_doc, '')  appoint_doc 
                ,isnull(worker, '') worker 
                ,isnull(prescription_no, '') prescription_no  ,isnull(prescription_date, '') prescription_date 
                ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code 
                ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion 
                ,isnull(tsvFilteredFilename, '') tsvFilteredFilename 
                ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
                    then '' 
                    else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate 
                ,isnull(tsvFilteredStatus, '') tsvFilteredStatus 
                ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
                    then '' 
                    else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate 
                ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR 
                ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  
                    then '' 
                    else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate 
                ,case when IsNULL( left(report_date, 4 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), cast(CAST(accept_date as CHAR(8)) as datetime), 102 ), '' ) end accept_date 
                ,isnull(test_code, '') test_code  
                ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected 
                ,case when IsNULL( CONVERT(VARCHAR(4), report_date, 102 ), '' ) = '1900'  
                    then '' 
                    else IsNULL( CONVERT(VARCHAR(10), report_date, 102 ), '' ) end  report_date 
                ,isnull(examin, '') examin, isnull(recheck, '') recheck 
                ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest  
                , isnull(vusmsg, '')  vusmsg, isnull(ver_file, '5.10') verfile  
                , isnull(genetic1, '') genetic1, isnull(genetic2, '') genetic2, isnull(genetic3, '') genetic3, isnull(genetic4, '') genetic4
                , isnull(report_title, '') reportTitle
                , isnull(req_pathologist, '') req_pathologist ,isnull(req_department, '') req_department ,isnull(req_instnm, '') req_instnm
                , isnull(path_comment, '') path_comment ,isnull(gbn, '') gbn
                from [dbo].[patientinfo_diag] where specimenNo=@specimenNo `;
    logger.info('[118][screenList][find patient]sql=' + sql);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
        console.dir( result);
        
        return result.recordset[0];
    } catch (error) {
      logger.error('[128][screenList][find patient]err=' + error.message);
    }
  
}

// 진검 오늘 환자 검색
// 2021.01.29 prescription_date -> accept_date 조회 조건 변경
const  messageHandler = async (today) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info('[82][patientinfo_diag list]today=' + today);

    const sql =`select isnull(name, '') name  ,isnull(patientID, '') patientID 
    ,isnull(age,  '') age ,isnull(gender, '') gender 
    ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion 
    ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease 
    ,isnull(method, '') method ,isnull(specimen, '') specimen 
    ,case when IsNULL( gbn, '' ) = ''  
        then isnull(request, '')
        when IsNULL( gbn, '' ) = 'cmc'
        then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') 
        when IsNULL( gbn, '' ) = '인터넷'
        then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') + '/' + isnull(path_comment, '') 
        else isnull(request, '') end request, isnull(appoint_doc, '')  appoint_doc 
    ,isnull(worker, '') worker 
    ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date 
    ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code 
    ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion 
    ,isnull(tsvFilteredFilename, '') tsvFilteredFilename 
    ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate 
    ,isnull(tsvFilteredStatus, '') tsvFilteredStatus 
    ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate 
    ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR 
    ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate 
    ,case when IsNULL( left(report_date, 4 ), '' )  = '1900'  
    then '' 
    else IsNULL( CONVERT(VARCHAR(4), cast(CAST(accept_date as CHAR(8)) as datetime), 102  ), '' ) end accept_date 
    ,isnull(test_code, '') test_code  
    ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected 
    ,case when IsNULL( CONVERT(VARCHAR(4), report_date, 102 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), report_date, 102 ), '' ) end  report_date 
    ,isnull(examin, '') examin, isnull(recheck, '') recheck 
    ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest  
    , isnull(vusmsg, '')  vusmsg, isnull(ver_file, '5.10') verfile 
    , isnull(genetic1, '') genetic1, isnull(genetic2, '') genetic2, isnull(genetic3, '') genetic3, isnull(genetic4, '') genetic4
    , isnull(report_title, '') reportTitle
    , isnull(req_pathologist, '') req_pathologist ,isnull(req_department, '') req_department ,isnull(req_instnm, '') req_instnm
    , isnull(path_comment, '') path_comment ,isnull(gbn, '') gbn
    from [dbo].[patientinfo_diag] where left(accept_date, 8) = '` + today + "'";
    logger.info('[102][patientinfo_diag list]sql=' + sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result.recordset);
        
        return result.recordset;
    } catch (error) {
        logger.error('[110][patientinfo_diag list]err=' + error.message);
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
        logger.error('[126][patientinfo_diag list]err=' + error.message);
        res.sendStatus(500)
    }); 
}

// 진검 환자 검색
// 2021.01.29 prescription_date -> accept_date 조회 조건 변경
const  messageHandler2 = async (start, end, patientID, specimenNo, sheet, status, research) => {
    await poolConnect; // ensures that the pool has been created
   
  logger.info('[196][patientinfo_diag list]qry start=' + start + ' ' + end + ' ' +  patientID + ' ' + specimenNo + ' '  + sheet + ' ' +  status + ' ' + research);

    let patient =  nvl(patientID, "");
    console.log('patient 0');
    let specimen_no =  nvl(specimenNo, "");
    let sheet_1 =  nvl(sheet, "");
    let status_1 =  nvl(status, "");
    let research1 = nvl(research, "");

    logger.info("sheet_1="+sheet_1);
    logger.info("status_1="+status_1);
 
    let sql = `select isnull(name, '') name  ,isnull(patientID, '') patientID 
            ,isnull(age,  '') age ,isnull(gender, '') gender 
            ,a.specimenNo
        ,case when a.screenstatus = '3' then  isnull(b.[IKZK1Deletion], '') else isnull(a.[IKZK1Deletion], '') end IKZK1Deletion
        ,case when a.screenstatus = '3' then  isnull(b.FLT3ITD, '') else isnull(a.FLT3ITD, '') end FLT3ITD
        ,case when a.screenstatus = '3' then  isnull(b.[chromosomalanalysis], '') else isnull(a.[chromosomalanalysis], '') end chromosomalanalysis
        ,case when a.screenstatus = '3' then  isnull(b.[leukemiaassociatedfusion], '') else isnull(a.[leukemiaassociatedfusion], '') end leukemiaassociatedfusion
        ,case when a.screenstatus = '3' then  isnull(b.[diagnosis], '') else isnull(a.[diagnosis], '') end diagnosis
        ,case when a.screenstatus = '3' then  isnull(b.[genetictest], '') else isnull(a.[genetictest], '') end genetictest
        ,case when a.screenstatus = '3' then  isnull(b.[bonemarrow], '') else isnull(a.[bonemarrow], '') end bonemarrow
            ,isnull(targetDisease, '') targetDisease 
            ,isnull(method, '') method ,isnull(a.specimen, '') specimen 
            ,case when IsNULL( gbn, '' ) = ''  
                then isnull(request, '')
                when IsNULL( gbn, '' ) = 'cmc'
                then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') 
                when IsNULL( gbn, '' ) = '인터넷'
                then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') + '/' + isnull(path_comment, '') 
                else isnull(request, '') end request 
            , isnull(appoint_doc, '')  appoint_doc 
            ,isnull(worker, '') worker 
            ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date 
            ,isnull(prescription_code, '')  prescription_code 
            ,isnull(testednum, '') testednum 
            ,isnull(tsvFilteredFilename, '') tsvFilteredFilename 
            ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate 
            ,isnull(tsvFilteredStatus, '') tsvFilteredStatus 
            ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate 
            ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR 
            ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate 
            ,case when IsNULL( left(accept_date, 4 ), '' ) = '1900'  
            then '' 
            else IsNULL( CONVERT(VARCHAR(10), cast(CAST(accept_date as CHAR(8)) as datetime), 102 ), '' ) end accept_date 
            , accept_date accept_date2 
            ,isnull(test_code, '') test_code  
            ,isnull(a.screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected 
            ,case when IsNULL( CONVERT(VARCHAR(4), a.report_date, 102 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), a.report_date, 102 ), '' ) end  report_date 
            ,isnull(examin, '') examin, isnull(recheck, '') recheck 
            , isnull(vusmsg, '') vusmsg, isnull(ver_file, '5.10') verfile  
            , isnull(genetic1, '') genetic1, isnull(genetic2, '') genetic2, isnull(genetic3, '') genetic3, isnull(genetic4, '') genetic4
            , isnull(report_title, '') reportTitle
            , isnull(req_pathologist, '') req_pathologist ,isnull(req_department, '') req_department ,isnull(req_instnm, '') req_instnm
            , isnull(path_comment, '') path_comment ,isnull(gbn, '') gbn
            from [dbo].[patientinfo_diag] a
            left outer join dbo.report_patientsInfo b
            on a.specimenNo = b.specimenNo
            where left(accept_date, 8) >= '` + start + "'" 
             + " and left(accept_date, 8) <= '" + end + "'"; 
 
    if(patient.length > 0 )
    {
        sql = sql +  " and patientID = '" +  patient + "'";
    }

    if(specimen_no.length > 0 )
    {
        sql = sql +  " and specimenNo = '" +  specimen_no + "'";
    }

    if(sheet_1.length > 0 )
    {
        if (sheet_1 == 'AMLALL') {
            sql = sql +  " and test_code in ('LPE471','LPE472', 'LPE545')";
        } else if (sheet_1 == 'MDS') {  // MDS/MPN 
            sql = sql +  " and test_code in ('LPE473')";
        } else if (sheet_1 == 'lymphoma') {  // 악성림프종
            sql = sql +  " and test_code in ('LPE474', 'LPE475')";
        } else if (sheet_1 == 'genetic') {  // 유전성유전질환
            sql = sql +   ` and test_code in ('LPE548', 'LPE439', 'LPE452', 'LPE453', 'LPE454', 'LPE455', 
                                    'LPE456', 'LPE488', 'LPE489', 'LPE490', 'LPE497', 'LPE498', 'LPE499',
                                    'LPE517', 'LPE518', 'LPE519', 'LPE520', 'LPE521', 'LPE522', 'LPE523',
                                    'LPE524', 'LPE525', 'LPE526', 'LPE527', 'LPE528', 'LPE529', 'LPE530',
                                    'LPE531', 'LPE532', 'LPE533', 'LPE534', 'LPE535', 'LPE536', 'LPE537',
                                    'LPE538', 'LPE539', 'LPE540', 'LPE541', 'LPE542', 'LPE543')`;
        } else if (sheet_1 == 'Sequencing') {  // Sequencing
            sql = sql +   ` and test_code in ('LPC100', 'LPC101', 'LPC117', 'LPC118',   'LPE115', 'LPE141', 'LPE156',   'LPE221',
            'LPE227', 'LPE229', 'LPE231', 'LPE233', 'LPE236', 'LPE237', 'LPE238', 'LPE241', 'LPE243', 'LPE245',
            'LPE247', 'LPE249', 'LPE251', 'LPE258', 'LPE262',  'LPE272', 'LPE275', 'LPE276', 'LPE280',
            'LPE282', 'LPE285', 'LPE287',  'LPE295', 'LPE302', 'LPE306', 'LPE308', 'LPE310',
            'LPE313', 'LPE314', 'LPE316', 'LPE320', 'LPE334', 'LPE337', 'LPE340', 'LPE341', 'LPE342', 'LPE343',
            'LPE349', 'LPE352', 'LPE354', 'LPE356', 'LPE358', 'LPE360', 'LPE362', 'LPE364', 'LPE366', 'LPE371',
            'LPE374', 'LPE375', 'LPE378', 'LPE379', 'LPE384', 'LPE391', 'LPE392', 'LPE368',  'LPE412',
            'LPE414', 'LPE418', 'LPE420', 'LPE428', 'LPE431', 'LPE433', 'LPE436', 'LPE457', 'LPE460', 'LPE462',
            'LPE469', 'LPE477', 'LPE481', 'LPE482', 'LPE494', 'LPE495', 'LPE330', 'LPE438') `
        } else if (sheet_1 == 'MLPA') {  // MLPA
            sql = sql +  ` and test_code in ('LPE232', 'LPE294', 'LPE322', 'LPE332', 'LPE351', 'LPE369', 
                                    'LPE377', 'LPE464')`;
        } else {
            sql = sql +  ` and test_code = '` + sheet_1 + `'`;
        }
             
    }

    if(status_1.length == 1 )
    {
        sql = sql +  " and a.screenstatus = '" +  status_1 + "'";
    } else if (status_1.length === 2) {
        sql = sql +  " and isnull(a.screenstatus, '') = ''";
    } 

    if (research1.length > 0) {
        if (research === 'RESEARCH') {
            sql = sql +  " and a.gbn = 'RESEARCH'";
        } else {
            sql = sql +  " and a.gbn = ''";
        }
    }
    //sql = sql + " order by accept_date desc, specimenNo desc   ";
    sql = sql + " order by accept_date2 asc  ";

    logger.info("[301][patientinfo_diag list]sql="+sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
        console.log( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[310][patientinfo_diag list]SQL error'+ err.message);
    }
}



// 2021.09.22
// 진검 mutation gene coding count 검색
const  counterHandler = async (gene, coding) => {
    await poolConnect; // ensures that the pool has been created
   
  logger.info('[324][patientinfo_diag mutation cnt]qry gene=' + gene + ', coding=' + coding );

    let gene2 =  nvl(gene, "");
    let coding2 =  nvl(coding, "");
 
    let sql = `SELECT count (1) cnt
        FROM [ngs_data].[dbo].[report_detected_variants]
        where [type] = 'M'
        and  [gene] = @gene
        and [nucleotide_change] = @coding`

    logger.info("[335][patientinfo_diag mutation cnt]sql="+sql);
    
    try {
        const request = pool.request()
        .input('gene', mssql.NVarChar, gene2)
        .input('coding', mssql.VarChar, coding2);

        const result = await request.query(sql);
       // console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[346][patientinfo_diag mutation cnt]SQL error'+ err.message);
    }
}

exports.count = (req,res, next) => {
    logger.info('[351] patientinfo_diag mutation cnt -' + JSON.stringify(req.body));

    const gene = req.body.gene;
    const coding= req.body.coding; 
    const result = counterHandler(gene, coding);
    result.then(data => {
        res.json(data[0]);
    })
    .catch( error => {
        logger.error('[360] patientinfo_diag mutation cnt  err=' + error.message);
        res.sendStatus(500);
    });     
}

// diag 날자별 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagLists = (req, res,next) => {

    logger.info('data=' + JSON.stringify( req.body));
    //console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID.trim(); // 환자 id
   let specimenNo   =  req.body.specimenNo.trim(); // 검채 번호
   let status   =  req.body.status; // 상태
   let sheet   =  req.body.sheet; // 결과지
   let research = req.body.research; // 연구용

   console.log('[218][patientslist_diag][getPatientDiagLists] 검색', start,end, patientID, specimenNo, sheet, status, research);
   logger.info('[218][patientslist_diag][getPatientDiagLists] 검색' + start + ", " + end + ", " + patientID + ", " +  specimenNo + ", " + sheet + ", " + status + ", research" + research);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
   result.then(data => {
 
      res.json(data);

      res.end();
   })
   .catch( err => {
      logger.error('[310][patientinfo_diag list]SQL error'+ err.message);
      res.sendStatus(500);
    }); 
}

// diag 날자별 AML/ALL 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsAml = (req, res,next) => {

   logger.info('[355][patientslist_diag][getPatientDiagListsAml] data=' + JSON.stringify( req.body));
    //console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID; // 환자 id
   let specimenNo   =  req.body.specimenNo; // 검채 번호
   let status   =  req.body.status; // 상태
   let sheet   =  nvl(req.body.sheet, 'AMLALL'); // 결과지
   let research = req.body.research; // 연구용

   console.log('[361][patientslist_diag][getPatientDiagListsAml] 검색', start,end, patientID, specimenNo, sheet, status);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
   result.then(data => {

      res.json(data);

      res.end();
   })
   .catch( err  => {
    logger.error('[385][patientinfo_diag][getPatientDiagListsAml]SQL error'+ err.message);
    res.sendStatus(500);
  }); 
}

// diag 날자별 MDS/MPN 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsMdsMlpn = (req, res,next) => {

   logger.info('[355][patientslist_diag][getPatientDiagListsMdsMlpn] data=' + JSON.stringify( req.body));
    //console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID; // 환자 id
   let specimenNo   =  req.body.specimenNo; // 검채 번호
   let status   =  req.body.status; // 상태
   let sheet   =  nvl(req.body.sheet, 'MDS'); // 결과지
   let research = req.body.research; // 연구용

   console.log('[361][patientslist_diag][getPatientDiagListsMdsMlpn] 검색', start,end, patientID, specimenNo, sheet, status, research);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
   result.then(data => {

      res.json(data);

      res.end();
   })
   .catch( err  => {
    logger.error('[385][patientinfo_diag][getPatientDiagListsMdsMlpn]SQL error'+ err.message);
    res.sendStatus(500);
  }); 
}

// diag 날자별 악성림프종 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsLymphoma = (req, res,next) => {

   logger.info('[431][patientslist_diag][getPatientDiagListsLymphoma] data=' + JSON.stringify( req.body));
    //console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID; // 환자 id
   let specimenNo   =  req.body.specimenNo; // 검채 번호
   let status   =  req.body.status; // 상태
   let sheet   =  nvl(req.body.sheet, 'lymphoma'); // 결과지
   let research = req.body.research; // 연구용

   console.log('[440][patientslist_diag][getPatientDiagListsLymphoma] 검색', start,end, patientID, specimenNo, sheet, status);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
   result.then(data => {

      res.json(data);

      res.end();
   })
   .catch( err  => {
    logger.error('[461][patientinfo_diag][getPatientDiagListsLymphoma]SQL error'+ err.message);
    res.sendStatus(500);
  }); 
}

// diag 날자별 유전성유전질환 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsGenetic = (req, res,next) => {

   logger.info('[431][patientslist_diag][getPatientDiagListsGenetic] data=' + JSON.stringify( req.body));
    //console.log(req);
   let start =  req.body.start; //.replace("-", "");
   let end   =  req.body.end; //.replace("-", "");
   let patientID   =  req.body.patientID; // 환자 id
   let specimenNo   =  req.body.specimenNo; // 검채 번호
   let status   =  req.body.status; // 상태
   let sheet   =  nvl(req.body.sheet, 'genetic'); // 결과지
   let research = req.body.research; // 연구용

   console.log('[440][patientslist_diag][getPatientDiagListsGenetic] 검색', start,end, patientID, specimenNo, sheet, status);
   
   const  now = new Date();
   const today = getFormatDate2(now);

   const nowTime = new Date().getTime();
   const requestTime = getFormatDate3(end).getTime();

   if (requestTime > nowTime) {
	   end = today; // .replace("-", "");
       console.log('end=', end);
   }

   const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
   result.then(data => {

      res.json(data);

      res.end();
   })
   .catch( err  => {
    logger.error('[461][patientinfo_diag][getPatientDiagListsGenetic]SQL error'+ err.message);
    res.sendStatus(500);
  }); 
}

// diag 날자별 Sequencing 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsSequencing = (req, res,next) => {

    logger.info('[509][patientslist_diag][getPatientDiagListsSequencing] data=' + JSON.stringify( req.body));
     //console.log(req);
    let start =  req.body.start; //.replace("-", "");
    let end   =  req.body.end; //.replace("-", "");
    let patientID   =  req.body.patientID; // 환자 id
    let specimenNo   =  req.body.specimenNo; // 검채 번호
    let status   =  req.body.status; // 상태
    let sheet   =  nvl(req.body.sheet, 'Sequencing'); // 결과지
    let research = req.body.research; // 연구용
 
    console.log('[518][patientslist_diag][getPatientDiagListsSequencing] 검색', start,end, patientID, specimenNo, sheet, status);
    
    const  now = new Date();
    const today = getFormatDate2(now);
 
    const nowTime = new Date().getTime();
    const requestTime = getFormatDate3(end).getTime();
 
    if (requestTime > nowTime) {
        end = today; // .replace("-", "");
        console.log('end=', end);
    }
 
    const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
    result.then(data => {
       
       res.json(data);
 
       res.end();
    })
    .catch( err  => {
     logger.error('[539][patientinfo_diag][getPatientDiagListsSequencing]SQL error'+ err.message);
     res.sendStatus(500);
   }); 
}

// diag 날자별 MLPA 환자ID, 검사ID 로 검사자 조회  
exports.getPatientDiagListsMlpa = (req, res,next) => {

    logger.info('[545][patientslist_diag][getPatientDiagListsMlpa] data=' + JSON.stringify( req.body));
     //console.log(req);
    let start =  req.body.start; //.replace("-", "");
    let end   =  req.body.end; //.replace("-", "");
    let patientID   =  req.body.patientID; // 환자 id
    let specimenNo   =  req.body.specimenNo; // 검채 번호
    let status   =  req.body.status; // 상태
    let sheet   =  nvl(req.body.sheet, 'MLPA'); // 결과지
    let research = req.body.research; // 연구용
 
    console.log('[545][patientslist_diag][getPatientDiagListsMlpa] 검색', start,end, patientID, specimenNo, sheet, status);
    
    const  now = new Date();
    const today = getFormatDate2(now);
 
    const nowTime = new Date().getTime();
    const requestTime = getFormatDate3(end).getTime();
 
    if (requestTime > nowTime) {
        end = today; // .replace("-", "");
        console.log('end=', end);
    }
 
    const result = messageHandler2(start, end, patientID, specimenNo, sheet, status, research);
    result.then(data => {
 
       res.json(data);
 
       res.end();
    })
    .catch( err  => {
     logger.error('[539][patientinfo_diag][getPatientDiagListsMlpa]SQL error'+ err.message);
     res.sendStatus(500);
   }); 
}

/**
 * @param 검체자 검사자 기록
 * @param {*} res 
 * @param {*} next 
 */
const changeExaminer = async (specimenNo, part, name) => {
    logger.info('[249][patientinfo_diag updateExaminer]specimenNo=' + specimenNo);
    logger.info('[250][patientinfo_diag updateExaminer]part=' + part);
    logger.info('[251][patientinfo_diag updateExaminer]name=' + name);

    let sql;
    if ( part === 'exam') {
        sql =`update patientInfo_diag set examin=@name where specimenNo=@specimenNo`;
    } else if (part === 'recheck') {
        sql =`update patientInfo_diag set recheck=@name where specimenNo=@specimenNo`;
    }

    logger.info('[260][patientinfo_diag updateExaminer]sql=' + sql);

    try {
        const request = pool.request()
        .input('name', mssql.NVarChar, name)
        .input('specimenNo', mssql.VarChar, specimenNo);
        
        const result = await request.query(sql);       
        return result;
    } catch (error) {
        logger.error('[270][patientinfo_diag updateExaminer]err=' + error.message);
    }    
}

exports.updateExaminer = (req, res, next) => {
    let specimenNo   =  req.body.specimenNo.trim(); 
    let part =  req.body.part;  
    let name   =  req.body.name; 
    console.log('[669][updateExaminer] ===> ', specimenNo, part, name);
    const result = changeExaminer(specimenNo, part, name);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[283][patientinfo_diag updateExaminer]err=' + error.message);
    });
}

const messageHandlerStat_diag = async (specimenNo, userid, type ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[295][patientinfo_diag stat_log] specimenNo=" + specimenNo);
	logger.info("[295][patientinfo_diag stat_log] userid=" + userid);
	logger.info("[295][patientinfo_diag stat_log] type=" + type);

	//select Query 생성
	let sql2 = "insert_stat_log_diag";

	logger.info("[300][patientinfo_diag stat_log] sql=" + sql2);

	try {
		const request = pool.request()
			.input('specimenNo', mssql.VarChar(300), specimenNo)
			.input('userId', mssql.VarChar(30), userid)
			.input('type', mssql.VarChar(100), type)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultSt;
		await request.execute(sql2, (err, recordset, returnValue) => {
			if (err)
			{
				logger.error("[313][patientinfo_diag  stat_log]err message=" + err.message);
			}

			logger.info("[313][patientinfo_diag  stat_log]recordset=" + recordset);
			logger.info("[313][patientinfo_diag  stat_log]returnValue=" + returnValue);

			resultSt = returnValue;
			logger.info("[313][patientinfo_diag stat_log]resultSt=" + JSON.stringify(resultSt));
		});
		
		return resultSt;
	} catch (err) {
		logger.error('[342][patientinfo_diag  stat_log]SQL error=' + JSON.stringify(err));
	} // try end
}



// 진검 "수정" 버튼 누르면 screenstatus 상태를 변경
const resetscreenstatus = async (specimenNo, seq, userid, type) =>{
    await poolConnect; // ensures that the pool has been created

    logger.info('[291][patientinfo_diag resetscreenstatus]specimenNo=' + specimenNo);
    logger.info('[292][patientinfo_diag resetscreenstatus]seq=' + seq);
    let sql =`update patientInfo_diag set screenstatus=@seq where specimenNo=@specimenNo`;
    logger.info('[294][patientinfo_diag resetscreenstatus]sql=' + sql);
    
    try {

        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql); 
      
    } catch(error) {
        logger.error('[304][patientinfo_diag resetscreenstatus]err=' + error.message);
    }

    
    let prescription_no = '';
    let prescription_date = '';
    let test_code = '';
    let specimen = '';

    // 2021.04.15 진검 cdw file copy
    const result_path = getPatientDiagHandler(specimenNo);
    result_path.then(data => {
        //res.json(data);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]data=' + JSON.stringify(data));

        logger.info('[patientinfo_diag][304][getPatientDiagHandler]prescription_no=' + data.prescription_no);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]prescription_date=' + data.prescription_date);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]test_code=' + data.test_code);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]specimen=' + data.specimen);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]path=' + data.path);
        logger.info('[patientinfo_diag][304][getPatientDiagHandler]file=' + data.tsvFilteredFilename);

        prescription_no  = data.prescription_no;
        prescription_date  = data.prescription_date;
        test_code  = data.test_code;
        specimen  = data.specimen;

        let file_names = '';
        file_names = data.tsvFilteredFilename.toLowerCase(); 
        let xlsx = file_names.indexOf('xlsx');
        let tsv = file_names.indexOf('tsv');
        let txt = file_names.indexOf('txt');
        let ngs_path_a = '';
        let ngs_path = '';
        let ngs_file = '';
        let cdw_path = 'C:\\NGS_LAB\\' ;
        let cdw_file = '';

        logger.info('[770][patientinfo_diag]tsvFilteredFilename=' + data.tsvFilteredFilename);
        logger.info('[770][patientinfo_diag]xlsx=' + xlsx);
        logger.info('[770][patientinfo_diag]tsv=' + tsv);
        logger.info('[770][patientinfo_diag]txt=' + txt);

        if ( tsv > 0) {

            ngs_path_a = data.path.split('/') ;
        
            ngs_path = './' + ngs_path_a[0] + '_success/' + ngs_path_a[1] + '/' + ngs_path_a[2] + '/' + ngs_path_a[3] ;
            ngs_file = ngs_path + '/' + data.tsvFilteredFilename;
            logger.info('[patientinfo_diag][786][getPatientDiagHandler]ngs_file=' + ngs_file);
    
            cdw_file = cdw_path + '012_' + prescription_no + '_' 
                   + prescription_date + '_' 
                   + test_code + '_' 
                   + specimen + '_' 
                   + specimenNo + '.tsv'
            logger.info('[patientinfo_diag][793][getPatientDiagHandler]file=' + cdw_file);
        
            // destination will be created or overwritten by default.
            fs.copyFile(ngs_file, cdw_file, (err) => {
            if (err) logger.error('[797][patientinfo_diag getPatientDiagHandler]err=' + err.message);
                logger.info('[patientinfo_diag][798]File was copied to destination');
            });  
        }
        else if ( xlsx > 0) {

            
          
        }
        else if ( txt > 0) {
                
            ngs_path_a = data.path.split('/') ;
            
            ngs_path = './' + ngs_path_a[0] + '/' + ngs_path_a[1] + '/' + ngs_path_a[2] + '/' + ngs_path_a[3] ;
            ngs_file = ngs_path + '/' + data.tsvFilteredFilename;
            logger.info('[patientinfo_diag][812][resetscreenstatus]ngs_file=' + ngs_file);

            cdw_file = cdw_path + '012_' + prescription_no + '_' 
                + prescription_date + '_' 
                + test_code + '_' 
                + specimen + '_' 
                + specimenNo + '.txt'
            logger.info('[patientinfo_diag][819][resetscreenstatus]file=' + cdw_file);
        
            // destination will be created or overwritten by default.
            fs.copyFile(ngs_file, cdw_file, (err) => {
            if (err) logger.error('[823][patientinfo_diag getPatientDiagHandler]err=' + err.message);
            logger.info('[patientinfo_diag][824]File was copied to destination');
            });  
        
        }
    });
   
    const resultLog = messageHandlerStat_diag(specimenNo, userid, type);
    logger.info('[patientinfo_diag][350][patientinfo_diag resetScreen]result=' + resultLog); 
        //  res.json({message: 'SUCCESS'});
          
    return resultLog;        
}

// screenstatus 변경
exports.resetScreenStatus = (req, res, next) => {

    logger.info('[366][patientinfo_diag resetScreen]data=' + JSON.stringify(req.body));
    
    let specimenNo = req.body.specimenNo.trim();
    let num        = req.body.num;
    //let userid     = req.body.userid;

    //const userid = req.body.userid;
    let userinfo = JSON.parse(req.body.userid); 
  
    let userid = userinfo.userid; 
    //  const pw= userinfo.pwd; 
    let type     = req.body.type;
    logger.info('[372][patientinfo_diag resetScreen]specimenNo=' + specimenNo);
    logger.info('[373][patientinfo_diag resetScreen]num=' + num);
    logger.info('[373][patientinfo_diag resetScreen]userid=' + userid);
    logger.info('[373][patientinfo_diag resetScreen]type=' + type);

    const result = resetscreenstatus(specimenNo, num, userid, type);
    result.then(data => {

        
         res.json({message: "SUCCESS"});
    })
    .catch( error => {
        logger.error('[380][patientinfo_diag resetScreen]err=' + error.message);
    })
}

//진검의 screenstatus 상태 알애내기
const getscreenstatus = async (specimenNo) =>{
    await poolConnect; // ensures that the pool has been created
    logger.info('[327][patientinfo_diag getScreen]specimenNo=' + specimenNo);
    let sql =`select screenstatus from patientInfo_diag where specimenNo=@specimenNo`;
    logger.info('[329][patientinfo_diag getScreen]sql=' + sql);
    try {
        const request = pool.request()
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql);       
        return result.recordset;             
    } catch(error) {
        logger.error('[336][patientinfo_diag getScreen]err=' + error.message);
    }
}

exports.getScreenStatus = (req, res, next) => {
    let specimenNo = req.body.specimenNo.trim();
    logger.info('[342][patientinfo_diag getScreen]specimenNo=' + specimenNo);
    const result = getscreenstatus(specimenNo);
    result.then(data => {
      //  console.log('[345][검색결과][]', data);
         res.json(data);
    })
    .catch( error => {
        logger.error('[349][patientinfo_diag getScreen]err=' + error.message);
    });
}

// EMR로 보낸 전송 횟수 기록
const setEMRcount = async (specimenNo, sendEMR) => {
    await poolConnect; // ensures that the pool has been created
    let sql;
    logger.info('[357][patientinfo_diag sendEMRcount]specimenNo=' + specimenNo);
    logger.info('[358][patientinfo_diag sendEMRcount]sendEMR=' + sendEMR );
    if ( Number(sendEMR) === 1 ) {  // 검사보고일
        sql =`update patientInfo_diag set sendEMR=@sendEMR , sendEMRDate=getdate() where specimenNo=@specimenNo`;
    } else if (Number(sendEMR) > 1 ) {  // 수정 보고일
        sql =`update patientInfo_diag set sendEMR=@sendEMR , report_date=getdate() where specimenNo=@specimenNo`;
    }  else {
        sql =`update patientInfo_diag set sendEMR=@sendEMR   where specimenNo=@specimenNo`;
    }
    logger.info('[366][patientinfo_diag sendEMrcount]sql=' + sql);

    try {
        const request = pool.request()
        .input('sendEMR', mssql.VarChar, sendEMR)
        .input('specimenNo', mssql.VarChar, specimenNo);

        const result = await request.query(sql);
        return result;

    } catch(error) {
        logger.error('[377][patientinfo_diag sendEMRcount]err=' + error.message);
    }
}

exports.setEMRSendCount = (req, res, next) => {
    const specimenNo = req.body.specimenNo.trim();
    const sendEMR    = req.body.sendEMR;  // 전송 횟수

    logger.info('[385][patientinfo_diag sendEMRcount]specimenNo=' + specimenNo);
    logger.info('[386][patientinfo_diag sendEMRcount]sendEMR=' + sendEMR );
    
    const result = setEMRcount(specimenNo, sendEMR);
    result.then(data => {
           console.log(data);
           res.json({message: 'SUCCESS', count: sendEMR});
    })
    .catch( error => {
        logger.error('[394][patientinfo_diag sendEMRcount]err=' + error.message);
    });
}

// EMR 전송 횟수 알아오기
const getEMRcount = async (specimenNo) => {
    await poolConnect;
    
    const sql =`select sendEMR from patientInfo_diag  where specimenNo=@specimenNo`;

    try {
        const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo);

        const result = await request.query(sql);
        return result.recordset[0];

    } catch(error) {
        logger.error('[412][patientinfo_diag getEMRcount]err=' + error.message);
    }

}

exports.getEMRSendCount = (req, res, next) => {
    const specimenNo = req.body.specimenNo.trim();
    const result = getEMRcount(specimenNo);
    result.then(data => {
        console.log(data);
        res.json({count: data});
 })
 .catch( error => {
     logger.error('[425][patientinfo_diag getEMRcount]err=' + error.message);
 });
}

// 검체자 정보 찿기
// 21.08.25 genetic1, genetic2, genetic3, genetic4
const getpatientinfo = async (specimenNo) => {
    await poolConnect;
    
    const sql =`select isnull(name, '') name  ,isnull(patientID, '') patientID 
            ,isnull(age,  '') age ,isnull(gender, '') gender 
            ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion 
            ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease 
            ,isnull(method, '') method ,isnull(specimen, '') specimen 
            ,case when IsNULL( gbn, '' ) = ''  
            then isnull(request, '')
            when IsNULL( gbn, '' ) = 'cmc'
            then isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') 
            when IsNULL( gbn, '' ) = '인터넷'
            then isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') + '/' + isnull(path_comment, '') 
            else isnull(request, '') end request ,isnull(appoint_doc, '')  appoint_doc 
            ,isnull(worker, '') worker 
            ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date 
            ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code 
            ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion 
            ,isnull(tsvFilteredFilename, '') tsvFilteredFilename 
            ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate 
            ,isnull(tsvFilteredStatus, '') tsvFilteredStatus 
            ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate 
            ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR 
            ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate 
            ,case when IsNULL( left(report_date, 4 ), '' )  = '1900'  
            then '' 
            else IsNULL( CONVERT(VARCHAR(10), cast(CAST(accept_date as CHAR(8)) as datetime), 102 ), '' ) end accept_date 
            ,isnull(test_code, '') test_code  
            ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected 
            ,case when IsNULL( CONVERT(VARCHAR(4), report_date, 102 ), '' ) = '1900'  
                then '' 
                else IsNULL( CONVERT(VARCHAR(10), report_date, 102 ), '' ) end  report_date 
            ,isnull(examin, '') examin, isnull(recheck, '') recheck 
            ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest  
            , isnull(vusmsg, '') vusmsg, isnull(ver_file, '5.1.0') verfile  
            , isnull(genetic1, '') genetic1, isnull(genetic2, '') genetic2, isnull(genetic3, '') genetic3, isnull(genetic4, '') genetic4
            from patientInfo_diag  where specimenNo=@specimenNo order by id desc`;

    try {
        const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo);

        const result = await request.query(sql);
        return result.recordset[0];

    } catch(error) {
        logger.error('[443][patientinfo_diag getpatientinfo]err=' + error.message);
    }

}
exports.getPatientinfo  = (req, res, next) => {
    const specimenNo = req.body.specimenNo;
    console.log('[449][getPatientinfo]', specimenNo);
    const result = getpatientinfo(specimenNo);
    result.then(data => {
       // console.log(data);
        res.json(data);
 })
 .catch( error => {
     logger.error('[455][patientinfo_diag getPatientinfo]err=' + error.message);
 });
}

// screenstatus 상태를 변경
const changescreenstatus = async (specimenNo, seq, userid, type) =>{
    await poolConnect; // ensures that the pool has been created

    logger.info('[997][patientinfo_diag changescreenstatus]specimenNo=' + specimenNo);
    logger.info('[1000][patientinfo_diag changescreenstatus]seq=' + seq);
    let sql =`update patientInfo_diag set screenstatus=@seq where specimenNo=@specimenNo`;
    logger.info('[1000][patientinfo_diag changescreenstatus]sql=' + sql);
    
    try {

        const request = pool.request()
                 .input('seq', mssql.VarChar, seq)
                 .input('specimenNo', mssql.VarChar, specimenNo);
        const result = await request.query(sql); 
      
    } catch(error) {
        logger.error('[1010][patientinfo_diag changescreenstatus]err=' + error.message);
    }

}

exports.changestatus = (req, res, next) => {

    logger.info('[1017][patientinfo_diag resetScreen]data=' + JSON.stringify(req.body));
    
    let specimenNo = req.body.specimenNo.trim();
    let num        = req.body.num;
    //let userid     = req.body.userid;

    //const userid = req.body.userid;
    let userinfo = JSON.parse(req.body.userid); 
  
    let userid = userinfo.userid; 
    //  const pw= userinfo.pwd; 
    let type     = req.body.type;
    logger.info('[1029][patientinfo_diag resetScreen]specimenNo=' + specimenNo);
    logger.info('[1029][patientinfo_diag resetScreen]num=' + num);
    logger.info('[1029][patientinfo_diag resetScreen]userid=' + userid);
    logger.info('[1029]][patientinfo_diag resetScreen]type=' + type);

    const result = changescreenstatus(specimenNo, num, userid, type);
    result.then(data => {
         res.json({message: "SUCCESS"});
    })
    .catch( error => {
        logger.error('[1029][patientinfo_diag resetScreen]err=' + error.message);
    })
}

//  진검 전체 리스트
const allListsHandler = async () =>{
    await poolConnect;
    
    const sql =`select isnull(screenstatus, '') screenstatus ,  isnull(test_code, '') test_code
            from patientInfo_diag `;

    try {
        const request = pool.request();

        const result = await request.query(sql);
        return result.recordset;

    } catch(error) {
        logger.error('[1127][patientinfo_diag allListsHandler]err=' + error.message);
    }
}

exports.allLists = (req, res, next) => {
    const result = allListsHandler();
    result.then(data => {
         res.json(data);
    })
    .catch( error => {
        logger.error('[1137][patientinfo_diag allLists]err=' + error.message);
    })

}


////////////////////////////////////////////////////////
// 연구용 진검 환자등록
const insertHandler = async (req) =>{
    await poolConnect;
    logger.info('[1149][insertHandler] data=' + JSON.stringify(req.body));
    const name       = req.body.name;
    const patientID  = req.body.patientID;
    const age        = req.body.age;
    const gender     = req.body.gender;
    const specimenNo = req.body.specimenNo;
    const reportTitle= req.body.reportTitle;
    const test_code  = req.body.test_code;
    const type       = req.body.type;
    const now = new Date();
    const accept_date = getFormatDate2(now);
    let sql;
    if ( type === 'SEQ' || type === 'MLPA') {
        sql=`insert into patientinfo_diag (name, patientID, age ,gender,specimenNo,       
            test_code, accept_date, report_title, gbn, screenstatus)
            values( @name, @patientID,@age,@gender,@specimenNo,         
               @test_code,@accept_date,@reportTitle,'RESEARCH', '0')`;
    } else {
        sql=`insert into patientinfo_diag (name, patientID, age ,gender,specimenNo,       
            test_code, accept_date, report_title, gbn)
            values( @name, @patientID,@age,@gender,@specimenNo,         
               @test_code,@accept_date,@reportTitle,'RESEARCH')`;
    }

 

        logger.info('[1170][insertHandler] sql =' + sql);
        try {
            const request = pool.request()
                     .input('name', mssql.NVarChar, name)
                     .input('patientID', mssql.VarChar,patientID  )
                     .input('age', mssql.VarChar, age )
                     .input('gender', mssql.VarChar, gender )
                     .input('specimenNo', mssql.VarChar, specimenNo )
                     .input('reportTitle', mssql.NVarChar, reportTitle )
                     .input('test_code', mssql.VarChar,  test_code)
                     .input('accept_date',mssql.VarChar, accept_date);
            const result = await request.query(sql); 
            return result;
        } catch(error) {  
          logger.error('[1184][insertHandler]err=' + error.message);
        }
}

exports.insertPatientinfo = (req, res, next) => {

    const result = insertHandler(req);
    result.then(data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[1195][insertPatientinfo] err=' + error.message);
    })

}

// 연구용 환자 불러오기
const  listsHandler = async (today) => {
    await poolConnect; // ensures that the pool has been created
   
    logger.info('[1200][listsHandler]today=' + today);

    const sql =`select id, isnull(name, '') name  ,isnull(patientID, '') patientID 
    ,isnull(age,  '') age ,isnull(gender, '') gender 
    ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion 
    ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease 
    ,isnull(method, '') method ,isnull(specimen, '') specimen 
    ,case when IsNULL( gbn, '' ) = ''  
        then isnull(request, '')
        when IsNULL( gbn, '' ) = 'cmc'
        then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') 
        when IsNULL( gbn, '' ) = '인터넷'
        then  isnull(req_instnm, '') + '/' + isnull(req_pathologist, '')  + '/' + isnull(req_department, '') + '/' + isnull(path_comment, '') 
        else isnull(request, '') end request, isnull(appoint_doc, '')  appoint_doc 
    ,isnull(worker, '') worker 
    ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date 
    ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code 
    ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion 
    ,isnull(tsvFilteredFilename, '') tsvFilteredFilename 
    ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate 
    ,isnull(tsvFilteredStatus, '') tsvFilteredStatus 
    ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate 
    ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR 
    ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate 
    ,case when IsNULL( left(report_date, 4 ), '' )  = '1900'  
    then '' 
    else IsNULL( CONVERT(VARCHAR(4), cast(CAST(accept_date as CHAR(8)) as datetime), 102  ), '' ) end accept_date 
    ,isnull(test_code, '') test_code  
    ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected 
    ,case when IsNULL( CONVERT(VARCHAR(4), report_date, 102 ), '' ) = '1900'  
        then '' 
        else IsNULL( CONVERT(VARCHAR(10), report_date, 102 ), '' ) end  report_date 
    ,isnull(examin, '') examin, isnull(recheck, '') recheck 
    ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest  
    , isnull(vusmsg, '')  vusmsg, isnull(ver_file, '5.10') verfile 
    , isnull(genetic1, '') genetic1, isnull(genetic2, '') genetic2, isnull(genetic3, '') genetic3, isnull(genetic4, '') genetic4
    , isnull(report_title, '') reportTitle
    , isnull(req_pathologist, '') req_pathologist ,isnull(req_department, '') req_department ,isnull(req_instnm, '') req_instnm
    , isnull(path_comment, '') path_comment ,isnull(gbn, '') gbn
    from [dbo].[patientinfo_diag] where gbn = 'RESEARCH' order by id desc`;
    logger.info('[1246][istsHandler]sql=' + sql);
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
        
        return result.recordset;
    } catch (error) {
        logger.error('[1253][istsHandler]err=' + error.message);
    }
}

exports.getResearchLists= (req, res) => {
    const result = listsHandler(req);
    result.then(data => {
         res.json(data);
    })
    .catch( error => {
        logger.error('[1263][getResearchLists] err=' + error.message);
    })   
}
 
///////// specimenNo 로 생성
const insertSepecimennoHandler = async (req) =>{
    await poolConnect;
    logger.info('[1270][insertSepecimennoHandler] data=' + JSON.stringify(req.body));
 
    const specimenNo = req.body.specimenNo;
    const patientID  = req.body.patientID;

    const qry=`select count(*) as cnt from patientinfo_diag where specimenNo=@specimenNo`;
    const request = pool.request()
                 .input('specimenNo', mssql.VarChar, specimenNo )
    const result = await request.query(qry); 
    const count = result.recordset[0].cnt;
    if (parseInt(count, 10) === 0) {
            const sql=`insert into patientinfo_diag ( specimenNo, patientID,screenstatus)  values(@specimenNo, @patientID, '0')`;
            logger.info('[1274][insertSepecimennoHandler] sql =' + sql);
            try {
                    const request = pool.request()
                            .input('specimenNo', mssql.VarChar, specimenNo)
                            .input('patientID',mssql.VarChar, patientID);
                    const result = await request.query(sql); 
                    return result;
            } catch(error) {  
                logger.error('[1281][insertSepecimennoHandler]err=' + error.message);
            }
    } else {
        return 'Duplicate';
    }
      
}

exports.insertPatientinfoBySepecimenno = (req, res, next) => {
    const result = insertSepecimennoHandler(req);
    result.then(data => {
         if (data === 'Duplicate') {
            res.json({message: 'Duplicate'});
         } else {
            res.json({message: 'SUCCESS'});
         }
         
    })
    .catch( error => {
        logger.error('[1291][insertPatientinfoBySepecimenno] err=' + error.message);
    })
}

//////   specimenNo 로 갱신
const updateSepecimennoHandler = async (req) =>{
    await poolConnect;
    logger.info('[1298][updateSepecimennoHandler] data=' + JSON.stringify(req.body));
    const name       = req.body.name;
    const patientID  = req.body.patientID;
    const age        = req.body.age;
    const gender     = req.body.gender;
    const specimenNo = req.body.specimenNo;
    const reportTitle= req.body.reportTitle;
    const test_code  = req.body.test_code;
    const testednum  = req.body.testname;
  
    const sql=`update patientinfo_diag set name=@name, patientID=@patientID, age=@age ,gender=@gender, report_title=@reportTitle,testednum=@testednum,
     test_code=@test_code  where specimenNo=@specimenNo `;
 
    logger.info('[1313][updateSepecimennoHandler] sql =' + sql);
    try {
        const request = pool.request()
                     .input('name', mssql.NVarChar, name)
                     .input('patientID', mssql.VarChar,patientID  )
                     .input('age', mssql.VarChar, age )
                     .input('gender', mssql.VarChar, gender )
                     .input('specimenNo', mssql.VarChar, specimenNo )
                     .input('reportTitle', mssql.NVarChar, reportTitle )
                     .input('test_code', mssql.VarChar,  test_code)
                     .input('testednum',mssql.VarChar, testednum);
            const result = await request.query(sql); 
            return result;
        } catch(error) {  
          logger.error('[1347][updateSepecimennoHandler]err=' + error.message);
        }
}

exports.updatePatientinfoBySepecimenno = (req, res, next) => {
    const result = updateSepecimennoHandler(req);
    result.then(data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[1358][updatePatientinfoBySepecimenno] err=' + error.message);
    })
}
// 삭제
const deleteSepecimennoHandler = async (req) =>{
    await poolConnect;
    logger.info('[1364][deleteSepecimennoHandler] data=' + JSON.stringify(req.body));
   
    const specimenNo = req.body.specimenNo;
    const patientID  = req.body.patientID;
    const sql=`delete from patientinfo_diag where specimenNo=@specimenNo and patientID=@patientID and gbn='RESEARCH'`;
 
    logger.info('[1369][deleteSepecimennoHandler] sql =' + sql);
    try {
            const request = pool.request()
                     .input('specimenNo', mssql.VarChar, specimenNo)
                     .input('patientID', mssql.VarChar, patientID);
 
            const result = await request.query(sql); 
            return result;
    } catch(error) {  
          logger.error('[1377][deleteSepecimennoHandler]err=' + error.message);
    }
}

exports.deletePatientinfoBySepecimenno = (req, res, next) => {
    const result = deleteSepecimennoHandler(req);
    result.then(data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[1387][deletePatientinfoBySepecimenno] err=' + error.message);
    })
}

///////////////////////////////////////////////////////////////////
// testcodelists 에서 검사목록 가져오기
const testcodeTypeHandler = async (req) =>{
    await poolConnect;  
    const type = req.body.type;   
    const sql=`select  isnull(code, '') code, isnull(report, '') report from testcodelists where type=@type`;
    logger.info('[1395][testcodeTypeHandler] sql =' + sql);
    try {
            const request = pool.request()
                     .input('type', mssql.VarChar, type);                 
            const result = await request.query(sql); 
            return result.recordset;
    } catch(error) {  
          logger.error('[1402][testcodeTypeHandler]err=' + error.message);
    }
}

exports.getTestcodeByType = (req, res, next) => {
    const result = testcodeTypeHandler(req);
    result.then(data => {
         res.json(data);
    })
    .catch( error => {
        logger.error('[1412][getTestcodeByType] err=' + error.message);
    })
}
//////////////////////////////////////////////////////////


