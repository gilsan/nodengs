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

// insert mutation
const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  const igv               = nvl(req.body.igv, "");
  const sanger            = nvl(req.body.sanger, "");  
  const patient_name      = req.body.name;
  const register_number   = req.body.patientID;
  const gene              = req.body.gene;
  const functional_impact = req.body.functionalImpact;
  const transcript        = req.body.transcript;
  const exon_intro        = req.body.exonIntro;
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = nvl(req.body.zygosity, "");
  const vaf               = nvl(req.body.vaf, "");
  const reference         = nvl(req.body.reference, "");
  const cosmic_id         = nvl(req.body.cosmicID, "");
  const buccal            = nvl(req.body.buccal, "");
  const buccal2           = nvl(req.body.buccal2, "");

  logger.info('[47][mutation]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene);   
  logger.info('[47][mutation]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[47][mutation]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[47][mutation]zygosity=' + zygosity  + ' vaf=' + vaf  + 'reference=' +  reference + ' cosmic_id= ' + cosmic_id);
  logger.info('[47][mutation]buccal=' + buccal  + ' buccal2=' + buccal2);

  let sql ="insert into mutation   ";
  sql = sql + " (igv, sanger,patient_name,register_number,  ";
  sql = sql + " gene,functional_impact,transcript,  ";
  sql = sql + " exon_intro,nucleotide_change,  ";
  sql = sql + " amino_acid_change,zygosity,vaf,  ";
  sql = sql + " reference,cosmic_id, buccal, buccal2)   ";
  sql = sql + " values (@igv, @sanger, @patient_name, @register_number,  ";
  sql = sql + " @gene, @functional_impact, @transcript,  ";
  sql = sql + " @exon_intro, @nucleotide_change,  ";
  sql = sql + " @amino_acid_change, @zygosity, @vaf,  ";
  sql = sql + " @reference,@cosmic_id,@buccal,@buccal2)";

  logger.info('[64][mutation]sql=' + sql);

  try {
      const request = pool.request()
        .input('igv', mssql.VarChar, igv) 
        .input('sanger', mssql.VarChar, sanger) 
        .input('patient_name', mssql.VarChar, patient_name) 
        .input('register_number', mssql.VarChar, register_number) 
        .input('gene', mssql.VarChar, gene) 
        .input('functional_impact', mssql.VarChar, functional_impact) 
        .input('transcript', mssql.VarChar, transcript) 
        .input('exon_intro', mssql.VarChar, exon_intro) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change) 
        .input('amino_acid_change', mssql.VarChar, amino_acid_change) 
        .input('zygosity', mssql.VarChar, zygosity) 
        .input('vaf', mssql.VarChar, vaf) 
        .input('reference', mssql.VarChar, reference) 
        .input('cosmic_id', mssql.VarChar, cosmic_id)
        .input('buccal', mssql.VarChar, buccal) 
        .input('buccal2', mssql.VarChar, buccal2); 
      const result = await request.query(sql)
     // console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[87][mutation]err=' + error.message);
  }
}

 exports.saveMutation = (req,res, next) => {
        
  logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

   const result = messageHandler(req);
   result.then(data => {

      //  console.log(json.stringfy());
        res.json(data);
    })
    .catch( error  => {
      logger.error('[102][mutation]err=' + error.message);
      res.sendStatus(500)
    });
}

exports.updateMutation = (req, res, next) => {

}

const  messageHandler2 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[114][mutation] del data=' + JSON.stringify( req.body));

  const id = req.body.id;

  const sql = "delete from mutation where id=@id";
  logger.info('[114][mutation]del data=' + JSON.stringify( req.body));
       
  try {
      const request = pool.request()
        .input('id', mssql.VarChar, id); 
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[129][mutation]err=' + error.message);
  }
}

exports.deleteMutation = (req, res, next) => {
  
     const id = req.body.id;
        
     const result = messageHandler2(id);
     result.then(data => {
 
       //  console.log(json.stringfy());
         res.json(data);
     })
     .catch( error  => {
      logger.error('[144][mutation]err=' + error.message)
      res.sendStatus(500);
    });

}
