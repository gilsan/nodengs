const express = require('express');

const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

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
 

/*******
 * sorting 을 위한 임시 저장임.
 * 키이름은 dvsorting 테입블의 필드와  references 을 제외하고 동일
 * references   테이블에는 reference 로 됨
 * id 
checked 
igv 
sanger 
type 
gene 
functionalImpact 
transcript 
exonIntro 
nucleotideChange 
aminoAcidChange 
zygosity 
vafPercent 
references   테이블에는 reference 로 됨
cosmicID 
status 
 */

const beforesortingHandler = async (req) => {
    await poolConnect; // ensures that the pool has been created

   const items = req.body.data;
   const patientID = req.body.patientID;
   const len = items.length;
   let result;
   if ( len > 0 ) {
      for (let i = 0; i < len; i++) {

        const id      = nvl(items[i].id,"");
        const checked = items[i].checked; 
        const igv     = nvl(items[i].igv,""); 
        const sanger  = nvl(items[i].sanger, ""); 
        const type    = nvl(items[i].type,""); 
        const gene    = nvl(items[i].gene,""); 
        const functionalImpact = nvl(items[i].functionalImpact,""); 
        const transcript       = nvl(items[i].transcript,""); 
        const exonIntro        = nvl(items[i].exonIntro,""); 
        const nucleotideChange = nvl(items[i].nucleotideChange,""); 
        const aminoAcidChange  = nvl(items[i].aminoAcidChange,""); 
        const zygosity         = nvl(items[i].zygosity,""); 
        const vafPercent       = nvl(items[i].vafPercent,""); 
        const reference        = nvl(items[i].references,"");    
        const cosmicID         = nvl(items[i].cosmicID,""); 
        const status           = nvl(items[i].status,""); 
    
        logger.info('[77][dvbeforesroting]  checked=[' + checked + ']'); 
 

        logger.info('========= [78][dvbeforesroting  controller][' + i +'] =============='); 
        logger.info('[78][dvbeforesroting] id =[' + id + '] checked=[' + checked + '] igv=[' + igv + ']');  
        logger.info('[78][dvbeforesroting] sanger =[' + sanger + '] type=[' + type + '] gene=[' + gene + ']'); 
        logger.info('[78][dvbeforesroting] functionalImpact =[' + functionalImpact + '] transcript=[' + transcript + '] exonIntro=[' + exonIntro + ']');  
        logger.info('[78][dvbeforesroting] nucleotideChange =[' + nucleotideChange + '] aminoAcidChange=[' + aminoAcidChange + '] zygosity=[' + zygosity + ']');
        logger.info('[78][dvbeforesroting] vafPercent =[' + vafPercent + '] references=[' + reference + '] cosmicID=[' + cosmicID + ']');
        logger.info('[78][dvbeforesroting] status =[' + status+ '] patientID= [' + patientID + ']'); 
    
        let sql ="insert into dvsorting   ";
        sql = sql + " (id, checked,  igv, sanger,  ";
        sql = sql + "type,  gene,  functionalImpact,  transcript, ";
        sql = sql + "exonIntro,  nucleotideChange, aminoAcidChange, zygosity, ";
        sql = sql + "vafPercent,  reference, cosmicID,  status, patientID) ";
        sql = sql + " values (@id, @checked, @igv, @sanger, @type, @gene,  ";
        sql = sql + " @functionalImpact, @transcript, @exonIntro, @nucleotideChange, @aminoAcidChange, @zygosity,  ";
        sql = sql + " @vafPercent, @reference, @cosmicID, @status, @patientID)";

        logger.info('[94][dvbeforesroting]sql=' + sql);
    
        try {
    
            const request = pool.request()
            .input('id', mssql.VarChar, id) 
            .input('checked', mssql.VarChar, checked) 
            .input('igv', mssql.VarChar, igv) 
            .input('sanger', mssql.VarChar, sanger) 
            .input('type', mssql.VarChar, type)
            .input('gene', mssql.VarChar, gene) 
            .input('functionalImpact', mssql.VarChar, functionalImpact) 
            .input('transcript', mssql.VarChar, transcript) 
            .input('exonIntro', mssql.VarChar, exonIntro) 
            .input('nucleotideChange', mssql.VarChar, nucleotideChange) 
            .input('aminoAcidChange', mssql.VarChar, aminoAcidChange) 
            .input('zygosity', mssql.VarChar, zygosity) 
            .input('vafPercent', mssql.VarChar, vafPercent) 
            .input('reference', mssql.VarChar, reference) 
            .input('cosmicID', mssql.VarChar, cosmicID)
            .input('status', mssql.VarChar, status)
            .input('patientID', mssql.VarChar, patientID) ; 
    
           result = await request.query(sql);
            
        } catch(error) {
            logger.error('[120][dvbeforesroting] err=' + error.message);
        }

      }
      return result;
   } // End of If


}

// Detected Variants 입력
// POST
exports.dvbeforsorting = (req, res, next) => {   
    const result = beforesortingHandler(req);
    result.then(data => { 
            res.json({message: 'SUCC'});
    })
    .catch( err  => res.sendStatus(500));
};





const aftersortingHandler = async (req) => {
    await poolConnect; // ensures that the pool has been created
    const patientID = req.body.patientID;

    let sql ="select id	";
        sql = sql + " ,isnull(checked, '') checked";
        sql = sql + " ,isnull(igv, '') igv";
        sql = sql + " ,isnull(sanger, '') sanger";
        sql = sql + " ,isnull(type, '') type";
        sql = sql + " ,isnull(gene, '') gene";
        sql = sql + " ,isnull(functionalImpact, '') functionalImpact";
        sql = sql + " ,isnull(transcript, '') transcript";
        sql = sql + " ,isnull(exonIntro, '') exonIntro";
        sql = sql + " ,isnull(nucleotideChange, '') nucleotideChange";
        sql = sql + " ,isnull(aminoAcidChange, '') aminoAcidChange";
        sql = sql + " ,isnull(zygosity, '') zygosity";
        sql = sql + " ,isnull(vafPercent, '') vafPercent";
        sql = sql + " ,isnull(reference, '') reference  ";
        sql = sql + " ,isnull(cosmicID, '') cosmicID";
        sql = sql + " ,isnull(status, '') status from dvsorting where patientID = @patientID order by  gene, nucleotideChange ";

    let query = "delete from dvsorting where patientID = @patientID";
    
    logger.info('== [169][aftersorting  sql][' + sql +'] ==');
        try {
            const request = pool.request()
                            .input('patientID', mssql.VarChar, patientID); 
                            
            const result = await request.query(sql) 
                await request.query(query);
                
                return result.recordset;
            } catch (err) {
               
               logger.error("[181][dvaftersroting] err=" + error.message);
            }
    }

// GET
// SELECT 실행후 , 항사 DELETE 실행
exports.dvaftersorting = (req, res, next) => {   
    console.log('dvaftersorting');
    const result = aftersortingHandler(req);
    result.then(data => { 
            res.json(data);
        })
        .catch( err  => res.sendStatus(500));
    };


  