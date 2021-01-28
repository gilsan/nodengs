// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const amlReportInsert = require('./amlReportInsert');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;
  logger.info('[17][screenList][find detected_variant]specimenNo=' + specimenNo); 

  const sql ="select * from [dbo].[report_detected_variants] where specimenNo=@specimenNo ";
  logger.info('[20][screenList][find detectd_variant]sql=' + sql); 

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[30][screenList][find detectd_varint]err=' + error.message);
  }
}

// report_detected_variants 를 specimenNo 로  조회
 exports.screenLists = (req,res, next) => {
    
  logger.info('[37][screenList][detected_variants]req=' + JSON.stringify(req.body));
    const result = messageHandler(req);
    result.then(data => {

      // console.log('[50][screenstatus]',data);
 
       res.json(data);
  })
  .catch( error => {
    logger.error('[47][screenList][find detected variant]err=' + error.message);
    res.sendStatus(500);
  });
 };

 ////////////////////////////////////////////////////////////
 const commentHander = async (specimenNo) => {
    logger.info('[54][screenList][find comments]specimenNo=' + specimenNo); 
    const sql ="select * from [dbo].[report_comments] where specimenNo=@specimenNo ";
    logger.info('[56][screenList][find comments]sql=' +sql);

    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[66][screenList][find comments]error=' + error.message);
    }

 }

 // report_comments 에서 specimenNo 로 조회
 exports.commentLists = (req,res,next) => {
    logger.info('[73][screenList][find comments]req=' + JSON.stringify(req.body));
     const result = commentHander(req.body.specimenNo);
     result.then(data => {
           res.json(data);
     })
     .catch(error => {
      logger.error('[79][screenList][find comments]err=' + error.message);
     })
 }


 ////////////////////////////////////////////////////////////
 const patientHandler = async (specimenNo) => {
  logger.info('[86][screenList][find patient]specimenNo=' + specimenNo);
  const sql ="select isnull(name, '') name  ,isnull(patientID, '') patientID \
              ,isnull(age,  '') age ,isnull(gender, '') gender \
              ,specimenNo, isnull(IKZK1Deletion, '') IKZK1Deletion \
              ,isnull(chromosomalanalysis, '') chromosomalanalysis ,isnull(targetDisease, '') targetDisease \
              ,isnull(method, '') method ,isnull(specimen, '') specimen \
              ,isnull(request, '') request ,isnull(appoint_doc, '')  appoint_doc \
              ,isnull(worker, '') worker \
              ,isnull(prescription_no, '') rescription_no  ,isnull(prescription_date, '') prescription_date \
              ,isnull(FLT3ITD, '') FLT3ITD ,isnull(prescription_code, '')  prescription_code \
              ,isnull(testednum, '') testednum , isnull(leukemiaassociatedfusion, '') leukemiaassociatedfusion \
              ,isnull(tsvFilteredFilename, '') tsvFilteredFilename \
              ,case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  \
                  then '' \
                  else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate \
              ,isnull(tsvFilteredStatus, '') tsvFilteredStatus \
              ,case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  \
                  then '' \
                  else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 102 ), '' ) end tsvFilteredDate \
              ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR \
              ,case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 102 ), '' ) = '1900'  \
                  then '' \
                  else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 102 ), '' ) end sendEMRDate \
              ,case when IsNULL( left(report_date, 4 ), '' ) = '1900'  \
              then '' \
              else IsNULL( CONVERT(VARCHAR(10), cast(CAST(accept_date as CHAR(8)) as datetime), 102 ), '' ) end accept_date \
              ,isnull(test_code, '') test_code  \
              ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected \
              ,case when IsNULL( CONVERT(VARCHAR(4), report_date, 102 ), '' ) = '1900'  \
                  then '' \
                  else IsNULL( CONVERT(VARCHAR(10), report_date, 102 ), '' ) end  report_date \
              ,isnull(examin, '') examin, isnull(recheck, '') recheck \
              ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest  \
              from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";
  logger.info('[118][screenList][find patient]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[128][screenList][find patient]err=' + error.message);
  }

}

// report_comments 에서 specimenNo 로 조회
exports.patientLists = (req,res,next) => {
  logger.info('[135][screenList][find patient]req=' + JSON.stringify(req.body));
   const result = patientHandler(req.body.specimenNo);
   result.then(data => {
         res.json(data);
   })
   .catch(error => {
    logger.error('[140][screenList][find patient]err=' + error.message);
   })
}

// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler2 = async (specimenNo, status, chron,flt3ITD,leukemia, examin, recheck) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[149][screenList][update screen]data=' + status + ", " + specimenNo + ", "
                                       + chron + ", " + flt3ITD + ", " +leukemia); 

    let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@status, \
                 leukemiaassociatedfusion=@leukemia,  \
                 chromosomalanalysis=@chron, \
                 FLT3ITD=@flt3ITD , examin=@examin, recheck=@recheck \
             where specimenNo=@specimenNo ";   
    logger.info('[158][screenList][set screen]sql=' + sql);
    try {
        const request = pool.request()
            .input('status', mssql.VarChar, status)
            .input('flt3ITD', mssql.VarChar, flt3ITD)
            .input('leukemia', mssql.VarChar, leukemia)
            .input('chron', mssql.NVarChar, chron)
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[173][screenList][set screen]err=' + error.message);
    }
}
  
// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler3 = async (specimenNo, status) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[181][screenList][update screen 2]data=' + status + ", " + specimenNo);
   let sql ="update [dbo].[patientinfo_diag] \
           set screenstatus=@status \
           where specimenNo=@specimenNo ";
  logger.info('[185][screenList][update screen 2]sql=' + sql);
 
  try {
      const request = pool.request()
          .input('status', mssql.VarChar, status)
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[196][screenList][update screen 2]err=' + error.message);
  }
}

// 스크린 완료 comments
const insertCommentHandler = async(specimenNo, comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;

  logger.info('[205][screenList][insert comments]comments=' + JSON.stringify(comments) );

  for (i = 0; i < comments.length; i++)
  {
	  const gene       = comments[i].gene;
    const variants    = comments[i].variant_id;
    const comment    = comments[i].comment;
    const reference  = comments[i].reference;

    logger.info('[214][screenList][insert comments]gene=' + gene + ', variants=', variants
                                   + ', comment=' +comment + ', reference=' + reference );

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		             gene, variants, comment, reference)   \
					  values(@specimenNo, getdate(), \
					   @gene, @variants, @comment, @reference)";

    logger.info('[223][screenList][insert comments]sql=' + qry);
		   
	  try {
		  const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('comment', mssql.NVarChar, comment)
			      .input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('reference', mssql.NVarChar, reference); 
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
		  logger.error('[236][screenList][insert comments]err=' + error.message);
	  }
	}  // End of For Loop
    return commentResult;
}

//////////////////////////////////////////////////////////////////////////////////
// 스크린 완료 Detected Variants 
const insertHandler = async (specimenNo, detected_variants) => {
 // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
 logger.info('[246][screenList][insert detected_variants]specimenNo=' + specimenNo);
 logger.info('[246][screenList][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));

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

    logger.info('[267][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                          + ', gene=' + gene + ', functional_impact=' + functional_impact
                          + ', transcript= ' + transcript + ', exon=' + exon 
                          + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                          + ', zygosity=' + zygosity + ', vaf=' + vaf + ', reference=' + reference 
                          + ', cosmic_id=' + cosmic_id + ', type=' + type);
  
    //insert Query 생성;
    const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
              functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
              vaf, reference, cosmic_id, igv, sanger, type) \
              values(@specimenNo, getdate(),  @gene, \
                @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
              @vaf, @reference, @cosmic_id, @igv, @sanger, @type)";
            
      logger.info('[282][screenList][insert detected_variants]sql=' + qry);

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
        logger.error('[304][screenList][insert detected_variants]err=' + error.message);
      }
      
  } // End of For Loop
    return result;
 }

//////////////////////////////////////////////////////////////////////////////////
// 스크린 완료 Detected Variants 
const insertHandler = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[246][screenList][insert detected_variants]specimenNo=' + specimenNo);
  logger.info('[246][screenList][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));
 
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
 
    logger.info('[267][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                         + ', gene=' + gene + ', functional_impact=' + functional_impact
                         + ', transcript= ' + transcript + ', exon=' + exon 
                         + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                         + ', zygosity=' + zygosity + ', vaf=' + vaf + ', reference=' + reference 
                         + ', cosmic_id=' + cosmic_id + ', type=' + type);
  
    //insert Query 생성;
    const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
             functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
             vaf, reference, cosmic_id, igv, sanger, type) \
             values(@specimenNo, getdate(),  @gene, \
               @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
             @vaf, @reference, @cosmic_id, @igv, @sanger, @type)";
           
     logger.info('[282][screenList][insert detected_variants]sql=' + qry);
 
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
       logger.error('[304][screenList][insert detected_variants]err=' + error.message);
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
    
    logger.info('[319][screenList][update patientinfo_diag]specimenNo=' + specimenNo
                        + ', detectedtype=' + detectedtype + ', type=' + type);

    let sql ="update [dbo].[patientinfo_diag] \
    set detected=@type  where specimenNo=@specimenNo ";  
    logger.info('[324][screenList][update patientinfo_diag]sql=' + sql);

  try {
    const request = pool.request()
      .input('specimenNo', mssql.VarChar, specimenNo)
      .input('type', mssql.VarChar, type);
      
      result = await request.query(sql);         

  } catch (error) {
    logger.error('[334][screenList][update patientinfo_diag]err=' + error.message);
  }

    return result;
}

// 스크린 완료
exports.insertScreen = (req, res, next) => {

logger.info('[343][screenList][insertScreen]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;

const specimenNo        = req.body.specimenNo;
const detected_variants = req.body.detected_variants;
const comments          = req.body.comments;
const detectedtype      = req.body.resultStatus;
const examin            = req.body.patientInfo.examin;
const recheck           = req.body.patientInfo.recheck;

logger.info('[350][screenList][update screenspecimenNo=, ' + specimenNo
                              + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia); 
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
    logger.info('[384][screenList][insertScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

///////////////////////////////////////////////////////////////////////////////////////
const deleteCommentHandler = async (specimenNo) => {
  let  commentResult;

  logger.info('[393][screenList]deleteCommentHandler]specimenNo=' + specimenNo);
	  //delete Query 생성                     
    const qry = "delete report_comments where specimenNo=@specimenNo";                

	  logger.info('[397][screenList]deleteCommentHandler]sql='  + qry);
		   
	  try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
      logger.error('[406][screenList]deleteCommentHandler]err=' + error.message);
	  }

    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const deleteHandler = async (specimenNo) => {
   
  logger.info('[415][screenList]delete detected_variants]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
            
    logger.info("[419][screenList][del detected_variant]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[428][screenList][del detected_variant]err=' +  error.message);
    }
      
    return result;
}

// 검진 EMR 전송후 screenstatus 변경
exports.emrSendUpdate = (req, res, next) => {
  logger.info('[436][screenList][emr status update]req=' + JSON.stringify(req.body));
    const specimenNo    = req.body.specimenNo;
  // const chron         = req.body.chron

  const result = messageHandler3(specimenNo, '3');
  result.then(data => {
    res.json({message: 'EMR 전송 상태 갱신 했습니다.'})
  })
  .catch(error => {
    logger.error('[445][screenList][emr status update]err=' + error.message);
  })
     
}

// 병리 DB 저장 완료
const  messageHandlerPathology = async (pathologyNum) => {
  logger.info('[452][screenList][finishPathologyScreen]pathologyNum=' +  pathologyNum); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='1' \
          where pathology_num=@pathologyNum ";

  try {
      const request = pool.request()
          .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
            
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[466][screenList][finishPathologyScreen]err=' + error.message);
  }

}

exports.finishPathologyScreen = (req, res, next) => {
  logger.info('[472][screenList][screen status update]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.pathologyNum;
  
  const result = messageHandlerPathology(pathologyNum);
  result.then(data => {
      
      res.json({message: "SUCCESS"})
  }) 
  .catch( error => {
    logger.error('[481][screenList][screen status update]err=' + error.message);
    res.sendStatus(500);
  });
}

const messageHandlerStat_log = async (pathologyNum, userid ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[618][stat_log] pathology_num=" + pathologyNum);
	logger.info("[618][stat_log] userid=" + userid);

	//select Query 생성
	let sql2 = "insert_stat_log_path";

	logger.info("[495][stat_log] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar(300), pathologyNum)
			.input('userId', mssql.VarChar(30), userid)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultSt;
		await request.execute(sql2, (err, recordset, returnValue) => {
			if (err)
			{
				logger.error("[507][stat_log]err message=" + err.message);
			}

			logger.info("[510][stat_log]recordset=" + recordset);
			logger.info("[510][stat_log]returnValue=" + returnValue);

			resultSt = returnValue;
			logger.info("[514][stat_log]resultSt=" + JSON.stringify(resultSt));
		});
		
		return resultSt;
	} catch (error) {
		logger.error('[519][stat_log]err=' + error.message);
	} // try end
}

// 병리 EMR전송 완료
const messageHandlerEMR = async (pathologyNum) => {
  logger.info('[654][screenList][finishPathologyScreen]pathologyNum=' + pathologyNum); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='3', \
            sendEMRDate = getdate()  \
          where pathology_num=@pathologyNum ";

 try {
     const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
           
     const result = await request.query(sql)
     console.dir( result);
     
     return result;
 } catch (error) {
  logger.error('[540][screenList update]err=' + error.message);
 }

}

exports.finishPathologyEMRScreen = (req, res, next) => {

  logger.info('[screenList][547][finishPathologyScreen]data=' + JSON.stringify(req.body));

  const pathologyNum = req.body.pathologyNum;
  const userid = req.body.userid;
  logger.info('[screenList][551][finishPathologyScreen]pathologyNum=' + pathologyNum);
  logger.info('[screenList][552][finishPathologyScreen]userid=' + userid);

  const resultLog = messageHandlerStat_log(pathologyNum, userid);
  logger.info('[screenList][555][finishPathologyScreen]result=' + resultLog); 
    //  res.json({message: 'SUCCESS'});

  const result = messageHandlerEMR(pathologyNum);
  result.then(data => {
    console.log('[screenList][560][finishPathologyScreen]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( error => {
    logger.error('[564][screenList][finishPathologyScreen]err=' + error.message);
    res.sendStatus(500);
  });
}

// 병리 EMR전송 완료
const  messageHandlerPath = async (pathologyNum) => {
  logger.info('[571][screenList][pathologydUpdate]pathologyNum=' + pathologyNum); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='2' \
          where pathology_num=@pathologyNum ";

 try {
     const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
           
     const result = await request.query(sql)
     console.dir( result);
     
     return result;
 } catch (error) {
  logger.error('[585][screenList][pathologydUpdate]err=' + error.message);
 }

}

exports.pathologyReportUpdate = (req, res, next) => {
  logger.info('[591][screenList][pathologydUpdate]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.pathologyNum;
  console.log('[screenList][593][pathologydUpdate]',pathologyNum);
  const result = messageHandlerPath(pathologyNum);
  result.then(data => {
    console.log('[screenList][596][pathologydUpdate]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( error => {
    logger.error('[600][screenList][pathologydUpdate]err=' + error.message);
    res.sendStatus(500);
  });
}

// 판독 완료
exports.finishScreen = (req, res, next) => {

  logger.info('[608][screenList][pathologydUpdate]req=' + JSON.stringify(req.body));

    const specimenNo  = req.body.specimenNo;
    const comments    = req.body.comments;
    const detected_variants = req.body. detected_variants;
    const profile = req.body.profile

    const chron    = profile.chron ;
    const flt3ITD  = profile.flt3itd ; 
    const leukemia = profile.leukemia;
    const examin   = req.body.patientInfo.examin;
    const recheck  = req.body.patientInfo.recheck;
    
    const result = deleteHandler(specimenNo);
    result.then( data => {

      const result2 = insertHandler(specimenNo, detected_variants);
      result2.then( data => {
          
        // console.log('[157][insertScreen]', data);
        const commentResult2 = deleteCommentHandler(specimenNo, comments);
        commentResult2.then(data => {
        
          // console.log('[157][insertScreen]', data);
          const commentResult = insertCommentHandler(specimenNo, comments);
          commentResult.then(data => {

            // 검사자 상태변경
            const statusResult = messageHandler2(specimenNo, '2', chron,flt3ITD,leukemia, examin, recheck);
            statusResult.then(data => {
                res.json({message: 'OK UPDATE'});
            });

          });
        });
      });

    });
};

// 임시저장
exports.saveScreen = (req, res, next) => {

logger.info('[466][screenList][insertScreen]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;

const specimenNo        = req.body.specimenNo;
const detected_variants = req.body.detected_variants;
const comments          = req.body.comments;
const detectedtype      = req.body.resultStatus;
const examin            = req.body.patientInfo.examin;
const recheck           = req.body.patientInfo.recheck;

logger.info('[479][screenList][update screenspecimenNo=, ' + specimenNo
                              + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia); 
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
    logger.info('[509][screenList][insertScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

