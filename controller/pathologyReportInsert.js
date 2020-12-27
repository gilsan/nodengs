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

// Mutation coount Check
//const MutationCntMessageHandler  = async (pathology_num, gene, amino_acid_change, report_gb ) => {
function MutationCntMessageHandler(pathology_num, gene, amino_acid_change, report_gb ) {
	//await poolConnect; // ensures that the pool has been created

	logger.info("[37][pathologyReportInsert][MutationCnt] pathology_num= " +  pathology_num);
	logger.info("[37][pathologyReportInsert][MutationCnt]  gene = " +  gene);
	logger.info("[37][pathologyReportInsert][MutationCnt] amino_acid_change =" +  amino_acid_change);
	logger.info("[37][pathologyReportInsert][MutationCnt]  report_gb" + report_gb); 
	
  //insert Query 생성
  let sql2 = "select count(1)  as cnt from report_mutation \
					where  pathology_num = @pathology_num \
					and  gene = @gene \
					and  amino_acid_change = @amino_acid_change\
					and  report_gb = @report_gb";

	logger.info("[49][MutationCnt] sql=" + sql2);
	
  try {
	const request = pool.request()
		.input('pathology_num', mssql.VarChar, pathology_num)
		.input('gene', mssql.VarChar, gene)
		.input('amino_acid_change', mssql.VarChar, amino_acid_change)
		.input('report_gb', mssql.VarChar, report_gb); 
		
	const result = request.query(sql2);
	
	let data  = result.recordset[0];
	
	logger.info("[62][pathologyReportInsert][MutationCnt]=" + JSON.stringify( data));

	return JSON.stringify( data);
	
	//return result;
  } catch (err) {
	logger.error('[68][MutatonCnt]SQL error=' + JSON.stringify(	err));
	return -1;
  }
}

// fusion coount Check
const fusionCntMessageHandler = async (pathology_num, gene, report_gb ) => {
	await poolConnect; // ensures that the pool has been created

	console.log("[75][pathologyReportInsert][fusionCnt] pathology_num= " + pathology_num);
	logger.info("[75][FusionCnt] report_gb=" + report_gb);
	logger.info("[75][FusionCnt] gene =" + gene);
	
  //insert Query 생성
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

	  //insert Query 생성
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

// 병리 Clinically 결과지 입력/수정/삭제
const  messageMutationCHandler = async (pathology_num, mutation, report_gb) => {

	const mutation_length =  mutation.length;
	logger.info("[254][mutation] data=" + JSON.stringify( mutation));
	logger.info("[254[mutation] length=" + mutation.length);
	logger.info("[254[mutation] report_gb=" + report_gb);
  
	let resultCnt;
   
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
  
	let cnt = 0;
	if (mutation_length > 0)
	{
	  //for 루프를 돌면서 Mutation 카운트 만큼       //Mutation Count
	  for (let i = 0; i < mutation_length ; i++)
	  {
		  let gene              = mutation[i].gene;
		  let amino_acid_change = mutation[i].aminoAcidChange;
		  let nucleotide_change = mutation[i].nucleotideChange;
		  let variant_allele_frequency = mutation[i].variantAlleleFrequency;
		  let variant_id       = mutation[i].ID;
		  let tier             = mutation[i].tier;
		  
		  logger.info("[289][mutation C] pathology_num=" + pathology_num);
		  logger.info("[289][mutation C] gene=" + gene);
		  logger.info("[289][mutation C] nucleotide_change=" + nucleotide_change);
		  logger.info("[289][mutation C] amino_acid_change=" + amino_acid_change);
		  logger.info("[289][mutation C] report_gb=" + report_gb);
  
		  console.log("[296]cnt=" , cnt);
		  cnt += 1;
  
		  resultCnt = MutationCntMessageHandler(pathology_num, gene, amino_acid_change, report_gb);

		  let dataCnt  = JSON.stringify(resultCnt); 
  
		  //resultCnt.then(data => {
		  //try
		  //{
			//  logger.info('[301][mutationc] data =' + JSON.stringify(data));
			  logger.info('[301][mutationc] data =' + resultCnt);
			  // if ( data.cnt == 0)
			  if ( dataCnt <= 0)
			  {
				  logger.info("[289][mutation C] pathology_num=" + pathology_num);
				  logger.info("[289][mutation C] gene=" + gene);
				  logger.info("[289][mutation C] nucleotide_change=" + nucleotide_change);
				  logger.info("[289][mutation C] amino_acid_change=" + amino_acid_change);
				  logger.info("[289][mutation C] variant_allele_frequency=" + variant_allele_frequency);
				  logger.info("[289][mutation C] variant_id=" + variant_id);
				  logger.info("[289][mutation C] tier=" + tier);
		  
				  //insert Query 생성
				  let sql = "insert into report_mutation (pathology_num, report_date, \
					  report_gb, gene, amino_acid_change,nucleotide_change, \
					  variant_allele_frequency, variant_id, tier) \
					  values(@pathology_num, getdate(), \
						  @report_gb, @gene, @amino_acid_change, @nucleotide_change, \
						  @variant_allele_frequency, @variant_id, @tier)";
  
				  logger.info('[312][pathologyReportInsert][mutation] sql=' + sql);
					  
				  try {
					  const request = pool.request()
						  .input('pathology_num', mssql.VarChar, pathology_num)
						  .input('report_gb', mssql.VarChar, report_gb)
						  .input('gene', mssql.VarChar, gene) 
						  .input('amino_acid_change', mssql.VarChar, amino_acid_change) 
						  .input('nucleotide_change', mssql.VarChar, nucleotide_change) 
						  .input('variant_allele_frequency', mssql.VarChar, variant_allele_frequency) 
						  .input('variant_id', mssql.VarChar, variant_id)
						  .input('tier', mssql.VarChar, tier); 
						  
						  const resultMC = await request.query(sql)
						  //const resultMC = request.query(sql)
  
						  logger.info("[336][mutation C] result=" + JSON.stringify(resultMC) );
					  
					  //return resultMC;
				  } catch (err) {
					  logger.error('[342][mutation C]SQL error=' + JSON.stringify(err));
				  } // try end
			  }  // if cnt end
		  //}
		  //catch(err) {
		  //	logger.error('[338][mutation C]SQL error=' + JSON.stringify( err));
		  //} // try end
		  //}
		//)
		//.catch((err) => {
		//  logger.error('[352][mutation C]SQL error=' + JSON.stringify(err));
		//); //
	  } // for end
	}  //if end
}

// 병리 Prevalent 결과지 입력/수정/삭제
const  messageMutationPHandler = async (pathology_num, mutation, report_gb) => {

	const mutation_length =  mutation.length;
	logger.info("[254][mutation] data=" + JSON.stringify( mutation));
	logger.info("[254[mutation] length=" + mutation.length);
	logger.info("[254[mutation] report_gb=" + report_gb);
  
	let cnt = 0;
	let resultCnt = 0;
	if (mutation_length > 0)
	{
	  //for 루프를 돌면서 Mutation 카운트 만큼       //Mutation Count
	  for (let i = 0; i < mutation_length ; i++)
	  {
		  let gene              = mutation[i].gene;
		  let amino_acid_change = mutation[i].aminoAcidChange;
		  let nucleotide_change = mutation[i].nucleotideChange;
		  let variant_allele_frequency = mutation[i].variantAlleleFrequency;
		  let variant_id       = mutation[i].ID;
		  let note             = mutation[i].note;
		  
		  logger.info("[289][mutation C] pathology_num=" + pathology_num);
		  logger.info("[289][mutation C] gene=" + gene);
		  logger.info("[289][mutation C] nucleotide_change=" + nucleotide_change);
		  logger.info("[289][mutation C] amino_acid_change=" + amino_acid_change);
		  logger.info("[289][mutation C] report_gb=" + report_gb);
  
		  console.log("[296]cnt=" , cnt);
		  cnt += 1;
  
		  resultCnt = MutationCntMessageHandler(pathology_num, gene, amino_acid_change, report_gb);
  
		  resultCnt.then(data => {
		  //try
		  //{
			  logger.info('[301][mutationc] data =' + JSON.stringify(data));
			  if ( data.cnt == 0)
			  {
				  logger.info("[289][mutation C] pathology_num=" + pathology_num);
				  logger.info("[289][mutation C] gene=" + gene);
				  logger.info("[289][mutation C] nucleotide_change=" + nucleotide_change);
				  logger.info("[289][mutation C] amino_acid_change=" + amino_acid_change);
				  logger.info("[289][mutation C] variant_allele_frequency=" + variant_allele_frequency);
				  logger.info("[289][mutation C] variant_id=" + variant_id);
				  logger.info("[289][mutation C] note=" + note);
		  
				  //insert Query 생성
				  let sql = "insert into report_mutation (pathology_num, report_date, \
					  report_gb, gene, amino_acid_change,nucleotide_change, \
					  variant_allele_frequency, variant_id, note) \
					  values(@pathology_num, getdate(), \
						  @report_gb, @gene, @amino_acid_change, @nucleotide_change, \
						  @variant_allele_frequency, @variant_id, @note)";
  
				  logger.info('[312][pathologyReportInsert][mutation] sql=' + sql);
					  
				  try {
					  const request = pool.request()
						  .input('pathology_num', mssql.VarChar, pathology_num)
						  .input('report_gb', mssql.VarChar, report_gb)
						  .input('gene', mssql.VarChar, gene) 
						  .input('amino_acid_change', mssql.VarChar, amino_acid_change) 
						  .input('nucleotide_change', mssql.VarChar, nucleotide_change) 
						  .input('variant_allele_frequency', mssql.VarChar, variant_allele_frequency) 
						  .input('variant_id', mssql.VarChar, variant_id)
						  .input('note', mssql.VarChar, note); 
						  
						  //const result = await request.query(sql)
						  const resultMC = request.query(sql)
  
						  logger.info("[336][mutation C] result=" + JSON.stringify(resultMC) );
					  
					  return resultMC;
				  } catch (err) {
					  logger.error('[342][mutation C]SQL error=' + JSON.stringify(err));
				  } // try end
			  }  // if cnt end
		  //}
		  //catch(err) {
		  //	logger.error('[338][mutation C]SQL error=' + JSON.stringify( err));
		  //} // try end
		  }
		//)
		//.catch((err) => {
		//  logger.error('[352][mutation C]SQL error=' + JSON.stringify(err));
		); //
	  } // for end
	}  //if end
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
  
	if (amplification_length > 0)
	{
	  logger.info("[378][amplification C] length=" + amplification.length);
  
		//for 루프를 돌면서 Amplification카운트 만큼       //Amplification Count
	  for (let i = 0; i < amplification_length ; i++)
	  {
		let gene             = amplification[i].gene;
		let region           = amplification[i].region;
		let estimated_copy_num = amplification[i].copynumber;
		let tier             = amplification[i].tier;
		let note             = amplification[i].note;
  
		logger.info("[377][amplification] pathology_num=" + pathology_num);
		logger.info("[377][amplification] region=" + region);
		logger.info("[377][amplification] estimated_copy_num=" + estimated_copy_num);
		logger.info("[377][amplification] tier=" + tier);
		logger.info("[377][amplification] note=" + note);
		//logger.info
  
		let resultCntAC = amplificationCntMessageHandler(pathology_num, gene, estimated_copy_num, report_gb);
  
		resultCntAC.then(data2 => {
  
		//console.log('[mutationc][268]', data);
		if ( data2.cnt == 0)
		{
		  try
		  {
  
		  //insert Query 생성
		  const sql = "insert into report_amplification (pathology_num, report_date, \
					  report_gb, gene, region, \
					  estimated_copy_num, tier, note)   \
					  values(@pathology_num, getdate(), \
						  @report_gb, @gene, @region, \
						  @estimated_copy_num, @tier, @note)";
		  
		  console.log('[196][pathologyReportInsert][amplification]',sql);
			  
		  try {
			  const request = pool.request()
				  .input('pathology_num', mssql.VarChar, pathology_num)
				  .input('report_gb', mssql.VarChar, report_gb)
				  .input('gene', mssql.VarChar, gene)
				  .input('region', mssql.VarChar, region) 
				  .input('estimated_copy_num', mssql.VarChar, estimated_copy_num)
				  .input('tier', mssql.VarChar, tier)
				  .input('note', mssql.VarChar, note); 
				  
			  //const result = await request.query(sql)
			  const result = request.query(sql)
			  
			  return result;
		  } catch (err) {
			  console.error('SQL error', err);
		  } // try end
		} // try cnt end
		catch(err) {
			console.error('SQL error', err);
		} // try end
	  }
		}); //
	  } // for end
  } // if  amplipication end
}

// 병리 결과지 입력/수정/삭제
const  messageAmplificationPHandler = async (pathology_num, amplification, report_gb) => {

	const amplification_length =  amplification.length;
	logger.info("[345][amplification P] amplification_p =" + JSON.stringify( amplification));
	logger.info("[345][amplification P] length=" + amplification.length);
	logger.info("[347][amplification P] pathology_num=" + pathology_num );
	logger.info("[347][amplification P] report_gb=" + report_gb );

	let resultCnt;
	if (amplification_length > 0)
	{
	  logger.info("[378][amplification P] length=" + amplification.length);
  
		//for 루프를 돌면서 Amplification카운트 만큼       //Amplification Count
	  for (let i = 0; i < amplification_length ; i++)
	  {
		let gene             = amplification[i].gene;
		let region           = amplification[i].region;
		let estimated_copy_num = amplification[i].copynumber;
		let tier             = amplification[i].tier;
		let note             = amplification[i].note;
  
		logger.info("[377][amplification P] pathology_num=" + pathology_num);
		logger.info("[377][amplification P] region=" + region);
		logger.info("[377][amplification P] estimated_copy_num=" + estimated_copy_num);
		logger.info("[377][amplification P] tier=" + tier);
		logger.info("[377][amplification P] note=" + note);
		//logger.info
  
		resultCnt = amplificationCntMessageHandler(pathology_num, gene, estimated_copy_num, report_gb);
  
		resultCnt.then(data2 => {
  
		//console.log('[mutationc][268]', data);
		if ( data2.cnt == 0)
		{
		  try
		  {
  
		  //insert Query 생성
		  const sql = "insert into report_amplification (pathology_num, report_date, \
					  report_gb, gene, region, \
					  estimated_copy_num, tier, note)   \
					  values(@pathology_num, getdate(), \
						  @report_gb, @gene, @region, \
						  @estimated_copy_num, @tier, @note)";
		  
		  console.log('[196][pathologyReportInsert][amplification]',sql);
			  
		  try {
			  const request = pool.request()
				  .input('pathology_num', mssql.VarChar, pathology_num)
				  .input('report_gb', mssql.VarChar, report_gb)
				  .input('gene', mssql.VarChar, gene)
				  .input('region', mssql.VarChar, region) 
				  .input('estimated_copy_num', mssql.VarChar, estimated_copy_num)
				  .input('tier', mssql.VarChar, tier)
				  .input('note', mssql.VarChar, note); 
				  
			  //const result = await request.query(sql)
			  const result = request.query(sql)
			  
			  return result;
		  } catch (err) {
			  console.error('SQL error', err);
		  } // try end
		} // try cnt end
		catch(err) {
			console.error('SQL error', err);
		} // try end
	  }
		}); //
	  } // for end
  } // if  amplipication end
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
		//for 루프를 돌면서 fusion 카운트 만큼       
		for (let i = 0; i < fusion_length; i++)
		{
			let gene              = fusion[i].gene;
			let fusion_breakpoint = fusion[i].breakpoint;
			let fusion_function   = fusion[i].functions;
			let tier              = fusion[i].tier;

			resultCnt = fusionCntMessageHandler(pathology_num, gene, report_gb);

		resultCnt.then(data => {

		console.log('[mutationc][268]', data);
		if ( data.cnt == 0)
		{
			try
			{

			//insert Query 생성
			const sql = "insert into report_fusion (pathology_num, report_date, \
										report_gb, gene, fusion_breakpoint, \
										fusion_function, tier)  \
							values(@pathology_num, getdate(), \
									@report_gb, @gene, @fusion_breakpoint, \
									@fusion_function, @tier)";
			
			console.log('[255][pathologyReportInsert][fusion]',sql);
				
			try {
				const request = pool.request()
					.input('pathology_num', mssql.VarChar, pathology_num)
					.input('report_gb', mssql.VarChar, report_gb)
					.input('gene', mssql.VarChar, gene)
					.input('fusion_breakpoint', mssql.VarChar, fusion_breakpoint)
					.input('fusion_function', mssql.VarChar, fusion_function)
					.input('tier', mssql.VarChar, tier); 
					
					//const result = await request.query(sql)
					const result = request.query(sql)
				
				return result;
			} catch (err) {
				console.error('SQL error', err);
			}  // try end
		} // try cnt end
		catch(err) {
			console.error('SQL error', err);
		} // try end
	  }
	}); //
   } // for end
 } //  if end

}

// 병리 fusion 결과지 입력/수정/삭제
const  messageFusionPHandler = async (pathology_num, fusion, report_gb) => {

  const fusion_length = fusion.length;
  console.log("fusion=", fusion);
  console.log("b=", fusion.length);
  let resultCnt;

  if (fusion_length > 0)
  {
  //for 루프를 돌면서 fusion 카운트 만큼       
  for (let i = 0; i < fusion_length; i++)
  {
  	  let gene              = fusion[i].gene;
	  let fusion_breakpoint = fusion[i].breakpoint;
	  let fusion_function   = fusion[i].functions;
	  let note              = fusion[i].note;

	  resultCnt = fusionCntMessageHandler(pathology_num, gene, report_gb);

	  resultCnt.then(data => {

	  console.log('[fusionC][268]', data);
	  if ( data.cnt == 0)
	  {
		try
		{

		//insert Query 생성
		const sql = "insert into report_fusion (pathology_num, report_date, \
									report_gb, gene, fusion_breakpoint, \
									fusion_function, note)  \
						values(@pathology_num, getdate(), \
								@report_gb, @gene, @fusion_breakpoint, \
								@fusion_function, @note)";
		
		console.log('[255][pathologyReportInsert][fusion]',sql);
			
		try {
			const request = pool.request()
				.input('pathology_num', mssql.VarChar, pathology_num)
				.input('report_gb', mssql.VarChar, report_gb)
				.input('gene', mssql.VarChar, gene)
				.input('fusion_breakpoint', mssql.VarChar, fusion_breakpoint)
				.input('fusion_function', mssql.VarChar, fusion_function)
				.input('note', mssql.VarChar, note); 
				
				//const result = await request.query(sql)
				const result = request.query(sql)
			
			return result;
		} catch (err) {
			console.error('SQL error', err);
		}  // try end
	} // try cnt end
	catch(err) {
		console.error('SQL error', err);
	} // try end
  }
	}); //
   } // for end
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
  let management = extraction.managementNum;
  let dnarna = ''
  let keyblock = '';
  let tumorcellpercentage = '';
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
  logger.info("[->][pathologyReportInsert][extraction][management]" + management);
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
  
  //insert Query 생성
  const sql_patient = "update patientinfo_path \
			   set dna_rna_ext = @dnarna, management = @management, \
			   key_block = @keyblock, \
			tumor_cell_per = @tumorcellpercentage, \
			   organ = @organ, tumor_type = @tumortype, \
			   pathological_dx=@diagnosis, screenstatus = @screenstatus,\
			   msiscore=@msiscore, tumorburden=@tumorburden, examin=@examin, recheck=@recheck \
	  where  pathology_num = @pathology_num ";
	  
  logger.info("[222][pathologyReportInsert][patientinfo][sql]" + sql_patient);
	  
  try {
	  const request = pool.request()
		  .input('dnarna', mssql.VarChar, dnarna)
		  .input('management', mssql.VarChar, management) 
		  .input('keyblock', mssql.VarChar, keyblock) 
		  .input('tumorcellpercentage', mssql.VarChar, tumorcellpercentage) 
		  .input('organ', mssql.VarChar, organ) 
		  .input('tumortype', mssql.VarChar, tumortype)
		  .input('diagnosis', mssql.VarChar, diagnosis)
		  .input('pathology_num', mssql.VarChar, pathology_num)
		  .input('msiscore', mssql.VarChar, msiscore)
		  .input('tumorburden', mssql.VarChar, tumorburden)
		  .input('examin', mssql.NVarChar,examin)
		  .input('recheck',mssql.NVarChar,recheck)
		  .input('screenstatus',mssql.NVarChar,screenstatus);
		  
	  const result = await request.query(sql_patient);
	  
	  logger.info("data", JSON.stringify(result));
	  //return result;
  } catch (err) {
	  logger.error('SQL error=' , JSON.stringify(err));
  }
  
  //1. Clinically significant boiomakers

  //리포트 구분 C = Crininically, P = Prevalent
  let report_gb  = "C"   
  
  // mutation handler
  let resultMc = messageMutationCHandler(pathology_num, mutation_c, report_gb);

  resultMc.then(data2 => {
	logger.info("[361][messageMutationCHandler] data=" + JSON.stringify(data2)); 

  }); 
  
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