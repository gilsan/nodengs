//================================================
//
//진검 AML (ALL,MPN,Lymphoma 같이 사용) 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  //입력 파라미터를 수신한다
  //1. Detected Variants
  
	const pathology_num = req.body.pathology_num;
	const report_date = req.body.report_date;
	const report_gb  = 'C'

	logger.info('[25][amlReport messageHandler]pathology_num=' +pathology_num + ", report_date=" + report_date);

	//insert Query 생성;
	const qry = "select gene, \
	         functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
			 vaf, reference, cosmic_id \
			 from  report_detected_variants \
			 where specimenNo = @pathology_num \
			 and convert(varchar, report_date, 112) = @report_date \
			 and report_gb = @report_gb";
		   
	logger.info('[37][amlReport messageHandler sql=' + qry);

	try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_date', mssql.VarChar, report_date)
			.input('report_gb', mssql.VarChar, report_gb);
			
		  const result = await request.query(qry);
		  
		  return result.recordset;
	
	} catch (error) {
		logger.error('[50][amlReport messageHandler err=' + error.message);
	}
}

//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.searchReportDetected = (req,res, next) => {

  logger.info('[25][amlReport searchReportDetected req=' + JSON.stringify(req.body)); 
  const result = messageHandler(req);

  result.then(data => {

    //console.log(json.stringfy());
    res.json(data);
  })
  .catch( error => {
	logger.error('[66][amlReport searchReportComments err=' + error.message); 
	res.sendStatus(500);
  }); 
}

const  messageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. Detected Variants
	
	const pathology_num = req.body.pathology_num;
	const report_date = req.body.report_date;
	const report_gb  = 'C'

	logger.info('[25][amlReport messageHandler2 pathology_num=' + pathology_num + ', report_date=' + report_date);

	//insert Query 생성
	const qry = "select gene, variants \
				from report_comments  \
				where specimenNo = @pathology_num \
				and convert(varchar, report_date, 112) = @report_date \
				and report_gb = @report_gb";

	logger.info('[90][amlReport messageHandler2 sql' + qry);
		   
	try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_date', mssql.VarChar, report_date)
			.input('report_gb', mssql.VarChar, report_gb); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (error) {
		logger.error('[102][amlReport messageHandler2 err='  + error.message);
	}
}

//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.searchReportComments = (req,res, next) => {
  const result = messageHandler2(req);

  logger.info('[110][amlReport searchReportComments req=' + JSON.stringify(req.body));

  result.then(data => {

    //console.log(json.stringfy());
    res.json(data);
  })
  .catch( error => {
	logger.info('[118][amlReport searchReportComments err=' + error.message); 
	res.sendStatus(500);
  }); 

}