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

// AMLALL, LYM, MDS/MPN는  report_detected_variants 테이블에서 찿음
const  variantsHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const gubun = nvl(req.body.gubun, 'AMLALL');
  
  logger.info('[742][geneinfo]select data=' + gene + ", " + nucleotide_change + ", " + gubun); 
 
  let sql =`select top 1 functional_impact , reference, cosmic_id, type
                from report_detected_variants 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change 
                and gubun=@gubun
                and sendyn= '3'
                and reference != ''
                and cosmic_id != ''
                 order by id desc`
               
  logger.info('[749][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('gubun', mssql.VarChar, gubun); 
      const result = await request.query(sql);
      return result.recordset;
  } catch (error) {
    logger.error('[759][geneinfo]list err=' + error.message);
  }
}

exports.getVariantsLists = (req,res, next) => {
  logger.info('[764][geneinfo]getCommentInsert req=' + JSON.stringify(req.body));
   
  const result = variantsHandler(req);
  result.then(data => {
    res.json(data);
  })
  .catch( error => {
    logger.error('[771][geneinfo][getVariantsLists] err=' +error.message);
    res.sendStatus(500);
  });
}

// 유전성 유전질환은  mutation 테이블에서 찿음
const  variantsGeneticHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const gubun = nvl(req.body.gubun, 'AMLALL');
  
  logger.info('[361][geneinfo][variantsListsGeneticHandler]select data=' + gene + ", " + nucleotide_change + ", " + gubun); 
 
  let sql =`select top 1 isnull(functional_impact, '') functionalImpact, amino_acid_change, transcript, 
                           isnull(exon_intro, '') exon, 
                           isnull(dbsnp_hgmd, '') dbSNPHGMD , isnull(gnomad_eas, '') gnomADEAS,  
                           isnull(reference, '') reference, isnull(cosmic_id, '') cosmic_id, type
                from mutation 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change 
                and type=@gubun
                and dbsnp_hgmd != ''
                and gnomad_eas != ''
                 order by id desc`
               
  logger.info('[373][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('gubun', mssql.VarChar, gubun); 
      const result = await request.query(sql);
      return result.recordset;
  } catch (error) {
    logger.error('[383][variantsListsGeneticHandler]list err=' + error.message);
  }
}

exports.getVariantsListsGenetic = (req,res, next) => {
  logger.info('[388][geneinfo]getVariantsListsGenetic req=' + JSON.stringify(req.body));
   
  const result = variantsGeneticHandler(req);
  result.then(data => {
    res.json(data);
  })
  .catch( error => {
    logger.error('[395][geneinfo][getVariantsListsGenetic] err=' +error.message);
    res.sendStatus(500);
  });
}

// 유전성 유전질환은  mutation 테이블에서 찿음
const  variantsGeneticOMIMHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const type = nvl(req.body.type, 'AMLALL');
  
  logger.info('[361][geneinfo][variantsListsGeneticOMIMHandler]select data=' + gene + ", " + type); 
 
  let sql =`select top 1 isnull(OMIM, '') OMIM
                from mutation 
                where gene=@gene 
                and type=@type
                and dbsnp_hgmd != ''
                and gnomad_eas != ''
                 order by id desc`
               
  logger.info('[373][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql);
      return result.recordset;
  } catch (error) {
    logger.error('[383][variantsListsGeneticOMIMHandler]list err=' + error.message);
  }
}

exports.getVariantsListsOMIM = (req,res, next) => {
  logger.info('[388][geneinfo]getVariantsListsOMIM req=' + JSON.stringify(req.body));
   
  const result = variantsGeneticOMIMHandler(req);
  result.then(data => {
    res.json(data);
  })
  .catch( error => {
    logger.error('[395][geneinfo][getVariantsListsOMIM] err=' +error.message);
    res.sendStatus(500);
  });
}

// list
const listHandler = async (req) => {
    await poolConnect;  
    const genes		= req.body.genes; 
    const coding	= req.body.coding; 
    const type    = nvl(req.body.type, "");
    logger.info("[27][mutation list]genes=" + genes + ", coding=" + coding + ", type=" + type );
	
	let sql =`select id	
					,buccal 
					,patient_name 
					,register_number 
					,fusion 
					,gene 
					,functional_impact 
					,transcript 
					,exon_intro 
					,nucleotide_change 
					,amino_acid_change 
					,zygosity 
					,vaf 
					,reference 
					,cosmic_id 
					,sift_polyphen_mutation_taster 
					,buccal2 
         ,igv, sanger
         ,isnull(exac, '') exac
         ,isnull(exac_east_asia, '') exac_east_asia
         ,isnull(krgdb, '') krgdb
         ,isnull(etc1, '') etc1
         ,isnull(etc2, '') etc2
         ,isnull(etc3, '') etc3
         ,isnull(type, 'AMLALL') type
         ,isnull(rsid, '') rsid
         ,isnull(genbank_accesion, '') genbank_accesion
         ,isnull(dbsnp_hgmd, '') dbsnp_hgmd
         ,isnull(gnomad_eas, '') gnomad_eas
         ,isnull(omim, '') omim
         from mutation 
		     where 1=1`;

	if(genes != "") 
		sql = sql + " and gene like '%"+genes+"%'";

  if(coding != "") 
    sql = sql + " and nucleotide_change like '%"+coding+"%'";

  if(type != "") 
    sql = sql + " and type like '%"+type+"%'";

  sql = sql + " order by id desc";

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
   from mutation  where type='SEQ' order by id desc`;
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

//// neucleotide change 로 찿기
const seqcallHandler = async (req) => {
  await poolConnect;
  const nucleotideChange = req.body.coding;
  const gene             = req.body.gene;
  sql=`select top 1 isnull(type, '') type, isnull(exon_intro, '') exonintron,
     isnull(amino_acid_change, '') aminoAcidChange,
     isnull(cosmic_id, '') rsid, isnull(genbank_accesion, '') genbankaccesion
   from mutation  
   where gubun='SEQ' and nucleotide_change=@nucleotideChange and gene=@gene order by id desc`;
  logger.info('[460][mutation][seqcallHandler] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene)
           .input('nucleotideChange', mssql.VarChar, nucleotideChange);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[478][mutation][seqcallHandler] err=' + error.message);
  } 
}

// sequencing call
exports.seqcallMutation =  (req, res, next) => {
  logger.info('[484][mutation][seqcallMutation] req=' + JSON.stringify(req.body)); 
  const result = seqcallHandler(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[490][mutation][seqcallMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// sequencing insert
const seqsaveHandler = async (req) => {
  await poolConnect;
  const seq               = req.body;
  const gene              = seq.gene;
  const functional_impact = seq.functional_impact;
  const patient_name      = seq.name;
  const register_number   = nvl(seq.patientID,'');
  const exon_intro        = nvl(seq.exonintron,'');
  const nucleotide_change = seq.nucleotideChange;
  const amino_acid_change = seq.aminoAcidChange;
  const zygosity          = nvl(seq.zygosity,'');
  const rsid              = nvl(seq.rsid,'');
  const genbank_accesion  = nvl(seq.genbankaccesion,'');
  logger.info('[509][mutation][seqsaveHandler]register_number =' + register_number );  

  sql=`insert into mutation (gene, functional_impact,patient_name,register_number,exon_intro,
    nucleotide_change,amino_acid_change,zygosity,rsid,genbank_accesion, type)
    values(@gene, @functional_impact,@patient_name,@register_number,@exon_intro,
      @nucleotide_change,@amino_acid_change,@zygosity,@rsid,@genbank_accesion, 'SEQ')`;
 
  logger.info('[516][mutation][seqsaveHandler ] =' + sql);

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
      logger.error('[634][mutation][seqsaveHandler ] err=' + error.message);
  } 
}

exports.saveseqMutation =  (req, res, next) => {
  logger.info('[539][mutation][saveseqMutation] req=' + JSON.stringify(req.body)); 
  const result = seqsaveHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[545][mutation][saveseqMutation err=' + error.message);
      res.sendStatus(500);
  });
}

// sequencing update
const seqUpdateHandler = async (req) => {
  await poolConnect;
  const seq               = req.body.seq;
  const id                = seq.id;
  const gene              = seq.gene;
  const functional_impact = seq.functional_impact;
  const patient_name      = seq.name;
  const register_number   = nvl(seq.patientID,'');
  const exon_intro        = nvl(seq.exonintron,'');
  const nucleotide_change = seq.nucleotideChange;
  const amino_acid_change = seq.aminoAcidChange;
  const zygosity          = nvl(seq.zygosity,'');
  const rsid              = nvl(seq.rsid,'');
  const genbank_accesion  = nvl(seq.genbankaccesion,'');
  logger.info('[568][mutation][seqUpdateHandler]register_number =' + register_number );  

  sql=`update mutation
        set functional_impact = @functional_impact
          , patient_name = @patient_name
          , register_number = @register_number
          , exon_intro = @exon_intro
          , amino_acid_change = @amino_acid_change
          , rsid = @rsid
          , genbank_accesion = @genbank_accesion
          , zygosity = @zygosity
        where  id=@id`;
 
  logger.info('[581][mutation][seqUpdateHandler] =' + sql + ',' + id);

  try {
      const request = pool.request()
           .input('id', mssql.Int, id)
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
      logger.error('[600][mutation][seqUpdateHandler] err=' + error.message);
  } 
}

exports.updateseqMutation =  (req, res, next) => {
  logger.info('[605][mutation][updateseqMutation] req=' + JSON.stringify(req.body)); 
  const result = seqUpdateHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[611][mutation][updateseqMutation err=' + error.message);
      res.sendStatus(500);
  });
}

// sequencing delete
const seqDeleteHandler = async (req) => {
  await poolConnect;
  const id              = req.body.id;
  

  sql=`delete from mutation
        where id = @id`;
 
  logger.info('[625][mutation][seqDeleteHandler] =' + sql);

  try {
      const request = pool.request()
           .input('id',mssql.VarChar, id);
           
      const result = await request.query(sql);
      return result; 
  }catch (error) {
      logger.error('[634][mutation][seqDeleteHandler ] err=' + error.message);
  } 
}

exports.deleteseqMutation =  (req, res, next) => {
  logger.info('[482][mutation][deleteseqMutation] req=' + JSON.stringify(req.body)); 
  const result = seqDeleteHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[488][mutation][deleteseqMutation err=' + error.message);
      res.sendStatus(500);
  });
}


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
   from mutation  where type='Genetic' order by id desc`;
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
  const coding = req.body.coding;
  const gene             = req.body.gene;

  sql=`select top 1  isnull(functional_impact, '') functionalImpact, 
            isnull(transcript, '') transcript, isnull(exon, '') exon, isnull(amino_acid_change, '') amino_acid_change,
  isnull(dbSNPHGMD, '') dbSNPHGMD, isnull(gnomADEAS, '') gnomADEAS
   from report_detected_variants  where (gubun='Genetic' or gubun='genetic' ) and gene=@gene and nucleotide_change=@coding and  sendyn='3' order by id desc`;
  logger.info('[549][mutation][geneticcallHandler2] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene)
           .input('coding', mssql.VarChar, coding);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[701][mutation][geneticcallHandler2] err=' + error.message);
  } 
}

exports.geneticcallMutation2 =  (req, res, next) => {
  logger.info('[706][mutation][geneticcallMutation2] req=' + JSON.stringify(req.body)); 
  const result = geneticcallHandler2(req);
  result.then(data => {  
      console.log('[708]', data);
      res.json(data);
  })
  .catch( error => {
      logger.error('[713][mutation][geneticcallMutation2] err=' + error.message);
      res.sendStatus(500);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////
const geneticcallHandler1 = async (req) => {
  await poolConnect;
  const gene             = req.body.gene;

  sql=`select top 1 isnull(OMIM, '') OMIM  from report_detected_variants  where (gubun='Genetic' or  gubun='genentic') and gene=@gene and sendyn='3' order by id desc`;
  logger.info('[723][mutation][geneticcallHandler1] =' + sql);

  try {
      const request = pool.request()
           .input('gene', mssql.VarChar, gene);
      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[731][mutation][geneticcallHandler1] err=' + error.message);
  } 
}

exports.geneticcallMutation1 =  (req, res, next) => {
  logger.info('[736][mutation][geneticcallMutation1] req=' + JSON.stringify(req.body)); 
  const result = geneticcallHandler1(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[742][mutation][geneticcallMutation1] err=' + error.message);
      res.sendStatus(500);
  });
}

///////////// genetic insert //////////
const geneticsaveHandler = async (req) => {
  await poolConnect;
  const genetic           = req.body;
  const gene              = genetic.gene;
  const functional_impact = genetic.functional_impact;
  const patient_name      = genetic.name;
  const register_number   = genetic.patientID;
  const transcript        = genetic.transcript;
  const exon_intro        = genetic.exon;
  const nucleotide_change = genetic.nucleotideChange;
  const amino_acid_change = genetic.aminoAcidChange;
  const zygosity          = genetic.zygosity;
  const dbsnp_hgmd        = genetic.dbSNPHGMD;
  const gnomad_eas        = genetic.gnomADEAS;
  const omim              = genetic.OMIM;
  const igv               = genetic.igv;
  const sanger            = genetic.sanger;
  
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
      logger.error('[797][mutation][geneticsaveHandler] err=' + error.message);
  } 
}

exports.savegeneticMutation =  (req, res, next) => {
  logger.info('[802][mutation][savegeneticMutationn] req=' + JSON.stringify(req.body)); 
  const result = geneticsaveHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[808][mutation][savegeneticMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// genetic update
const updateGeneticHandler = async (req) => {
  await poolConnect;
  const genetic           = req.body.genetic;
  const id                = genetic.id;
  const gene              = genetic.gene;
  const functional_impact = genetic.functional_impact;
  const patient_name      = genetic.name;
  const register_number   = genetic.patientID;
  const transcript        = genetic.transcript;
  const exon_intro        = genetic.exon;
  const nucleotide_change = genetic.nucleotideChange;
  const amino_acid_change = genetic.aminoAcidChange;
  const zygosity          = genetic.zygosity;
  const dbsnp_hgmd        = genetic.dbSNPHGMD;
  const gnomad_eas        = genetic.gnomADEAS;
  const omim              = genetic.OMIM;
  const igv               = genetic.igv;
  const sanger            = genetic.sanger;
  logger.info('[832][mutation][updateGeneticHandler] =' + id + ',' + gene );
  sql=`update mutation
      set functional_impact = @functional_impact
      , patient_name = @patient_name
      , register_number = @register_number
      , transcript = @transcript
      , exon_intro = @exon_intro
      , amino_acid_change = @amino_acid_change
      , zygosity = @zygosity
      , dbsnp_hgmd = @dbsnp_hgmd
      , gnomad_eas = @gnomad_eas
      , omim = @omim
      , igv = @igv
      , sanger = @sanger
      where id = @id`;

  logger.info('[848][mutation][updateGeneticHandler] =' + sql);

  try {
      const request = pool.request()
           .input('id',mssql.Int, id)
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
      logger.error('[871][mutation][updateGeneticHandler] err=' + error.message);
  } 
}

exports.updategeneticMutation =  (req, res, next) => {
  logger.info('[876][mutation][updategeneticMutation] req=' + JSON.stringify(req.body)); 
  const result = updateGeneticHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[882][mutation][updategeneticMutation] err=' + error.message);
      res.sendStatus(500);
  });
}

// genetic delete
const deleteGeneticHandler = async (req) => {
  await poolConnect;
  const gene              = req.body.gene;
  const nucleotide_change = req.body.nucleotideChange;  

  sql=`delete from mutation
        where gene = @gene
        and   nucleotide_change = @nucleotide_change
        and   type = 'SEQ'`;
 
  logger.info('[459][mutation][deleteGeneticHandler] =' + sql);

  try {
      const request = pool.request()
           .input('gene',mssql.VarChar, gene)
           .input('nucleotide_change', mssql.VarChar,nucleotide_change);

      const result = await request.query(sql);
      return result; 
  }catch (error) {
      logger.error('[476][mutation][deleteGeneticHandler] err=' + error.message);
  } 
}


const deleteGeneticHandler2 = async (req) => {
  await poolConnect;
  const id              = req.body.id;

  sql=`delete from mutation where  id = @id`;
 
  logger.info('[919][mutation][deleteGeneticHandler2] =' + sql + '  ' + id);

  try {
      const request = pool.request()
           .input('id',mssql.Int,id);

      const result = await request.query(sql);
      return result; 
  }catch (error) {
      logger.error('[928][mutation][deleteGeneticHandler2] err=' + error.message);
  } 
}

exports.deletegeneticMutation =  (req, res, next) => {
  logger.info('[933][mutation][deletegeneticMutation] req=' + JSON.stringify(req.body)); 
  const result = deleteGeneticHandler2(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[939][mutation][deletegeneticMutation err=' + error.message);
      res.sendStatus(500);
  });
}

////////////// Essential DNA ment

//////////////////// essential amplification 입력
const  insertEssentialHandler = async (req) => {
  await poolConnect;

  const title          = req.body.title;
  const mutation       = req.body.mutation;
  const amplification  = req.body.amplification;
  const fusion         = req.body.fusion;

  const sql = `insert into essentialDNAMent (title,  mutation, amplification, fusion) values(@title, @mutation, @amplification, @fusion)`;
  logger.info('[686][mutation][insertEssentialHandler] =' + sql);
 
    try {
      const request = pool.request()
      .input('mutation', mssql.VarChar, mutation)
      .input('title', mssql.VarChar, title)
      .input('fusion',mssql.VarChar, fusion)
      .input('amplification', mssql.VarChar, amplification);
      const result = await request.query(sql);
      return result; 
    } catch (error) {
        logger.error('[696][mutation]insertEssentialHandler] err=' + error.message);
    } 
}


exports.insertEssential = (req,res, next) => {
  logger.info('[702][mutation insert]data=' + JSON.stringify(req.body));
  const result = insertEssentialHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[708][mutation][insertEssential] err=' + error.message);
      res.sendStatus(500);
  });
}

///////////////////// essential amplification  갱신
const  updateEssentialHandler = async (req) => {
  await poolConnect;
 
    const id             = req.body.id;
    const title          = req.body.title
    const mutation       = req.body.mutation;
    const amplification  = req.body.amplification;
    const fusion         = req.body.fusion;
    
    sql=`update essentialDNAMent set mutation=@mutation, title=@title,  
      fusion=@fusion, amplification=@amplification where id=@id`;
    logger.info('[976][mutation][updateEssentialHandler] =' + sql);
    try {
        const request = pool.request()
            .input('id', mssql.Int, id)
            .input('mutation', mssql.VarChar, mutation)
            .input('title', mssql.VarChar, title)
            .input('fusion',mssql.VarChar, fusion)
            .input('amplification', mssql.VarChar, amplification);

        const result = await request.query(sql);
        return result;
    }catch (error) {
        logger.error('[088][mutation][updateEssentialHandler] err=' + error.message);
    } 
 
}

exports.updateEssential = (req,res, next) => {
  logger.info('[994][mutation]data=' + JSON.stringify(req.body));
  const result = updateEssentialHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[1000][mutation][updateEssential] err=' + error.message);
      res.sendStatus(500);
  });
}

//////////////////// essential amplification  삭제
const  deleteEssentialHandler = async (req) => {
  await poolConnect;
  const id = req.body.id;
  const sql ='delete from essentialDNAMent where id=@id';
  logger.info('[1010][mutation][deleteEssentialHandler] =' + sql);
  try {
    const request = pool.request()
        .input('id', mssql.Int, id);

    const result = await request.query(sql);
    return result;
  }catch (error) {
    logger.error('[1018][mutation][deleteEssentialHandler] err=' + error.message);
  }  
}


exports.deleteEssential = (req,res, next) => {
  logger.info('[1024][mutatio]data=' + JSON.stringify(req.body));
  const result = deleteEssentialHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[1030][mutation][deleteEssential] err=' + error.message);
      res.sendStatus(500);
  });
}

/////// essentila lists 
const  listsEssentialHandler = async (req) => {
  await poolConnect;
 
  const sql =`select id, isnull(title,'') title , isnull(mutation, '') mutation, isnull(amplification, '') amplification, 
    isnull(fusion, '') fusion  from essentialDNAMent`;
  logger.info('[1041][mutation][listsEssentialHandler] =' + sql);
  try {
    const request = pool.request();
    const result = await request.query(sql);
    return result.recordset;
  }catch (error) {
    logger.error('[1047][mutation][listsEssentialHandler] err=' + error.message);
  }  
}

exports.listEssential = (req,res, next) => {
  const result = listsEssentialHandler(req);
  result.then(data => {  
    res.json(data);
  })
  .catch( error => {
    logger.error('[1057][mutation][listEssential] err=' + error.message);
    res.sendStatus(500);
  });
}

//// TITLE 만 가져왹
const  listsEssentialTitleHandler = async (req) => {
  await poolConnect;
 
  const sql =`select  DISTINCT title  from essentialDNAMent`;
  logger.info('[1067][mutation][listsEssentialTitleHandler] =' + sql);
  try {
    const request = pool.request();
    const result = await request.query(sql);
    return result.recordset;
  }catch (error) {
    logger.error('[1073][mutation][listsEssentialTitleHandler] err=' + error.message);
  }  
}

exports.listEssentialTitle = (req,res, next) => {
  const result = listsEssentialTitleHandler(req);
  result.then(data => {  
    res.json(data);
  })
  .catch( error => {
    logger.error('[1083][mutation][listEssentialTitle] err=' + error.message);
    res.sendStatus(500);
  });
}

//////////////   AMLALL LYM MDS  //////////////////////
///  입력
const amlInsertlHandler = async (req) => {
  await poolConnect;
  const aml           = req.body.aml;
  const type          = req.body.type;

  const patient_name      =   aml.name;
  const gene              =   aml.gene;
  const functional_impact =   aml.functional_impact;
  const transcript        =   aml.transcript;
  const exon_intro        =   aml.exon; 
  const nucleotide_change =   aml.nucleotideChange; 
  const amino_acid_change =   aml.aminoAcidChange;
  const zygosity          =   aml.zygosity;
  const vaf               =   aml.vaf;
  const reference         =   aml.reference;
  const cosmic_id         =   aml.cosmic_id; 
  const igv               =   aml.igv;
  const sanger            =   aml.sanger;

  const sql= `insert into mutation (patient_name, gene, functional_impact, transcript, exon_intro, nucleotide_change, amino_acid_change,
    vaf, reference, cosmic_id, igv, sanger, type, zygosity)  values(@patient_name, @gene, @functional_impact, @transcript, @exon_intro,
      @nucleotide_change, @amino_acid_change, @vaf, @reference, @cosmic_id, @igv, @sanger, @type, @zygosity)`;

  logger.info('[1128][mutation][amlInsertlHandler] =' + sql);
 
  try {
        const request = pool.request()
        .input('patient_name', mssql.NVarChar, patient_name)
        .input('gene', mssql.VarChar, gene)
        .input('functional_impact',mssql.VarChar, functional_impact)
        .input('transcript', mssql.VarChar, transcript)
        .input('exon_intro', mssql.VarChar, exon_intro)
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change)
        .input('zygosity', mssql.VarChar, zygosity)
        .input('vaf', mssql.VarChar, vaf)
        .input('reference', mssql.VarChar, reference)
        .input('cosmic_id', mssql.VarChar, cosmic_id)
        .input('igv', mssql.VarChar, igv)
        .input('sanger', mssql.VarChar, sanger)
        .input('type', mssql.VarChar, type);
        const result = await request.query(sql);
        return result; 
      } catch (error) {
        logger.error('[1148][mutation][amlInsertlHandler] err=' + error.message);
  }  

}

exports.amlInsert = (req,res, next) => {
  logger.info('[1154][mutation insert]data=' + JSON.stringify(req.body));

  const result = amlInsertlHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[1161][mutation][amlInsert] err=' + error.message);
      res.sendStatus(500);
  });

}

////////////////// 수정  ////////////////////////////
const amlUpdatelHandler = async (req) => {
  await poolConnect;
  const aml           = req.body.aml;
  
  const id                =   aml.id;
  const patient_name      =   aml.name;
  const gene              =   aml.gene;
  const functional_impact =   aml.functional_impact;
  const transcript        =   aml.transcript;
  const exon_intro        =   aml.exon; 
  const nucleotide_change =   aml.nucleotideChange; 
  const amino_acid_change =   aml.aminoAcidChange;
  const zygosity          =   aml.zygosity;
  const vaf               =   aml.vaf;
  const reference         =   aml.reference;
  const cosmic_id         =   aml.cosmic_id; 
  const igv               =   aml.igv;
  const sanger            =   aml.sanger;
  const type              =   aml.type;

  const sql = `update mutation set patient_name=@patient_name, gene=@gene, functional_impact=@functional_impact,
  transcript=@transcript, exon_intro=@exon_intro, nucleotide_change=@nucleotide_change, amino_acid_change=@amino_acid_change,
  vaf=@vaf,  reference=@reference, cosmic_id=@cosmic_id, igv=@igv, sanger=@sanger, zygosity=@zygosity where id=@id`;

  try {
    const request = pool.request()
    .input ('id', mssql.Int, id)
    .input('patient_name', mssql.NVarChar, patient_name)
    .input('gene', mssql.VarChar, gene)
    .input('functional_impact',mssql.VarChar, functional_impact)
    .input('transcript', mssql.VarChar, transcript)
    .input('exon_intro', mssql.VarChar, exon_intro)
    .input('nucleotide_change', mssql.VarChar, nucleotide_change)
    .input('amino_acid_change', mssql.VarChar, amino_acid_change)
    .input('zygosity', mssql.VarChar, zygosity)
    .input('vaf', mssql.VarChar, vaf)
    .input('reference', mssql.VarChar, reference)
    .input('cosmic_id', mssql.VarChar, cosmic_id)
    .input('igv', mssql.VarChar, igv)
    .input('sanger', mssql.VarChar, sanger)
    .input('type', mssql.VarChar, type);
    const result = await request.query(sql);
    return result; 
  } catch (error) {
    logger.error('[1209][mutation][amlUpdatelHandler] err=' + error.message);
  }  

}

exports.amlUpdate = (req,res, next) => {
  logger.info('[1215][mutation insert]data=' + JSON.stringify(req.body));

  const result = amlUpdatelHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[1222][mutation][amlUpdate] err=' + error.message);
      res.sendStatus(500);
  });
}

///////////// 삭제  ////////////////////
const amlDeleteHandler = async (req) => {
  await poolConnect;
  const id = req.body.id;
  const sql ='delete from mutation where id=@id';
  logger.info('[232][mutation][amlDeleteHandler] =' + sql + ', ' + id);
  try {
    const request = pool.request()
        .input('id', mssql.Int, id);

    const result = await request.query(sql);
    return result;
  }catch (error) {
    logger.error('[1240][mutation][amlDeleteHandler] err=' + error.message);
  }  
}

exports.amlDelete = (req,res, next) => {  
  const result = amlDeleteHandler(req);
  result.then(data => {  
      res.json({message: 'SUCCESS'});
  })
  .catch( error => {
      logger.error('[1251][mutation][amlDelete] err=' + error.message);
      res.sendStatus(500);
  });
}


////////// 목록
const amlListsHandler = async (req) => {
  await poolConnect;
  const type  = req.body.type;

  const sql=`select id, isnull(patient_name, '') patient_name,  isnull(gene, '') gene, isnull(functional_impact, '') functional_impact, isnull(transcript, '') transcript,
   isnull(exon_intro, '') exonIntro,
   isnull(nucleotide_change, '') nucleotideChange, isnull(amino_acid_change, '') aminoAcidChange, isnull(zygosity, '') zygosity,
   isnull(vaf, '') vaf, isnull(reference, '') reference, isnull(cosmic_id, '') cosmic_id,
   isnull(igv, '') igv, isnull(sanger, '') sanger
   from mutation  where type=@type order by id desc`;
  logger.info('[508][mutation][geneticlistindHandler] =' + sql);

  try {
      const request = pool.request()
      .input('type', mssql.VarChar, type);

      const result = await request.query(sql);
      return result.recordset; 
  }catch (error) {
      logger.error('[1276][mutation][amlListsHandler] err=' + error.message);
  } 
}

exports.amlLists = (req,res, next) => {
   
  const result = amlListsHandler(req);
  result.then(data => {  
      res.json(data);
  })
  .catch( error => {
      logger.error('[1287][mutation][amlLists] err=' + error.message);
      res.sendStatus(500);
  });
}

///////////////////////////////////////////////

 

 