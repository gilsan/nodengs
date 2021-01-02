// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const amlReportInsert = require('./amlReportInsert');
const logger = require('../common/winston');
const { json } = require('body-parser');

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

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;
  logger.info('[33][screen][report_detected_variants]specimenNo=' + specimenNo);

  const sql ="select * from [dbo].[report_detected_variants] where specimenNo=@specimenNo ";
  logger.info('[35][screen][report_detected_variants]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (error) {      
    logger.error('[45][screen][report_detected_variants]error=' + error.message);
  }
}

// report_detected_variants 를 specimenNo 로  조회
 exports.screenLists = (req,res, next) => {
    
  logger.info('[52][screen][report_detected_variants]data=' + JSON.stringify(req.body));
    const result = messageHandler(req);
    result.then(data => {

      // console.log('[50][screenstatus]',data);
 
       res.json(data);
  })
  .catch( error  =>{
      
    logger.error('[62][screen][report_detected_variants]error=' + error.message);
    res.sendStatus(500)});
 };

 ////////////////////////////////////////////////////////////
 const commentHander = async (specimenNo) => {

  logger.info('[69][screen][comment]specimenNo=' + specimenNo);

  const sql ="select * from [dbo].[report_comments] where specimenNo=@specimenNo ";
  
  logger.info('[33][screen][comment]specimenNo=' + specimenNo);

  try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
  } catch (error) {
    logger.error('[33][screen][comment handler]err=' + error.message);
  }
 }

 // report_comments 에서 specimenNo 로 조회
 exports.commentLists = (req,res,next) => {
  
  logger.info('[90][screen][comment list]data=' + JSON.stringify(req.body));

  const result = commentHander(req.body.specimenNo);
  result.then(data => {
   res.json(data);
  })
  .catch(error => {
    logger.info('[97][screen][comment]err=' + error.message);
  })
 }

 ////////////////////////////////////////////////////////////
 const patientHandler = async (specimenNo) => {

  logger.info('[104][screen][patient diag]specimenNo=' + specimenNo);
  const sql ="select * from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";
  logger.info('[106][screen][patient_diag]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result.recordset;
  } catch (error) {      
    logger.error('[116][screen][patient_diag]err=' + error.message);
  }
}

// report_comments 에서 specimenNo 로 조회
exports.patientLists = (req,res,next) => {
   const result = patientHandler(req.body.specimenNo);
   result.then(data => {
         res.json(data);
   })
}

 // 검사자 screenstatus 상태 스크린 완료 로 변경
 const  messageHandler2 = async (specimenNo, status, chron,flt3ITD,leukemia, examin, recheck) => {
    await poolConnect; // ensures that the pool has been created

  logger.info('[131][screen][patient_diag update]specimenNo=' + specimenNo);
  logger.info('[131][screen][patient_diag update]status=' + status);
  logger.info('[131][screen][patient_diag update]chron=' + chron);
  logger.info('[131][screen][patient_diag update]flt3ITD=' + flt3ITD);
  logger.info('[131][screen][patient_diag update]leukemia=' + leukemia);
  logger.info('[131][screen][patient_diag update]examin=' + examin);
  logger.info('[131][screen][patient_diag update]recheck=' + recheck);
    
    let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@status, \
                 leukemiaassociatedfusion=@leukemia,  \
                 chromosomalanalysis=@chron, \
                 FLT3ITD=@flt3ITD , examin=@examin, recheck=@recheck \
             where specimenNo=@specimenNo ";   
    logger.info('[147][screen][patient_diag update]sql=' + sql);
    try {
        const request = pool.request()
            .input('status', mssql.VarChar, status)
            .input('flt3ITD', mssql.VarChar, flt3ITD)
            .input('leukemia', mssql.VarChar, leukemia)
            .input('chron', mssql.VarChar, chron)
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[33][screen][patient_diag update]error=' + error.message);
    }
  }

 // 검사자 screenstatus 상태 스크린 완료 로 변경
 const  messageHandler3 = async (specimenNo, status) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[169][screen][patient_diag status update]status=' + status);
  logger.info('[169][screen][patient_diag status update]specimenNo=' + specimenNo);
  
   let sql ="update [dbo].[patientinfo_diag] \
           set screenstatus=@status \
           where specimenNo=@specimenNo ";
 
  try {
      const request = pool.request()
          .input('status', mssql.VarChar, status)
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (error) {
      logger.error('[185][screen][patient_diag status update]error=', error.message);
  }
}

  // 스크린 완료 comments
const insertCommentHandler = async(specimenNo, comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;
  logger.info('[192][screen][comments update]specimenNo=' + specimenNo);
  logger.info('[192][screen][comments update]comments=' + JSON.stringify( comments));

  for (i = 0; i < comments.length; i++)
  {
	  const gene       = comments[i].gene;
      const variants    = comments[i].variant_id;
      const comment    = comments[i].comment;
      const reference  = comments[i].reference;

      logger.info('[169][screen][comments update]gene=' + gene);
      logger.info('[169][screen][comments update]variants=' + variants);  
      logger.info('[169][screen][comments update]comment=' + comment);
      logger.info('[169][screen][comments update]reference=' + reference);

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		             gene, variants, comment, reference)   \
					  values(@specimenNo, getdate(), \
					   @gene, @variants, @comment, @reference)";

    logger.info('[214][screen][comments]update qry=' + qry);

	  try {
		  const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('comment', mssql.NVarChar, comment)
			      .input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('reference', mssql.NVarChar, reference); 
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
      logger.error('[214][screen][comments]update err=' + error.message);
	  }
	}  // End of For Loop
    return commentResult;
  }

 //////////////////////////////////////////////////////////////////////////////////
 // 스크린 완료 Detected Variants 
  const insertHandler = async (specimenNo, detected_variants) => {
 // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[237][screen][detected_variants update] specimenNo=' + specimenNo);
  logger.info('[237][screen][detected_variants update] detected_variants=' + JSON.stringify( detected_variants));

  let result;
  for (i = 0; i < detected_variants.length; i++)
  {
   const igv               = detected_variants[i].igv;
   const sanger            = detected_variants[i].sanger;
   const gene              = detected_variants[i].gene;
   const functional_impact = detected_variants[i].functionalImpact;
   const transcript        = detected_variants[i].transcript;
   
   const exon              = detected_variants[i].exonIntro;
   const nucleotide_change = detected_variants[i].nucleotideChange;
   const amino_acid_change = detected_variants[i].aminoAcidChange;
   const zygosity          = detected_variants[i].zygosity;
   const vaf               = detected_variants[i].vafPercent;
   const reference         = detected_variants[i].references;
   const cosmic_id         = detected_variants[i].cosmicID;
   const type              = detected_variants[i].type;

   logger.info('[258][screen][detected_variants update] specimenNo=' + specimenNo);
   logger.info('[258][screen][detected_variants update] igv=' + igv);
   logger.info('[258][screen][detected_variants update] sanger=' + sanger);
   logger.info('[258][screen][detected_variants update] gene=' + gene);
   logger.info('[258][screen][detected_variants update] functional_impact=' + functional_impact);
   logger.info('[258][screen][detected_variants update] transcript=' + transcript);
   logger.info('[258][screen][detected_variants update] exon=' + exon);
   logger.info('[258][screen][detected_variants update] nucleotide_change=' + nucleotide_change);
   logger.info('[258][screen][detected_variants update] amino_acid_change=' + amino_acid_change);
   logger.info('[258][screen][detected_variants update] zygosity=' + zygosity);
   logger.info('[258][screen][detected_variants update] vaf=' + vaf);
   logger.info('[258][screen][detected_variants update] reference=' + reference);
   logger.info('[258][screen][detected_variants update] cosmic_id=' + cosmic_id);
   logger.info('[258][screen][detected_variants update] type=' + type);

   //insert Query 생성;
   const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
            functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
            vaf, reference, cosmic_id, igv, sanger, type) \
            values(@specimenNo, getdate(),  @gene, \
              @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
            @vaf, @reference, @cosmic_id, @igv, @sanger, @type)";
          
   logger.info('[214][screen][detected_variants insert] sql=' + qry);

     try {
         const request = pool.request()
           .input('specimenNo', mssql.VarChar, specimenNo)
           .input('gene', mssql.VarChar, gene)
           .input('functional_impact', mssql.VarChar, functional_impact)
           .input('transcript', mssql.VarChar, transcript)
           .input('exon', mssql.VarChar, exon)
           .input('nucleotide_change', mssql.VarChar, nucleotide_change)
           .input('amino_acid_change', mssql.VarChar, amino_acid_change)
           .input('zygosity', mssql.VarChar, zygosity)
           .input('vaf', mssql.VarChar, vaf)
           .input('reference', mssql.VarChar, reference)
           .input('cosmic_id', mssql.VarChar, cosmic_id)
           .input('igv', mssql.VarChar, igv)
           .input('sanger', mssql.VarChar, sanger)
           .input('type', mssql.VarChar, type);
           
          result = await request.query(qry);         
   
     } catch (error) {
      logger.error('[214][screen][detected_variants insert] err=' + error.message);
     }
     
  } // End of For Loop
     return result;
 }
// 검체 검출 여부 등록
 const updateDetectedHandler = async (specimenNo, detectedtype) => {
     let type;
     if ( detectedtype === 'detected') {
        type = '0';
     } else {
       type = '1';
     }
     logger.info('[316][screen][detected update] specimenNo=' + specimenNo);
     logger.info('[316][screen][detected update] type=' + type);

     let sql ="update [dbo].[patientinfo_diag] \
     set detected=@type  where specimenNo=@specimenNo ";  

     logger.info('[323][screen][detected_variants update] sql=' + sql);

     try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('type', mssql.VarChar, type);
        
       result = await request.query(sql);         

     } catch (error) {
       logger.error('[333][screen][detected_variants update] err=' + error.message);
     }

     return result;

 }

 // 스크린 완료
 exports.insertScreen = (req, res, next) => {
    
  logger.info('[214][screen][screen update]data=' + JSON.stringify(req.body));

    const chron = req.body.chron ;
    const flt3ITD = req.body.flt3itd ; 
    const leukemia = req.body.leukemia;

    const specimenNo        = req.body.specimenNo;
    const detected_variants = req.body.detected_variants;
    const comments          = req.body.comments;
    const detectedtype      = req.body.resultStatus;
    const examin            = req.body.patientInfo.examin;
    const recheck           = req.body.patientInfo.recheck;

    logger.info('[357][screen][screen update] specimenNo=' + specimenNo);
    logger.info('[357][screen][screen update] detecte type=' + detectedtype);
    logger.info('[357][screen][screen update] examin=' + examin);
    logger.info('[357][screen][screen update] recheck=' + recheck);

    const result2 = deleteHandler(specimenNo);
    result2.then(data => {
   
      const result = insertHandler(specimenNo, detected_variants);
      result.then(data => {

        // console.log('[157][insertScreen]', data);
        const commentResult2 = deleteCommentHandler(specimenNo, comments);
        commentResult2.then(data => {
        
          // console.log('[157][insertScreen]', data);
          const commentResult = insertCommentHandler(specimenNo, comments);
          commentResult.then(data => {
             const detectedResult = updateDetectedHandler(specimenNo, detectedtype);
             detectedResult.then(data => {
                // 검사자 상태변경
                const statusResult = messageHandler2(specimenNo, '1', chron, flt3ITD, leukemia, examin, recheck);
                statusResult.then(data => {
                     res.json({message: 'OK'});
                 });
             });

            });
        });
      });
         
     })
     .catch( error  => {
      logger.error('[390][screen][screen update]err=' + error.message);
       res.sendStatus(500)
      });
     
 };

///////////////////////////////////////////////////////////////////////////////////////
const deleteCommentHandler = async (specimenNo) => {
  let  commentResult;
	  //delete Query 생성                     
    const qry = "delete report_comments where specimenNo=@specimenNo";                
    logger.info('[401][screen][comments delete] specimenNo=' + specimenNo);
    logger.info('[401][screen][comments delete] sql=' + qry);

	  try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
      logger.info('[411][screen][comments delete] err=' + error.message);
	  }

    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const deleteHandler = async (specimenNo) => {
   
    //delete Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
    logger.info('[214][screen][detected_variants]del specimenNo=' + specimenNo);
    logger.info("[466][screen][detected_variants]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[214][screen][detected_variants update] err=' + error.message);
    }
      
    return result;
}

 // 검진 EMR 전송후 screenstatus 변경
 exports.emrSendUpdate = (req, res, next) => {
     const specimenNo    = req.body.specimenNo;
     logger.info('[441][screen][patient diag update]specimenNo=' + specimenNo);

     const result = messageHandler3(specimenNo, '3');
     result.then(data => {
        res.json({message: 'EMR 전송 상태 갱신 했습니다.'})
     })
 }

  // 병리 DB 저장 완료
  const  messageHandlerPathology = async (pathologyNum) => {
    logger.info('[[451][screen][finishPathologyScreen]pathologyNum=' +  pathologyNum); 
    let sql ="update [dbo].[patientinfo_path] \
            set screenstatus='1' \
            where pathology_num=@pathologyNum ";
   logger.info('[455][screen][finishPathologyScreen]update sql=' + sql);
  
   try {
       const request = pool.request()
           .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
             
       const result = await request.query(sql)
       console.dir( result);
       
       return result;
   } catch (error) {
    logger.error('[455][screen][finishPathologyScreen]update err=' + error.message);
   }

 }

exports.finishPathologyScreen = (req, res, next) => {
    const pathologyNum = req.body.pathologyNum;
   
    const result = messageHandlerPathology(pathologyNum);
    result.then(data => {
       
        res.json({message: "SUCCESS"})
    }) 
    .catch( error  => {
      logger.info('[455][screen][finishPathologyScreen]update err=' + error.message);  
       res.sendStatus(500)
    });
}

const messageHandlerStat_log = async (pathologyNum ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[486][stat_log] pathology_num=" + pathologyNum);

	//select Query 생성
	let sql2 = "insert_stat_log_path";

	logger.info("[493][stat_log] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar(300), pathologyNum)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultSt;
		await request.execute(sql2, (err, recordset, returnValue) => {
			if (err)
			{
				logger.error("[504][stat_log]err message=" + err.message);
			}

			logger.info("[504][stat_log]recordset="+ recordset);
			logger.info("[504][stat_log]returnValue="+ returnValue);

			resultSt = returnValue;
			logger.info("[504]resultSt=" + JSON.stringify(resultSt));
		});
		
		return resultSt;
	} catch (error) {
		logger.error('[516][stat_log]err=' + error.message);
	} // try end
}

// 병리 EMR전송 완료
const  messageHandlerEMR = async (pathologyNum) => {
  logger.info('[522][sendEMR]pathologyNum' + pathologyNum); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='3', \
            sendEMRDate = getdate()  \
          where pathology_num=@pathologyNum ";
  logger.info('[342][sendEMR]sql=' + sql);

 try {
     const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
           
     const result = await request.query(sql)
     console.dir( result);
     
     return result;
 } catch (error) {
  logger.error('[342][sendEMR]err=' + error.message);
 }
}

exports.finishPathologyEMRScreen = (req, res, next) => {
  const pathologyNum = req.body.pathologyNum;
  logger.info('[544][screen][finishPathologyScreen]',pathologyNum);

  const resultLog = messageHandlerStat_log(pathologyNum);
  logger.info('[655][screen][finishPathologyScreen]',resultLog); 
    //  res.json({message: 'SUCCESS'});

  const result = messageHandlerEMR(pathologyNum);
  result.then(data => {
    console.log('[661][screen][finishPathologyScreen]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( err  => res.sendStatus(500));
}

// 병리 EMR전송 완료
const  messageHandlerPath = async (pathologyNum) => {
  logger.info('[560][screen][update patient_path]pathologyNum=' + pathologyNum);
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='2' \
          where pathology_num=@pathologyNum ";
  logger.info('[564][screen][update patient_path]sql=' + sql);
  
 try {
     const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
           
     const result = await request.query(sql)
     console.dir( result);
     
     return result;
 } catch (error) {
  logger.error('[575][screen][update patient_path]err=' + error.message);  
 }
}

exports.pathologyReportUpdate = (req, res, next) => {
  const pathologyNum = req.body.pathologyNum;
  logger.info('[575][screen][update patient_path]pathologyNum=' + pathologyNum );  

  const result = messageHandlerPath(pathologyNum);
  result.then(data => {
    //console.log('[screenList][558][pathologydUpdate]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( error  => {
    logger.error('[575][screen][update patient_path]err=' + error.message);  
    res.sendStatus(500)
  });
}