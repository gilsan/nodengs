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
    const type    = nvl(req.body.type, "");
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


/////////////////////////////////////////////////////////////////////////////////////////////////////
// sequencing list
const seqlistindHandler = async (req) => {
  await poolConnect;

  sql=`select isnull(functional_impact, '') type, isnull(exon_intro, '') exonintron,
   isnull(nucleotide_change, '') nucleotideChange, isnull(amino_acid_change, '') aminoAcidChange,
   isnull(zygosity, '') zygosity, isnull(rsid, '') rsid, isnull(genbank_accesion, '') genbankaccesion,
   from mutation  where type='SEQ'`;
  logger.info('[383][mutation][seqlistindHandler] =' + sql);

  try {
      const request = pool.request();
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[390][mutation][seqlistindHandler] err=' + error.message);
  } 
}

exports.seqlistMutation =  (req, res, next) => {
  const result = seqlistindHandler(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[401][mutation][seqlistMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// neucleotide change 로 찿기
const seqcallHandler = async (req) => {
  await poolConnect;
  const nucleotideChange = req.body.coding;
  const gene             = req.body.gene;
  sql=`select top 1 isnull(functional_impact, '') type, isnull(exon_intro, '') exonintron,
   isnull(nucleotide_change, '') nucleotideChange, isnull(amino_acid_change, '') aminoAcidChange,
   isnull(zygosity, '') zygosity, isnull(rsid, '') rsid, isnull(genbank_accesion, '') genbankaccesion
   from mutation  where type='SEQ' and  nucleotide_change=@nucleotideChange and gene=@gene  order by id desc`;
  logger.info('[415][mutation][seqcallHandler] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene)
           .input('nucleotideChange', mssql.VarChar, nucleotideChange);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[424][mutation][seqcallHandler] err=' + error.message);
  } 
}

// sequencing call
exports.seqcallMutation =  (req, res, next) => {
  logger.info('[430][mutation][seqcallMutation] req=' + JSON.stringify(req.body)); 
  const result = seqcallHandler(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[436][mutation][seqcallMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// // sequencing insert
const seqsaveHandler = async (req) => {
  await poolConnect;
  const gene              = req.body.gene;
  const functional_impact = req.body.type;
  const patient_name      = req.body.name;
  const register_number   = nvl(req.body.patientID,'');
  const exon_intro        = nvl(req.body.exonintron,'');
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = nvl(req.body.zygosity,'');
  const rsid              = nvl(req.body.rsid,'');
  const genbank_accesion  = nvl(req.body.genbankaccesion,'');
  logger.info('[455][mutation][seqsaveHandler]register_number =' + register_number );  

  sql=`insert into mutation (gene, functional_impact,patient_name,register_number,exon_intro,
    nucleotide_change,amino_acid_change,zygosity,rsid,genbank_accesion, type)
    values(@gene, @functional_impact,@patient_name,@register_number,@exon_intro,
      @nucleotide_change,@amino_acid_change,@zygosity,@rsid,@genbank_accesion, 'SEQ')`;
 
  logger.info('[459][mutation][seqsaveHandler ] =' + sql);

  try {
      const request = pool.request()
           .input('gene',mssql.VarChar, gene)
           .input('functional_impact', mssql.VarChar,functional_impact)
           .input('patient_name', mssql.NVarChar,patient_name)
           .input('register_number', mssql.VarChar,register_number )
           .input('exon_intro', mssql.VarChar,exon_intro)
           .input('nucleotide_change', mssql.VarChar,nucleotide_change)
           .input('amino_acid_change', mssql.VarChar,amino_acid_change)
           .input('zygosity', mssql.VarChar,zygosity)
           .input('rsid', mssql.VarChar,rsid)
           .input('genbank_accesion', mssql.VarChar, genbank_accesion);
      const result = await request.query(sql);
      return result; 
  }catch (error) {
      logger.error('[476][mutation][seqsaveHandler ] err=' + error.message);
  } 
}


exports.saveseqMutation =  (req, res, next) => {
  logger.info('[482][mutation][seqcallMutation] req=' + JSON.stringify(req.body)); 
  const result = seqsaveHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[488][mutation][saveseqMutation err=' + error.message);
      res.sendStatus(500);
  });
}

// sequencing upldate


// sequencing delete


////////////////////////////////////////////////
// 유전성유전질환
// genetic list
const geneticlistindHandler = async (req) => {
  await poolConnect;

  sql=`select isnull(gene, '') gene, isnull(functional_impact, '') functionalImpact, isnull(transcript, '') transcript,
   isnull(exon_intro, '') exonIntro,
   isnull(nucleotide_change, '') nucleotideChange, isnull(amino_acid_change, '') aminoAcidChange,
   isnull(zygosity, '') zygosity, isnull(dbsnp_hgmd, '') dbSNPHGMD, isnull(gnomad_eas, '') gnomADEAS,
   isnull(omim, '') OMIM
   from mutation  where type='Genetic'`;
  logger.info('[508][mutation][geneticlistindHandler] =' + sql);

  try {
      const request = pool.request();
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[518][mutation][geneticlistindHandler] err=' + error.message);
  } 
}

exports.geneticlistMutation =  (req, res, next) => {
  const result = geneticlistindHandler(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[528][mutation][geneticlistMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// gene , nucleotide 로 호출
// genetic call
const geneticcallHandler2 = async (req) => {
  await poolConnect;
  const nucleotideChange = req.body.nucleotideChange;
  const gene             = req.body.gene;

  sql=`select top 1 isnull(gene, '') gene, isnull(functional_impact, '') functionalImpact, isnull(transcript, '') transcript,
   isnull(exon_intro, '') exonIntro,
   isnull(nucleotide_change, '') nucleotideChange, isnull(amino_acid_change, '') aminoAcidChange,
   isnull(zygosity, '') zygosity, isnull(dbsnp_hgmd, '') dbSNPHGMD, isnull(gnomad_eas, '') gnomADEAS,
   from mutation  where type='Genetic' and gene=@gene and nucleotide_change=@nucleotideChange order by id`;
  logger.info('[545][mutation][geneticcallHandler2] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene)
           .input('nucleotideChange', mssql.VarChar, nucleotideChange);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[554][mutation][geneticcallHandler2] err=' + error.message);
  } 
}

exports.geneticcallMutation2 =  (req, res, next) => {
  logger.info('[559][mutation][geneticcallMutation2] req=' + JSON.stringify(req.body)); 
  const result = geneticcallHandler2(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[565][mutation][geneticcallMutation2] err=' + error.message);
      res.sendStatus(500);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////
const geneticcallHandler1 = async (req) => {
  await poolConnect;
  const gene             = req.body.gene;

  sql=`select top 1 isnull(omim, '') OMIM  from mutation  where type='Genetic' and gene=@gene order by id desc`;
  logger.info('[575][mutation][geneticcallHandler1] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[583][mutation][geneticcallHandler1] err=' + error.message);
  } 
}

exports.geneticcallMutation1 =  (req, res, next) => {
  logger.info('[588][mutation][geneticcallMutation1] req=' + JSON.stringify(req.body)); 
  const result = geneticcallHandler1(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[594][mutation][geneticcallMutation1] err=' + error.message);
      res.sendStatus(500);
  });
}

///////////// genetic insert //////////
const geneticsaveHandler = async (req) => {
  await poolConnect;
  const gene              = req.body.gene;
  const functional_impact = req.body.functionalImpact;
  const patient_name      = req.body.name;
  const register_number   = req.body.patientID;
  const transcript        = req.body.transcript;
  const exon_intro        = req.body.exonIntro;
  const nucleotide_change = req.body.nucleotideChange;
  const amino_acid_change = req.body.aminoAcidChange;
  const zygosity          = req.body.zygosity;
  const dbsnp_hgmd        = req.body.dbSNPHGMD;
  const gnomad_eas        = req.body.gnomADEAS;
  const omim              = req.body.OMIM;
  const igv               = req.body.igv;
  const sanger            = req.body.sanger;

  sql=`insert into mutation (gene, functional_impact,patient_name,register_number,transcript,exon_intro,
    nucleotide_change,amino_acid_change,zygosity,dbsnp_hgmd,gnomad_eas, 
    omim, igv, sanger,type)
    values(@gene, @functional_impact,@patient_name,@register_number,@transcript,@exon_intro,
      @nucleotide_change,@amino_acid_change,@zygosity,@dbsnp_hgmd,@gnomad_eas,@omim, @igv, @sanger,'Genetic')`;
  logger.info('[622][mutation][sgeneticsaveHandler] =' + sql);

  try {
      const request = pool.request()
           .input('gene',mssql.VarChar, gene)
           .input('functional_impact', mssql.VarChar,functional_impact)
           .input('patient_name', mssql.NVarChar,patient_name)
           .input('register_number', mssql.VarChar,register_number )
           .input('exon_intro', mssql.VarChar,exon_intro)
           .input('transcript', mssql.VarChar,transcript)
           .input('nucleotide_change', mssql.VarChar,nucleotide_change)
           .input('amino_acid_change', mssql.VarChar,amino_acid_change)
           .input('zygosity', mssql.VarChar,zygosity)
           .input('dbsnp_hgmd', mssql.VarChar,dbsnp_hgmd)
           .input('gnomad_eas', mssql.VarChar, gnomad_eas)
           .input('omim', mssql.VarChar, omim)
           .input('igv', mssql.VarChar, igv)
           .input('sanger', mssql.VarChar, sanger);
           
      const result = await request.query(sql);
      return result; 
  }catch (error) {
      logger.error('[644][mutation][geneticsaveHandler] err=' + error.message);
  } 
}


exports.savegeneticMutation =  (req, res, next) => {
  logger.info('[650][mutation][savegeneticMutationn] req=' + JSON.stringify(req.body)); 
  const result = geneticsaveHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[656][mutation][savegeneticMutation] err=' + error.message);
      res.sendStatus(500);
  });
}







// genetic update


// genetic delete