const express = require('express');
const router = express.Router();
const mssql = require('mssql');
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

const pool = new mssql.ConnectionPool(config);
*/

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

function getFormatDate2(date){

    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + month +  day;
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
                isnull(worker, '') worker, isnull(sw_ver, '1') sw_ver from [dbo].[patientinfo_path] \
                where left(prescription_date, 10) = '" + today + "'";
    logger.info('[49][patientinfo_path select]sql=' + sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
        logger.error('[58][patientinfo_path select]err=' + error.message);
    }
  }

 exports.getLists = (req,res, next) => {
    
	const  now = new Date();
    const today = getFormatDate2(now);
    const result = messageHandler(today);
    result.then(data => {
   
       // console.log(json.stringfy());
        res.json(data);
    })
    .catch( error  => {
        logger.error('[58][patientinfo_path getLists]err=' + error.message);
        res.sendStatus(500)}
    ); 
}

const  messageHandler2 = async (start, end) => {
    await poolConnect; // ensures that the pool has been created
   
    const sql = "select isnull(FLT3ITD, '') FLT3ITD, \
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
                    isnull(worker, '') worker, isnull(sw_ver, '1') sw_ver from [dbo].[patientinfo_path]"
               + " where left(prescription_date, 8) >= '" + start 
               + "' and left(prescription_date, 8) <= '" + end + "'";
    logger.info('[58][patientinfo_path select2]sql=' + sql);
  
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
        console.dir( result);
 
        return result.recordset;
    } catch (error) {
        logger.error('[58][patientinfo_path select2]err=' + error.message);
    }
  }

exports.patientSearch = (req, res,next) => {

   const start =  req.body.start;  
   let end   =  req.body.end;  

   const  now = new Date();
   const today = getFormatDate(now);

   const nowTime = new Date().getTime();
   const requestTime = new Date(end).getTime();

   if (requestTime > nowTime) {
	   end = today; 
   }

   logger.info('[112][patientinfo_path select2]start=' + start);
   logger.info('[112][patientinfo_path select2]end=' + end);
   logger.info('[112][patientinfo_path select2]today=' + today );

   const dataset = messageHandler2(start, end);
   dataset.then(data => {
      res.json(data);
   })
   .catch( error  => {
    logger.error('[120][patientinfo_path select2]err=' + error.message);
    res.status(500).send('That is Not good...config.database.anchor.apply.')
   }); 
}