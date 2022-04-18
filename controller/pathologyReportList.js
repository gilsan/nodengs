//================================================
//
//    병리 결과지, 보고서 조회 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

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

const  cntHandler_mutation_c = async (pathologyNum) => { 
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[33][mutationC]pathologyNum=' + pathologyNum);

  let reportGb  = "C"

  const sql = "select count(1) as count  \
			from  report_mutation \
			where pathology_num=@pathologyNum \
			and report_gb=@reportGb ";

	logger.info('[42][mutationC]sql=' + sql);
			
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb) ; 
				
		const result = await request.query(sql)
			
		const data = result.recordset[0];
		return data;      
		
	} catch (error) {
		logger.error('[55][mutation C]err=' + error.message);
	}
}

const  messageHandler_mutation_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	let reportGb  = "C"
  
	logger.info('[63][mutation C]pathologyNum=' + pathologyNum);
		  
  	//select Query 생성
  	const sql = "select pathology_num, report_date, \
			gene, amino_acid_change,nucleotide_change, isnull(transcript, '') transcript, \
			variant_allele_frequency, variant_id, isnull(tier, '') tier, seq \
			from  report_mutation \
			where pathology_num=@pathologyNum \
			and report_gb=@reportGb \
			order by seq ";

	logger.info('[74][mutationC]sel sql=' + sql);
			
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb) ; 
				
		const result = await request.query(sql)
			
		return result.recordset;
	} catch (error) {
		logger.error('[85][muttation C]sel err=' + error.message);
	}
}

//병리 Mutation c형 보고서 조회
exports.searchReportMutationC = (req,res, next) => {

  logger.info('[109][searchMutation C]data=' + JSON.stringify(req.body));

  let pathologyNum = req.body.pathologyNum;
  
  const resultC = cntHandler_mutation_c(pathologyNum);
  resultC.then(data => {

	console.log('[mutation][109]', data);
	if ( data.count > 0) {

 		const result = messageHandler_mutation_c(pathologyNum);
  		result.then(data => {

     	//console.log(json.stringfy());
		 res.json(data);
		});
	} else { 
	 	//console.log(json.stringfy());
		 res.json({message:"no data"});
	}
  })
  .catch( error  =>{ 
	logger.error('[114][search Mutation C]err=' + error.message);
	res.sendStatus(500);
  });

}

const  cntHandler_amplification_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	logger.info("[122][amplication C Count]pathologyNum=" + pathologyNum);
  
	let reportGb  = "C"
  
	const sql = "select count(1) as count  \
			  from  report_amplification \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	logger.info('[132][amplification_c Count]sql=' + sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (error) {
		logger.error('[145][amplication c Count]err=' + error.message);
	  }
}

const  messageHandler_amplification_c = async (pathologyNum) => { 

	let reportGb  = "C"

	//insert Query 생성
	const sql = "select pathology_num, report_date, \
			report_gb, gene, region, \
			estimated_copy_num, isnull(tier, '') tier, seq   \
			from report_amplification \
			where pathology_num = @pathologyNum \
			and report_gb =	@reportGb \
			order by seq ";
	logger.info('[161][sel_amplication_c]data=' + pathologyNum);
	logger.info("[162][sel_amplification_c]sql=" + sql);
	
	try {
		const request = pool.request()
		    .input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb); 
			
		const result = await request.query(sql)
		  
		return result.recordset;
	} catch (error) {
		logger.error('[173][sel_amplicaton_c]err=' + error.message);
	}
	
}

//병리 Amplification c형 보고서 조회
exports.searchReportAmplificationC = (req,res, next) => {
  
  logger.info('[181][sel_amplification_c]data=' +  JSON.stringify(req.body));

  let pathologyNum = req.body.pathologyNum;
  
  const resultC = cntHandler_amplification_c(pathologyNum);
  resultC.then(data_c => {

	console.log('[amplicationC][188]', data_c);
	if ( data_c.count > 0) {

  		const result = messageHandler_amplification_c(pathologyNum);
  		  result.then(data => {

     		//console.log(JSON.stringfy());
     		res.json(data);
  		  })
		  .catch( error  => {
			  logger.error('[198][sel_amplication_c]err=' + error.message);
			  res.sendStatus(500)
		  }
		); 
	} else { 
	 	//console.log(json.stringfy());
		res.json({message:"no data"});
	}
  })
  .catch( error  => {
	logger.error('[208][cnt_amplication_c]err=' + error.message);
	  res.sendStatus(500)
  }); 

}

//병리 Fusion c형 보고서 조회
const  cntHandler_fusion_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	logger.info('[218][cnt_fusion_c]pathologyNum=' + pathologyNum);
  
	let reportGb  = "C"
  
	const sql = "select count(1) as count  \
			  from  report_fusion \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	logger.info('[227][cnt_fusion_c]sql=' + sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (error) {
		logger.error('[240][cnt_fusion_cd]err=' + error.message);
	  }
}

//병리 Fusion c형 보고서 조회
const  messageHandler_fusion_c = async (pathologyNum) => { 

	let reportGb  = "C"
	
	//insert Query 생성
	const sql = "select pathology_num, report_date, \
					report_gb, gene, fusion_breakpoint, \
					fusion_function, isnull(tier, '') tier, seq, isnull(readcount, '') readcount \
					from report_fusion \
					where pathology_num = @pathologyNum \
					and report_gb =	@reportGb \
					order by seq ";
	  
	logger.info("[258][sel_fusion_c]sql=" + sql);
		   
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb); 
			
		const result = await request.query(sql)
		  
		return result.recordset;
	} catch (error) {
		logger.error('[269][sel_fusion_c]err=' + error.message);
	}  
   
}

//병리 Fusion c형 보고서 조회
exports.searchReportFusionC = (req,res, next) => {
  
  logger.info('[277][sel_fusion_c]data=' + JSON.stringify (req.body));

  let pathologyNum = req.body.pathologyNum;
  
  const resultC = cntHandler_fusion_c(pathologyNum);
  resultC.then(data => {

	console.log('[fusion_c][284]', data);
	if ( data.count > 0) {
  		const result = messageHandler_fusion_c(pathologyNum);
  		result.then(data => {

     	//console.log(json.stringfy());
     	res.json(data);
  	  })
  	  .catch( error  => {
		logger.error('[293][sel_fusion_c]err=' + error.message);
		res.sendStatus(500);
	  }); 
	} else { 
	 //console.log(json.stringfy());
	  res.json({message:"no data"});
	}
  })
  .catch( error  =>{
	logger.error('[302][cnt_fusion_c]err=' + error.message);
	res.sendStatus(500);
  }); 

}

//병리 _mutation c형 보고서 조회
const  cntHandler_mutation_p = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	logger.info("[312][cnt_mutation_p]pathologyNum=" + pathologyNum);
  
	let reportGb  = "P"
  
	const sql = "select count(1) as count  \
			  from  report_mutation \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	console.log('[321][cnt_mutation_p]sql=' + sql);
			  
	try {
	  const request = pool.request()
		  .input('pathologyNum', mssql.VarChar, pathologyNum)
		  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	} catch (error) {
		logger.error('[334][cnt_mutation_p]err=' + error.message);
	}
}

const  messageHandler_mutation_p = async (pathologyNum) => { 

	let reportGb  = "P"

	//select Query 생성
	const sql = "select pathology_num, report_date, \
	            gene, amino_acid_change,nucleotide_change, isnull(transcript, '') traanscript, \
	            variant_allele_frequency, variant_id, isnull(tier, '') tier, seq \
	            from  report_mutation \
	            where pathology_num = @pathologyNum \
	            and report_gb =	@reportGb \
				order by seq ";

	logger.info('[351][sel_mutation_p]pathologyNum=' + pathologyNum); 
	logger.info('[351][sel_mutation_p]sql=' + sql);
	
	try {
	const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum)
		.input('reportGb', mssql.VarChar, reportGb) ; 
		
	  const result = await request.query(sql)
	
	  return result.recordset;
	} catch (error) {
		logger.error('[363][sel_mutation_p]err=' + error.message);
	}
	
 }

 //병리 Mutation p형 보고서 조회
 exports.searchReportMutationP = (req,res, next) => {
 
	logger.info('[371][sel_mutation_p]data=' + JSON.stringify (req.body));
 
   let pathologyNum = req.body.pathologyNum;
   
   const resultC = cntHandler_mutation_p(pathologyNum);
   resultC.then(data => {

     console.log('[mutationp][378]', data);
     if ( data.count > 0) {
       const result = messageHandler_mutation_p(pathologyNum);
       result.then(data => {
 
	   //console.log(json.stringfy());
	   res.json(data);
     })
	 .catch( error  =>{ 
		logger.error('[387][sel_mutation_p]err=' + error.message);
		res.sendStatus(500);
	 });
	} else { 
	 //console.log(json.stringfy());
	  res.json({message:"no data"});
	}
  })
  .catch( error => {
	logger.error('[396][cnt_mutation_P]err=' + error.message);
	res.sendStatus(500);
  });  
 
 }

//병리 amplification p형 보고서 조회
const  cntHandler_amplification_p = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	logger.info("[406][cnt_amplication_p]pathologyNum=" + pathologyNum);
  
	let reportGb  = "P"
  
	const sql = "select count(1) as count  \
			  from  report_amplification \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	logger.info('[415][cnt_amplification_p]sql=' + sql);
			  
	try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	} catch (error) {
		logger.error('[428][cnt_amplication_p]err=' + error.message);
	}
}

const  messageHandler_amplification_p = async (pathologyNum) => { 
 
	let reportGb  = "P"
 
	//insert Query 생성
	const sql = "select pathology_num, report_date, \
			 report_gb, gene, region, \
			 estimated_copy_num, isnull(note, '') note, seq   \
			 from report_amplification \
			 where pathology_num = @pathologyNum \
			 and report_gb = @reportGb \
			 order by seq ";
	
	logger.info('[445][sel_amplifiaction_p]pathologyNum=' + pathologyNum);
	logger.info('[445][sel_amplification_p]sql=' + sql);
			
	try {
		 const request = pool.request()
			 .input('pathologyNum', mssql.VarChar, pathologyNum)
			 .input('reportGb', mssql.VarChar, reportGb); 
			 
		 const result = await request.query(sql)
		   
		 return result.recordset;
	} catch (error) {
		logger.error('[547][sel_amplification_p]err=' + error.message);
	}
	 
}
 
 //병리 Amplification p형 보고서 조회
 exports.searchReportAmplificationP = (req,res, next) => {
 
   logger.info('[465][sel_amplification_p]data=' + JSON.stringify(req.body));
 
   let pathologyNum = req.body.pathologyNum;
   
   const resultC = cntHandler_amplification_p(pathologyNum);
   resultC.then(data => {

    console.log('[Amplification][472]', data);
    if ( data.count > 0) {

    const result = messageHandler_amplification_p(pathologyNum);
    result.then(data => {
 
	  //console.log(json.stringfy());
	  res.json(data);
    })
    .catch( error  => { 
		logger.error('[482][sel_amplification_p]err=' + error.message);
		res.sendStatus(500)
	}); 
   } else { 
   //console.log(json.stringfy());
   res.json({message:"no data"});
   }
  })
  .catch( error  => {
	logger.error('[491][cnt_amplication_p]err=' + error.message);
	res.sendStatus(500)
  });  
 
 }

 //병리 fusion p형 보고서 조회
 const  cntHandler_fusion_p = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	 
	logger.info("[501][cnt_fusion_p]pathologyNum=" + pathologyNum);
   
	let reportGb  = "P"
   
	const sql = "select count(1) as count  \
			   from  report_fusion \
			   where pathology_num=@pathologyNum \
			   and report_gb=@reportGb ";
   
	logger.info('[510][cnt_fusion_p]sql=' + sql);
			   
	try {
		   const request = pool.request()
			   .input('pathologyNum', mssql.VarChar, pathologyNum)
			   .input('reportGb', mssql.VarChar, reportGb) ; 
				   
		   const result = await request.query(sql)
			   
		   const data = result.recordset[0];
		   return data;      
		   
	} catch (error) {
	   console.error('[523][cnt_fusion_p]err=' + error.message);
	}
 }

  //병리 fusion p형 보고서 조회
 const  messageHandler_fusion_p = async (pathologyNum) => { 
 
	let reportGb  = "P"
	 
	//insert Query 생성
	const sql = "select pathology_num, report_date, \
					report_gb, gene, fusion_breakpoint, \
					fusion_function, isnull(tier, '') tier, seq, isnull(readcount, '') readcount \
					from report_fusion \
					where pathology_num = @pathologyNum \
					and report_gb =	@reportGb \
					order by seq ";
	
	logger.info('[541][sel_fusion_p]pathologyNum=' + pathologyNum);
	logger.info('[541][sel_fusion_p]sql=' + sql);
	
	try {
		const request = pool.request()
			 .input('pathologyNum', mssql.VarChar, pathologyNum)
			 .input('reportGb', mssql.VarChar, reportGb); 
			 
		const result = await request.query(sql)
		   
		return result.recordset;
	} catch (error) {
		logger.error('[553][sel_fusion_p]err='+ error.message);
	}  
 }

 //병리 Fusion p형 보고서 조회
 exports.searchReportFusionP = (req,res, next) => {
 
	logger.info('[560][sel_fusion_p]data=' + JSON.stringify(req.body));
 
   let pathologyNum = req.body.pathology_num;
   
     
   const resultC = cntHandler_fusion_p(pathologyNum);
   resultC.then(data => {

    console.log('[Fusion][568]', data);
    if ( data.count > 0) {

       const result = messageHandler_fusion_p(pathologyNum);
       result.then(data => {
 
	     //console.log(json.stringfy());
	    res.json(data);
      })
      .catch( error  => {
		logger.error('[578][sel_fusion_p]err=' + error.message);
		res.sendStatus(500)
	  }); 
 
    } else { 
	//console.log(json.stringfy());
	res.json({message:"no data"});
   }
   })
   .catch( error  => {
	   logger.error('[588][cnt_fusion_p]err=' + error.message);	   
	   res.sendStatus(500)
	});  
 }
 