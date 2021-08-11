// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const amlReportInsert = require('./amlReportInsert');
const logger = require('../common/winston');
const fs = require('fs');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
const { json } = require('body-parser');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;
  logger.info('[17][screenList][find detected_variant]specimenNo=' + specimenNo); 

  const sql =`select specimenNo, report_date, gene, 
  isnull(igv, '') igv, isnull(sanger, '') sanger, 
  isnull(functional_impact, '') functional_impact, isnull(transcript, '') transcript, 
  exon, nucleotide_change, amino_acid_change, 
  isnull(zygosity, '') zygosity, isnuul(vaf, '') vaf, isnull(reference, '') reference, cosmic_id, 
  isnull(type, '') type, isnull(checked, '') checked, isnull(functional_code, '') functional_code, 
  isnull(dbSNPHGMD, '') dbSNPHGMD, isnull(gnomADEAS, '') gnomADEAS,  isnull(OMIM, '') OMIM, 
  isnull(work_now, '') work_now, isnull(work_diag, '') work_diag 
   from [dbo].[report_detected_variants] 
   where specimenNo=@specimenNo 
   order by functional_code, gene, nucleotide_change `;
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

// 2021.04.15 병리 검체로 환자정보 알아오기
const getPatientPathInfo = async (pathologyNum) => {
  await poolConnect; // ensures that the pool has been created
  
  let sql = "select isnull(FLT3ITD, '') FLT3ITD, \
        isnull(accept_date, '') accept_date, \
        isnull(age, '') age, \
        isnull(appoint_doc, '') appoint_doc, \
        isnull(bamFilename, '') bamFilename, \
        case when IsNULL( CONVERT(VARCHAR(4), createDate, 126 ), '' ) = '1900'  \
            then '' \
            else IsNULL( CONVERT(VARCHAR(10), createDate, 126 ), '' ) end createDate, \
        isnull(dna_rna_ext, '') dna_rna_ext, \
        isnull(examin, '') examin, \
        isnull(gender, '') gender, \
        isnull(id, '') id, \
        isnull(irpath, '') irpath, \
        isnull(key_block, '') key_block, \
        isnull(management, '') management, \
        isnull(msiscore, '') msiscore, \
        isnull(name, '') name, \
        isnull(organ, '') organ, \
        isnull(orpath, '')  orpath, \
        isnull(pathological_dx, '') pathological_dx, \
        isnull(pathology_num, '') pathology_num, \
        isnull(patientID, '') patientID, \
        isnull(prescription_code, '') prescription_code, \
        isnull(prescription_date, '') prescription_date, \
        isnull(prescription_no, '') prescription_no, \
        isnull(recheck, '') recheck, \
        isnull(rel_pathology_num, '') rel_pathology_num, \
        case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  \
            then '' \
            else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date, \
        isnull(screenstatus, '') screenstatus, \
        isnull(sendEMR, '') sendEMR, \
        case when IsNULL( CONVERT(VARCHAR(4), sendEMRDate, 126 ), '' ) = '1900'  \
            then '' \
            else IsNULL( CONVERT(VARCHAR(10), sendEMRDate, 126 ), '' ) end sendEMRDate, \
        isnull(test_code, '') test_code, \
        case when IsNULL( CONVERT(VARCHAR(4), tsvFilteredDate, 126 ), '' ) = '1900'  \
            then '' \
            else IsNULL( CONVERT(VARCHAR(10), tsvFilteredDate, 126 ), '' ) end tsvFilteredDate, \
        isnull(tsvFilteredFilename, '') tsvFilteredFilename, \
        isnull(tsvFilteredStatus, '') tsvFilteredStatus, \
        isnull(tsvirfilename, '') tsvirfilename, \
        isnull(tsvorfilename, '') tsvorfilename, \
        isnull(tumor_cell_per, '') tumor_cell_per, \
        isnull(tumor_type, '') tumor_type, \
        isnull(tumorburden, '') tumorburden, \
        isnull(worker, '') worker  from [dbo].[patientinfo_path] \
             where  pathology_num=@pathologyNum";
  logger.info('[141][screenList][find path patient]sql=' + sql);
     
  try {
      const request = pool.request()
       .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset[0];
  } catch (error) {
      logger.error("[151][patientinfo_path select]err=" + error.message);
  }
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
              , isnull(vusmsg, '') vusmsg  \
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
const  messageHandler2 = async (specimenNo, status, chron,flt3ITD,leukemia, examin, recheck, vusmsg) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[149][screenList][update screen]data=' + status + ", " + specimenNo + ", " + chron + ", "  + flt3ITD + ", " + leukemia
                                       + ", vusmsg=" + vusmsg + + ", " + examin  + ", " + recheck,); 

    let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@status, examin=@examin, recheck=@recheck, vusmsg = @vusmsg \
             where specimenNo=@specimenNo ";   
    logger.info('[158][screenList][set screen]sql=' + sql);
    try {
        const request = pool.request()
            .input('status', mssql.VarChar, status)
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('vusmsg', mssql.NVarChar, vusmsg)
            .input('specimenNo', mssql.VarChar, specimenNo); 
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[173][screenList][set screen]err=' + error.message);
    }
}

// 2021.04.29 스크린 상태 변경 안 함
// 임시 저장
const  messageHandler4 = async (specimenNo, chron,flt3ITD,leukemia, examin, recheck, vusmsg) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[149][screenList][update screen]data=' + specimenNo + ", " + chron + ", "  + flt3ITD + ", " + leukemia
                                       + ", vusmsg=" + vusmsg + + ", " + examin  + ", " + recheck,); 

    let sql ="update [dbo].[patientinfo_diag] \
             set examin=@examin, recheck=@recheck, vusmsg = @vusmsg \
             where specimenNo=@specimenNo ";   
    logger.info('[158][screenList][set screen]sql=' + sql);
    try {
        const request = pool.request()
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('vusmsg', mssql.NVarChar, vusmsg)
            .input('specimenNo', mssql.VarChar, specimenNo); 
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

    logger.info('[214][screenList][insert comments]gene=' + gene + ', variants=' + variants
                                   + ', comment=' + comment + ', reference=' + reference );

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
    const checked           = detected_variants[i].checked;

    let functional_code = i;

    if (i < 10) {
      functional_code = '0' + i;
    }


    logger.info('[267][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                          + ', gene=' + gene 
                          + ', functional_impact=' + functional_impact + ', functional_code = ' + functional_code
                          + ', transcript= ' + transcript + ', exon=' + exon 
                          + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                          + ', zygosity=' + zygosity + ', vaf=' + vaf + ', reference=' + reference 
                          + ', cosmic_id=' + cosmic_id + ', type=' + type + ', checked=' + checked);
 
    //insert Query 생성;
    const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
              functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
              vaf, reference, cosmic_id, igv, sanger, type, checked, functional_code) \
              values(@specimenNo, getdate(),  @gene,\
                @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
              @vaf, @reference, @cosmic_id, @igv, @sanger, @type, @checked, @functional_code)";
            
      logger.info('[282][screenList][insert detected_variants]sql=' + qry);

      try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('gene', mssql.VarChar, gene)
            .input('functional_impact', mssql.VarChar, functional_impact)
            .input('functional_code', mssql.VarChar, functional_code)
            .input('transcript', mssql.VarChar, transcript)
            .input('exon', mssql.VarChar, exon)
            .input('nucleotide_change', mssql.VarChar, nucleotide_change)
            .input('amino_acid_change', mssql.VarChar, amino_acid_change)
            .input('zygosity', mssql.VarChar, zygosity)
            .input('vaf', mssql.VarChar, vaf)
            .input('reference', mssql.VarChar, reference)
            .input('cosmic_id', mssql.VarChar, cosmic_id)
            .input('igv', mssql.NVarChar, igv)
            .input('sanger', mssql.NVarChar, sanger)
            .input('type', mssql.VarChar, type)
            .input('checked', mssql.VarChar, checked);
            
            result = await request.query(qry);         
    
      } catch (error) {
        logger.error('[304][screenList][insert detected_variants]err=' + error.message);
      }
      
  } // End of For Loop
    return result;
}

//////////////////////////////////////////////////////////////////////////////////
// 선천성 면역결핍증 스크린 완료 Detected Variants 
const insertHandler_form6 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[246][screenList][insert detected_variants 6]specimenNo=' + specimenNo);
  logger.info('[246][screenList][insert detected_variants 6]detected_variants=' + JSON.stringify(detected_variants));
 
   let result;
    
   for (i = 0; i < detected_variants.length; i++)
   {
     const gene              = detected_variants[i].gene;
     const functional_impact = detected_variants[i].functionalImpact;
     const transcript        = detected_variants[i].transcript;
     
     const exon              = detected_variants[i].exonIntro;
     const nucleotide_change = detected_variants[i].nucleotideChange;
     const amino_acid_change = detected_variants[i].aminoAcidChange;
     const zygosity          = detected_variants[i].zygosity;
     const reference         = detected_variants[i].references;
     const cosmic_id         = detected_variants[i].cosmicID;
     const dbSNPHGMD         = detected_variants[i].dbSNPHGMD;
     const gnomADEAS         = detected_variants[i].gnomADEAS;
     const OMIM              = detected_variants[i].OMIM;
 
     let functional_code = i;
 
     if (i < 10) {
       functional_code = '0' + i;
     }
 
 
     logger.info('[267][screenList][insert detected_variants 6]gene=' + gene 
                           + ', functional_impact=' + functional_impact + ', functional_code = ' + functional_code
                           + ', transcript= ' + transcript + ', exon=' + exon 
                           + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                           + ', zygosity=' + zygosity + ', reference=' + reference 
                           + ', cosmic_id=' + cosmic_id + ', dbSNPHGMD=' + dbSNPHGMD + ', gnomADEAS=' + gnomADEAS + ', OMIM=' + OMIM);
  
     //insert Query 생성;
     const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
               functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, 
               vaf, reference, cosmic_id, dbSNPHGMD, gnomADEAS, OMIM, functional_code) 
               values(@specimenNo, getdate(),  @gene,
                 @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, 
               @vaf, @reference, @cosmic_id, @dbSNPHGMD, @gnomADEAS, @OMIM, @functional_code)`;
             
       logger.info('[282][screenList][insert detected_variants 6]sql=' + qry);
 
       try {
           const request = pool.request()
             .input('specimenNo', mssql.VarChar, specimenNo)
             .input('gene', mssql.VarChar, gene)
             .input('functional_impact', mssql.VarChar, functional_impact)
             .input('functional_code', mssql.VarChar, functional_code)
             .input('transcript', mssql.VarChar, transcript)
             .input('exon', mssql.VarChar, exon)
             .input('nucleotide_change', mssql.VarChar, nucleotide_change)
             .input('amino_acid_change', mssql.VarChar, amino_acid_change)
             .input('zygosity', mssql.VarChar, zygosity)
             .input('vaf', mssql.VarChar, vaf)
             .input('reference', mssql.VarChar, reference)
             .input('cosmic_id', mssql.VarChar, cosmic_id)
             .input('dbSNPHGMD', mssql.NVarChar, dbSNPHGMD)
             .input('gnomADEAS', mssql.NVarChar, gnomADEAS)
             .input('OMIM', mssql.VarChar, OMIM);
             
             result = await request.query(qry);         
     
       } catch (error) {
         logger.error('[304][screenList][insert detected_variants 6]err=' + error.message);
       }
       
   } // End of For Loop
     return result;
}

//////////////////////////////////////////////////////////////////////////////////
// sequential 스크린 완료 Detected Variants 
const insertHandler_form7 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[246][screenList][insert detected_variants 7]specimenNo=' + specimenNo);
  logger.info('[246][screenList][insert detected_variants 7]detected_variants=' + JSON.stringify(detected_variants));
 
   let result;
    
   for (i = 0; i < detected_variants.length; i++)
   {
     const gene              = detected_variants[i].gene;
     const type               = detected_variants[i].type;
     
     const exon              = detected_variants[i].exonIntro;
     const nucleotide_change = detected_variants[i].nucleotideChange;
     const amino_acid_change = detected_variants[i].aminoAcidChange;
     const cosmic_id         = detected_variants[i].cosmicID;
     const dbSNPHGMD         = detected_variants[i].dbSNP;
     const work_now          = detected_variants[i].work_now;
     const work_diag         = detected_variants[i].work_diag;
 
     let functional_code = i;
 
     if (i < 10) {
       functional_code = '0' + i;
     }
 
 
     logger.info('[267][screenList][insert detected_variants]gene=' + gene 
                           + ', type=' + type + ', functional_code = ' + functional_code + ', exon=' + exon 
                           + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                           + ', dbSNPHGMD=' + dbSNPHGMD + ', cosmic_id=' + cosmic_id 
                           + ', work_now=' + work_now + ', work_diag=' + work_diag );
  
     //insert Query 생성;
     const qry = `insert into report_detected_variants (specimenNo, report_date, gene, type,
               exon, nucleotide_change, amino_acid_change, 
               dbSNPHGMD, cosmic_id, work_now, work_diag, functional_code) 
               values(@specimenNo, getdate(),  @gene, @type
                  @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, \
                  @dbSNPHGMD, @cosmic_id, @work_now, @work_diag, @functional_code)`;
             
       logger.info('[282][screenList][insert detected_variants 7]sql=' + qry);
 
       try {
           const request = pool.request()
             .input('specimenNo', mssql.VarChar, specimenNo)
             .input('gene', mssql.VarChar, gene)
             .input('type', mssql.VarChar, type)
             .input('functional_code', mssql.VarChar, functional_code)
             .input('exon', mssql.VarChar, exon)
             .input('nucleotide_change', mssql.VarChar, nucleotide_change)
             .input('amino_acid_change', mssql.VarChar, amino_acid_change)
             .input('dbSNPHGMD', mssql.VarChar, dbSNPHGMD)
             .input('cosmic_id', mssql.VarChar, cosmic_id)
             .input('work_now', mssql.VarChar, work_now)
             .input('work_diag', mssql.VarChar, work_diag);
             
             result = await request.query(qry);         
     
       } catch (error) {
         logger.error('[304][screenList][insert detected_variants 7]err=' + error.message);
       }
       
   } // End of For Loop
     return result;
}

//////////////////////////////////////////////////////////////////////////////////
// 스크린 완료 Detected Variants 
const insertHandler2 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[246][screenList2][insert detected_variants]specimenNo=' + specimenNo);
  logger.info('[246][screenList2][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));
 
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
     const checked           = detected_variants[i].checked;
 
     let functional_code = '';
 
     if (functional_impact == 'Pathogenic') {
       functional_code = '1';
     } else if (functional_impact == 'Likely Pathogenic'){
       functional_code = '2'; 
     } else if (functional_impact == 'VUS')  {
       functional_code = '3';
     } else {
       functional_code = '4';
     } 
 
     logger.info('[267][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                           + ', gene=' + gene 
                           + ', functional_impact=' + functional_impact + ', functional_code = ' + functional_code
                           + ', transcript= ' + transcript + ', exon=' + exon 
                           + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                           + ', zygosity=' + zygosity + ', vaf=' + vaf + ', reference=' + reference 
                           + ', cosmic_id=' + cosmic_id + ', type=' + type + ', checked=' + checked);
  
     //insert Query 생성;
     const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
               functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
               vaf, reference, cosmic_id, igv, sanger, type, checked, functional_code) \
               values(@specimenNo, getdate(),  @gene,\
                 @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
               @vaf, @reference, @cosmic_id, @igv, @sanger, @type, @checked, @functional_code)";
             
       logger.info('[282][screenList][insert detected_variants]sql=' + qry);
 
       try {
           const request = pool.request()
             .input('specimenNo', mssql.VarChar, specimenNo)
             .input('gene', mssql.VarChar, gene)
             .input('functional_impact', mssql.VarChar, functional_impact)
             .input('functional_code', mssql.VarChar, functional_code)
             .input('transcript', mssql.VarChar, transcript)
             .input('exon', mssql.VarChar, exon)
             .input('nucleotide_change', mssql.VarChar, nucleotide_change)
             .input('amino_acid_change', mssql.VarChar, amino_acid_change)
             .input('zygosity', mssql.VarChar, zygosity)
             .input('vaf', mssql.VarChar, vaf)
             .input('reference', mssql.VarChar, reference)
             .input('cosmic_id', mssql.VarChar, cosmic_id)
             .input('igv', mssql.NVarChar, igv)
             .input('sanger', mssql.NVarChar, sanger)
             .input('type', mssql.VarChar, type)
             .input('checked', mssql.VarChar, checked);
             
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
const vusmsg            = req.body.patientInfo.vusmsg;

logger.info('[350][screenList][update screenspecimenNo=, ' + specimenNo
                              + ", chron=" + chron + ", flt3ITD=" + flt3ITD 
                              + ", examin=" + examin + ", recheck=" + recheck + ", detectedtype=" + detectedtype 
                              + ", leukemia=" +leukemia + ", vusmsg=" + vusmsg); 
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
            const statusResult = messageHandler2(specimenNo, '1', chron, flt3ITD, leukemia, examin, recheck, vusmsg);
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

// 2021.04.15 진검 cdw file copy
exports.finishPathologyEMRScreen = (req, res, next) => {

  logger.info('[screenList][547][hologyScreen]data=' + JSON.stringify(req.body));

  const pathologyNum = req.body.pathologyNum;
  //const userid = req.body.userid;

  //const userid = req.body.userid;
  const userinfo = JSON.parse(req.body.userid); 
  
  const userid = userinfo.userid; 

  //  const pw= userinfo.pwd; 

  logger.info('[screenList][551][finishPathologyScreen]pathologyNum=' + pathologyNum);
  logger.info('[screenList][552][finishPathologyScreen]userid=' + userid);
  
  
  let prescription_no = '';
  let prescription_date = '';
  let prescription_code = '';

  // 2021.04.15 병리 cdw file copy
  const result_path = getPatientPathInfo(pathologyNum);
  result_path.then(data => {
    //res.json(data);
    logger.info('[screenList][552][getPatientPathInfo]data=' + JSON.stringify(data));

    logger.info('[screenList][552][getPatientPathInfo]prescription_no=' + data.prescription_no);
    logger.info('[screenList][552][getPatientPathInfo]irpath=' + data.irpath);
    logger.info('[screenList][552][getPatientPathInfo]irfile=' + data.tsvirfilename);
    
    prescription_no  = data.prescription_no;
    prescription_date  = data.prescription_date;
    prescription_code  = data.prescription_code;

    let ngs_path_a = data.irpath.split('/') ;
    
    let ngs_path = './' + ngs_path_a[0] + '_success/' + ngs_path_a[1] + '/' + ngs_path_a[2] + '/' + ngs_path_a[3] ;
    let ngs_file = ngs_path + '/' + data.tsvirfilename;
    logger.info('[screenList][552][getPatientPathInfo]ngs_file=' + ngs_file);

    let cdw_path = 'C:\\NGS_Path\\' ;
    let cdw_file = cdw_path + '012_' + prescription_no + '_' 
               + prescription_date + '_' 
               + prescription_code + '_TMO870_' 
               + pathologyNum + '.tsv'
    logger.info('[screenList][552][getPatientPathInfo]file=' + cdw_file);
    
    // destination will be created or overwritten by default.
    fs.copyFile(ngs_file, cdw_file, (err) => {
      if (err) logger.error('[552][screenList getPatientPathInfo]err=' + err.message);
      logger.info('[screenList][552]File was copied to destination');
    });
  }); 
  

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

// 병리 EMR전송 완료
const  messageHandlerPath2 = async (pathologyNum, status) => {
  logger.info('[571][screenList][finishPathologyEMR]pathologyNum=' + pathologyNum + ", status=" + status); 
  let sql ="update [dbo].[patientinfo_path] \
          set screenstatus=@status \
          where pathology_num=@pathologyNum ";

 try {
     const request = pool.request()
         .input('pathologyNum', mssql.VarChar, pathologyNum)
         .input('status', mssql.VarChar, status); 
           
     const result = await request.query(sql)
     console.dir( result);
     
     return result;
 } catch (error) {
  logger.error('[585][screenList][finishPathologyEMR]err=' + error.message);
 }

}

// 병리 쿼리
const  selectHandlerPath2 = async (pathologyNum, patientID) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[883][loginUser 병리]pathologyNum=' + pathologyNum + ", patientID=" + patientID);

  //const uuid = uuidv4();

  //console.log('uuid:', uuid);

  const sql= `select pathology_num from [dbo].[patientinfo_path] 
         where pathology_num = @pathologyNum 
         and patientID = @patientID`;
  
  logger.info('[890][loginUser 병리]sql=' + sql);

  try {
      const request = pool.request()
        .input('pathologyNum', mssql.VarChar, pathologyNum) // pathologyNum
        .input('patientID', mssql.VarChar, patientID); // patientID 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[900][finishPathologyEMR]err=' + error.message);
  }
}

// 2021.05.28 병리 최종 상태 update
exports.finishPathologyEMR = (req, res, next) => {
  logger.info('[883][screenList][finishPathologyEMR]req=' + JSON.stringify(req.query));
  const pathologyNum = req.query.spcno;
  const patientID = req.query.patientID;
  const status = req.query.status;
  logger.info('[screenList][887][finishPathologyEMR]pathologyNum=' + pathologyNum
                         + ", patientID=" + patientID  + ", Status" + status);

  let p_sts = '';
  if (status === 'R')
    p_sts = '4';
  else if (status === 'C')
    p_sts = '3';

  const result2 = selectHandlerPath2(pathologyNum, patientID);
  result2.then(data => {

    let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: '0'});
    }
    else
    {
      const result = messageHandlerPath2(pathologyNum, p_sts);
      result.then(data => {
        console.log('[screenList][890][finishPathologyEMR]',data); 

        if (data.rowsAffected[0] == 1 ) {
          res.json({message: '1'});
        } else {
          res.json({message: '0'});
        } 
      })
    }
  }) 
  .catch( error => {
    logger.error('[898][screenList][finishPathologyEMR]err=' + error.message);
    res.sendStatus(500);
  });

}

// 판독 완료
exports.finishScreen = (req, res, next) => {

  logger.info('[608][screenList][finishScreen]req=' + JSON.stringify(req.body));

    const specimenNo  = req.body.specimenNo;
    const comments    = req.body.comments;
    const detected_variants = req.body. detected_variants;
    const profile = req.body.profile

    const chron    = profile.chron ;
    const flt3ITD  = profile.flt3itd ; 
    const leukemia = profile.leukemia;
    const examin   = req.body.patientInfo.examin;
    const recheck  = req.body.patientInfo.recheck;
    const vusmsg            = req.body.patientInfo.vusmsg;

    logger.info('[631][screenList][finishScreen]specimenNo=, ' + specimenNo
                                  + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia 
                                  + ", examin=" + examin + ", recheck=" + recheck +  ", vusmsg=" +vusmsg); 
    
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
            const statusResult = messageHandler2(specimenNo, '2', chron,flt3ITD,leukemia, examin, recheck, vusmsg);
            statusResult.then(data => {
                res.json({message: 'OK UPDATE'});
            });

          });
        });
      });

    })
    .catch( error  => {
      logger.info('[661][screenList][finishScreen]err=' + error.message);
      res.sendStatus(500)
    });
};

// 임시저장
exports.saveScreen = (req, res, next) => {

logger.info('[669][screenList][saveScreen]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;

const specimenNo        = req.body.specimenNo;
const detected_variants = req.body.detected_variants;
const comments          = req.body.comments;
const detectedtype      = req.body.resultStatus;
const examin            = req.body.patientInfo.examin;
const recheck           = req.body.patientInfo.recheck;
//const screenstatus      = req.body.patientInfo.screenstatus;
const vusmsg            = req.body.patientInfo.vusmsg;

//logger.info('[684][screenList][saveScreen]screenstatus = ' + screenstatus + ', specimenNo=, ' + specimenNo
logger.info('[684][screenList][saveScreen]specimenNo=, ' + specimenNo
                              + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia + ", vusmsg=" +vusmsg); 
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
            // 검사지 변경
            //const statusResult = messageHandler2(specimenNo, screenstatus, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
            const statusResult = messageHandler4(specimenNo, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
            statusResult.then(data => {
                  res.json({message: 'OK'});
              });
          });

        });
    });
  });
        
  })
  .catch( error  => {
    logger.info('[714][screenList][saveScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

// 임시저장
exports.saveScreen2 = (req, res, next) => {

logger.info('[744][screenList][saveScreen2]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;

const specimenNo        = req.body.specimenNo;
const detected_variants = req.body.detected_variants;
const comments          = req.body.comments;
const detectedtype      = req.body.resultStatus;
const examin            = req.body.patientInfo.examin;
const recheck           = req.body.patientInfo.recheck;
//const screenstatus      = req.body.patientInfo.screenstatus;
const vusmsg            = req.body.patientInfo.vusmsg;

//logger.info('[761][screenList][saveScreen]screenstatus = ' + screenstatus + ', specimenNo=, ' + specimenNo
logger.info('[761][screenList][saveScreen]specimenNo=, ' + specimenNo
                              + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia + ", vusmsg=" +vusmsg); 
const result2 = deleteHandler(specimenNo);
result2.then(data => {

  const result = insertHandler2(specimenNo, detected_variants);
  result.then(data => {

    // console.log('[157][insertScreen]', data);
    const commentResult2 = deleteCommentHandler(specimenNo, comments);
    commentResult2.then(data => {
    
      // console.log('[157][insertScreen]', data);
      const commentResult = insertCommentHandler(specimenNo, comments);
      commentResult.then(data => {
          const detectedResult = updateDetectedHandler(specimenNo, detectedtype);
          detectedResult.then(data => {
            // 검사지 변경
            const statusResult = messageHandler4(specimenNo, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
            statusResult.then(data => {
                  res.json({message: 'OK'});
              });
          });

        });
    });
  });
        
  })
  .catch( error  => {
    logger.info('[714][screenList][saveScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

// 선천성 면역결핍증 임시저장
exports.saveScreen6 = (req, res, next) => {

  logger.info('[669][screenList][saveScreen 6]req=' + JSON.stringify(req.body));
  
  const chron = req.body.chron ;
  const flt3ITD = req.body.flt3itd ; 
  const leukemia = req.body.leukemia;
  
  const specimenNo        = req.body.specimenNo;
  const detected_variants = req.body.detected_variants;
  const comments          = req.body.comments;
  const detectedtype      = req.body.resultStatus;
  const examin            = req.body.patientInfo.examin;
  const recheck           = req.body.patientInfo.recheck;
  //const screenstatus      = req.body.patientInfo.screenstatus;
  const vusmsg            = req.body.patientInfo.vusmsg;
  
  //logger.info('[684][screenList][saveScreen]screenstatus = ' + screenstatus + ', specimenNo=, ' + specimenNo
  logger.info('[684][screenList][saveScreen 6]specimenNo=, ' + specimenNo
                                + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia + ", vusmsg=" +vusmsg); 
  const result2 = deleteHandler(specimenNo);
  result2.then(data => {
  
    const result = insertHandler_form6(specimenNo, detected_variants);
    result.then(data => {
  
      // console.log('[157][insertScreen]', data);
      const commentResult2 = deleteCommentHandler(specimenNo, comments);
      commentResult2.then(data => {
      
        // console.log('[157][insertScreen]', data);
        const commentResult = insertCommentHandler(specimenNo, comments);
        commentResult.then(data => {
            const detectedResult = updateDetectedHandler(specimenNo, detectedtype);
            detectedResult.then(data => {
              // 검사지 변경
              //const statusResult = messageHandler2(specimenNo, screenstatus, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
              const statusResult = messageHandler4(specimenNo, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
              statusResult.then(data => {
                    res.json({message: 'OK'});
                });
            });
  
          });
      });
    });
          
    })
    .catch( error  => {
      logger.info('[714][screenList][saveScreen 6]err=' + error.message);
      res.sendStatus(500)
    });
};

// sequential 임시저장
exports.saveScreen7 = (req, res, next) => {
  
    logger.info('[669][screenList][saveScreen 7]req=' + JSON.stringify(req.body));
    
    const chron = req.body.chron ;
    const flt3ITD = req.body.flt3itd ; 
    const leukemia = req.body.leukemia;
    
    const specimenNo        = req.body.specimenNo;
    const detected_variants = req.body.detected_variants;
    const comments          = req.body.comments;
    const detectedtype      = req.body.resultStatus;
    const examin            = req.body.patientInfo.examin;
    const recheck           = req.body.patientInfo.recheck;
    //const screenstatus      = req.body.patientInfo.screenstatus;
    const vusmsg            = req.body.patientInfo.vusmsg;
    
    //logger.info('[684][screenList][saveScreen]screenstatus = ' + screenstatus + ', specimenNo=, ' + specimenNo
    logger.info('[684][screenList][saveScreen 7]specimenNo=, ' + specimenNo
                                  + ", chron=" + chron + ", flt3ITD=" + flt3ITD + ", leukemia=" +leukemia + ", vusmsg=" +vusmsg); 
    const result2 = deleteHandler(specimenNo);
    result2.then(data => {
    
      const result = insertHandler_form7(specimenNo, detected_variants);
      result.then(data => {
    
        // console.log('[157][insertScreen]', data);
        const commentResult2 = deleteCommentHandler(specimenNo, comments);
        commentResult2.then(data => {
        
          // console.log('[157][insertScreen]', data);
          const commentResult = insertCommentHandler(specimenNo, comments);
          commentResult.then(data => {
              const detectedResult = updateDetectedHandler(specimenNo, detectedtype);
              detectedResult.then(data => {
                // 검사지 변경
                //const statusResult = messageHandler2(specimenNo, screenstatus, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
                const statusResult = messageHandler4(specimenNo, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
                statusResult.then(data => {
                      res.json({message: 'OK'});
                  });
              });
    
            });
        });
      });
            
      })
      .catch( error  => {
        logger.info('[714][screenList][saveScreen 7]err=' + error.message);
        res.sendStatus(500)
      });
};
