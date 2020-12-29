//================================================
//
//    병리 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const { data } = require('../common/winston');
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

const sleep = (ms) => {
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
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

// fusion coount Check
const fusionCntMessageHandler = async (pathology_num, gene, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	console.log("[75][pathologyReportInsert][fusionCnt] pathology_num= " + pathology_num);
	logger.info("[75][FusionCnt] report_gb=" + report_gb);
	logger.info("[75][FusionCnt] gene =" + gene);
	
  //select Query 생성
  let sql2 = "select count(1)  as cnt from report_fusion \
			where  pathology_num = @pathology_num \
			and  gene = @gene \
			and  report_gb = @report_gb";

	logger.info(sql2);
	
  try {
	const request = pool.request()
		.input('pathology_num', mssql.VarChar, pathology_num)
		.input('gene', mssql.VarChar, gene)
		.input('report_gb', mssql.VarChar, report_gb); 
		
	const result = await request.query(sql2);

	const data  = result.recordset[0];

	logger.info("data=" + JSON.stringify( data));
	return data;
	
	//return result;
  } catch (err) {
	logger.error('SQL error=' + JSON.stringify( err));
	return "{'cnt':'-1'}";
  }

}


// amplification  coount Check
const  amplificationCntMessageHandler = async (pathology_num, gene, estimated_copy_num, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[109][pathologyReportInsert][amplification] pathology_num=" +  pathology_num) ;
	logger.info("[amplificatio]gene =" + gene);
	logger.info("[amplification] estimated_copy_num=" + estimated_copy_num);
	logger.info("[amplificaion] report_gb=" + report_gb);

	  //select Query 생성
	  const sql = "select count(1) as cnt from report_amplification \
	               where pathology_num = @pathology_num \
				   and report_gb = @report_gb \
				   and estimated_copy_num = @estimated_copy_num ";
	  
	  logger.info('[196][pathologyReportInsert][amplification] sql=' + sql);
		   
	  try {
		  const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_gb', mssql.VarChar, report_gb)
			.input('gene', mssql.VarChar, gene)
			.input('estimated_copy_num', mssql.VarChar, estimated_copy_num); 
			
		  const result = await request.query(sql)
		  
		  const data  = result.recordset[0];

		  logger.info("[132][pathologyReportInsert][amplification]=" + JSON.stringify( data));

		  return data;
	  } catch (err) {
		  logger.error('SQL error=' + JSON.stringify(err));
	  } // try end
}


const MutationSaveHandler = async (pathology_num, mutation, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	let gene              = mutation.gene;
	let amino_acid_change = mutation.aminoAcidChange;
	let nucleotide_change = mutation.nucleotideChange;
	let variant_allele_frequency = mutation.variantAlleleFrequency;
	let variant_id       = mutation.ID;
	let tier             = mutation.tier;

	logger.info("[289][mutation] pathology_num=" + pathology_num);
	logger.info("[289][mutation] gene=" + gene);
	logger.info("[289][mutation] nucleotide_change=" + nucleotide_change);
	logger.info("[289][mutation] amino_acid_change=" + amino_acid_change);
	logger.info("[289][mutation] variant_allele_frequency=" + variant_allele_frequency);
	logger.info("[289][mutation] variant_id=" + variant_id);
	logger.info("[289][mutation] tier=" + tier);

	//select Query 생성
	let sql2 = "insert_report_mutation";

	logger.info("[49][MutationCnt] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathology_num', mssql.VarChar(300), pathology_num)
			.input('report_gb', mssql.VarChar(1), report_gb)
			.input('gene', mssql.VarChar(100), gene) 
			.input('amino_acid_change', mssql.VarChar(100), amino_acid_change) 
			.input('nucleotide_change', mssql.VarChar(100), nucleotide_change) 
			.input('variant_allele_frequency', mssql.VarChar(100), variant_allele_frequency) 
			.input('variant_id', mssql.VarChar(100), variant_id)
			.input('tier', mssql.VarChar(10), tier)
			.input('note', mssql.VarChar(10), '')
			.output('TOTALCNT', mssql.int, 0); 
			
		const resultMC = await request.execute(sql2);
		
		logger.info("[275]resultMC=" + JSON.stringify(resultMC));
		
		return resultMC;
	} catch (err) {
		logger.error('[342][mutation C]SQL error=' + JSON.stringify(err));
	} // try end
}

// 병리 Clinically 결과지 입력/수정/삭제
const  messageMutationCHandler = async (pathology_num, mutation, report_gb) => {

	const mutation_length =  mutation.length;
	logger.info("[254][mutation] data=" + JSON.stringify( mutation));
	logger.info("[254[mutation] length=" + mutation.length);
	logger.info("[254[mutation] report_gb=" + report_gb);
   
	//insert Query 생성
	let sql2 = "delete from report_mutation where  pathology_num = @pathology_num ";
  
	logger.info("[262][del mutation] sql=" + sql2);
	  
	try {
	  const request = pool.request()
		  .input('pathology_num', mssql.VarChar, pathology_num); 
		  
	  const result = await request.query(sql2);
	  
	  logger.info("[270] result =" + JSON.stringify(result) )
	  //return result;
	} catch (err) {
	  logger.error('SQL error=' + JSON.stringify(err));
	}
  
	let resultCnt;
	if (mutation_length > 0)
	{
	  mutation.forEach (item => 
	  {
		resultCnt = MutationSaveHandler(pathology_num, item, report_gb);
		logger.info("[296]cnt=" , resultCnt);
	
	  }); // foreach end
	}  //if end

	return resultCnt; 
}

// 병리 Prevalent 결과지 입력/수정/삭제
const  messageMutationPHandler = async (pathology_num, mutationP, report_gb) => {

	const mutation_length =  mutationP.length;
	logger.info("[292][mutation p] data=" + JSON.stringify( mutationP));
	logger.info("[292[mutation p] length=" + mutationP.length);
	logger.info("[292[mutation p] report_gb=" + report_gb);
  
	let cnt = 0;
	let resultCnt = 0;
	if (mutation_length > 0)
	{
		//for 루프를 돌면서 Mutation 카운트 만큼       //Mutation Count
	  	mutationP.forEach (item => 
		{
		  resultCnt = MutationSaveHandler(pathology_num, item, report_gb);
		  logger.info("[296]cnt=" , resultCnt);
	  	}); // foreach end
	}  //if end
}

const amplificationSaveHandler = async (pathology_num, amplification, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	let gene             = amplification.gene;
	let region           = amplification.region;
	let estimated_copy_num = amplification.copynumber;
	let tier             = amplification.tier;
	let note             = amplification.note;
  
	logger.info("[243][amplification] pathology_num=" + pathology_num);
	logger.info("[243][amplification] report_gb=" + report_gb);
	logger.info("[243][amplification] region=" + region);
	logger.info("[243][amplification] estimated_copy_num=" + estimated_copy_num);
	logger.info("[243][amplification] tier=" + tier);
	logger.info("[243][amplification] note=" + note);

	//select Query 생성
	let sql2 = "insert_report_amplification";

	logger.info("[252][amplification save] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_gb', mssql.VarChar, report_gb)
			.input('gene', mssql.VarChar, gene)
			.input('region', mssql.VarChar, region) 
			.input('estimated_copy_num', mssql.VarChar, estimated_copy_num)
			.input('tier', mssql.VarChar, tier)
			.input('note', mssql.VarChar, note)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultAc;
		 	await request.execute(sql2, (err, recordset, returnValue) => {
				if (err)
				{
					logger.info ("[268][amplification]err message=" + err.message);
				}

				logger.info("[268][amplication]recordset="+ recordset);
				logger.info("[268][amplication]returnValue="+ returnValue);

				resultAc = returnValue;
			 });
		
		logger.info("[275]resultAc=" + JSON.stringify(resultAc));
		
		return resultAc;
	} catch (err) {
		logger.error('[342][mutation C]SQL error=' + JSON.stringify(err));
	} // try end
}

// 병리 결과지 입력/수정/삭제
const  messageAmplificationCHandler = async (pathology_num, amplification, report_gb) => {

	const amplification_length =  amplification.length;
	logger.info("[345][amplification C] amplification_c =" + JSON.stringify( amplification));
	logger.info("[345][amplification C] length=" + amplification.length);
	logger.info("[347][amplification C] pathology_num=" + pathology_num );
	logger.info("[347][amplification C] report_gb=" + report_gb );
  
	//dekete Query 생성
	let sql2 = "delete from report_amplification where  pathology_num = @pathology_num ";
  
	console.log(sql2);
	logger.info("[352][amplication C]del sql =" + sql2);
	  
	try {
	  const request = pool.request()
		  .input('pathology_num', mssql.VarChar, pathology_num); 
		  
	  const result = await request.query(sql2);
  
	  logger.info("[361][amplification] data=" + JSON.stringify(result)); 
	  //return result;
	} catch (err) {
	  logger.error('[364][amplification] SQL error=' + JSON.stringify(err));
	}
  
	let resultCnt;
	if (amplification_length > 0)
	{
		amplification.forEach (item => 
	  	{
			resultCnt = amplificationSaveHandler(pathology_num, item, report_gb);
			logger.info("[296]cnt=" , resultCnt);
	
	  	}); // foreach end
	}  //if end

	return resultCnt; 
}

// 병리 결과지 입력/수정/삭제
const  messageAmplificationPHandler = async (pathology_num, amplificationP, report_gb) => {

	const amplification_length =  amplificationP.length;
	logger.info("[345][amplification P] amplification_p =" + JSON.stringify( amplificationP));
	logger.info("[345][amplification P] length=" + amplificationP.length);
	logger.info("[347][amplification P] pathology_num=" + pathology_num );
	logger.info("[347][amplification P] report_gb=" + report_gb );

	let resultCnt;
	if (amplification_length > 0)
	{
		amplificationP.forEach (item => 
		{
			resultCnt = amplificationSaveHandler(pathology_num, item, report_gb);
			logger.info("[296]cnt=" , resultCnt);
	
		}); // foreach end
  } // if  amplipication end
}

const fusionSaveHandler = async (pathology_num, fusion, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	let gene              = fusion.gene;
	let fusion_breakpoint = fusion.breakpoint;
	let fusion_function   = fusion.functions;
	let tier              = fusion.tier;
	let note              = fusion.note;
  
	logger.info("[243][fusion] pathology_num=" + pathology_num);
	logger.info("[243][fusion] gene=" + gene);
	logger.info("[243][fusion] fusion_breakpoint=" + fusion_breakpoint);
	logger.info("[243][fusion] fusion_function=" + fusion_function);
	logger.info("[243][fusion] report_gb=" + report_gb);

	//select Query 생성
	let sql2 = "insert_report_fusion";

	logger.info("[252][fusion save] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num)
			.input('report_gb', mssql.VarChar, report_gb)
			.input('gene', mssql.VarChar, gene)
			.input('fusion_breakpoint', mssql.VarChar, fusion_breakpoint)
			.input('fusion_function', mssql.VarChar, fusion_function)
			.input('tier', mssql.VarChar, tier)
			.input('note', mssql.VarChar, note)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultFu;
		 	await request.execute(sql2, (err, recordset, returnValue) => {
				if (err)
				{
					logger.info ("[268][fusion]err message=" + err.message);
				}

				logger.info("[268][fusion]recordset="+ recordset);
				logger.info("[268][fusion]returnValue="+ returnValue);

				resultFu = returnValue;
			 });
		
		logger.info("[275]resultFu=" + JSON.stringify(resultFu));
		
		return resultFu;
	} catch (err) {
		logger.error('[342][mutation C]SQL error=' + JSON.stringify(err));
	} // try end
}

// 병리 fusion 결과지 입력/수정/삭제
const  messageFusionCHandler = async (pathology_num, fusion, report_gb) => {

	const fusion_length = fusion.length;
	console.log("fusion=", fusion);
	console.log("b=", fusion.length);

	let resultCnt ;

	//dekete Query 생성
	let sql2 = "delete from report_fusion where  pathology_num = @pathology_num ";

	console.log(sql2);
		
	try {
		const request = pool.request()
			.input('pathology_num', mssql.VarChar, pathology_num); 
			
		const result = await request.query(sql2)
		
		//return result;
	} catch (err) {
		console.error('SQL error', err);
	}

	if (fusion_length > 0)
	{
		fusion.forEach (item => 
		{
			resultCnt = fusionSaveHandler(pathology_num, item, report_gb);
			logger.info("[296]cnt=" , resultCnt);
	
		}); // foreach end
 	} //  if end

}

// 병리 fusion 결과지 입력/수정/삭제
const  messageFusionPHandler = async (pathology_num, fusionP, report_gb) => {

  const fusion_length = fusionP.length;
  console.log("fusion=", fusionP);
  console.log("b=", fusionP.length);
  let resultCnt;

  if (fusion_length > 0)
  {
	fusionP.forEach (item => 
		{
			resultCnt = fusionSaveHandler(pathology_num, item, report_gb);
			logger.info("[296]cnt=" , resultCnt);
	
		}); // foreach end
  } //  if end

}

// 병리 결과지 입력/수정/삭제
const  messageHandler = async (pathology_num, patientinfo, mutation_c, amplification_c, fusion_c,
									mutation_p, amplification_p, fusion_p, 
									extraction, 
									notement, generalReport, specialment,
									screenstatus) => {
  await poolConnect; // ensures that the pool has been created
  
  //입력 파라미터를 수신한다
  logger.info("[->][pathologyReportInsert][pathology_num]" + patientinfo);
  logger.info("[->][pathologyReportInsert][extraction]" + extraction);

  logger.info( "[->][pathologyReportInsert][messageHandler] pathology_num= " +  pathology_num);
  
  let diagnosis = extraction.diagnosis;
  let dnarna = ''
  let keyblock = '';
  let tumorcellpercentage = '';
  let rel_pathology_num = extraction.managementNum;
  let organ = '';
  let tumortype = '';
  let msiscore = '';
  let tumorburden = '';

  	if (screenstatus === '1')
  	{
		dnarna = extraction.dnarna;
		keyblock = extraction.keyblock;
		tumorcellpercentage = extraction.tumorcellpercentage;
		organ = extraction.organ;
		tumortype = extraction.tumortype;
		msiscore = extraction.msiscore;
		tumorburden = extraction.tumorburden;
  	}
	else if (screenstatus === '2') {
		// dnarna = patientinfo.dna_rna_ext;
		// keyblock = patientinfo.key_block;
		// tumorcellpercentage = patientinfo.tumor_cell_per;
		// organ = patientinfo.organ;
		// tumortype = patientinfo.tumor_type;
		// msiscore = patientinfo.msiscore;
		// tumorburden = patientinfo.tumorburden;
		dnarna = extraction.dnarna;
		keyblock = extraction.keyblock;
		tumorcellpercentage = extraction.tumorcellpercentage;
		organ = extraction.organ;

		tumortype = extraction.tumortype;
		msiscore = extraction.msiscore;
		tumorburden = extraction.tumorburden;		
	}
  let examin  = patientinfo.examin;  // 검사자
  let recheck = patientinfo.recheck; // 확인자 

  logger.info("[199][pathologyReportInsert][extraction][dnarna]" + dnarna);
  logger.info("[->][pathologyReportInsert][extraction][keyblock]" + keyblock);
  logger.info("[->][pathologyReportInsert][extraction][organ]" + organ);
  logger.info("[->][pathologyReportInsert][extraction][tumortype]" + tumortype);
  logger.info("[->][pathologyReportInsert][extraction][diagnosis]" + diagnosis);
  logger.info("[->][pathologyReportInsert][extraction][msiscore]" + msiscore);
  logger.info("[->][pathologyReportInsert][extraction][tumorburden]" + tumorburden);
  logger.info("[->][pathologyReportInsert][extraction][tumorcellpercentage]" + tumorcellpercentage);
  logger.info("[->][pathologyReportInsert][patientinfo][examin]" + examin);
  logger.info("[->][pathologyReportInsert][patientinfo][recheck]" +  recheck);
  logger.info("[->][pathologyReportInsert][patientinfo][screenstatus]" + screenstatus);  
  logger.info("[->][pathologyReportInsert][patientinfo][rel_pathology_num]" +  rel_pathology_num);
  
  //insert Query 생성
  const sql_patient = "update patientinfo_path \
			   set dna_rna_ext = @dnarna,  \
			   key_block = @keyblock, rel_pathology_num = @rel_pathology_num, \
			tumor_cell_per = @tumorcellpercentage, \
			   organ = @organ, tumor_type = @tumortype, \
			   pathological_dx=@diagnosis, screenstatus = @screenstatus,\
			   msiscore=@msiscore, tumorburden=@tumorburden, examin=@examin, recheck=@recheck \
	  where  pathology_num = @pathology_num ";
	  
  logger.info("[222][pathologyReportInsert][patientinfo][sql]" + sql_patient);
	  
  try {
	  const request = pool.request()
		  .input('dnarna', mssql.VarChar, dnarna)
		  .input('rel_pathology_num', mssql.VarChar, rel_pathology_num) 
		  .input('keyblock', mssql.NVarChar, keyblock) 
		  .input('tumorcellpercentage', mssql.VarChar, tumorcellpercentage) 
		  .input('organ', mssql.NVarChar, organ) 
		  .input('tumortype', mssql.VarChar, tumortype)
		  .input('diagnosis', mssql.NVarChar, diagnosis)
		  .input('msiscore', mssql.VarChar, msiscore)
		  .input('tumorburden', mssql.VarChar, tumorburden)
		  .input('examin', mssql.NVarChar,examin)
		  .input('recheck',mssql.NVarChar,recheck)
		  .input('screenstatus',mssql.NVarChar,screenstatus)
		  .input('pathology_num', mssql.VarChar, pathology_num);
		  
	  let result;
	   await request.query(sql_patient, (err, recordset) => 
	  	{
			if (err)
			{
				logger.error("err=" + err.message);
			}

			result = recordset;
		}
		);
	  
	  logger.info("data", JSON.stringify(result));
	  //return result;
  } catch (err) {
	  logger.error('SQL error=' + err);
  }
  
  //1. Clinically significant boiomakers

  //리포트 구분 C = Crininically, P = Prevalent
  let report_gb  = "C"   
  
  // mutation handler
  let resultMc = messageMutationCHandler(pathology_num, mutation_c, report_gb);

  logger.info("[361][messageMutationCHandler] data=" + JSON.stringify(resultMc)); 

  /*
  resultMc.then(data2 => {
	logger.info("[361][messageMutationCHandler] data=" + JSON.stringify(data2)); 

  });
  */ 
  
  // amplification handler
  resultMc = messageAmplificationCHandler(pathology_num, amplification_c, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageAmplificationCHandler] data=" + JSON.stringify(data2)); 

  });

  // fusion C handler
  resultMc = messageFusionCHandler(pathology_num, fusion_c, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageFusionCHandler] data=" + JSON.stringify(data2)); 

  });

  //2. Prevalent cancer biomarkfers of known significant 

  //위 '1' 과 동일한 패턴으로 진행하도록 한다.

  //리포트 구분 C = Crininically, P = Prevalent
  report_gb  = "P";         
  console.log("report_gb=", report_gb);    

  // mutation handler
  resultMc = messageMutationPHandler(pathology_num, mutation_p, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageMutationPHandler] data=" + JSON.stringify(data2)); 

  }); 
  
  // amplification handler
  resultMc = messageAmplificationPHandler(pathology_num, amplification_p, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageAmplificationPHandler] data=" + JSON.stringify(data2)); 

  });

  // fusion P handler
  resultMc = messageFusionPHandler(pathology_num, fusion_p, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageFusionPHandler] data=" + JSON.stringify(data2)); 

  });

  //delete Query 생성
  sql_del = "delete from path_comment where  pathology_num = @pathology_num ";

  console.log("[438][del comment]", sql_del);
	
  try {
	const request = pool.request()
		.input('pathology_num', mssql.VarChar, pathology_num); 
		
	const result = await request.query(sql_del);

	console.log("[693][commwnt]", result);
	
	//return result;
  } catch (err) {
	console.error('SQL error', err);
  }

  console.log("[455][comment][notement]", notement);
  console.log("[455][comment][generalReport]", generalReport);
  console.log("[455][comment][specialment]", specialment);

	//insert Query 생성
	const sql_comment = "insert into path_comment \
					(pathology_num, notement, \
					  generalReport, specialMent)  \
					values(@pathology_num, @notement, \
						@generalReport, @specialment)";
	
	console.log('[465][pathologyReportInsert][comment]',sql_comment);
	
	let result_comment;

	try {
		const request = pool.request()
		.input('pathology_num', mssql.NVarChar, pathology_num)
		.input('notement', mssql.NVarChar, notement)
		.input('generalReport', mssql.NVarChar, generalReport)
		.input('specialment', mssql.NVarChar, specialment); 
		
		result_comment = await request.query(sql_comment);

		console.log("[721][commwnt]", result_comment);
		
		//return result;
	} catch (err) {
		console.error('SQL error', err);
	}  // try end

  
  //const uuid = uuidv4();
  //console.log('uuid:', uuid);

  //return '{"uuid":"' + uuid + '"}';
  return result_comment; //
  
  
}


//병리 Pathology 보고서 입력
exports.insertReportPathology = (req,res, next) => {

 // console.log ('[515][pathologyReportInsert][ifusion]', req.body);
  
  let screenstatus = '1';
  let pathology_num = req.body.pathology_num;
  let patientinfo = req.body.patientinfo;
  let mutation_c = req.body.mutation_c;
  let amplification_c = req.body.amplification_c;
  let fusion_c = req.body.fusion_c;
  let mutation_p = req.body.mutation_p;
  let amplification_p = req.body.amplification_p;
  let fusion_p = req.body.fusion_p;
  let extraction = req.body.extraction;
  let notement = req.body.notement;
  let generalReport = req.body.generalReport;
  let specialment = req.body.specialment;

   
  console.log ('[748][pathologyReportInsert][mutation_c]', mutation_c);
  

  const result = messageHandler(pathology_num, patientinfo,mutation_c, amplification_c, fusion_c,
								   mutation_p, amplification_p, fusion_p, extraction, 
								   notement, generalReport, specialment, screenstatus);
  result.then(data => {

     //console.log(json.stringfy());
     res.json({info:"SUCCESS"});
  })
  .catch( err  => res.sendStatus(500)); 

}

//병리 Pathology 보고서 2차
exports.updateReportPathology = (req,res, next) => {

  console.log ('[488][pathologyReportInsert][update]', req.body);

  var log_req_body  = "[488][pathologyReportInsert][MutationCnt]  req.body=" + JSON.stringify( req.body); 
  logger.info(log_req_body);

  let screenstatus = '2';
  let pathology_num = req.body.pathology_num;
  let patientinfo = req.body.patientinfo;
  let mutation_c = req.body.mutation_c;
  let amplification_c = req.body.amplification_c;
  let fusion_c = req.body.fusion_c;
  let mutation_p = req.body.mutation_p;
  let amplification_p = req.body.amplification_p;
  let fusion_p = req.body.fusion_p;
  let extraction = req.body.extraction;
  let notement = req.body.notement;
  let generalReport = req.body.generalReport;
  let specialment = req.body.specialment;

  const result = messageHandler(pathology_num, patientinfo,mutation_c, amplification_c, fusion_c,
								   mutation_p, amplification_p, fusion_p, extraction, 
								   notement, generalReport, specialment, screenstatus);
  result.then(data => {

     //console.log(json.stringfy());
     res.json({info:"SUCCESS"});
  })
  .catch( err  => res.sendStatus(500)); 

}