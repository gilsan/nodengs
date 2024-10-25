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

  const specimenNo = req.body.specimenNo;
  const detected_variants = req.body.detected_variants;
  const detected_length =  detected_variants.length
  const report_gb  = 'C'

  logger.info('[110][amlReportinsert messageHandler specimenNo= ' + specimenNo 
							   + ', detected_variants=' +  JSON.stringify( detected_variants)
							   + ', length=' + detected_variants.length);

  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  for (i = 0; i < detected_length; i++)
  {
	const gene   = detected_variants[i].gene;
	const functional_impact = detected_variants[i].functional_impact;
	const transcript        = detected_variants[i].transcript;
	const exon              = detected_variants[i].exon;
	const nucleotide_change = detected_variants[i].nucleotide_change;
	const amino_acid_change = detected_variants[i].amino_acid_change;
	const zygosity          = detected_variants[i].zygosity;
	const vaf               = detected_variants[i].vaf;
	const reference         = detected_variants[i].reference;
	const cosmic_id         = detected_variants[i].cosmic_id;

	logger.info('[45][amlReportinsert messageHandler gene=' + gene + ", functional_impact=" + functional_impact
	    					+ ', exon=' + exon + ' ,nucleotide_change=' + nucleotide_change 
							+ ', amino_acid_change='  + amino_acid_change + ', zygosity=' + zygosity
							+ ', vaf= ' + vaf + ', reference=' + reference + ', cosmic_id=' + cosmic_id);

	//insert Query 생성;
	const qry = "insert into report_detected_variants (specimenNo, report_date, report_gb, gene, \
	         functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
	         vaf, reference, cosmic_id) \
	         values(@specimenNo, getdate(), @report_gb, @gene, \
	           @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
	         @vaf, @reference, @cosmic_id)";
		   
	logger.info('[110][amlReportinsert detectd_variants messageHandler sql=' + qry);

	try {
		const request = pool.request()
		.input('specimenNo', mssql.VarChar, specimenNo)
		.input('report_gb', mssql.VarChar, report_gb)
		.input('gene', mssql.VarChar, gene)
		.input('functional_impact', mssql.VarChar, functional_impact)
		.input('transcript', mssql.VarChar, transcript)
		.input('exon', mssql.VarChar, exon)
		.input('nucleotide_change', mssql.VarChar, nucleotide_change)
		.input('amino_acid_change', mssql.VarChar, amino_acid_change)
		.input('zygosity', mssql.VarChar, zygosity)
		.input('vaf', mssql.VarChar, vaf)
		.input('reference', mssql.VarChar, reference)
		.input('cosmic_id', mssql.VarChar, cosmic_id);
		
		const result = await request.query(qry);
		
		//return result;

	} catch (error) {
		logger.error('[80][amlReportinsert detected_variants messageHandler err=' + error.message);
	}
  }

  const Commencts = req.body.Commencts;
  const Commencts_length =  Commencts.length;
	
  logger.info('[110][amlReportinsert messageHandler Comments=' + JSON.stringify( Comments)
  								+ ', length=' + Commencts_length);

  if (Commencts_length > 0 )
  {

    //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  	for (i = 0; i < Commencts_length; i++)
  	{
	  const gene        = Commencts[i].gene;
	  const variants    = Commencts[i].variants;
	
	  logger.info('[107][amlReportinsert messageHandler comments gene=' + gene + ', variants=' + variants);

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		            report_gb, gene, variants)   \
					  values(@specimenNo, getdate(), \
					  @report_gb, @gene, @variants)";

	  logger.info('[107][amlReportinsert comment messageHandler sql=' + qry);
		   
	  try {
		  const request = pool.request()
			.input('specimenNo', mssql.VarChar, specimenNo)
			.input('report_gb', mssql.VarChar, report_gb)
			.input('gene', mssql.VarChar, gene)
			.input('variants', mssql.VarChar, variants); 
			
		  const result = await request.query(qry);
		  
		 // return result;
	  } catch (error) {
		logger.error('[120][amlReportinsert messageHandler comments err=' + error.message);
	  }
	}
  }
  
  const uuid = uuidv4();
  console.log('uuid:', uuid);
  return result.dataset;
  
}
   
//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.insertReportAML = (req,res, next) => {

	logger.info('[134][amlReportinsert insertReportAML req=' + JSON.stringify(req.body));  
  const result = messageHandler(req);

  result.then(data => {

    console.log(json.stringfy());
    res.json(data);
  })
  .catch( error => {
	logger.error('[110][amlReportinsert insertReportAML err=' + error.message);
	res.sendStatus(500)
  }); 

}