
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

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

const  excelDvInsertHandler = async (specimenNo, excelDv) => {
    await poolConnect; // ensures that the pool has been created

    const len = excelDv.length;

    let result;

    logger.info("[excelDv][17]len=" + len);
     
    if (len > 0) {
        for (let i =0; i < len; i++) {

            let patientID = excelDv[i].patientID;
            let name      = excelDv[i].name;
            let age      = excelDv[i].age;
            let gender    = excelDv[i].gender;
            let test_code = nvl(excelDv[i].testcode, "");
            let gene      = excelDv[i].gene;
            let functionalImpact  = excelDv[i].functionalImpact;
            let transcript  = excelDv[i].transcript;
            let exonIntro  = excelDv[i].exonIntro;
            let nucleotideChange  = excelDv[i].nucleotideChange;
            let aminoAcidChange  = excelDv[i].aminoAcidChange;
            let zygosity  = excelDv[i].zygosity;
            let vafPercent  = excelDv[i].vafPercent;
            let references  = excelDv[i].reference;
            let cosmicID  = excelDv[i].cosmicID;
            let accept_date  = nvl(excelDv[i].acceptdate, "");
            let report_date  = nvl(excelDv[i].reportdate, "");
            let tsv_name  = nvl(excelDv[i].tsvname, "");
                        
            logger.info( '[25][excelDvdata]' + specimenNo  + " " + patientID + " " + name +  " " + age + " " + gender + " " + test_code  );
            logger.info( '[25][excelDvdata]' + gene + " " + transcript + " " + exonIntro + " " + nucleotideChange + " " + aminoAcidChange);
            logger.info( '[25][excelDvdata]' + zygosity + " " + vafPercent + " " + references + " " + cosmicID + " " + accept_date + " " + report_date + " " + tsv_name);

            const qry = `insert into excelDv (
                    patientID
                    , specimenNo
                    , name
                    , gender
                    , age
                    , gene
                    , test_code
                    , functionalImpact
                    , transcript
                    , exonIntro
                    , nucleotideChange
                    , aminoAcidChange
                    , zygosity
                    , vafPercent
                    , reference
                    , cosmicID
                    , accept_date
                    , report_date
                    , tsvname
                    ) 
                    values(
                        @patientID
                        , @specimenNo
                        , @name
                        , @gender
                        , @age
                        , @gene
                        , @test_code
                        , @functionalImpact
                        , @transcript
                        , @exonIntro
                        , @nucleotideChange
                        , @aminoAcidChange
                        , @zygosity
                        , @vafPercent
                        , @references
                        , @cosmicID
                        , @accept_date
                        , @report_date
                        , @tsv_name
                    )`; 
            logger.info('[27][excelDvdata] sql='+ qry);
            try {
                const request = pool.request()
                .input('patientID', mssql.VarChar, patientID)
                .input('specimenNo', mssql.VarChar, specimenNo)
                .input('name', mssql.NVarChar, name)
                .input('gender', mssql.VarChar, gender)
                .input('age', mssql.VarChar, age)
                .input('test_code', mssql.VarChar, test_code)
                .input('gene', mssql.NVarChar, gene)
                .input('functionalImpact', mssql.VarChar, functionalImpact)
                .input('transcript', mssql.VarChar, transcript)
                .input('exonIntro', mssql.VarChar, exonIntro)
                .input('nucleotideChange', mssql.VarChar, nucleotideChange)
                .input('aminoAcidChange', mssql.VarChar, aminoAcidChange)
                .input('zygosity', mssql.VarChar, zygosity)
                .input('vafPercent', mssql.VarChar, vafPercent)
                .input('references', mssql.VarChar, references)
                .input('cosmicID', mssql.VarChar, cosmicID)
                .input('accept_date', mssql.VarChar, accept_date)
                .input('report_date', mssql.VarChar, report_date)
                .input('tsv_name', mssql.VarChar, tsv_name);
    
                result = await request.query(qry);
    
            } catch (error) {
                logger.error('[38][excelDv ins]err='+ error.message);
            }
        }
    }

    return result;
}

const excelDvDeleteHandler = async (specimenNo) => {
   
    logger.info('[105][excelDv]delete excelDvDeleteHandler]specimenNo=' + specimenNo);
      //delete Query 생성;    
      const qry ="delete excelDv where specimenNo=@specimenNo";
              
      logger.info("[419][screenList][del excelDv]del sql=" + qry);
    
      try {
          const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo);
            
            result = await request.query(qry);         
    
      } catch (error) {
        logger.error('[428][excelDv][del excelDvDeleteHandler]err=' +  error.message);
      }
        
      return result;
  }

// save excelDv list
exports.excelDvSave = (req, res, next) => {
     
    logger.info('[84][excelDv data]req=' + JSON.stringify(req.body));

    const specimenNo = req.body.specimenNo;
    const excelDv = req.body.data;

    const result2 = excelDvDeleteHandler(specimenNo);
    result2.then( data => {
     
    const result = excelDvInsertHandler(specimenNo, excelDv);
    result.then(data => {  
      //  console.log('[92][excelDvdata]', data);
          res.json({message: 'SUCCESS'});
     })
    })
    .catch( error  => {
        logger.error('[95][excelDv]err= ' + error.message);
        res.sendStatus(500);
    });

};

const  excelDvSelectHandler = async (start, end ,type) => {
    await poolConnect; // ensures that the pool has been created
    logger.error('[184] excelDvSelectHandler =' + start + ', ' + end + ', '+ type);
    //select Query 생성
        let qry = `SELECT
            isnull( tsvname, '') tsvname
            , isnull( patientID, '') patientID
            , isnull(specimenNo, '') specimenNo
            , isnull(name, '') name
            , isnull(gender, '') gender
            , isnull(age, '') age
            , isnull(gene, '') gene
            , isnull(test_code, '') testcode
            , isnull(functionalImpact, '') functionalImpact
            , isnull(transcript, '') transcript
            , isnull(exonIntro, '') exonIntro
            , isnull(nucleotideChange, '') nucleotideChange
            , isnull(aminoAcidChange, '') aminoAcidChange
            , isnull(zygosity, '') zygosity
            , isnull(vafPercent, '') vafPercent
            , isnull(reference, '') reference
            , isnull(cosmicID, '') cosmicID
            , isnull(accept_date,  '') acceptdate
            , isnull(report_date,  '') reportdate
        FROM NGS_DATA.dbo.excelDV 
        where left(report_date, 10) >= '` + start + "'" 
             + " and left(report_date, 10) <= '" + end + "'";

        if (type.length > 0) {

            if (type === 'AML')
            {
                qry = qry +  " and test_code in ('AML', 'ALL') ";
            }
            else
            {
                qry = qry +  " and test_code = '" +  type + "'";
            }
        }

        logger.info('[214]excelDvSelect sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[223]excelDvSelectHandler err=' + error.message);
    }
}

// get excelDv List
exports.excelDvList = (req, res, next) => {
    logger.info('[229]excelDvList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const start = req.body.start;
    const end   = req.body.end;
    const type  = req.body.type;
    const result = excelDvSelectHandler(start, end, type);
    // const result = excelDvSelectHandler(pathologyNum);
    result.then(data => {  
        //  console.log('[108][excelDvList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[242]excelDvList err=' + error.message);
        res.sendStatus(500)
    }); 
 };

