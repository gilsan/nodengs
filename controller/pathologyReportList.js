//================================================
//
//    병리 결과지, 보고서 조회 기능
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

const pool = new mssql.ConnectionPool(config);
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
  
  console.log("pathologyNum", pathologyNum);

  let reportGb  = "C"

  const sql = "select count(1) as count  \
			from  report_mutation \
			where pathology_num=@pathologyNum \
			and report_gb=@reportGb ";

	console.log('[55][mutationC]', sql);
			
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb) ; 
				
		const result = await request.query(sql)
			
		const data = result.recordset[0];
		return data;      
		
	} catch (err) {
		console.error('SQL error', err);
	}
}

const  messageHandler_mutation_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	let reportGb  = "C"
		  
  	//select Query 생성
  	const sql = "select pathology_num, report_date, \
			gene, amino_acid_change,nucleotide_change, \
			variant_allele_frequency, variant_id, tier \
			from  report_mutation \
			where pathology_num=@pathologyNum \
			and report_gb=@reportGb \
			order by id ";

	console.log('[84][mutationC]', sql);
			
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb) ; 
				
		const result = await request.query(sql)
			
		return result.recordset;
	} catch (err) {
		console.error('SQL error', err);
	}
}

//병리 Mutation c형 보고서 조회
exports.searchReportMutationC = (req,res, next) => {

  console.log (req.body);

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
  .catch( err  => res.sendStatus(500)); 

}

const  cntHandler_amplification_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	console.log("pathologyNum", pathologyNum);
  
	let reportGb  = "C"
  
	const sql = "select count(1) as count  \
			  from  report_amplification \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	  console.log('[139][amplification_c]', sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
}

const  messageHandler_amplification_c = async (pathologyNum) => { 

	let reportGb  = "C"

	//insert Query 생성
	const sql = "select pathology_num, report_date, \
			report_gb, gene, region, \
			estimated_copy_num, tier   \
			from report_amplification \
			where pathology_num = @pathologyNum \
			and report_gb =	@reportGb \
			order by id ";
	  
	console.log("[168][sel_amplification_c]", sql);
		   
	try {
		const request = pool.request()
		    .input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb); 
			
		const result = await request.query(sql)
		  
		return result.recordset;
	} catch (err) {
		console.error('SQL error', err);
	}
	
}

//병리 Amplification c형 보고서 조회
exports.searchReportAmplificationC = (req,res, next) => {
  
  console.log (req.body);

  let pathologyNum = req.body.pathologyNum;
  
  const resultC = cntHandler_amplification_c(pathologyNum);
  resultC.then(data_c => {

	console.log('[amplicationC][194]', data_c);
	if ( data_c.count > 0) {

  		const result = messageHandler_amplification_c(pathologyNum);
  		result.then(data => {

     		//console.log(JSON.stringfy());
     		res.json(data);
  		})
  		.catch( err  => res.sendStatus(500)); 
	} else { 
	 	//console.log(json.stringfy());
		res.json({message:"no data"});
	}
  })
  .catch( err  => res.sendStatus(500)); 

}

//병리 Fusion c형 보고서 조회
const  cntHandler_fusion_c = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	console.log("pathologyNum", pathologyNum);
  
	let reportGb  = "C"
  
	const sql = "select count(1) as count  \
			  from  report_fusion \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	  console.log('[226][fusion_c]', sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
}

//병리 Fusion c형 보고서 조회
const  messageHandler_fusion_c = async (pathologyNum) => { 

	let reportGb  = "C"
	
	//insert Query 생성
	const sql = "select pathology_num, report_date, \
					report_gb, gene, fusion_breakpoint, \
					fusion_function, tier \
					from report_fusion \
					where pathology_num = @pathologyNum \
					and report_gb =	@reportGb \
					order by id ";
	  
	console.log("[226][sel_fusion_c]",sql);
		   
	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum)
			.input('reportGb', mssql.VarChar, reportGb); 
			
		const result = await request.query(sql)
		  
		return result.recordset;
	} catch (err) {
		  console.error('SQL error', err);
	}  
   
}

//병리 Fusion c형 보고서 조회
exports.searchReportFusionC = (req,res, next) => {
  
  console.log (req.body);

  let pathologyNum = req.body.pathologyNum;
  
  const resultC = cntHandler_fusion_c(pathologyNum);
  resultC.then(data => {

	console.log('[fusion_c][202]', data);
	if ( data.count > 0) {
  		const result = messageHandler_fusion_c(pathologyNum);
  		result.then(data => {

     	//console.log(json.stringfy());
     	res.json(data);
  	  })
  	  .catch( err  => res.sendStatus(500)); 
	} else { 
	 //console.log(json.stringfy());
	  res.json({message:"no data"});
	}
  })
  .catch( err  => res.sendStatus(500)); 

}

//병리 _mutation c형 보고서 조회
const  cntHandler_mutation_p = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	console.log("pathologyNum", pathologyNum);
  
	let reportGb  = "P"
  
	const sql = "select count(1) as count  \
			  from  report_mutation \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	  console.log('[313][mutation_p]', sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
}

const  messageHandler_mutation_p = async (pathologyNum) => { 

	let reportGb  = "P"

	//select Query 생성
	const sql = "select pathology_num, report_date, \
	            gene, amino_acid_change,nucleotide_change, \
	            variant_allele_frequency, variant_id, tier \
	            from  report_mutation \
	            where pathology_num = @pathologyNum \
	            and report_gb =	@reportGb \
				order by id ";

	console.log(sql);
	
	try {
	const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum)
		.input('reportGb', mssql.VarChar, reportGb) ; 
		
	  const result = await request.query(sql)
	
	  return result.recordset;
	} catch (err) {
	  console.error('SQL error', err);
	}
	
 }

 //병리 Mutation p형 보고서 조회
 exports.searchReportMutationP = (req,res, next) => {
 
   console.log (req.body);
 
   let pathologyNum = req.body.pathologyNum;
   
   const resultC = cntHandler_mutation_p(pathologyNum);
   resultC.then(data => {

     console.log('[mutationp][368]', data);
     if ( data.count > 0) {
       const result = messageHandler_mutation_p(pathologyNum);
       result.then(data => {
 
	   //console.log(json.stringfy());
	   res.json(data);
     })
     .catch( err  => res.sendStatus(500));
	} else { 
	 //console.log(json.stringfy());
	  res.json({message:"no data"});
	}
  })
  .catch( err  => res.sendStatus(500));  
 
 }


//병리 amplification p형 보고서 조회
const  cntHandler_amplification_p = async (pathologyNum) => { 
	await poolConnect; // ensures that the pool has been created
	
	console.log("pathologyNum", pathologyNum);
  
	let reportGb  = "P"
  
	const sql = "select count(1) as count  \
			  from  report_amplification \
			  where pathology_num=@pathologyNum \
			  and report_gb=@reportGb ";
  
	  console.log('[313][amplification_p]', sql);
			  
	  try {
		  const request = pool.request()
			  .input('pathologyNum', mssql.VarChar, pathologyNum)
			  .input('reportGb', mssql.VarChar, reportGb) ; 
				  
		  const result = await request.query(sql)
			  
		  const data = result.recordset[0];
		  return data;      
		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
}

 const  messageHandler_amplification_p = async (pathologyNum) => { 
 
	 let reportGb  = "P"
 
	 //insert Query 생성
	 const sql = "select pathology_num, report_date, \
			 report_gb, gene, region, \
			 estimated_copy_num, note   \
			 from report_amplification \
			 where pathology_num = @pathologyNum \
			 and report_gb = @reportGb \
			 order by id ";
	   
	 console.log(sql);
			
	 try {
		 const request = pool.request()
			 .input('pathologyNum', mssql.VarChar, pathologyNum)
			 .input('reportGb', mssql.VarChar, reportGb); 
			 
		 const result = await request.query(sql)
		   
		 return result.recordset;
	 } catch (err) {
		 console.error('SQL error', err);
	 }
	 
 }
 
 //병리 Amplification p형 보고서 조회
 exports.searchReportAmplificationP = (req,res, next) => {
 
   console.log (req.body);
 
   let pathologyNum = req.body.pathologyNum;
   
   const resultC = cntHandler_amplification_p(pathologyNum);
   resultC.then(data => {

     console.log('[Amplification][368]', data);
     if ( data.count > 0) {

     const result = messageHandler_amplification_p(pathologyNum);
     result.then(data => {
 
	  //console.log(json.stringfy());
	  res.json(data);
    })
   .catch( err  => res.sendStatus(500)); 
   } else { 
   //console.log(json.stringfy());
   res.json({message:"no data"});
   }
  })
  .catch( err  => res.sendStatus(500));  
 
 }


 //병리 fusion p형 보고서 조회
 const  cntHandler_fusion_p = async (pathologyNum) => { 
	 await poolConnect; // ensures that the pool has been created
	 
	 console.log("pathologyNum", pathologyNum);
   
	 let reportGb  = "P"
   
	 const sql = "select count(1) as count  \
			   from  report_fusion \
			   where pathology_num=@pathologyNum \
			   and report_gb=@reportGb ";
   
	   console.log('[488][fusion_p]', sql);
			   
	   try {
		   const request = pool.request()
			   .input('pathologyNum', mssql.VarChar, pathologyNum)
			   .input('reportGb', mssql.VarChar, reportGb) ; 
				   
		   const result = await request.query(sql)
			   
		   const data = result.recordset[0];
		   return data;      
		   
	   } catch (err) {
		   console.error('SQL error', err);
	   }
 }

  //병리 fusion p형 보고서 조회
 const  messageHandler_fusion_p = async (pathologyNum) => { 
 
	 let reportGb  = "P"
	 
	 //insert Query 생성
	 const sql = "select pathology_num, report_date, \
					report_gb, gene, fusion_breakpoint, \
					fusion_function, tier \
					from report_fusion \
					where pathology_num = @pathologyNum \
					and report_gb =	@reportGb \
					order by id ";
	
	 console.log(sql);
			
	 try {
		 const request = pool.request()
			 .input('pathologyNum', mssql.VarChar, pathologyNum)
			 .input('reportGb', mssql.VarChar, reportGb); 
			 
		 const result = await request.query(sql)
		   
		 return result.recordset;
	 } catch (err) {
		   console.error('SQL error', err);
	 }  
	
 }

 //병리 Fusion p형 보고서 조회
 exports.searchReportFusionP = (req,res, next) => {
 
   console.log (req.body);
 
   let pathologyNum = req.body.pathology_num;
   
     
   const resultC = cntHandler_fusion_p(pathologyNum);
   resultC.then(data => {

     console.log('[Fusion][545]', data);
     if ( data.count > 0) {

 
       const result = messageHandler_fusion_p(pathologyNum);
       result.then(data => {
 
	     //console.log(json.stringfy());
	     res.json(data);
      })
      .catch( err  => res.sendStatus(500)); 
 
    } else { 
	//console.log(json.stringfy());
	res.json({message:"no data"});
   }
   })
   .catch( err  => res.sendStatus(500));  
 }
 