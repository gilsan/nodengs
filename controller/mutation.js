const express = require('express');

const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
/*
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
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  const igv               = req.body.irg;
  const sanger            = req.body.sanger;  
  const patient_name      = req.body.name;
  const register_number   = req.body.patientID;
  const gene              = req.body.gene;
  const functional_impact = req.body.functionalImpact;
  const transcript        = req.body.transcript;
  const exon_intro        = req.body.exonIntro;
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = req.body.zygosity;
  const vaf               = req.body.vafPercent;
  const reference         = req.body.references;
  const cosmic_id         = req.body.cosmicID;

  logger.info('[47][mutation]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene);   
  logger.info('[47][mutation]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[47][mutation]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[47][mutation]zygosity=' + zygosity  + ' vaf=' + vaf  + 'reference=' +  reference + ' cosmic_id= ' + cosmic_id);

  let sql ="insert into mutation   ";
  sql = sql + " (igv, sanger,patient_name,register_number,  ";
  sql = sql + " gene,functional_impact,transcript,  ";
  sql = sql + " exon_intro,nucleotide_change,  ";
  sql = sql + " amino_acid_change,zygosity,vaf,  ";
  sql = sql + " reference,cosmic_id)   ";
  sql = sql + " values (@igv, @sanger, @patient_name, @register_number,  ";
  sql = sql + " @gene, @functional_impact, @transcript,  ";
  sql = sql + " @exon_intro, @nucleotide_change,  ";
  sql = sql + " @amino_acid_change, @zygosity, @vaf,  ";
  sql = sql + " @reference,@cosmic_id)";

  logger.info('[64][mutation]sql=' + sql);

  try {
      const request = pool.request()
        .input('igv', mssql.VarChar, igv) // or: new sql.Request(pool1)
        .input('sanger', mssql.VarChar, sanger) // or: new sql.Request(pool1)
        .input('patient_name', mssql.VarChar, patient_name) // or: new sql.Request(pool1)
        .input('register_number', mssql.VarChar, register_number) // or: new sql.Request(pool1)
        .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
        .input('functional_impact', mssql.VarChar, functional_impact) // or: new sql.Request(pool1)
        .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
        .input('exon_intro', mssql.VarChar, exon_intro) // or: new sql.Request(pool1)
        .input('nucleotide_change', mssql.VarChar, nucleotide_change) // or: new sql.Request(pool1)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change) // or: new sql.Request(pool1)
        .input('zygosity', mssql.VarChar, zygosity) // or: new sql.Request(pool1)
        .input('vaf', mssql.VarChar, vaf) // or: new sql.Request(pool1)
        .input('reference', mssql.VarChar, reference) // or: new sql.Request(pool1)
        .input('cosmic_id', mssql.VarChar, cosmic_id); // or: new sql.Request(pool1)
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
        .input('id', mssql.VarChar, id); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

exports.deleteMutation = (req, res, next) => {
  
     const id = req.body.id;
        
     const result = messageHandler2(id);
     result.then(data => {
 
       //  console.log(json.stringfy());
         res.json(data);
     })
     .catch( err  => res.sendStatus(500));

}
