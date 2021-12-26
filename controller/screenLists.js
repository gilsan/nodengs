// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const fs = require('fs');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

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

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;
  logger.info('[35][screenList][find detected_variant]specimenNo=' + specimenNo); 

  const sql =`select specimenNo, report_date, gene, 
  isnull(igv, '') igv, isnull(sanger, '') sanger, 
  isnull(functional_impact, '') functional_impact, isnull(transcript, '') transcript, 
  isnull(exon, '') exon, isnull(nucleotide_change,'') nucleotide_change, isnull(amino_acid_change,'') amino_acid_change, 
  isnull(zygosity, '') zygosity, isnull(vaf, '') vaf, isnull(reference, '') reference, isnull(cosmic_id, '') cosmic_id, 
  isnull(type, '') type, isnull(checked, '') checked, isnull(functional_code, '') functional_code, 
  isnull(dbSNPHGMD, '') dbSNPHGMD, isnull(gnomADEAS, '') gnomADEAS,  isnull(OMIM, '') OMIM, 
  isnull(work_now, '') work_now, isnull(work_diag, '') work_diag, isnull(cnt, '') cnt, isnull(gubun, '') gubun, isnull(sendyn, '') sendyn
   from [dbo].[report_detected_variants] 
   where specimenNo=@specimenNo 
   order by functional_code, gene, nucleotide_change `;
  logger.info('[48][screenList][find detectd_variant]sql=' + sql); 

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordsets[0];
  } catch (error) {
    logger.error('[58][screenList][find detectd_varint]err=' + error.message);
  }
}

// report_detected_variants 를 specimenNo 로  조회
exports.screenLists = (req,res, next) => {
    
  logger.info('[65][screenList][detected_variants]req=' + JSON.stringify(req.body));
    const result = messageHandler(req);
    result.then(data => {

      console.log('[69][screenstatus]',data);
       res.json(data);
  })
  .catch( error => {
    logger.error('[73][screenList][find detected variant]err=' + error.message);
    res.sendStatus(500);
  });
};

////////////////////////////////////////////////////////////
const commentHander = async (specimenNo) => {
    logger.info('[80][screenList][find comments]specimenNo=' + specimenNo); 
    //const sql ="select * from [dbo].[report_comments] where specimenNo=@specimenNo ";
    const sql =`select id, isnull(comment, '') comment, isnull(gene, '') gene, isnull(methods, '') methods,
      isnull(reference, '') reference, isnull(specimenNo, '') specimenNo, isnull(technique, '') technique, isnull(variants, '') variants
      from  [dbo].[report_comments] where specimenNo=@specimenNo `
    logger.info('[82][screenList][find comments]sql=' +sql);

    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[92][screenList][find comments]error=' + error.message);
    }

}

// report_comments 에서 specimenNo 로 조회
exports.commentLists = (req,res,next) => {
    logger.info('[99][screenList][find comments]req=' + JSON.stringify(req.body));
     const result = commentHander(req.body.specimenNo);
     result.then(data => {
           res.json(data);
     })
     .catch(error => {
      logger.error('[105][screenList][find comments]err=' + error.message);
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
  logger.info('[161][screenList][find path patient]sql=' + sql);
     
  try {
      const request = pool.request()
       .input('pathologyNum', mssql.VarChar, pathologyNum); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset[0];
  } catch (error) {
      logger.error("[171][patientinfo_path select]err=" + error.message);
  }
}

////////////////////////////////////////////////////////////
const patientHandler = async (specimenNo) => {
  logger.info('[177][screenList][find patient]specimenNo=' + specimenNo);
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
              , case when isnull(screenstatus, '') = '' then  'T' \
              else isnull(saveyn, 'S') end saveyn \
              from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";
  logger.info('[212][screenList][find patient]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[222][screenList][find patient]err=' + error.message);
  }

}

// report_comments 에서 specimenNo 로 조회
exports.patientLists = (req,res,next) => {
  logger.info('[229][screenList][find patient]req=' + JSON.stringify(req.body));
   const result = patientHandler(req.body.specimenNo);
   result.then(data => {
         res.json(data);
   })
   .catch(error => {
    logger.error('[235][screenList][find patient]err=' + error.message);
   })
}

// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler2 = async (specimenNo, status, chron,flt3ITD, 
                                  leukemia, examin, recheck, vusmsg) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[243][screenList][update screen]data=' + status + ", " + specimenNo + ", " + chron + ", "  + flt3ITD + ", " + leukemia
                                       + ", vusmsg=" + vusmsg + + ", examin=" + examin  + ", recheck=" + recheck); 

    let sql =`update [dbo].[patientinfo_diag] 
             set screenstatus=@status, examin=@examin, recheck=@recheck, vusmsg = @vusmsg, saveyn = 'S'
             where specimenNo=@specimenNo `;   
    logger.info('[249][screenList][set screen]sql=' + sql);
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
      logger.error('[262][screenList][set screen]err=' + error.message);
    }
}

// 2021.04.29 스크린 상태 변경 안 함
// 임시 저장
const  messageHandler4 = async (specimenNo, chron, flt3ITD, detectedtype,
                                leukemia, examin, recheck, vusmsg) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[271][screenList][update screen]data=' + specimenNo);
    logger.info('[271][screenList][update screen]chron=' + chron);
    logger.info('[271][screenList][update screen]flt3ITD='  + flt3ITD);
    logger.info('[271][screenList][update screen] ' + leukemia);
    logger.info('[271][screenList][update screen]detectedtype=' + detectedtype);
    logger.info('[271][screenList][update screen]vusmsg=' + vusmsg);
    logger.info('[271][screenList][update screen]examin=' + examin);
    logger.info('[271][screenList][update screen]recheck=' + recheck);

    let detected =''
    if ( detectedtype === 'detected') {
      detected = '0';
    } else {
      detected = '1';
    }

    let sql =`update [dbo].[patientinfo_diag] 
             set examin=@examin
             , recheck=@recheck
             , vusmsg = @vusmsg
             , detected = @detected
             , saveyn = 'S'
             where specimenNo=@specimenNo `;   
    logger.info('[277][screenList][set screen]sql=' + sql);
    try {
        const request = pool.request()
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('vusmsg', mssql.NVarChar, vusmsg)
            .input('detected', mssql.VarChar, detected)
            .input('specimenNo', mssql.VarChar, specimenNo); 
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
      logger.error('[289][screenList][set screen]err=' + error.message);
    }
}
  
// 검사자 screenstatus 상태 스크린 완료 로 변경
const  messageHandler3 = async (specimenNo, status) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[297][screenList][update screen 2]data=' + status + ", " + specimenNo);
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
    const variants   = comments[i].variant_id;
    const comment    = comments[i].comment;
    const reference  = comments[i].reference;
    const methods    = comments[i].methods;
    const technique  = comments[i].technique;

    logger.info('[214][screenList][insert comments]gene=' + gene + ', variants=' + variants
                                   + ', comment=' + comment + ', reference=' + reference );

	  //insert Query 생성
	  const qry = "insert into report_comments (specimenNo, report_date, \
		             gene, variants, comment, reference, methods, technique)   \
					  values(@specimenNo, getdate(), \
					   @gene, @variants, @comment, @reference, @methods, @technique)";

    logger.info('[223][screenList][insert comments]sql=' + qry);
		   
	  try {
		  const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('comment', mssql.NVarChar, comment)
			      .input('gene', mssql.VarChar, gene)
            .input('variants', mssql.VarChar, variants)
            .input('reference', mssql.NVarChar, reference)
            .input('methods', mssql.NVarChar, methods)
            .input('technique', mssql.NVarChar,technique); 
			
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
 logger.info('[362]][screenList][insert detected_variants]specimenNo=' + specimenNo);
 logger.info('[363][screenList][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));

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
    const zygosity          = nvl(detected_variants[i].zygosity, '');
    const vaf               = nvl(detected_variants[i].vafPercent, '');
    const reference         = nvl(detected_variants[i].reference, '');
    const cosmic_id         = detected_variants[i].cosmic_id;
    const type              = detected_variants[i].type;
    const checked           = detected_variants[i].checked;
    const dbSNPHGMD         = nvl(detected_variants[i].dbSNPHGMD, '');
    const gnomADEAS         = nvl(detected_variants[i].gnomADEAS, '');
    const OMIM              = nvl(detected_variants[i].OMIM,'');
    const cnt               = nvl(detected_variants[i].cnt, '');
    const gubun             = detected_variants[i].gubun;
    let functional_code = i;

    if (i < 10) {
      functional_code = '0' + i;
    }


    logger.info('[267][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                          + ', gene=' + gene 
                          + ', functional_impact=' + functional_impact + ', functional_code = ' + functional_code
                          + ', transcript= ' + transcript + ', exon=' + exon 
                          + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                          + ', zygosity=' + zygosity 
                          + ', dbSNPHGMD=' + dbSNPHGMD + ', gnomADEAS=' + gnomADEAS + ', OMIM=' + OMIM 
                          + ', vaf=' + vaf + ', reference=' + reference 
                          + ', cosmic_id=' + cosmic_id + ', type=' + type + ', checked=' + checked + ', cnt=' + cnt);
 
    //insert Query 생성;
    const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
              functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, 
              dbSNPHGMD, gnomADEAS, OMIM,
              vaf, reference, cosmic_id, igv, sanger, type, checked, functional_code, cnt, gubun, saveyn) 
              values(@specimenNo, getdate(),  @gene,
                @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, 
                @dbSNPHGMD, @gnomADEAS, @OMIM,
              @vaf, @reference, @cosmic_id, @igv, @sanger, @type, @checked, @functional_code, @cnt, @gubun, 'S')`;
            
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
            .input('dbSNPHGMD', mssql.NVarChar, dbSNPHGMD)
            .input('gnomADEAS', mssql.NVarChar, gnomADEAS)
            .input('OMIM', mssql.VarChar, OMIM)
            .input('checked', mssql.VarChar, checked)
            .input('cnt', mssql.VarChar, cnt)
            .input('gubun', mssql.VarChar, gubun);
            
            result = await request.query(qry);         
    
      } catch (error) {
        logger.error('[304][screenList][insert detected_variants]err=' + error.message);
      }
      
  } // End of For Loop
    return result;
}

const  messageHandler6 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;
  logger.info('[17][screenList][find detected_variant]specimenNo=' + specimenNo); 

  const sql =`select specimenNo, report_date, gene,
  isnull(functional_impact, '') functional_impact, isnull(transcript, '') transcript, 
  exon, nucleotide_change, amino_acid_change, 
  isnull(zygosity, '') zygosity, cosmic_id, 
  isnull(dbSNPHGMD, '') dbSNPHGMD, isnull(gnomADEAS, '') gnomADEAS,  isnull(OMIM, '') OMIM, isnull(saveyn, 'S') saveyn
   from [dbo].[report_detected_variants] 
   where specimenNo=@specimenNo 
   order by functional_code, gene, nucleotide_change `;
  logger.info('[20][screenList][find detectd_variant]sql=' + sql); 

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordsets[0];
  } catch (error) {
    logger.error('[30][screenList][find detectd_varint]err=' + error.message);
  }
}

// filtered_raw_tsv 를 specimenNo 로  조회
exports.screenLists6 = (req,res, next) => {
    
  logger.info('[456][screenList][find detected_variants]req=' + JSON.stringify(req.body));
    const result = messageHandler6(req);
    result.then(data => {

      // console.log('[50][screenstatus]',data);
 
       res.json(data);
  })
  .catch( error => {
    logger.error('[465][screenList][find  detected_variants]err=' + error.message);
    res.sendStatus(500);
  });
};


//////////////////////////////////////////////////////////////////////////////////
// 선천성 면역결핍증 스크린 완료 Detected Variants 
const insertHandler_form6 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[429][screenList][insert detected_variants 6]specimenNo=' + specimenNo);
  logger.info('[430][screenList][insert detected_variants 6]detected_variants=' + JSON.stringify(detected_variants));
 
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
     const zygosity          = nvl(detected_variants[i].zygosity, '');
     const type              = detected_variants[i].type;
     const checked           = detected_variants[i].checked;
     const dbSNPHGMD         = detected_variants[i].dbSNPHGMD;
     const gnomADEAS         = detected_variants[i].gnomADEAS;
     const OMIM              = detected_variants[i].OMIM;
      
     const cnt               = nvl(detected_variants[i].cnt, '');

     let functional_code = i;
 
     if (i < 10) {
       functional_code = '0' + i;
     }
 
 
     logger.info('[455][screenList][insert detected_variants 6]gene=' + gene 
                           + ', functional_impact=' + functional_impact 
                           + ', transcript= ' + transcript + ', exon=' + exon 
                           + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                           + ', zygosity=' + zygosity
                           + ', dbSNPHGMD=' + dbSNPHGMD + ', gnomADEAS=' + gnomADEAS + ', OMIM=' + OMIM + ', cnt=' + cnt );
  
     //insert Query 생성;
     const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
               functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, 
               dbSNPHGMD, gnomADEAS, OMIM, cnt, gubun, saveyn) 
               values(@specimenNo, getdate(),  @gene,
                 @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, 
                @dbSNPHGMD, @gnomADEAS, @OMIM, @cnt, 'genetic', 'S')`;
             
       logger.info('[470][screenList][insert detected_variants 6]sql=' + qry);
       
 
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
             .input('dbSNPHGMD', mssql.NVarChar, dbSNPHGMD)
             .input('gnomADEAS', mssql.NVarChar, gnomADEAS)
             .input('OMIM', mssql.VarChar, OMIM)
             .input('cnt', mssql.VarChar, cnt);
             
             result = await request.query(qry);         
     
       } catch (error) {
         logger.error('[490] *** [screenList][insert detected_variants 6] *** err=  ****  ' + error.message);
       }
       
   } // End of For Loop
     return result;
}

//////////////////////////////////////////////////////////////////////////////////
// 스크린 완료 Detected Variants 
const insertHandler2 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[569][screenList2][insert detected_variants]specimenNo=' + specimenNo);
  logger.info('[570][screenList2][insert detected_variants]detected_variants=' + JSON.stringify(detected_variants));
 
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
     const reference         = detected_variants[i].reference;
     const cosmic_id         = detected_variants[i].cosmic_id;
     const type              = detected_variants[i].type;
     const checked           = detected_variants[i].checked;
     const cnt               = nvl(detected_variants[i].cnt, '');
 
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
 
     logger.info('[604][screenList][insert detected_variants]igv=' + igv + ', sanger=' + sanger
                           + ', gene=' + gene 
                           + ', functional_impact=' + functional_impact + ', functional_code = ' + functional_code
                           + ', transcript= ' + transcript + ', exon=' + exon 
                           + ', nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change
                           + ', zygosity=' + zygosity + ', vaf=' + vaf + ', reference=' + reference 
                           + ', cosmic_id=' + cosmic_id + ', type=' + type + ', checked=' + checked + ', cnt=' + cnt);
  
     //insert Query 생성;
     const qry = "insert into report_detected_variants (specimenNo, report_date, gene, \
               functional_impact, transcript, exon, nucleotide_change, amino_acid_change, zygosity, \
               vaf, reference, cosmic_id, igv, sanger, type, checked, functional_code, cnt, saveyn) \
               values(@specimenNo, getdate(),  @gene,\
                 @functional_impact, @transcript, @exon, @nucleotide_change, @amino_acid_change, @zygosity, \
               @vaf, @reference, @cosmic_id, @igv, @sanger, @type, @checked, @functional_code, @cnt, 'S')";
             
       logger.info('[620][screenList][insert detected_variants]sql=' + qry);
 
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
             .input('checked', mssql.VarChar, checked)
             .input('cnt', mssql.VarChar, cnt);
             
             result = await request.query(qry);         
     
       } catch (error) {
         logger.error('[644][screenList][insert detected_variants]err=' + error.message);
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
    
    logger.info('[660][screenList][update patientinfo_diag]specimenNo=' + specimenNo
                        + ', detectedtype=' + detectedtype + ', type=' + type);

    let sql ="update [dbo].[patientinfo_diag] \
    set detected=@type  where specimenNo=@specimenNo ";  
    logger.info('[665][screenList][update patientinfo_diag]sql=' + sql);

  try {
    const request = pool.request()
      .input('specimenNo', mssql.VarChar, specimenNo)
      .input('type', mssql.VarChar, type);
      
      result = await request.query(sql);         

  } catch (error) {
    logger.error('[675][screenList][update patientinfo_diag]err=' + error.message);
  }

    return result;
}

// 스크린 완료
exports.insertScreen = (req, res, next) => {

logger.info('[343][screenList][insertScreen]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;
const gubun    = req.body.gubun;
const specimenNo        = req.body.specimenNo;
const detected_variants = req.body.detected_variants;
const comments          = req.body.comments;
const detectedtype      = req.body.resultStatus;
const examin            = req.body.patientInfo.examin;
const recheck           = req.body.patientInfo.recheck;
const vusmsg            = req.body.patientInfo.vusmsg;

logger.info('[698][screenList][update screenspecimenNo=, ' + specimenNo
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
    logger.error('[730][screenList][insertScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

///////////////////////////////////////////////////////////////////////////////////////
const deleteCommentHandler = async (specimenNo) => {
  let  commentResult;

  logger.info('[739][screenList]deleteCommentHandler]specimenNo=' + specimenNo);
	  //delete Query 생성                     
    const qry = "delete report_comments where specimenNo=@specimenNo";                

	  logger.info('[743][screenList]deleteCommentHandler]sql='  + qry);
		   
	  try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
			
		    commentResult = await request.query(qry);
		  		  
	  } catch (error) {
      logger.error('[752][screenList]deleteCommentHandler]err=' + error.message);
	  }

    return commentResult;
}

/////////////////////////////////////////////////////////////////////////////////////////
const deleteHandler = async (specimenNo) => {
   
  logger.info('[761][screenList]delete detected_variants]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
            
    logger.info("[765][screenList][del detected_variant]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[774][screenList][del detected_variant]err=' +  error.message);
    }
      
    return result;
}

// 검진 EMR 전송후 screenstatus 변경
exports.emrSendUpdate = (req, res, next) => {
  logger.info('[782][screenList][emr status update]req=' + JSON.stringify(req.body));
    const specimenNo    = req.body.specimenNo;
  // const chron         = req.body.chron

  const result = messageHandler3(specimenNo, '3');
  result.then(data => {
    res.json({message: 'EMR 전송 상태 갱신 했습니다.'})
  })
  .catch(error => {
    logger.error('[791][screenList][emr status update]err=' + error.message);
  })
     
}

// 병리 DB 저장 완료
const  messageHandlerPathology = async (pathologyNum) => {
  logger.info('[798][screenList][finishPathologyScreen]pathologyNum=' +  pathologyNum); 
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
    logger.error('[812][screenList][finishPathologyScreen]err=' + error.message);
  }

}

exports.finishPathologyScreen = (req, res, next) => {
  logger.info('[818][screenList][screen status update]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.pathologyNum;
  
  const result = messageHandlerPathology(pathologyNum);
  result.then(data => {
      
      res.json({message: "SUCCESS"})
  }) 
  .catch( error => {
    logger.error('[827][screenList][screen status update]err=' + error.message);
    res.sendStatus(500);
  });
}

const messageHandlerStat_log = async (pathologyNum, userid ) => {
	await poolConnect; // ensures that the pool has been created

	logger.info("[835][stat_log] pathology_num=" + pathologyNum);
	logger.info("[836][stat_log] userid=" + userid);

	//select Query 생성
	let sql2 = "insert_stat_log_path";

	logger.info("[841][stat_log] sql=" + sql2);

	try {
		const request = pool.request()
			.input('pathologyNum', mssql.VarChar(300), pathologyNum)
			.input('userId', mssql.VarChar(30), userid)
			.output('TOTALCNT', mssql.int, 0); 
			
		let resultSt;
		await request.execute(sql2, (err, recordset, returnValue) => {
			if (err)
			{
				logger.error("[853][stat_log]err message=" + err.message);
			}

			logger.info("[856][stat_log]recordset=" + recordset);
			logger.info("[857][stat_log]returnValue=" + returnValue);

			resultSt = returnValue;
			logger.info("[860][stat_log]resultSt=" + JSON.stringify(resultSt));
		});
		
		return resultSt;
	} catch (error) {
		logger.error('[865][stat_log]err=' + error.message);
	} // try end
}

// 병리 EMR전송 완료
const messageHandlerEMR = async (pathologyNum) => {
  logger.info('[871][screenList][finishPathologyScreen]pathologyNum=' + pathologyNum); 
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
  logger.error('[886][screenList update]err=' + error.message);
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

// 병리 접수취소 완료
const  messageReceiptCancel = async (pathologyNum, status) => {
  logger.info('[1159][screenList][ReceiptCancel]pathologyNum=' + pathologyNum + ", status=" + status); 
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
  logger.error('[1174][screenList][ReceiptCancel]err=' + error.message);
 }

}

// 병리 접수취소 쿼리
const  selectReceiptCancel = async (pathologyNum, patientID) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[1183][ReceiptCancel 병리]pathologyNum=' + pathologyNum + ", patientID=" + patientID);

  //const uuid = uuidv4();

  //console.log('uuid:', uuid);

  const sql= `select pathology_num from [dbo].[patientinfo_path] 
         where pathology_num = @pathologyNum 
         and patientID = @patientID`;
  
  logger.info('[1193][ReceiptCancel 병리]sql=' + sql);

  try {
      const request = pool.request()
        .input('pathologyNum', mssql.VarChar, pathologyNum) // pathologyNum
        .input('patientID', mssql.VarChar, patientID); // patientID 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[1204][ReceiptCancel]err=' + error.message);
  }
}

// 2021.08.26 병리 '접수취소'  update
//                      post spcno=nnnnn&patientID=nnnnnn 
exports.receiptcancel = (req, res, next) => {
  logger.info('[1211][screenList][receiptcancel]req=' + JSON.stringify(req.query));
  const pathologyNum = req.query.spcno;
  const patientID = req.query.patientID;
  logger.info('[screenList][1214][receiptcancel]pathologyNum=' + pathologyNum
                         + ", patientID=" + patientID );

  let p_sts = '5';
  /*
  if (status === 'R')
    p_sts = '4';
  else if (status === 'C')
    p_sts = '3';
  */
 
  const result2 = selectReceiptCancel(pathologyNum, patientID);
  result2.then(data => {

    let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: '0'});
    }
    else
    {
      const result = messageReceiptCancel(pathologyNum, p_sts);
      result.then(data => {
        console.log('[screenList][1237][ReceiptCancel]',data); 

        if (data.rowsAffected[0] == 1 ) {
          res.json({message: '1'});
        } else {
          res.json({message: '0'});
        } 
      })
    }
  }) 
  .catch( error => {
    logger.error('[1248][screenList][ReceiptCancel]err=' + error.message);
    res.sendStatus(500);
  });

}

// 2021.08.26 병리 '접수취소'  update
//                      post spcno=nnnnn&patientID=nnnnnn 
exports.receiptcancel_post = (req, res, next) => {
  logger.info('[1211][screenList][receiptcancel]req=' + JSON.stringify(req.body));
  const pathologyNum = req.body.spcno;
  const patientID = req.body.patientID;
  logger.info('[screenList][1214][receiptcancel]pathologyNum=' + pathologyNum
                         + ", patientID=" + patientID );

  let p_sts = '5';
  /*
  if (status === 'R')
    p_sts = '4';
  else if (status === 'C')
    p_sts = '3';
  */
 
  const result2 = selectReceiptCancel(pathologyNum, patientID);
  result2.then(data => {

    let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: '0'});
    }
    else
    {
      const result = messageReceiptCancel(pathologyNum, p_sts);
      result.then(data => {
        console.log('[screenList][1237][ReceiptCancel]',data); 

        if (data.rowsAffected[0] == 1 ) {
          res.json({message: '1'});
        } else {
          res.json({message: '0'});
        } 
      })
    }
  }) 
  .catch( error => {
    logger.error('[1248][screenList][ReceiptCancel]err=' + error.message);
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

// AMLALL 임시저장
exports.saveScreen = (req, res, next) => {

logger.info('[669][screenList][saveScreen]req=' + JSON.stringify(req.body));

const chron = req.body.chron ;
const flt3ITD = req.body.flt3itd ; 
const leukemia = req.body.leukemia;
const comment2          = req.body.comment2;
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
            // 검사지 변경
            //const statusResult = messageHandler2(specimenNo, screenstatus, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
            const statusResult = messageHandler4(specimenNo, chron, flt3ITD, detectedtype, 
                                                    leukemia, examin, recheck, vusmsg, comment2);
            statusResult.then(data => {
                  res.json({message: 'OK'});
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
            // 검사지 변경
            const statusResult = messageHandler4(specimenNo, chron, flt3ITD, detectedtype,
                                                     leukemia, examin, recheck, vusmsg);
            statusResult.then(data => {
                  res.json({message: 'OK'});
              });

        });
    });
  });
        
  })
  .catch( error  => {
    logger.error('[714][screenList][saveScreen]err=' + error.message);
    res.sendStatus(500)
  });
};

const deleteHandlerForm6 = async (specimenNo) => {
   
  logger.info('[1703][screenList]delete Genetic]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_patientsInfo where specimenNo=@specimenNo";
            
    logger.info("[1707][screenList][del Genetic]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[1716][screenList][del Genetic]err=' +  error.message);
    }
      
    return result;
}

const insertHandlerForm6 = async (specimenNo, result6,
                      additional_Note, methods, technique, comments ) => {
  
    logger.info('[1292][screenList][saveScreen 6]comment2= ' + specimenNo);    

    logger.info('[1292][screenList][saveScreen 6]result6= ' + result6);    

    logger.info('[1292][screenList][saveScreen 6]comments= ' + comments);
    logger.info('[1292][screenList][saveScreen 6]additional_Note= ' + additional_Note);
    logger.info('[1292][screenList][saveScreen 6]technique= ' + technique);
    logger.info('[1292][screenList][saveScreen 6]methods= ' + methods);
  

  //insert Query 생성;
  const qry = `insert into report_patientsInfo (
    specimenNo, report_date, result,
      additional_Note, techniques, comments, methods, screenstatus) 
      values(@specimenNo, getdate(),  @result6,
      @additional_Note, @technique, @comments, @methods, '2')`;
    
  logger.info('[1824][screenList][insert report_patientsInfo]sql=' + qry);

  try {
    const request = pool.request()
      .input('specimenNo', mssql.VarChar, specimenNo)
      .input('result6', mssql.VarChar, result6)
      .input('technique', mssql.NVarChar, technique)
      .input('additional_Note', mssql.NVarChar, additional_Note)
      .input('methods', mssql.NVarChar, methods)
      .input('comments', mssql.NVarChar, comments);
      
    let result = await request.query(qry);         

  } catch (error) {
    logger.error('[1810][screenList][insert report_patientsInfo]err=' + error.message);
  }
    
}

// 선천성 면역결핍증 임시저장
exports.saveScreen6 = (req, res, next) => {

  logger.info('[1276][screenList][saveScreen 6]req=' + JSON.stringify(req.body));
  
  const chron = '' ;
  const flt3ITD = '' ; 
  const leukemia = '';
  const vusmsg            = '';

  const specimenNo        = req.body.specimenNo;
  
  const detectedtype      = req.body.resultStatus;
  let   result6           = nvl(req.body.result, '');
  
  const detected_variants = req.body.detected_variants;

  const comments          = req.body.comments;
  const additional_Note   = req.body.additionalNote;
  const technique         = req.body.technique;
  const methods           = req.body.methods;

  const examin            = req.body.patientInfo.examin;
  const recheck           = req.body.patientInfo.recheck;

  logger.info('[1292][screenList][saveScreen 6]specimenNo= ' + specimenNo
                                + ", immundefi=  " + detected_variants ); 
  
  logger.info('[1292][screenList][saveScreen 6]comments= ' + comments);
  logger.info('[1292][screenList][saveScreen 6]additional_Note= ' + additional_Note);
  logger.info('[1292][screenList][saveScreen 6]technique= ' + technique);
  logger.info('[1292][screenList][saveScreen 6]methods= ' + methods);

  const result2 = deleteHandler(specimenNo);
  result2.then(data => {
  
    const result = insertHandler_form6(specimenNo, detected_variants);
    result.then(data => {
    
      const result4 = deleteHandlerForm6(specimenNo);
      result4.then(data => {
  
        const result5 = insertHandlerForm6 (specimenNo, result6, 
                                    additional_Note, methods, technique, comments );
          result5.then(data => {
  
            const statusResult = messageHandler4(specimenNo, chron, flt3ITD, detectedtype,
                                                    leukemia, examin, recheck, vusmsg );
            statusResult.then(data => {
                  res.json({message: 'OK'});
            });
          });
        });
      });
    })
    .catch( error  => {
      logger.error('[1311][screenList][saveScreen 6]err=' + error.message);
      res.sendStatus(500)
    });
};

// 선천성 면역결핍증 내역
const immundefiHandler = async (specimenNo) => {
  await poolConnect; 

  const sql=`select 
              isnull(result, '') result,
              isnull(additional_Note,'') additional_Note, isnull(techniques, '') techniques, 
              isnull(comments, '') comments, isnull(methods, '') methods
          from [dbo].[report_patientsInfo] where specimenNo = @specimenNo
  `;

  try {
      const request = pool.request().input('specimenNo', mssql.VarChar, specimenNo); 
      const result = await request.query(sql)

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1332][immundefiHandler]err=' + error.message);
    }
  
};

exports.listImmundefi = (req, res, next) => {
  const specimenNo        = req.body.specimenNo;

  const dataset = immundefiHandler(specimenNo);
  dataset.then(data => {
    console.log('[1342][listImmundefi] ==> ', data)
     res.json(data);
  })
  .catch( error  => {
   logger.error('[1347][listImmundefi select]err=' + error.message);
   res.status(500).send('That is Not good ')
  }); 

}


// sequential 내역
const SequntialHandler = async (specimenNo) => {
  await poolConnect; 

  const sql=`select   isnull(a.type, '') type,
      isnull(a.exon, '') exonintron, isnull(a.nucleotide_change, '') nucleotideChange,
      isnull(a.amino_acid_change, '') aminoAcidChange, isnull(a.zygosity, '') zygosity, isnull(a.cosmic_id, '') rsid,
      isnull(a.reference, '') reference, isnull(saveyn, 'S') saveyn
      from  [dbo].[report_detected_variants]  a
      where a.specimenNo =@specimenNo
  `;

  logger.info('[1385][listSequntial select]sql=' + sql);

  try {
      const request = pool.request().input('specimenNo', mssql.VarChar, specimenNo); 
      const result = await request.query(sql)

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1370][listSequntial]err=' + error.message);
    }
  
};

exports.listSequntial = (req, res, next) => {
  const specimenNo        = req.body.specimenNo;

  logger.info('[1385][listSequntial select]specimenNo=' + specimenNo);

  const dataset = SequntialHandler(specimenNo);
  dataset.then(data => {
    console.log('[1381][listSequntial] ==> ', data)
     res.json(data);
  })
  .catch( error  => {
   logger.error('[1385][listSequntial select]err=' + error.message);
   res.status(500).send('That is Not good ')
  }); 

}

// get patientsInfo Count
const patientsInfoCountHandler = async (specimenNo) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[1726][screenList]get patientsInfoCountHandler specimenNo=' + specimenNo);
  const sql =`select count(1) as count from report_patientsInfo 
                      where specimenNo = @specimenNo`;
  logger.info('[572][screenList]get patientsInfoCountHandler sql=' + sql);  

  try {
    const request = pool.request()
                  .input('specimenNo', mssql.VarChar, specimenNo); 

    const result = await request.query(sql);
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[581][screenList]patientsInfoCountHandler err=' + error.message);
  }
}

// get patientsInfo Status
const patientsInfoStautsHandler = async (specimenNo) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[1726][screenList]get patientsInfoStautsHandler specimenNo=' + specimenNo);
  const sql =`select screenstatus from report_patientsInfo 
           where specimenNo = @specimenNo`;
  logger.info('[572][screenList]get patientsInfoStautsHandler sql=' + sql);  

  try {
    const request = pool.request()
                      .input('specimenNo', mssql.VarChar, specimenNo);

    const result = await request.query(sql);
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[581][screenList]patientsInfoStautsHandler err=' + error.message);
  }
}

// sequential patient 내역
const PatientSequntialHandler = async (specimenNo) => {
  await poolConnect; 
  const sql=`select  
      isnull(a.test_code, '') report_type, '' result, isnull(saveyn, 'S') saveyn, 
      isnull(b.target, '') target,  isnull(b.method, '') method, isnull(b.analyzedgene, '') analyzedgene,
      '' identified_variations, isnull(b.specimen, '') specimen,
      isnull(b.comment1, '') comment1, isnull(b.comment2, '') comment2, isnull(b.Comment, '') seqcomment
      , case when isnull(screenstatus, '') = '' then  'T' 
        else isnull(saveyn, 'S') end saveyn
      from [dbo].[patientinfo_diag]  a
      left outer join [dbo].[codedefaultvalue] b
      on a.test_code = b.code
      where a.specimenNo =@specimenNo
  `;

  logger.info('[1672][listPatientSequntial select]sql=' + sql + '  ' + specimenNo);

  try {
      const request = pool.request()
                    .input('specimenNo', mssql.VarChar, specimenNo); 

      const result = await request.query(sql);

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1680][listPatientSequntial 1]err=' + error.message);
    }
  
};

// sequential patient 내역
const reportSequntialHandler = async (specimenNo) => {
  await poolConnect; 
  const sql=`select  
      isnull(report_type, '') report_type, isnull(result, '') result, 
      isnull(target, '') target,  isnull(testmethod, '*Direct sequencing for whole exons including intron-exon boundaries') method,
      isnull(analyzedgene, '') analyzedgene,
      isnull(identified_variations, '') identified_variations, 
      isnull(specimen, 'Genomic DNA isolated from peripheral blood leukocytes-adequate specimen') specimen,
      isnull(comment, '') comment, isnull(comment1, '') comment1, isnull(comment2, '') comment2, isnull(seqcomment, '') seqcomment
      from [dbo].[report_patientsInfo]  
      where specimenNo =@specimenNo
  `;

  logger.info('[1672][listPatientSequntial select]sql=' + sql + '  ' + specimenNo);

  try {
      const request = pool.request()
                    .input('specimenNo', mssql.VarChar, specimenNo); 

      const result = await request.query(sql);

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1680][listPatientSequntial 2]err=' + error.message);
    }
  
};

exports.listPatientSequntial = (req, res, next) => {
  const specimenNo        = req.body.specimenNo;

  const result6 = patientsInfoCountHandler (specimenNo);
  result6.then(data => {

    let cnt = data[0].count;
    if (cnt === 0)
    {
      const result7 = PatientSequntialHandler (specimenNo);
        result7.then(data => {
          console.log('[1691][listPatientSequntial] ==> ', data)
           res.json(data);
        })
        .catch( error  => {
         logger.error('[1695][listPatientSequntial select]err=' + error.message);
         res.status(500).send('That is Not good ')
        }); 
    }
    else
    {
      const result8 = patientsInfoStautsHandler (specimenNo);
      result8.then(data => {
    
        let cnt = data[0].screenstaus;
        if (cnt !== '0')
        {
          const result7 = reportSequntialHandler (specimenNo);
            result7.then(data => {
              console.log('[1691][listPatientSequntial] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listPatientSequntial select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
        else
        {
          const result9 = PatientSequntialHandler (specimenNo);
            result9.then(data => {
              console.log('[1691][listPatientSequntial] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listPatientSequntial select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
      })
    }
  });

}

const deleteHandlerSequntial = async (specimenNo) => {
   
  logger.info('[1703][screenList]delete Sequntial]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_patientsInfo where specimenNo=@specimenNo";
            
    logger.info("[1707][screenList][del Sequntial]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[1716][screenList][del Sequntial]err=' +  error.message);
    }
      
    return result;
}

// get Sequencing Count
const SequencingCountHandler = async (type) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[1726][screenList]get SequencingCountHandler type=' + type);
  const sql ="select count(1) as count from sequncing_list \
           where report_type = '" + type + "'";
  logger.info('[1741][screenList]get SequencingCountHandler sql=' + sql);  

  try {
    const request = pool.request(); 
    const result = await request.query(sql)
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[1750][screenList]SequencingCountHandler err=' + error.message);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// sequential 스크린 완료 Detected Variants 
const insertHandler_form7 = async (specimenNo, detected_variants) => {
  // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
  logger.info('[583][screenList][insert detected_variants 7]specimenNo=' + specimenNo);
  logger.info('[584][screenList][insert detected_variants 7]detected_variants=' + JSON.stringify(detected_variants));

   let result;
    
   for (i = 0; i < detected_variants.length; i++)
   {
     const type              = detected_variants[i].type;
     const gene              = detected_variants[i].gene;
     const exon              = detected_variants[i].exonintron;
     const nucleotide_change = detected_variants[i].nucleotideChange;
     const amino_acid_change = detected_variants[i].aminoAcidChange;
     const cosmic_id         = detected_variants[i].rsid ;
     const zygosity          = detected_variants[i].zygosity;
     const reference         = nvl(detected_variants[i].genbankaccesion, '');
     const cnt               = nvl(detected_variants[i].cnt, '');

     let functional_code = i;
 
     if (i < 10) {
       functional_code = '0' + i;
     }
 
     logger.info('[1806][screenList][insert detected_variants]type=' + type + ', functional_code = ' + functional_code + ', exon=' + exon );
     logger.info('[1806][screenList][insert detected_variants]nucleotide_change=' + nucleotide_change + ', amino_acid_change=' + amino_acid_change );
     logger.info('[1806][screenList][insert detected_variants]zygosity=' + zygosity + ', cosmic_id=' + cosmic_id + ', cnt=' + cnt 
     + ', GenbankAccesionNo='+ reference + ', gene= ' + gene);
  
     //insert Query 생성;
     const qry = `insert into report_detected_variants (specimenNo, report_date, type,
               exon, nucleotide_change, amino_acid_change, 
               cosmic_id, functional_code, cnt, zygosity, reference, gene, gubun, saveyn) 
               values(@specimenNo, getdate(),  @type,
                  @exon, @nucleotide_change, @amino_acid_change, 
                  @cosmic_id, @functional_code, @cnt, @zygosity, @reference,@gene, 'SEQ', 'S')`;
             
       logger.info('[1819][screenList][insert detected_variants 7]sql=' + qry);
 
       try {
           const request = pool.request()
             .input('specimenNo', mssql.VarChar, specimenNo)
             .input('type', mssql.VarChar, type)
             .input('functional_code', mssql.VarChar, functional_code)
             .input('exon', mssql.VarChar, exon)
             .input('nucleotide_change', mssql.VarChar, nucleotide_change)
             .input('amino_acid_change', mssql.VarChar, amino_acid_change)
             .input('zygosity', mssql.VarChar, zygosity)
             .input('cosmic_id', mssql.VarChar, cosmic_id)
             .input('cnt', mssql.VarChar, cnt)
             .input('reference', mssql.NVarChar, reference)
             .input('gene', mssql.VarChar, gene) ;
             
             result = await request.query(qry);         
     
       } catch (error) {
         logger.error('[558][screenList][insert detected_variants 7]err=' + error.message);
       }
       
   } // End of For Loop
     return result;
}

//////////////////////////////////////////////////////////////////////////////////
// Sequencing 스크린 완료 
const insertHandlerSequencing = async (specimenNo, type, title, result2,  
                            target, testmethod, analyzedgene, specimen, comment, comment1,comment2, seqcomment,  identified_variations) => {
  
  logger.info('[1747][screenList][insert report_patientsInfo]specimenNo=' + specimenNo);
  logger.info('[1747][screenList][insert report_patientsInfo]type=' + type + ', title = ' + title + ', result=' + result2 );
  logger.info('[1747][screenList][insert report_patientsInfo]target=' + target );
  logger.info('[1747][screenList][insert report_patientsInfo]testmethod=' + testmethod );
  logger.info('[1747][screenList][insert report_patientsInfo]analyzedgene=' + analyzedgene );
  logger.info('[585][screenList][insert report_patientsInfo]comment=' + comment);
  logger.info('[585][screenList][insert report_patientsInfo]comment1=' + comment1);
  logger.info('[585][screenList][insert report_patientsInfo]comment2=' + comment2);
  logger.info('[585][screenList][insert report_patientsInfo]seqcomment=' + seqcomment);
  logger.info('[1747][screenList][insert report_patientsInfo]identified_variations=' + identified_variations );
  logger.info('[1747][screenList][insert report_patientsInfo]specimen=' + specimen);

  //insert Query 생성;
  const qry = `insert into report_patientsInfo (specimenNo, report_date, title, report_type,
      result, 
      target, testmethod, analyzedgene,
      identified_variations, specimen, 
      comment, comment1, comment2, seqcomment, screenstatus) 
      values(@specimenNo, getdate(),  @title, @type,
      @result2, 
      @target, @testmethod, @analyzedgene,
      @identified_variations, @specimen,
      @comment, @comment1,@comment2, @seqcomment, '2')`;
    
  logger.info('[1824][screenList][insert report_patientsInfo]sql=' + qry);

  try {
    const request = pool.request()
      .input('specimenNo', mssql.VarChar, specimenNo)
      .input('type', mssql.VarChar, type)
      .input('title', mssql.NVarChar, title)
      .input('result2', mssql.VarChar, result2)
      .input('target', mssql.NVarChar, target)
      .input('testmethod', mssql.NVarChar, testmethod)
      .input('analyzedgene', mssql.NVarChar, analyzedgene)
      .input('comment', mssql.NVarChar, comment)
      .input('comment1', mssql.NVarChar, comment1)
      .input('comment2', mssql.NVarChar, comment2)
      .input('seqcomment', mssql.NVarChar, seqcomment)
      .input('identified_variations', mssql.NVarChar, identified_variations)
      .input('specimen', mssql.VarChar, specimen);
      
    let result = await request.query(qry);         

  } catch (error) {
    logger.error('[1810][screenList][insert report_patientsInfo]err=' + error.message);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// Sequencing 리스트 입력
const insertHandlerSequence = async (type,  
                            target, testmethod, analyzedgene, specimen,  identified_variations, comment1, comment2 ) => {
  
  logger.info('[1931][screenList][insert sequncing_list]type=' + type  );
  logger.info('[1931][screenList][insert sequncing_list]target=' + target );
  logger.info('[1931][screenList][insert sequncing_list]testmethod=' + testmethod );
  logger.info('[1931][screenList][insert sequncing_list]analyzedgene=' + analyzedgene );
  logger.info('[1931][screenList][insert sequncing_list]comment1=' + comment1 );
  logger.info('[1931][screenList][insert sequncing_list]comment2=' + comment2 );
  logger.info('[1931][screenList][insert sequncing_list]identified_variations=' + identified_variations );
  logger.info('[1931][screenList][insert sequncing_list]specimen=' + specimen);
  
  //insert Query 생성;
  const qry = `insert into sequncing_list ( report_type,
      target, method, analyzedgene, comment1, comment2,
      identified_variations, specimen) 
      values(@type, 
      @target, @testmethod, @analyzedgene, @comment1, @comment2,
      @identified_variations, @specimen)`;
    
  logger.info('[1948][screenList][insert sequncing_list]sql=' + qry);

  try {
    const request = pool.request()
      .input('type', mssql.VarChar, type)
      .input('target', mssql.NVarChar, target)
      .input('testmethod', mssql.NVarChar, testmethod)
      .input('analyzedgene', mssql.NVarChar, analyzedgene)
      .input('identified_variations', mssql.NVarChar, identified_variations)
      .input('comment1', mssql.NVarChar, comment1)
      .input('comment2', mssql.NVarChar, comment2)
      .input('specimen', mssql.VarChar, specimen);
      
    let result = await request.query(qry);         

  } catch (error) {
    logger.error('[1964][screenList][insertHandlerSequence]err=' + error.message);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// Sequencing list 수정
const updateHandlerSequence = async (type,  title,
                            target, testmethod, analyzedgene, specimen,  identified_variations, comment1, comment2 ) => {
  
  logger.info('[1862][screenList][update sequncing_list]type=' + type  );
  logger.info('[1856][screenList][update sequncing_list]title=' + title );
  logger.info('[1856][screenList][update sequncing_list]target=' + target );
  logger.info('[1856][screenList][update sequncing_list]testmethod=' + testmethod );
  logger.info('[1856][screenList][update sequncing_list]analyzedgene=' + analyzedgene );
  logger.info('[1856][screenList][update sequncing_list]comment1=' + comment1 );
  logger.info('[1856][screenList][update sequncing_list]comment2=' + comment2 );
  logger.info('[1856][screenList][update sequncing_list]identified_variations=' + identified_variations );
  logger.info('[1856][screenList][update sequncing_list]specimen=' + specimen);
  
  //insert Query 생성;
  const qry = `update sequncing_list 
      set  target =@target, method = @testmethod, analyzedgene = @analyzedgene, 
      comment1 = @comment1, comment2 = @comment2,
      identified_variations = @identified_variations,  specimen =  @specimen
      where report_type= @type `;
    
  logger.info('[1877][screenList][insert updateHandlerSequence]sql=' + qry);

  try {
    const request = pool.request()
      .input('type', mssql.VarChar, type)
      .input('target', mssql.NVarChar, target)
      .input('testmethod', mssql.NVarChar, testmethod)
      .input('analyzedgene', mssql.NVarChar, analyzedgene)
      .input('identified_variations', mssql.NVarChar, identified_variations)
      .input('comment1', mssql.NVarChar, comment1)
      .input('comment2', mssql.NVarChar, comment2)
      .input('specimen', mssql.VarChar, specimen);
      
    let result = await request.query(qry);         

  } catch (error) {
    logger.error('[1893][screenList][insert report_mlpa]err=' + error.message);
  }
}

// sequential 임시저장
exports.saveScreen7 = (req, res, next) => {
  
    logger.info('[1900][screenList][saveScreen 7]req=' + JSON.stringify(req.body));
    
    const chron = '' ;
    const flt3ITD = '' ; 
    const leukemia = '';
    const vusmsg            = '';       
    let type = req.body.patientInfo.test_code;
    let title = nvl(req.body.patientInfo.title, '');
    let result2 = nvl(req.body.result, '');
    const resultStatus      = req.body.resultStatus;
    const specimen        = req.body.specimen;
    const specimenNo          = nvl(req.body.patientInfo.specimenNo, '');
    const detected_variants = req.body.sequencing;
 
    const examin            = req.body.patientInfo.examin;
    const recheck           = req.body.patientInfo.recheck;
    const identified_variations  = nvl(req.body.identified_variations, '');

    const comment           = req.body.comment;
    const comment1          = req.body.comment1;
    const comment2          = req.body.comment2;
    const seqcomment        = req.body.seqcomment;

    let target = nvl(req.body.target, '');
    let testmethod  = nvl(req.body.testmethod, '');
    let analyzedgene =  nvl(req.body.analyzedgene, '');

    logger.info('[1925][screenList][saveScreen 7]specimenNo= ' + specimenNo  + ', resultStatus= ' + resultStatus
                                  + ", detected_variants=" + detected_variants); 
    const result = deleteHandler(specimenNo);
    result.then(data => {
    
      const result3 = insertHandler_form7(specimenNo, detected_variants);
      result3.then(data => {
    
        const result4 = deleteHandlerSequntial(specimenNo);
        result4.then(data => {
    
          const result5 = insertHandlerSequencing (specimenNo, type, title, result2,
                                                  target, testmethod, analyzedgene, specimen, comment, comment1,comment2, seqcomment, identified_variations );
          result5.then(data => {

              // 검사지 변경
              const statusResult = messageHandler4(specimenNo, chron, flt3ITD, resultStatus,
                                                   leukemia, examin, recheck, vusmsg);
              statusResult.then(data => {

                const result6 = SequencingCountHandler (type);
                result6.then(data => {

                  let cnt = data[0].count;

                  logger.info('[2063][screenList][saveScreen 7]cnt='+ cnt);
                  //if (cnt === 0)
                  //{
                    const result7 = insertHandlerSequence (type, title,
                      target, testmethod, analyzedgene, specimen, identified_variations, comment1, comment2);
                      result7.then(data => {
                        res.json({message: 'OK'});
                      })
                  //}
                  //else
                  //{
                  //  res.json({message: 'OK'});
                  //}
                });
              });
          });
        
        });

      });
            
    })
    .catch( error  => {
      logger.error('[1430][screenList][saveScreen 7]err=' + error.message);
      res.sendStatus(500)
    });
};

// MLPA report 내역
const PatientMlpaHandler = async (specimenNo) => {
  await poolConnect; 

  const sql=`select  
            isnull(site, '') site, isnull(result, '') result, isnull(seq, '') seq
            , case when isnull(screenstatus, '') = '' then  'T' 
              else isnull(saveyn, 'S') end saveyn
        from [dbo].[patientinfo_diag]  a
        left outer join [dbo].[mlpaData] b
        on a.test_code = b.type
        where a.specimenNo =@specimenNo  
        order by seq
  `;

  logger.info('[1385][listReportMlpa select]sql=' + sql);

  try {
      const request = pool.request().input('specimenNo', mssql.VarChar, specimenNo); 
      const result = await request.query(sql)

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1370][listReportMlpa]err=' + error.message);
    }
  
};


// mlpa patient 내역
const ReportMlpalHandler = async (specimenNo) => {
  await poolConnect; 
  const sql=`select  
      isnull(site, '') site, isnull(result, '') result,
      isnull(deletion, '') deletion, isnull(methylation, '') methylation, isnull(seq, '') seq
      from [dbo].[report_mlpa] 
      where specimenNo =@specimenNo
      order by convert (int, seq) 
  `;

  logger.info('[1672][ReportMlpalHandler select]sql=' + sql + '  ' + specimenNo);

  try {
      const request = pool.request()
                    .input('specimenNo', mssql.VarChar, specimenNo); 

      const result = await request.query(sql);

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1680][ReportMlpalHandler 3]err=' + error.message);
    }
  
};


exports.listReportMlpa = (req, res, next) => {
  const specimenNo        = req.body.specimenNo;

  const result6 = patientsInfoCountHandler (specimenNo);
  result6.then(data => {

    let cnt = data[0].count;
    if (cnt === 0)
    {
      const result7 = PatientMlpaHandler (specimenNo);
        result7.then(data => {
          console.log('[1691][listReportMlpa] ==> ', data)
           res.json(data);
        })
        .catch( error  => {
         logger.error('[1695][listReportMlpa select]err=' + error.message);
         res.status(500).send('That is Not good ')
        }); 
    }
    else
    {
      const result8 = patientsInfoStautsHandler (specimenNo);
      result8.then(data => {
    
        let cnt = data[0].screenstaus;
        if (cnt !== '0')
        {
          const result7 = ReportMlpalHandler (specimenNo);
            result7.then(data => {
              console.log('[1691][listReportMlpa] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listReportMlpa select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
        else
        {
          const result9 = PatientMlpaHandler (specimenNo);
            result9.then(data => {
              console.log('[1691][listReportMlpa] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listReportMlpa select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
      })
    }
  });

}

// Mlpa 내역
const MlpalHandler = async (specimenNo) => {
  await poolConnect; 
  const sql=`select  
      isnull(a.test_code, '') report_type,  '' result,
       '' comment, 
      isnull(b.target, '') target,  isnull(b.method, '') testmethod, isnull(b.analyzedgene, '') analyzedgene ,
      isnull(b.specimen, '') specimen, isnull(b.comment1, '') conclusion, isnull(b.comment2, '') technique 
      , case when isnull(screenstatus, '') = '' then  'T' 
      else isnull(saveyn, 'S') end saveyn
      from [dbo].[patientInfo_diag]  a
      left outer join [dbo].[codedefaultvalue] b
      on a.test_code = b.code
      where a.specimenNo =@specimenNo
  `;



  logger.info('[1385][MlpalHandler select]sql=' + sql + '  ' + specimenNo);

  try {
      const request = pool.request().input('specimenNo', mssql.VarChar, specimenNo); 
      const result = await request.query(sql)

       return result.recordsets[0];
    } catch (error) {
         logger.error('[1370][MlpalHandler]err=' + error.message);
    }
  
};

// Mlpa Report 내역
const reportMlpalHandler = async (specimenNo) => {
  await poolConnect; 
  // const sql=`select  
  //     isnull(a.report_type, '') report_type, isnull(a.result, '') result, isnull(a.specimen, '') specimen,
  //     isnull(a.comment1, '') conclusion, isnull(a.comment2, '') technique, isnull(a.comment, '') comment,
  //     isnull(a.target, '') target,  isnull(a.testmethod, '') testmethod, isnull(a.analyzedgene, '') analyzedgene
  //     from [dbo].[report_patientsInfo]  a
  //     where a.specimenNo =@specimenNo
  // `;

  const sql=`select  
      isnull(a.report_type, '') report_type, isnull(a.result, '') result, isnull(a.specimen, '') specimen,
      isnull(a.conclusion, '') conclusion, isnull(a.technique, '') technique, isnull(a.comment, '') comment,
      isnull(a.target, '') target,  isnull(a.testmethod, '') testmethod, isnull(a.analyzedgene, '') analyzedgene
      from [dbo].[report_patientsInfo]  a
      where a.specimenNo =@specimenNo
  `;



  logger.info('[1385][reportMlpalHandler select]sql=' + sql + '  ' + specimenNo);

  try {
      const request = pool.request().input('specimenNo', mssql.VarChar, specimenNo); 
      const result = await request.query(sql)

        console.log(result.recordsets[0]);
       return result.recordsets[0];
    } catch (error) {
         logger.error('[1370][reportMlpalHandler]err=' + error.message);
    }
  
};


exports.listMlpa = (req, res, next) => {
  const specimenNo        = req.body.specimenNo;

  const result6 = patientsInfoCountHandler (specimenNo);
  result6.then(data => {

    let cnt = data[0].count;
    if (cnt === 0)
    {
      const result7 = MlpalHandler (specimenNo);
        result7.then(data => {
          console.log('[1691][listMlpa] ==> ', data)
           res.json(data);
        })
        .catch( error  => {
         logger.error('[1695][listMlpa select]err=' + error.message);
         res.status(500).send('That is Not good ')
        }); 
    }
    else
    {
      const result8 = patientsInfoStautsHandler (specimenNo);
      result8.then(data => {
    
        let cnt = data[0].screenstaus;
        if (cnt !== '0')
        {
          const result7 = reportMlpalHandler (specimenNo);
            result7.then(data => {
              console.log('[2328][listMlpa] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listMlpa select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
        else
        {
          const result9 = MlpalHandler (specimenNo);
            result9.then(data => {
              console.log('[2340][listMlpa] ==> ', data)
               res.json(data);
            })
            .catch( error  => {
             logger.error('[1695][listMlpa select]err=' + error.message);
             res.status(500).send('That is Not good ')
            }); 
        }
      })
    }
  });

}

const deleteHandlerMlpa = async (specimenNo) => {
   
  logger.info('[761][screenList]delete Mlpa]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_patientsInfo where specimenNo=@specimenNo";
            
    logger.info("[765][screenList][del Mlpa]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[774][screenList][del Mlpa]err=' +  error.message);
    }
      
    return result;
}

// report_mlpa
const deleteHandlerReportMlpa = async (specimenNo) => {
   
  logger.info('[761][screenList]delete report_mlpa]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_mlpa where specimenNo=@specimenNo";
            
    logger.info("[765][screenList][del report_mlpa]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[774][screenList][del report_mlpa]err=' +  error.message);
    }
      
    return result;
}

//////////////////////////////////////////////////////////////////////////////////
// MLPA 스크린 완료 
const insertHandlerMlpa = async (specimenNo, type, title, result2, conclusion, technique, target,  testmethod, analyzedgene, comment, detectedtype, specimen) => {
  
  logger.info('[2107][screenList][insert report_patientsInfo]specimenNo=' + specimenNo);
  logger.info('[2107]][screenList][insert report_patientsInfo]type=' + type + ', title = ' + title + ', result=' + result2 );
  logger.info('[2107]][screenList][insert report_patientsInfo]conclusion=' + conclusion);
  logger.info('[2107]][screenList][insert report_patientsInfo]technique=' + technique );
  logger.info('[2107]][screenList][insert report_patientsInfo]target=' + target );
  logger.info('[2107]][screenList][insert report_patientsInfo]testmethod=' + testmethod );
  logger.info('[1722][screenList][insert report_patientsInfo]analyzedgene=' + analyzedgene );
  logger.info('[1722][screenList][insert report_patientsInfo]comment=' + comment );
  logger.info('[2107]][screenList][insert report_patientsInfo]analyzedgene=' + detectedtype );
  logger.info('[2107]][screenList][insert report_patientsInfo]specimen=' + specimen );
  let detectedType
  if ( detectedtype === 'detected') {
    detectedType = '0';
  } else {
    detectedType = '1';
  }

  logger.info('[2124][screenList][insert report_patientsInfo]specimenNo=' + specimenNo
  + ', detectedtype=' + detectedtype + ', type=' + detectedType);

  let query ="update [dbo].[patientinfo_diag] \
  set detected=@detectedType, saveyn='S'  where specimenNo=@specimenNo ";  
  logger.info('[2129][screenList][update patientinfo_diag]sql=' + query);

  try {
  const request = pool.request()
  .input('specimenNo', mssql.VarChar, specimenNo)
  .input('detectedType', mssql.VarChar, detectedType);

  result = await request.query(query);         

  } catch (error) {
  logger.error('[2139][screenList][update patientinfo_diag]err=' + error.message);
  }

  //insert Query 생성;
  const qry = `insert into report_patientsInfo (specimenNo, report_date, title, report_type,
      result, conclusion, technique, 
      target, testmethod, analyzedgene, comment, screenstatus,specimen) 
      values(@specimenNo, getdate(),  @title, @type,
      @result2, @conclusion, @technique,
      @target, @testmethod, @analyzedgene, @comment, '2', @specimen)`;
    
  logger.info('[2152][screenList][insert report_patientsInfo]sql=' + qry);

  try {
    const request = pool.request()
      .input('specimenNo', mssql.VarChar, specimenNo)
      .input('type', mssql.VarChar, type)
      .input('title', mssql.NVarChar, title)
      .input('result2', mssql.VarChar, result2)
      .input('conclusion', mssql.NVarChar, conclusion)
      .input('technique', mssql.NVarChar, technique)
      .input('target', mssql.NVarChar, target)
      .input('testmethod', mssql.NVarChar, testmethod)
      .input('analyzedgene', mssql.NVarChar, analyzedgene)
      .input('comment', mssql.NVarChar, comment)
      .input('specimen', mssql.VarChar, specimen);
      
    let result = await request.query(qry);         

  } catch (error) {
  logger.error('[2179][screenList][insert report_mlpa]err=' + error.message);
  }
}

// MLPA 스크린 완료 
const insertHandlerReporMlpa = async (specimenNo, report_mlpa) => {
  // for 루프를 돌면서 report_mlpa 카운트 만큼       //report_mlpa Count
  logger.info('[2177][screenList][insert report_mlpa]specimenNo=' + specimenNo);
  logger.info('[2178][screenList][insert report_mlpa]report_mlpa=' + JSON.stringify(report_mlpa));

  for (i = 0; i < report_mlpa.length; i++)
  {
    let site              = report_mlpa[i].site;
    let result            = report_mlpa[i].result;
  //  let deletion          = report_mlpa[i].deletion;
  //  let methylation       = nvl(report_mlpa[i].methylation, '');

    let seq = i + 1;

    // if (i < 10) {
    //   seq = '0' + i;
    // }

    logger.info('[1865][screenList][insert report_mlpa]seq = ' + seq + ', site=' + site  );

    //insert Query 생성;
    const qry = `insert into report_mlpa (specimenNo, site,  result, seq) 
              values(@specimenNo, @site,  @result,  @seq)`;
            
      logger.info('[2199][screenList][insert report_mlpa]sql=' + qry);

      try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('site', mssql.VarChar, site)
            .input('seq', mssql.VarChar, seq)
            .input('result', mssql.VarChar, result);

          let result2 = await request.query(qry);         
    
      } catch (error) {
        logger.error('[2211][screenList][insert report_mlpa]err=' + error.message);
      }
      
  } // End of For Loop
}

// MLPA 임시저장
exports.saveScreenMlpa = (req, res, next) => {
  
    logger.info('[220][screenList][saveScreenMlpa]req=' + JSON.stringify(req.body));
    
    const chron = '' ;
    const flt3ITD = '' ; 
    const leukemia = '';
    const vusmsg            = '';   

    const resultStatus = req.body.resultStatus;
    const specimenNo        = req.body.specimenNo;
    let type = req.body.type;
    let title = req.body.title;
    let result2 = req.body.result;
    let conclusion = req.body.conclusion;
    let technique = req.body.technique;
    let comment = req.body.comment;
    let target = req.body.target;
    let testmethod  = req.body.testmethod;
    let analyzedgene =  req.body.analyzedgene;
    const specimen = req.body.specimen;
    const report_mlpa = req.body.data;
 
    const examin            = '';
    const recheck           = '';
 
    logger.info('[2244][screenList][saveScreenMlpa]specimenNo=, ' + specimenNo); 
    const result6 = deleteHandlerMlpa(specimenNo);
    result6.then(data => {

      const result3 = deleteHandlerReportMlpa(specimenNo);
      result3.then(data => {
    
        const result4 = insertHandlerMlpa (specimenNo, type, title, result2, conclusion, technique, target,  testmethod, analyzedgene, comment, resultStatus, specimen);
        result4.then(data => {
    
          const result5 = insertHandlerReporMlpa (specimenNo, report_mlpa);
          result5.then(data => {
            res.json({message: 'OK'});
              // 검사지 변경
              // const statusResult = messageHandler4(specimenNo, chron, flt3ITD, leukemia, examin, recheck, vusmsg);
              // statusResult.then(data => {
              //       
              //   });
            });
        });
      });
            
    })
    .catch( error  => {
      logger.error('[2268][screenList][saveScreenMlpa]err=' + error.message);
      res.sendStatus(500)
    });
};


const  findRefIdHandler = async (gene, nucleotideChange) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[2522][screenList][findRefIdHandler]gene = ' + gene  );
  logger.info('[2522][screenList][findRefIdHandler]nucleotideChange = ' + nucleotideChange  );
  
  //select Query 생성
      const qry = `SELECT
          isnull(reference, '') reference
          , isnull(cosmicID, '') cosmicID
          , isnull(report_date,  '') reportdate
        FROM dbo.excelDV
        where gene = @gene
        and nucleotideChange = @nucleotideChange
        order by reportdate desc`;

      logger.info('[2533]findRefIdHandler sql=' + qry);
  
  try {

    const request = pool.request()
      .input('gene', mssql.VarChar, gene)
      .input('nucleotideChange', mssql.VarChar, nucleotideChange);

    const result = await request.query(qry);
    return result.recordset; 
  }catch (error) {
    logger.error('[2544]findRefIdHandler err=' + error.message);
  }
}

// get findRefId List
exports.findRefId = (req, res, next) => {
  logger.info('[2550]findRefId req=' + JSON.stringify(req.body));

  const gene = req.body.gene;
  const nucleotideChange = req.body.nucleotideChange;
  const result = findRefIdHandler(gene, nucleotideChange);
  result.then(data => {

      console.log('[2556][findRefId]', data);
      res.json(data);
  })
  .catch( error => {

      logger.error('[2561]findRefId err=' + error.message);
      res.sendStatus(500)
  }); 
};



// 병리 접수취소 쿼리
const  selectReceiptCancel_Diag = async (specimenno, patientid) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[2621][ReceiptCancel Diag]specimenno=' + specimenno + ", patientid=" + patientid);

  const sql= `select specimenno from [dbo].[patientinfo_diag] 
         where specimenno = @specimenno 
         and patientid = @patientid`;
  
  logger.info('[1193][ReceiptCancel Diag]sql=' + sql);

  try {
      const request = pool.request()
        .input('specimenno', mssql.VarChar, specimenno) // specimenno
        .input('patientid', mssql.VarChar, patientid); // patientID 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[1204][ReceiptCancel Diag]err=' + error.message);
  }
}

const  findReceiptCancelDiagHandler = async (patientid, specimenno) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[2617][screenList][findReceiptCancelDiagHandler]patientid = ' + patientid  );
  logger.info('[2617][screenList][findReceiptCancelDiagHandler]specimenno = ' + specimenno  );
  
  //select Query 생성
      const qry = `update [dbo].[patientinfo_diag] 
          set screenstatus = '5'
        where specimenNo = @specimenno
        and patientid = @patientid`;

      logger.info('[2533]findReceiptCancelDiagHandler sql=' + qry);
  
  try {

    const request = pool.request()
      .input('patientid', mssql.VarChar, patientid)
      .input('specimenno', mssql.VarChar, specimenno);

    const result = await request.query(qry);
    return result; 
  }catch (error) {
    logger.error('[2544]findReceiptCancelDiagHandler err=' + error.message);
  }
}

// get receiptcancel_diag 
exports.receiptcancel_diag = (req, res, next) => {
  logger.info('[2550]findRreceiptcancel_diagefId req=' + JSON.stringify(req.query));

  const patientid = req.query.patientid ;
  const specimenno = req.query.specimenno ;

  const result2 = selectReceiptCancel_Diag(specimenno, patientid);
  result2.then(data => {

  let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: '0'});
    }
    else
    {
      const result =findReceiptCancelDiagHandler(patientid, specimenno);
      result.then(data => {
        console.log('[screenList][1237][ReceiptCancel]',data); 

        if (data.rowsAffected[0] == 1 ) {
          res.json({message: '1'});
        } else {
          res.json({message: '0'});
        } 
      })
    }
  })
  .catch( error => {

      logger.error('[2561]receiptcancel_diag err=' + error.message);
      res.sendStatus(500)
  }); 
};