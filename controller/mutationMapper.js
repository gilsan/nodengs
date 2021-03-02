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

// list
const listHandler = async (req) => {
  await poolConnect;  
  const genes			= req.body.genes; 
  const coding			= req.body.coding; 
  logger.info("[27][mutationMapper list]genes=" + genes + ", coding=" + coding );
	
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
				+"	,igv "
				+"	,sanger "
        +" ,isnull(exac, '') exac"
        +" ,isnull(exac_east_asia, '') exac_east_asia"
        +" ,isnull(krgdb, '') krgdb"
        +" ,isnull(etc1, '') etc1"
        +" ,isnull(etc2, '') etc2"
        +" ,isnull(etc3, '') etc3";
  sql = sql + " from mutation ";
  sql = sql + " where 1 = 1";
	if(genes != "") 
		sql = sql + " and gene like '%"+genes+"%'";
  if(coding != "") 
		sql = sql + " and nucleotide_change like '%"+coding+"%'";
  sql = sql + " order by id";
  
  logger.info("[54][mutationMapper list]sql" + sql);

    try {
       const request = pool.request()
         .input('genes', mssql.VarChar, genes); 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (error) {
    logger.error("[62][mutationMapper list]err=" + error.message);
   }
}

// insert 
const  insertHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
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
  const vaf               = nvl(req.body.vaf, "");
  const reference         = nvl(req.body.reference, "");
  const cosmic_id         = nvl(req.body.cosmicId, "");
  const	sift_polyphen_mutation_taster  = req.body.siftPolyphenMutationTaster;
  const buccal2			  = nvl(req.body.buccal2, "");
  const igv				  = nvl(req.body.igv, "");
  const sanger			  = nvl(req.body.sanger, "");
  const exac			  = nvl(req.body.exac, "");
  const exac_east_asia			  = nvl(req.body.exac_east_asia, "");
  const krgdb			  = nvl(req.body.krgdb, "");
  const etc1			  = nvl(req.body.etc1, "");
  const etc2			  = nvl(req.body.etc2, "");
  const etc3			  = nvl(req.body.etc3, "");

  logger.info('[90][mutationmapper insert]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene);   
  logger.info('[90][mutationmapper insert]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[90][mutationmapper insert]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[90][mutationmapper insert]zygosity=' + zygosity  + ' vaf=' + vaf  + 'reference=' +  reference + ' cosmic_id= ' + cosmic_id);
  logger.info('[90][mutationmapper insert]buccal=' + buccal  + ' buccal2=' + buccal2);
  logger.info('[90][mutationmapper insert]exac=' + exac  + ' exac_east_asia=' + exac_east_asia + ' krgdb=' + krgdb);
  logger.info('[90][mutationmapper insert]etc1=' + etc1  + ' etc2=' + etc2 + ' etc3=' + etc3);

  let sql ="insert into mutation   ";
  sql = sql + " (buccal,patient_name,register_number,  ";
  sql = sql + " fusion,gene,functional_impact,transcript,  ";
  sql = sql + " exon_intro,nucleotide_change,  ";
  sql = sql + " amino_acid_change,zygosity,vaf,  ";
  sql = sql + " reference,cosmic_id,sift_polyphen_mutation_taster,buccal2,igv,sanger,   ";
  sql = sql + " exac, exac_east_asia, krgdb, etc1, etc2, etc3)   ";
  sql = sql + " values ( ";   
  sql = sql + " @buccal, @patient_name, @register_number, @fusion, ";
  sql = sql + " @gene, @functional_impact, @transcript,  ";
  sql = sql + " @exon_intro, @nucleotide_change,  ";
  sql = sql + " @amino_acid_change, @zygosity, @vaf,  ";
  sql = sql + " @reference,@cosmic_id,@sift_polyphen_mutation_taster,@buccal2,@igv,@sanger,   ";
  sql = sql + " @exac, @exac_east_asia, @krgdb, @etc1, @etc2, @etc3)";

  logger.info('[112][mutationmapper insert]sql=' + sql);

  try {
      const request = pool.request()
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
		    .input('igv', mssql.VarChar, igv) 
        .input('sanger', mssql.VarChar, sanger)
        .input('exac', mssql.VarChar, exac)
        .input('exac_east_asia', mssql.VarChar, exac_east_asia)
        .input('krgdb', mssql.VarChar, krgdb)
        .input('etc1', mssql.VarChar, etc1)
        .input('etc2', mssql.VarChar, etc2)
        .input('etc3', mssql.VarChar, etc3) ; 

      const result = await request.query(sql)
     // console.dir( result);
      
      return result;
  } catch (error) {
    logger.error("[133][mutationMapper insert]err=" + error.message);
  }
}
 
// update 
const  updateHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  logger.info("[62][mutationMapper update]req data=" + JSON.stringify( req.body));

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
  const vaf               = nvl(req.body.vaf, "");
  const reference         = nvl(req.body.reference, "");
  const cosmic_id         = nvl(req.body.cosmicId, "");
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

  logger.info('[160][mutationmapper update]patient_name=' + patient_name + ' register_number=' + register_number + ' gene=' +  gene);   
  logger.info('[163][mutationmapper update]functional_impact=' + functional_impact + ' transcript=' + transcript + ' exon_intro=' + exon_intro);
  logger.info('[163][mutationmapper update]nucleotide_change=' + nucleotide_change + ' amino_acid_change=' +  amino_acid_change) ;
  logger.info('[163][mutationmapper update]zygosity=' + zygosity  + ' vaf=' + vaf  + 'reference=' +  reference + ' cosmic_id= ' + cosmic_id);
  logger.info('[163][mutationmapper update]buccal=' + buccal  + ' buccal2=' + buccal2);
  logger.info('[163][mutationmapper update]exac=' + exac  + ' exac_east_asia=' + exac_east_asia + ' krgdb=' + krgdb);
  logger.info('[163][mutationmapper update]etc1=' + etc1  + ' etc2=' + etc2 + ' etc3=' + etc3);

  let sql ="update mutation set  ";
  sql = sql + " buccal = @buccal, patient_name= @patient_name, register_number = @register_number,  ";
  sql = sql + " fusion = @fusion, gene = @gene, functional_impact = @functional_impact, transcript = @transcript,  ";
  sql = sql + " exon_intro = @exon_intro, nucleotide_change= @nucleotide_change,  ";
  sql = sql + " amino_acid_change = @amino_acid_change, zygosity= @zygosity, vaf= @vaf,  ";
  sql = sql + " reference = @reference, cosmic_id = @cosmic_id, sift_polyphen_mutation_taster = @sift_polyphen_mutation_taster, "
  sql = sql + " buccal2 = @buccal2, igv= @igv, sanger= @sanger,   ";
  sql = sql + " exac=@exac, exac_east_asia=@exac_east_asia, krgdb=@krgdb,   ";
  sql = sql + " etc1=@etc1, etc2=@etc2, etc3=@etc3 ";
  sql = sql + " where id = @id ";

  logger.info('[213][mutationmapper update]sql=' + sql);

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
		  .input('igv', mssql.VarChar, igv) 
      .input('sanger', mssql.VarChar, sanger)
      .input('exac', mssql.VarChar, exac)
      .input('exac_east_asia', mssql.VarChar, exac_east_asia)
      .input('krgdb', mssql.VarChar, krgdb)
      .input('etc1', mssql.VarChar, etc1)
      .input('etc2', mssql.VarChar, etc2)
      .input('etc3', mssql.VarChar, etc3) ; 

      const result = await request.query(sql)
     // console.dir( result);
      
      return result;
  } catch (error) {
    logger.error("[205][mutationMapper update]err=" + error.message);
  }
}

// Delete
const deleteHandler = async (req) => { 
  const id        = req.body.id; 
  
  logger.info("[213][mutationMapper del]id-" + id)
 
    let sql = "delete mutation  " ; 
    sql = sql + "where id = @id"; 
    logger.info("[215][mutationMapper del]sql=" + sql);

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
      logger.error("[205][mutationMapper del]err=" + error.message);
    }
}

// List Mutation
 exports.listMutation = (req, res, next) => { 
    logger.info("[232][mutationMapper list]req" + JSON.stringify(req.body));
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
      logger.error("[238][mutationMapper list]err=" + error.message);
       res.sendStatus(500);
    });
 };

// Mutation Insert
 exports.insertMutation = (req,res,next) => {
    logger.info('[245][mutationmapper insert]req' + JSON.stringify(req.body));
    const result = insertHandler(req);
    result.then(data => { 
      res.json(data);
    })
    .catch( error => {
      logger.error("[251][mutationMapper insert}err=" + error.message);
      res.sendStatus(500);
    });
 };

// Mutation Update
 exports.updateMutation = (req,res,next) => {
    logger.info('[258][mutationmapper update]req' + JSON.stringify(req.body));

	const result = updateHandler(req);
    result.then(data => {
          res.json(data);
     })
     .catch( error => {
      logger.error("[265][mutationMapper update]err=" + error.message); 
       res.sendStatus(500);
      });
	
 };
  
exports.deleteMutation = (req, res, next) => {
    
  logger.info("[273][mutationMapper del]req=" + JSON.stringify(req.body)); 
    const result = deleteHandler(req);
    result.then(data => {
 
       //  console.log(json.stringfy());
         res.json(data);
    })
    .catch( error => {
      logger.error("[281][mutationMapper del]err=" + error.message); 
       res.sendStatus(500);
    });

}

// 유전자가 있는지 확인
const searchGeneHandler =  async (gene) => {
  await poolConnect;

  logger.info("[290][mutationMapper search]gene=" + gene);
  const sql = "select  count(*) as count  from mutation where gene=@gene";
  logger.info("[293][mutationMapper search]sql=" + sql);
  try {
       const request = pool.request()
          .input('gene', mssql.VarChar, gene);
          const result = await request.query(sql);
          return result.recordset[0].count;
  } catch(error) {
    logger.info("[300][mutationMapper search]err=" + error.message);
  }

}

exports.searchMutaionbygene = (req, res, next) => {
  logger.info("[305][mutationMapper search]req=" + JSON.stringify(req.body)); 
  const gene = req.body.gene;
  const result = searchGeneHandler(gene);
  result.then(data => {
    res.json(data);
  })
  .catch(error => {
    logger.info("[205][mutationMapper search]err=" + error.message); 
    res.sendStatus(500)
  })

}

