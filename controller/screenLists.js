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
    res.sendStatus(500)
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
            ,isnull(tsvFilteredFilename, '') tsvFilteredFilename ,isnull(createDate, '') createDate \
            ,isnull(tsvFilteredStatus, '') tsvFilteredStatus ,isnull(tsvFilteredDate, '') tsvFilteredDate \
            ,isnull(bamFilename, '') bamFilename , isnull(sendEMR, '') sendEMR \
            ,isnull(sendEMRDate,'') sendEMRDate \
            ,isnull(convert(varchar(10), cast(stuff(stuff(stuff(accept_date, 9, 0, ' '), 12, 0, ':'), 15, 0, ':') as datetime), 102), '') accept_date \
            ,isnull(test_code, '') test_code  \
            ,isnull(screenstatus, '')  screenstatus, isnull(path, '') path, isnull(detected, '') detected \
            ,isnull(report_date, '') report_date \
            ,isnull(examin, '') examin, isnull(recheck, '') recheck \
            ,isnull(bonemarrow, '') bonemarrow,  isnull(diagnosis, '') diagnosis,  isnull(genetictest, '') genetictest \
   from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";
  logger.info('[107][screenList][find patient]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[117][screenList][find patient]err=' + error.message);
  }

}

// report_comments 에서 specimenNo 로 조회
exports.patientLists = (req,res,next) => {
  logger.info('[124][screenList][find patient]req=' + JSON.stringify(req.body));
   const result = patientHandler(req.body.specimenNo);
   result.then(data => {
         res.json(data);
   })
   .catch(error => {
    logger.error('[130][screenList][find patient]err=' + error.message);
   })
}

// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler2 = async (specimenNo, status, chron,flt3ITD,leukemia, examin, recheck) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[140][screenList][update screen]data=' + status + ", " + specimenNo + ", "
                                       + chron + ", " + flt3ITD + ", " +leukemia); 

    let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@status, \
                 leukemiaassociatedfusion=@leukemia,  \
                 chromosomalanalysis=@chron, \
                 FLT3ITD=@flt3ITD , examin=@examin, recheck=@recheck \
             where specimenNo=@specimenNo ";   
    logger.info('[149][screenList][set screen]sql=' + sql);
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
      logger.error('[162][screenList][set screen]err=' + error.message);
    }
}
  
// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler3 = async (specimenNo, status) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[170][screenList][update screen 2]data=' + status + ", " + specimenNo);
   let sql ="update [dbo].[patientinfo_diag] \
           set screenstatus=@status \
           where specimenNo=@specimenNo ";
  logger.info('[174][screenList][update screen 2]sql=' + sql);
 
  try {
      const request = pool.request()
          .input('status', mssql.VarChar, status)
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[185][screenList][update screen 2]err=' + error.message);
  }
}

// 스크린 완료 comments
const insertCommentHandler = async(specimenNo, comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;

  logger.info('[194][screenList][insert comments]comments=' + JSON.stringify(comments) );

  for (i = 0; i < comments.length; i++)
  {
	  const gene       = comments[i].gene;
    const variants    = comments[i].variant_id;
    const comment    = comments[i].comment;
    const reference  = comments[i].reference;

    logger.info('[203][screenList][insert comments]gene=' + gene + ', variants=', variants
                                   + ', comment=' +comment + ', reference=' + reference );

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		             gene, variants, comment, reference)   \
					  values(@specimenNo, getdate(), \
					   @gene, @variants, @comment, @reference)";

    logger.info('[212][screenList][insert comments]sql=' + qry);
		   
	  try {
		  const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('comment', mssql.NVarChar, comment)
			      .input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('reference', mssql.NVarChar, reference); 
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
		  logger.error('[225][screenList][insert comments]err=' + error.message);
	  }
	}  // End of For Loop
    return commentResult;
}

//////////////////////////////////////////////////////////////////////////////////
// 스크린 완료 Detected Variants 
const insertHandler = async (specimenNo, detected_variants) => {
 // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
 logger.info('[235][screenList][insert detected_variants]specimenNo=' + specimenNo);
 logger.info('[235][screenList][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));

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

   logger.info('[256][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
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
          
    logger.info('[256][screenList][insert detected_variants]sql=' + qry);

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
      logger.error('[256][screenList][insert detected_variants]err=' + error.message);
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
     
     logger.info('[308][screenList][update patientinfo_diag]specimenNo=' + specimenNo
                         + ', detectedtype=' + detectedtype + ', type=' + type);

     let sql ="update [dbo].[patientinfo_diag] \
     set detected=@type  where specimenNo=@specimenNo ";  
     logger.info('[308][screenList][update patientinfo_diag]sql=' + sql);

    try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('type', mssql.VarChar, type);
        
       result = await request.query(sql);         

    } catch (error) {
      logger.error('[308][screenList][update patientinfo_diag]err=' + error.message);
    }

     return result;
}

 // 스크린 완료
 exports.insertScreen = (req, res, next) => {
    
  logger.info('[308][screenList][insertScreen]req=' + JSON.stringify(req.body));
 
    const chron = req.body.chron ;
    const flt3ITD = req.body.flt3itd ; 
    const leukemia = req.body.leukemia;

    const specimenNo        = req.body.specimenNo;
    const detected_variants = req.body.detected_variants;
    const comments          = req.body.comments;
    const detectedtype      = req.body.resultStatus;
    const examin            = req.body.patientInfo.examin;
    const recheck           = req.body.patientInfo.recheck;
    console.log('[311][insertScreen][req.body]', req.body.specimenNo, detectedtype, examin, recheck);
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
      logger.info('[373][screenList][insertScreen]err=' + error.message);
      res.sendStatus(500)
    });
 };

///////////////////////////////////////////////////////////////////////////////////////
const updateCommentHandler = async (specimenNo, comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;
  for (i = 0; i < comments.length; i++)
  {
      const id          = comments[i].id;
	  const gene        = comments[i].gene;
      const variants    = comments[i].variants;
      const comment     = comments[i].comment;
      const reference   = comments[i].reference;

	  //insert Query 생성                     
      const qry = "update report_comments set gene=@gene, variants=@variants, comment=@comment, reference=@reference where id=@id";                

	console.log("sql",qry);
		   
	  try {
          const request = pool.request()
            .input('id', mssql.Int, id)
			.input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('comment', mssql.NVarChar, comment)
            .input('reference', mssql.NVarChar, reference);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
	}  // End of For Loop
    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const updateHandler = async (specimenNo, detected_variants) => {
    for (i = 0; i < detected_variants.length; i++)
    {
      const id                = detected_variants[i].id;
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
    
   
      //insert Query 생성;    
      const qry ="update report_detected_variants set gene=@gene, functional_impact=@functional_impact, \
      transcript=@transcript, exon=@exon, nucleotide_change=@nucleotide_change, amino_acid_change=@amino_acid_change, \
      zygosity=@zygosity, vaf=@vaf, reference=@reference, cosmic_id=@cosmic_id, igv=@igv, sanger=@sanger, type=@type \
        where id=@id";
             
      console.log("sql",qry);
   
        try {
            const request = pool.request()
              .input('id', mssql.Int, id)
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
      
        } catch (err) {
            console.error('SQL error', err);
        }
        
     } // End of For Loop
        return result;   

}

///////////////////////////////////////////////////////////////////////////////////////
const deleteCommentHandler = async (specimenNo) => {
  let  commentResult;

  logger.info('[373][screenList]deleteCommentHandler]specimenNo=' + specimenNo);
	  //delete Query 생성                     
    const qry = "delete report_comments where specimenNo=@specimenNo";                

	  logger.info('[373][screenList]deleteCommentHandler]sql='  + qry);
		   
	  try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
      logger.error('[373][screenList]deleteCommentHandler]err=' + error.message);
	  }

    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const deleteHandler = async (specimenNo) => {
   
  logger.info('[373][screenList]delete detected_variants]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
            
    logger.info("[466][screenList][del detected_variant]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.info('[508][screenList][del detected_variant]err=' +  error.message);
    }
      
    return result;
}

///////////////////////////////////////////////////
//
 const updateProfileHander = async (specimenNo) => {
    // profile insert Query 생성
 }
// 판독 완료
 exports.finishScreen = (req, res, next) => {

  console.log(req.body);

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

// 검진 EMR 전송후 screenstatus 변경
exports.emrSendUpdate = (req, res, next) => {
    logger.info('[466][screenList][emr status update]req=' + JSON.stringify(req.body));
     const specimenNo    = req.body.specimenNo;
    // const chron         = req.body.chron

    const result = messageHandler3(specimenNo, '3');
    result.then(data => {
      res.json({message: 'EMR 전송 상태 갱신 했습니다.'})
    })
    .catch(error => {
    logger.info('[574][screenList][emr status update]err=' + error.message);
     })
     
}

// 병리 DB 저장 완료
const  messageHandlerPathology = async (pathologyNum) => {
  logger.info('[screenList][501][finishPathologyScreen]pathologyNum=' +  pathologyNum); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus='1' \
          where pathology_num=@pathologyNum ";

  try {
      const request = pool.request()
          .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
            
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('[577]SQL error', err);
  }

}

exports.finishPathologyScreen = (req, res, next) => {
  logger.info('[601][screenList][screen status update]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.pathologyNum;
  
  const result = messageHandlerPathology(pathologyNum);
  result.then(data => {
      
      res.json({message: "SUCCESS"})
  }) 
  .catch( error => {
    logger.error('[610][screenList][screen status update]err=' + error.message);
    res.sendStatus(500)
  });
}

const messageHandlerStat_log = async (pathologyNum, userid ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[618][stat_log] pathology_num=" + pathologyNum);
	logger.info("[618][stat_log] userid=" + userid);

	//select Query 생성
	let sql2 = "insert_stat_log_path";

	logger.info("[624][stat_log] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar(300), pathologyNum)
			.input('userId', mssql.VarChar(30), userid)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultSt;
		await request.execute(sql2, (err, recordset, returnValue) => {
			if (err)
			{
				logger.error("[636][stat_log]err message=" + err.message);
			}

			logger.info("[636][stat_log]recordset=" + recordset);
			logger.info("[636][stat_log]returnValue=" + returnValue);

			resultSt = returnValue;
			logger.info("[643][stat_log]resultSt=" + JSON.stringify(resultSt));
		});
		
		return resultSt;
	} catch (error) {
		logger.error('[342][stat_log]err=' + error.message);
	} // try end
}

// 병리 EMR전송 완료
const messageHandlerEMR = async (pathologyNum) => {
  logger.info('[654][screenList][finishPathologyScreen]',pathologyNum); 
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
  logger.error('[601][screenList]err=' + error.message);
 }

}

exports.finishPathologyEMRScreen = (req, res, next) => {

  logger.info('[screenList][675][finishPathologyScreen]data=' + JSON.stringify(req.body));

  const pathologyNum = req.body.pathologyNum;
  const userid = req.body.userid;
  logger.info('[screenList][680][finishPathologyScreen]pathologyNum=' + pathologyNum);
  logger.info('[screenList][680][finishPathologyScreen]userid=' + userid);

  const resultLog = messageHandlerStat_log(pathologyNum, userid);
  logger.info('[screenList][684][finishPathologyScreen]result=' + resultLog); 
    //  res.json({message: 'SUCCESS'});

  const result = messageHandlerEMR(pathologyNum);
  result.then(data => {
    console.log('[screenList][688][finishPathologyScreen]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( error => {
    logger.error('[601][screenList][finishPathologyScreen]err=' + error.message);
    res.sendStatus(500)}
    );
}

// 병리 EMR전송 완료
const  messageHandlerPath = async (pathologyNum) => {
  logger.info('[700][screenList][pathologydUpdate]pathologyNum=' + pathologyNum); 
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
  logger.error('[654][screenList][pathologydUpdate]err=' + error.message);
 }

}

exports.pathologyReportUpdate = (req, res, next) => {
  logger.info('[700][screenList][pathologydUpdate]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.pathologyNum;
  console.log('[screenList][555][pathologydUpdate]',pathologyNum);
  const result = messageHandlerPath(pathologyNum);
  result.then(data => {
    console.log('[screenList][558][pathologydUpdate]',data); 
      res.json({message: 'SUCCESS'});
  }) 
  .catch( error => {
    logger.error('[700][screenList][pathologydUpdate]err=' + error.message);
    res.sendStatus(500);
  });
}