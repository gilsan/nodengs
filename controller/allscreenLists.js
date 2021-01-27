// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
//const amlReportInsert = require('./amlReportInsert');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;

  const sql ="select * from [dbo].[report_detected_variants] where specimenNo=@specimenNo ";

  logger.info("[report_detected_variants]select sql=" + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (err) {
      logger.error('[report_detected_variants]SQL error=' + err);
  }
}

// report_detected_variants 를 specimenNo 로  조회
 exports.screenLists = (req,res, next) => {
    
    const result = messageHandler(req);
    result.then(data => {

      // console.log('[50][screenstatus]',data);
 
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));
 };

 ////////////////////////////////////////////////////////////
 const commentHander = async (specimenNo) => {
    const sql ="select * from [dbo].[report_comments] where specimenNo=@specimenNo ";

    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }

 }

 // report_comments 에서 specimenNo 로 조회
 exports.commentLists = (req,res,next) => {
     const result = commentHander(req.body.specimenNo);
     result.then(data => {
           res.json(data);
     })
 }


 ////////////////////////////////////////////////////////////
 const patientHandler = async (specimenNo) => {
  const sql ="select * from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
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

    console.log(chron);
        
    console.log('[117][controller/screenList.js][스크린 상태변경]',status,specimenNo,chron,flt3ITD,leukemia); 
    //  let sql ="update [dbo].[patientinfo_diag] \
    //          set screenstatus=@status, \
    //             chromosomalanalysis=@chron, \
    //             leukemiaassociatedfusion=@leukemia,  \
    //             FLT3ITD=@flt3ITD  \
    //          where specimenNo=@specimenNo ";

      let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@status, \
                 leukemiaassociatedfusion=@leukemia,  \
                 chromosomalanalysis=@chron, \
                 FLT3ITD='', IKZK1Deletion=@flt3ITD , examin=@examin, recheck=@recheck \
             where specimenNo=@specimenNo ";   
	    console.log('================== [128][controller/screenList.js ] =====================\n', sql);
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
    } catch (err) {
        console.error('SQL error', err);
    }
  }

  
 // 검사자 screenstatus 상태 스크린 완료 로 변경
 const  messageHandler3 = async (specimenNo, status) => {
  await poolConnect; // ensures that the pool has been created

  console.log('[81][updatePatient]',status,specimenNo); 
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
  } catch (err) {
      console.error('SQL error', err);
  }
}


  // 스크린 완료 comments
  const insertCommentHandler = async(specimenNo, comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;
  for (i = 0; i < comments.length; i++)
  {
	  const gene       = comments[i].gene;
      const variants    = comments[i].variants;
      const comment    = comments[i].comment;
      const reference  = comments[i].reference;

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		             gene, variants, comment, reference)   \
					  values(@specimenNo, getdate(), \
					   @gene, @variants, @comment, @reference)";

	console.log("Comment Insert sql",qry);
		   
	  try {
		  const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('comment', mssql.NVarChar, comment)
			      .input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('reference', mssql.NVarChar, reference); 
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }
	}  // End of For Loop
    return commentResult;
  }
 //////////////////////////////////////////////////////////////////////////////////
 // 스크린 완료 Detected Variants 
  const insertHandler = async (specimenNo, detected_variants) => {
 // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
 // console.log('[82][specimenNo]================================== ', specimenNo);
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
 

   //insert Query 생성;
   const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
            functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
            vaf, reference, cosmic_id, igv, sanger, type) \
            values(@specimenNo, getdate(),  @gene, \
              @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
            @vaf, @reference, @cosmic_id, @igv, @sanger, @type)";
          
   console.log("[Detected Insert sql] ",qry);

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
   
     } catch (err) {
         console.error('SQL error', err);
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

     let sql ="update [dbo].[patientinfo_diag] \
     set detected=@type  where specimenNo=@specimenNo ";  
     console.log('[279][screenList][updateDetectedHandler]', sql, specimenNo, type);
     try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('type', mssql.VarChar, type);
        
       result = await request.query(sql);         

     } catch (err) {
          console.error('SQL error', err);
     }

     return result;

 }

 // 스크린 완료
 exports.insertScreen = (req, res, next) => {
    
   // console.log(req.body);
 
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
     .catch( err  => res.sendStatus(500));
     
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
	  //delete Query 생성                     
    const qry = "delete report_comments where specimenNo=@specimenNo";                

	  console.log("sql",qry);
		   
	  try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (err) {
		  console.error('SQL error', err);
	  }

    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const deleteHandler = async (specimenNo) => {
   
    //insert Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
            
    console.log("sql",qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (err) {
        console.error('SQL error', err);
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

        const commentResult = updateCommentHandler(specimenNo, comments);
        commentResult.then( data => {
          
          const commentResult2 = updateCommentHandler(specimenNo, comments);
          commentResult2.then( data => {

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
