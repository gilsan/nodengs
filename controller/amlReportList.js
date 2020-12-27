//================================================
//
//진검 AML (ALL,MPN,Lymphoma 같이 사용) 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

//
const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  //입력 파라미터를 수신한다
  //1. Detected Variants
  
  	console.log(req.body);

	const pathology_num = req.body.pathology_num;
	const report_date = req.body.report_date;
	const report_gb  = 'C'

	console.log(pathology_num);
	console.log(report_date);

	//insert Query 생성;
	const qry = "select gene, \
	         functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
			 vaf, reference, cosmic_id \
			 from  report_detected_variants \
			 where specimenNo = @pathology_num \
			 and convert(varchar, report_date, 112) = @report_date \
			 and report_gb = @report_gb";
		   
	console.log("sql",qry);

	try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_date', mssql.VarChar, report_date)
			.input('report_gb', mssql.VarChar, report_gb);
			
		  const result = await request.query(qry);
		  
		  return result.recordset;
	
	} catch (err) {
		  console.error('SQL error', err);
	}
}

//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.searchReportDetected = (req,res, next) => {
  const result = messageHandler(req);

  console.log(req.body);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}

const  messageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. Detected Variants
	
	const pathology_num = req.body.pathology_num;
	const report_date = req.body.report_date;
	const report_gb  = 'C'

	console.log('pathology_num',pathology_num);
	console.log('report_date',report_date);

	//insert Query 생성
	const qry = "select gene, variants \
				from report_comments  \
				where specimenNo = @pathology_num \
				and convert(varchar, report_date, 112) = @report_date \
				and report_gb = @report_gb";

	console.log("sql",qry);
		   
	try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_date', mssql.VarChar, report_date)
			.input('report_gb', mssql.VarChar, report_gb); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (err) {
		  console.error('SQL error', err);
	}
}

//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.searchReportComments = (req,res, next) => {
  const result = messageHandler2(req);

  console.log(req.body);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}