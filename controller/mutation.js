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
  const register_number   = req.body.registerNumber;
  const fusion			  = req.body.fusion;
  const gene              = req.body.gene;
  const functional_impact = req.body.functionalImpact;
  const transcript        = req.body.transcript;
  const exon_intro        = req.body.exonIntro;
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = nvl(req.body.zygosity, "");
  const vaf               = nvl(req.body.vafPercent, "");
  const reference         = nvl(req.body.references, "");
  const cosmic_id         = nvl(req.body.cosmicID, "");
  const buccal            = nvl(req.body.buccal, "");
  const buccal2           = nvl(req.body.buccal2, "");
  const exac           = nvl(req.body.exac, "");
  const exac_east_asia           = nvl(req.body.exac_east_asia, "");
  const krgdb           = nvl(req.body.krgdb, "");
  const etc1           = nvl(req.body.etc1, "");
  const etc2           = nvl(req.body.etc2, "");
  const etc3           = nvl(req.body.etc3, "");
  let type =  nvl(req.body.type, "AMLALL");

  logger.info('[47][mutation]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene + ' fusion=' +  fusion);   
  logger.info('[47][mutation]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[47][mutation]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[47][mutation]zygosity=' + zygosity  + ' vaf=' + vaf  + ' reference=' +  reference + ' cosmic_id= ' + cosmic_id);
  logger.info('[47][mutation]buccal=' + buccal  + ' buccal2=' + buccal2);
  logger.info('[47][mutation]exac=' + exac  + ' exac_east_asia=' + exac_east_asia + ' krgdb=' + krgdb);
  logger.info('[47][mutation]etc1=' + etc1  + ' etc2=' + etc2 + ' etc3=' + etc3 + ", type=" + type);

  let sql ="insert into mutation   ";
  sql = sql + " (igv, sanger,patient_name,register_number,  fusion,  ";
  sql = sql + " gene,functional_impact,transcript,  ";
  sql = sql + " exon_intro,nucleotide_change,  ";
  sql = sql + " amino_acid_change,zygosity,vaf,  ";
  sql = sql + " reference,cosmic_id, buccal, buccal2,   ";
  sql = sql + " exac, exac_east_asia, krgdb, etc1, etc2, etc3, type)   ";
  sql = sql + " values (@igv, @sanger, @patient_name, @register_number,  @fusion, ";
  sql = sql + " @gene, @functional_impact, @transcript,  ";
  sql = sql + " @exon_intro, @nucleotide_change,  ";
  sql = sql + " @amino_acid_change, @zygosity, @vaf,  ";
  sql = sql + " @reference,@cosmic_id,@buccal,@buccal2,   ";
  sql = sql + " @exac, @exac_east_asia, @krgdb, @etc1, @etc2, @etc3, @type)";

  logger.info('[64][mutation]sql=' + sql);

  try {
      const request = pool.request()
        .input('igv', mssql.NVarChar, igv) 
        .input('sanger', mssql.NVarChar, sanger) 
        .input('patient_name', mssql.NVarChar, patient_name) 
        .input('register_number', mssql.VarChar, register_number) 
        .input('fusion', mssql.VarChar, fusion) 
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
        .input('buccal2', mssql.VarChar, buccal2)
        .input('exac', mssql.VarChar, exac)
        .input('exac_east_asia', mssql.VarChar, exac_east_asia)
        .input('krgdb', mssql.VarChar, krgdb)
        .input('etc1', mssql.VarChar, etc1)
        .input('etc2', mssql.VarChar, etc2)
        .input('etc3', mssql.VarChar, etc3)
        .input('type', mssql.VarChar, type); 

      const result = await request.query(sql);
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
 
// update 
const  updateHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  logger.info("[62][mutation update]req data=" + JSON.stringify( req.body));

  const id				  = req.body.id;
  const buccal			  = nvl(req.body.buccal, "");
  const patient_name      = req.body.name;
  const register_number   = nvl(req.body.registerNumber, "");
  const fusion			  = req.body.fusion;
  const gene              = req.body.gene;
  const functional_impact = req.body.functionalImpact;
  const transcript        = req.body.transcript;
  const exon_intro        = req.body.exonIntro;
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = nvl(req.body.zygosity, "");  
  const vaf               = nvl(req.body.vafPercent, "");
  const reference         = nvl(req.body.references, "");
  const cosmic_id         = nvl(req.body.cosmicID, "");
  const	sift_polyphen_mutation_taster  = nvl(req.body.siftPolyphenMutationTaster, "");
  const buccal2			  = nvl(req.body.buccal2, "");
  const igv				  = nvl(req.body.igv, "");
  const sanger			  = nvl(req.body.sanger, "");
  const exac			  = nvl(req.body.exac, "");
  const exac_east_asia			  = nvl(req.body.exac_east_asia, "");
  const krgdb			  = nvl(req.body.krgdb, "");
  const etc1			  = nvl(req.body.etc1, "");
  const etc2			  = nvl(req.body.etc2, "");
  const etc3			  = nvl(req.body.etc3, "");
  let type =  nvl(req.body.type, "AMLALL");

  logger.info('[160][mutation update]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene + ' fusion=' +  fusion);   
  logger.info('[163][mutation update]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[163][mutation update]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[163][mutation update]zygosity=' + zygosity  + ' vaf=' + vaf  + 'reference=' +  reference + ' cosmic_id= ' + cosmic_id);
  logger.info('[163][mutation update]buccal=' + buccal  + ' buccal2=' + buccal2);
  logger.info('[163][mutation update]igv=' + igv  + ' sanger=' + sanger);
  logger.info('[163][mutation update]exac=' + exac  + ' exac_east_asia=' + exac_east_asia + ' krgdb=' + krgdb);
  logger.info('[163][mutation update]etc1=' + etc1  + ' etc2=' + etc2 + ' etc3=' + etc3 + ', type=' + type);

  let sql ="update mutation set  ";
  sql = sql + " buccal = @buccal, patient_name= @patient_name, register_number = @register_number,  ";
  sql = sql + " fusion = @fusion, gene = @gene, functional_impact = @functional_impact, transcript = @transcript,  ";
  sql = sql + " exon_intro = @exon_intro, nucleotide_change= @nucleotide_change,  ";
  sql = sql + " amino_acid_change = @amino_acid_change, zygosity= @zygosity, vaf= @vaf,  ";
  sql = sql + " reference = @reference, cosmic_id = @cosmic_id, sift_polyphen_mutation_taster = @sift_polyphen_mutation_taster, "
  sql = sql + " buccal2 = @buccal2, igv= @igv, sanger= @sanger,   ";
  sql = sql + " exac=@exac, exac_east_asia=@exac_east_asia, krgdb=@krgdb,   ";
  sql = sql + " etc1=@etc1, etc2=@etc2, etc3=@etc3, type=@type ";
  sql = sql + " where id = @id ";

  logger.info('[177][mutation update]sql=' + sql);

  try {
   const request = pool.request()
      .input('id', mssql.VarChar, id)  
      .input('buccal', mssql.VarChar, buccal) 
      .input('patient_name', mssql.NVarChar, patient_name) 
      .input('register_number', mssql.VarChar, register_number) 
      .input('fusion', mssql.VarChar, fusion) 
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
	    .input('sift_polyphen_mutation_taster', mssql.VarChar, sift_polyphen_mutation_taster) 
	    .input('buccal2', mssql.VarChar, buccal2) 
		  .input('igv', mssql.NVarChar, igv) 
      .input('sanger', mssql.NVarChar, sanger) 
      .input('exac', mssql.VarChar, exac)
      .input('exac_east_asia', mssql.VarChar, exac_east_asia)
      .input('krgdb', mssql.VarChar, krgdb)
      .input('etc1', mssql.VarChar, etc1)
      .input('etc2', mssql.VarChar, etc2)
      .input('etc3', mssql.VarChar, etc3)
      .input('type', mssql.VarChar, type) ; 

      const result = await request.query(sql);
     // console.dir( result);
      
      return result;
  } catch (error) {
    logger.error("[205][mutation update]err=" + error.message);
  }
}

exports.updateMutation = (req, res, next) => {
  logger.info('[258][mutation update]req' + JSON.stringify(req.body));

	const result = updateHandler(req);
    result.then(data => {
          res.json(data);
     })
     .catch( error => {
      logger.error("[265][mutation update]err=" + error.message); 
       res.sendStatus(500);
      });
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
  
     //const id = req.body.id;
        
     const result = messageHandler2(req);
     result.then(data => {
 
       //  console.log(json.stringfy());
         res.json(data);
     })
     .catch( error  => {
      logger.error('[144][mutation]err=' + error.message)
      res.sendStatus(500);
    });

}

// 유전자가 있는지 확인
const searchGeneHandler =  async (gene, type) => {
  await poolConnect;

  let type2 =  nvl(type, "AMLALL");

  const sql = "select  count(*) as count  from mutation where gene=@gene and type = @type";
  try {
       const request = pool.request()
          .input('gene', mssql.VarChar, gene)
          .input('type', mssql.VarChar, type2);
          const result = await request.query(sql);
          return result.recordset[0].count;
  } catch(err) {
    console.err('==[139][mutation controller] SQL error');
  }

}

exports.searchMutaionbygene = (req, res, next) => {
const gene = req.body.gene;
const type = req.body.type;
const result = searchGeneHandler(gene, type);
result.then(data => {
   res.json(data);
}).catch(err => res.sendStatus(500))

}

// list
const listHandler = async (req) => {
    await poolConnect;  
    const genes		= req.body.genes; 
    const coding	= req.body.coding; 
    const type    = nvl(req.body.type, "AMLALL");
    logger.info("[27][mutation list]genes=" + genes + ", coding=" + coding + ", type=" + type );
	
	let sql ="select id	"
				+"	,buccal "
				+"	,patient_name "
				+"	,register_number "
				+"	,fusion "
				+"	,gene "
				+"	,functional_impact "
				+"	,transcript "
				+"	,exon_intro "
				+"	,nucleotide_change "
				+"	,amino_acid_change "
				+"	,zygosity "
				+"	,vaf "
				+"	,reference "
				+"	,cosmic_id "
				+"	,sift_polyphen_mutation_taster "
				+"	,buccal2 "
        +" ,igv, sanger"
        +" ,isnull(exac, '') exac"
        +" ,isnull(exac_east_asia, '') exac_east_asia"
        +" ,isnull(krgdb, '') krgdb"
        +" ,isnull(etc1, '') etc1"
        +" ,isnull(etc2, '') etc2"
        +" ,isnull(etc3, '') etc3"
        +" ,isnull(type, 'AMLALL') type";
    sql = sql + " from mutation ";
		sql = sql + " where 1=1";

	if(genes != "") 
		sql = sql + " and gene like '%"+genes+"%'";

  if(coding != "") 
    sql = sql + " and nucleotide_change like '%"+coding+"%'";

  if(type != "") 
    sql = sql + " and type like '%"+type+"%'";

  sql = sql + " order by id";

    logger.info("[293][mutationMapper list]sql" + sql);
    try {
       const request = pool.request();
        // .input('gene', mssql.VarChar, genes); 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (err) {
      
      logger.error("[301][mutationMapper list]err=" + error.message);
   }
 }

// List Mutation
exports.listMutation = (req, res, next) => { 
  //   console.log('[200][listMutation]');
     const result = listHandler(req);
     result.then(data => { 
           res.json(data);
      })
      .catch( err  => res.sendStatus(500));
  };