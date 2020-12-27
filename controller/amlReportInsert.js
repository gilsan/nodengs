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
  
  console.log(req.body);
    
  //입력 파라미터를 수신한다
  //1. Detected Variants

  const pathology_num = req.body.pathology_num;
  const detected_variants = req.body.detected_variants;
  const detected_length =  detected_variants.length
  const report_gb  = 'C'

  console.log(pathology_num);
  console.log("a", detected_variants);
  console.log("b", detected_variants.length);

  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  for (i = 0; i < detected_length; i++)
  {
	const gene   = detected_variants[i].gene;
	const functional_impact = detected_variants[i].functional_impact;
	const transcript        = detected_variants[i].transcript;
	
	console.log("d", gene);
	console.log("e", functional_impact);

	const exon              = detected_variants[i].exon;
	const nucleotide_change = detected_variants[i].nucleotide_change;
	const amino_acid_change = detected_variants[i].amino_acid_change;
	const zygosity          = detected_variants[i].zygosity;
	const vaf               = detected_variants[i].vaf;
	const reference         = detected_variants[i].reference;
	const cosmic_id         = detected_variants[i].cosmic_id;

	console.log("e1", exon);
	console.log("e2", nucleotide_change);
	console.log("e3", amino_acid_change);
	console.log("e4", zygosity);
	console.log("e5", vaf);
	console.log("e6", reference);
	console.log("e7", cosmic_id);

	//insert Query 생성;
	const qry = "insert into report_detected_variants (specimenNo, report_date, report_gb, gene, \
	         functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
	         vaf, reference, cosmic_id) \
	         values(@pathology_num, getdate(), @report_gb, @gene, \
	           @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
	         @vaf, @reference, @cosmic_id)";
		   
	console.log("sql",qry);

	  try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
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
	
	  } catch (err) {
		  console.error('SQL error', err);
	  }
	  
}

const Commencts = req.body.Commencts;
const Commencts_length =  Commencts.length;
	
console.log("a", Commencts);
console.log("b", Commencts_length);
console.log("b", Commencts[0].gene);

if (Commencts_length > 0 )
{

  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  for (i = 0; i < Commencts_length; i++)
  {
	  const gene        = Commencts[i].gene;
	  const variants    = Commencts[i].variants;
	
	  console.log("d", gene);
	  console.log("e", variants);

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		            report_gb, gene, variants)   \
					  values(@pathology_num, getdate(), \
					  @report_gb, @gene, @variants)";

	console.log("sql",qry);
		   
	  try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_gb', mssql.VarChar, report_gb)
			.input('gene', mssql.VarChar, gene)
			.input('variants', mssql.VarChar, variants); 
			
		  const result = await request.query(qry);
		  
		 // return result;
	  } catch (err) {
		  console.error('SQL error', err);
	  }
	}
}
  
  const uuid = uuidv4();
  console.log('uuid:', uuid);
  return result.dataset;
  
}
   
//진검 AML (ALL, MPS/MPN, Lymphoma 같이 사용할것!!!) 보고서 입력
exports.insertReportAML = (req,res, next) => {
  const result = messageHandler(req);

  console.log(req.body);

  result.then(data => {

     console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}