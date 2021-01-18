 
// select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv
//  select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv where type != 'REF' and info != 'HS'
//  select   count(*) as cnt from filtered_raw_tsv where type != 'REF' and info != 'HS'

const fs = require('fs');
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

function parse_tsv(s, f) {
  s = s.replace(/,/g, ";");
  var ix_end = 0;
  for (var ix = 0; ix < s.length; ix = ix_end + 1) {
    ix_end = s.indexOf('\n', ix);
    if (ix_end == -1) {
      ix_end = s.length;
    }
    //var row = s.substring(ix, ix_end - 1).split('\t');
    var row = s.substring(ix, ix_end).split('\t');
    f(row);
  }
}


function loadData(filePath) {
  if (fs.existsSync(filePath)) {
    var tsvData = fs.readFileSync(filePath, 'utf-8');
    var rowCount = 0;
    var scenarios = [];
    parse_tsv(tsvData, (row) => {
      rowCount++;
      if (rowCount >= 0) {
        scenarios.push(row);
      }
    });
    return scenarios;
  } else {
    return [];
  }
}

// Variant effect: Sysmonymouse 존재하면 false, 존재하지 않으면 true
function varianEffect(variant_effect) {
   let semicheck;
  
   if (variant_effect.length) {
	   const semicheck = variant_effect.indexOf(';');

	   if (semicheck === -1) {
          if (variant_effect === 'synonymous') 
          {
	           return false;
          }             
               return true;
	   } else {
           const filterResult =  variant_effect.split(';');
	 
		   if (filterResult.includes('synonymous')) {
			   return false
		   }
		   return true;
	   }
   } else {  // 공백인 경우
       return true;
   }
}

function phredQualScore(score) {
   if (parseFloat(score) > 10) {
	   return true;
   }
   return false;
}

//  // Location: Exon 포함된것과 5-UTR 필드값 없음을 남김(그 외에 것들은 제거) true, false	
let loc1, loc2,loc3,loc4,loc5,loc6,loc7 ;
function locationsProcess(locations_data) {
	          loc1 = '';
			  loc2 = '';
			  loc3 = '';
			  loc4 = '';
			  loc5 = '';
			  loc6 = '';
			  loc7 = '';

			  const locations_items = locations_data.split(':');
			  if ( locations_items.length === 0) {
				  return false;
			  } else if (locations_items.length === 1) {
                  loc1 = locations_items[0];
				  loc2 = '';
				  loc3 = '';
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 ='';
			  }  else if (locations_items.length === 2) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = '';
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }   else if (locations_items.length === 3) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = locations_items[2];
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }   else if (locations_items.length === 4) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = locations_items[2];
				  loc4 = locations_items[3];
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }  else if (locations_items.length === 5) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = '';
				 loc7 = '';

			  }  else if (locations_items.length === 6) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = locations_items[5];
				 loc7 = '';

			  }  else if (locations_items.length === 7) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = locations_items[5];
				 loc7 = locations_items[6];
			  }
			  			
			  const  locations_length = locations_data.length;
			  const locations_exonic = locations_items.includes('exonic');
			  const locations_utr    = locations_items.includes('utr_5');
			  
			  if (locations_exonic || locations_utr || locations_length === 0)
			  {
				  if (locations_length === 0) {
					  loc1 = '';
					  loc2 = '';
					  loc3 = '';
					  loc4 = '';
					  loc5 = '';
					  loc6 = '';
					  loc7 = '';
				  }
				   return true
			  }	          
 
		return false;
}

// 7.0E-4 => 0.0001 * 7.0 => 0.0007 로 변환
function convert(sample) {
 const result =sample.split('E');
 const firstVal = Number(result[0]);
 const secondVal = result[1];
 
 const value = Number(secondVal.substr(1));

 let tempValue="0.";
 for(let i=1; i <= value; i++) {
    if (i === value) {
		tempValue += "1";
    } else {
       tempValue += "0";
	}   
 }
 const newValue = Number(tempValue) * firstVal;
 return newValue;
}

// gmaf: 0.01 미만 남김 미만인경우: true, 이상인 경우: false
 function gmafProcess(gmafVal) {
	     const gmafLength = gmafVal.toString().length;
		  
		if (gmafLength > 0) {			
		        if(parseFloat(gmafVal) > 0.01) {
                     return false;
		         } 
		             return true;
		     } else if (parseFloat(gmafVal) < 0) {
			  return true;
		}
}

 //  Krgdb에서 0.01  이상 제외 0.01 미만인경우: true, 0.01 이상인경우: false
let krgdb622val = '', krgdb1100val = '';
function krgdb622(krgbdata, locus) {
	//fs.appendFileSync('./krgdb.txt', '[' + locus +'] 데이타['+ krgbdata + '] 길이 [' + krgbdata.toString().length + ']'  +'\n');
   if (krgbdata.toString().length === 0 ) { 
	   return true;
   }

   const conloncheck =  krgbdata.indexOf(';');
   if ( conloncheck === -1) {
       const idrs = krgbdata.split('=');
	   if (idrs[0] === 'id') {
           return true;
	   }	   
   } else {  // 콜론이 있는경우

   const items = krgbdata.split(';'); 
   const results = items.map(item => { 
         temp_items = item.split('=');
	  
	     if (temp_items[0] === 'Alt_Freq') {             
 			 // Alt_Freq 한개인경우
            const commacheck = temp_items[1].indexOf(',');
			if (commacheck == -1)  {
			     krgdb622val =  parseFloat(temp_items[1].split(':')[1]); 			  
		        if ( krgdb622val > 0.01) {
			        return false;
		        } else {
                   return true;
		        }
			} else {
				// Alt_Freq 한개 이상인 경우
              comma_sepate =  temp_items[1].split(',');
			  const value = comma_sepate.map( data => {
                   return data.split(':')[1];
			  }).map(data => {				  
                 if (parseFloat(data) > 0.01) {
					 return false;
                 } else { return true; }
			  });
			  
			  if (value.includes(false)) {
				  return false;
			  }
			  return true;   
			}
	     } 
       }).filter(data => data !== undefined);

   if ( results.includes(true)) {
	   return true
   } 
   return false;   
   }   
}

function krgdb1100(krgbdata,locus) {
	
   if (krgbdata.toString().length === 0 || krgbdata.toString().length === 1 ) { 
	 //  fs.appendFileSync('./krgdb.txt', '[' + locus +'] 데이타['+ krgbdata + '] 길이 [' + krgbdata.toString().length + ']'  +'\n');
	   return true;
   }

   const conloncheck =  krgbdata.indexOf(';');

   if ( conloncheck === -1) {
       const idrs = krgbdata.split('=');
	   if (idrs[0] === 'id') {
           return true;
	   }
	   
   } else {  // 콜론이 있는경우

   const items = krgbdata.split(';');
  
   const results = items.map(item => { 
         temp_items = item.split('=');
	  
	     if (temp_items[0] === 'Alt_Freq') {             
 			 // Alt_Freq 한개인경우
            const commacheck = temp_items[1].indexOf(',');
			if (commacheck == -1)  {
			   krgdb1100val =  parseFloat(temp_items[1].split(':')[1]); 
			   
		        if ( krgdb1100val > 0.01) {
			        return false;
		        } else {
                   return true;
		        }
			} else {
				// Alt_Freq 한개 이상인 경우
              comma_sepate =  temp_items[1].split(',');
			  const value = comma_sepate.map( data => {
                   return data.split(':')[1];
			  }).map(data => {
				   
                 if (parseFloat(data) > 0.01) {
					 return false;
                 } else { return true; }
			  });
			  
			  if (value.includes(false)) {
				  return false;
			  }
			  return true;   
			}
	     } 
		 
       }).filter(data => data !== undefined);

   if ( results.includes(true)) {
	   return true
   } 
   return false;   
   }  
}
 
// info HS 이고  type이 REF 인것 제외
function infoProcess(info, type) {
  if (info === 'HS' && type === 'REF')  {
	  return false;
  }
  return true;
}


const  messageHandler = async (locus, genotype, filter ,ref, observed_allele, type, 
				  no_call_reason, genes, locations, length,
				  info, variant_id, variant_name, frequency,
				  strand, exon, transcript, coding,
				  amino_acid_change, variant_effect, phylop, sift,
				  grantham, polyphen, fathmm, pfam,
				  dbsnp, dgv, maf, emaf, amaf, gmaf, 
				  ucsc_common_snps, exac_laf, exac_eaaf, exac_oaf,
				  exac_efaf, exac_saaf, exac_enfaf, exac_aaf, exac_gaf,
				  cosmic, omim, gene_ontology, drugbank,
				  clinvar, allele_coverage, allele_ratio, p_value,
				  phred_qual_score, coverage, ref_ref_var_var,
				  homopolymer_length, subset_of, krgdb_622_lukemia, krgdb_1100_leukemia, tsv_file_name) => {
	await poolConnect; // ensures that the pool has been created
  
	const merged_sql =`insert into merged_raw_tsv (
		locus,genotype,filter,ref,observed_allele,
		type,no_call_reason,genes,locations,length,
		info, variant_id,variant_name,frequency,strand,exon,
		transcript,coding,amino_acid_change,variant_effect, phylop,
		sift,grantham,polyphen,fathmm, pfam,
		dbsnp,dgv,maf,emaf,amaf,
		gmaf,ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
		exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
		cosmic,omim,gene_ontology,drugbank,clinvar,
		allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
		ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename		    
	   ) 
	   values ( 
		@locus, @genotype, @filter , @ref, @observed_allele,
		@type, @no_call_reason, @genes, @locations, @length,
		@info, @variant_id, @variant_name, @frequency, @strand,
		@exon, @transcript, @coding, @amino_acid_change, @variant_effect,
		@phylop, @sift, @grantham, @polyphen, @fathmm,
		@pfam, @dbsnp, @dgv, @maf, @emaf, @amaf, @gmaf, @ucsc_common_snps,
		@exac_laf, @exac_eaaf, @exac_oaf, @exac_efaf, @exac_saaf,
		@exac_enfaf, @exac_aaf, @exac_gaf, @cosmic, @omim, @gene_ontology,
		@drugbank, @clinvar, @allele_coverage, @allele_ratio, @p_value, @phred_qual_score,
		@coverage, @ref_ref_var_var, @homopolymer_length, @subset_of, 
		@krgdb_622_lukemia, @krgdb_1100_leukemia, @tsv_file_name		
		)`;
	
		 
	try {
		const request = pool.request()
        .input('locus', mssql.VarChar, locus) // or: new sql.Request(pool1)
        .input('genotype', mssql.VarChar, genotype) // or: new sql.Request(pool1)
        .input('filter', mssql.VarChar, filter) // or: new sql.Request(pool1)
        .input('ref', mssql.VarChar, ref) // or: new sql.Request(pool1)
        .input('observed_allele', mssql.VarChar, observed_allele) // or: new sql.Request(pool1)
        .input('type', mssql.VarChar, type) // or: new sql.Request(pool1)
        .input('no_call_reason', mssql.VarChar, no_call_reason) // or: new sql.Request(pool1)
        .input('genes', mssql.VarChar, genes) // or: new sql.Request(pool1)
        .input('locations', mssql.VarChar, locations) // or: new sql.Request(pool1)
        .input('length', mssql.VarChar, length) // or: new sql.Request(pool1)
        .input('info', mssql.VarChar, info) // or: new sql.Request(pool1)
        .input('variant_id', mssql.VarChar, variant_id) // or: new sql.Request(pool1)
        .input('variant_name', mssql.VarChar, variant_name) // or: new sql.Request(pool1)
        .input('frequency', mssql.VarChar, frequency) // or: new sql.Request(pool1)
        .input('strand', mssql.VarChar, strand) // or: new sql.Request(pool1)
        .input('exon', mssql.VarChar, exon) // or: new sql.Request(pool1)
        .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
        .input('coding', mssql.VarChar, coding) // or: new sql.Request(pool1)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change) // or: new sql.Request(pool1)
        .input('variant_effect', mssql.VarChar, variant_effect) // or: new sql.Request(pool1)
        .input('phylop', mssql.VarChar, phylop) // or: new sql.Request(pool1)
        .input('sift', mssql.VarChar, sift) // or: new sql.Request(pool1)
        .input('grantham', mssql.VarChar, grantham) // or: new sql.Request(pool1)
        .input('polyphen', mssql.VarChar, polyphen) // or: new sql.Request(pool1)
        .input('fathmm', mssql.VarChar, fathmm) // or: new sql.Request(pool1)
        .input('pfam', mssql.VarChar, pfam) // or: new sql.Request(pool1)
        .input('dbsnp', mssql.VarChar, dbsnp) // or: new sql.Request(pool1)
        .input('dgv', mssql.VarChar, dgv) // or: new sql.Request(pool1)
        .input('maf', mssql.VarChar, maf) // or: new sql.Request(pool1)
        .input('emaf', mssql.VarChar, emaf) // or: new sql.Request(pool1)
        .input('amaf', mssql.VarChar, amaf) // or: new sql.Request(pool1)
        .input('gmaf', mssql.VarChar, gmaf) // or: new sql.Request(pool1)
        .input('ucsc_common_snps', mssql.VarChar, ucsc_common_snps) // or: new sql.Request(pool1)
        .input('exac_laf', mssql.VarChar, exac_laf) // or: new sql.Request(pool1)
        .input('exac_eaaf', mssql.VarChar, exac_eaaf) // or: new sql.Request(pool1)
        .input('exac_oaf', mssql.VarChar, exac_oaf) // or: new sql.Request(pool1)
        .input('exac_efaf', mssql.VarChar, exac_efaf) // or: new sql.Request(pool1)
        .input('exac_saaf', mssql.VarChar, exac_saaf) // or: new sql.Request(pool1)
        .input('exac_enfaf', mssql.VarChar, exac_enfaf) // or: new sql.Request(pool1)
        .input('exac_aaf', mssql.VarChar, exac_aaf) // or: new sql.Request(pool1)
        .input('exac_gaf', mssql.VarChar, exac_gaf) // or: new sql.Request(pool1)
        .input('cosmic', mssql.VarChar, cosmic) // or: new sql.Request(pool1)
        .input('omim', mssql.VarChar, omim) // or: new sql.Request(pool1)
        .input('gene_ontology', mssql.VarChar, gene_ontology) // or: new sql.Request(pool1)
        .input('drugbank', mssql.VarChar, drugbank) // or: new sql.Request(pool1)
        .input('clinvar', mssql.VarChar, clinvar) // or: new sql.Request(pool1)
        .input('allele_coverage', mssql.VarChar, allele_coverage) // or: new sql.Request(pool1)
        .input('allele_ratio', mssql.VarChar, allele_ratio) // or: new sql.Request(pool1)
        .input('p_value', mssql.VarChar, p_value) // or: new sql.Request(pool1)
        .input('phred_qual_score', mssql.VarChar, phred_qual_score) // or: new sql.Request(pool1)
        .input('coverage', mssql.VarChar, coverage) // or: new sql.Request(pool1)
        .input('ref_ref_var_var', mssql.VarChar, ref_ref_var_var) // or: new sql.Request(pool1)
        .input('homopolymer_length', mssql.VarChar, homopolymer_length) // or: new sql.Request(pool1)
        .input('subset_of', mssql.VarChar, subset_of) // or: new sql.Request(pool1)
        .input('krgdb_622_lukemia', mssql.VarChar, krgdb_622_lukemia) // or: new sql.Request(pool1)
        .input('krgdb_1100_leukemia', mssql.VarChar, krgdb_1100_leukemia) // or: new sql.Request(pool1)
        .input('tsv_file_name', mssql.VarChar, tsv_file_name); // or: new sql.Request(pool1)
		const result = await request.query(sql)
		console.dir( result);
		
		return result;
	} catch (err) {
		console.error('SQL error', err);
	}
  }


  const  messageHandler_del = async (testedID) => {

  await poolConnect; // ensures that the pool has been created

  const sql_del =`delete from filtered_raw_tsv where testedID = @testedID`;

  console.log("[477][del][sql_del]", sql_del);
  console.log("[477][del][testedId]", testedID);

  try {
      const request = pool.request()
        .input('testedID', mssql.VarChar, testedID); // or: new sql.Request(pool1)

        const result = await request.query(sql_del);
      console.dir( result);
      
      //return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

const  messageHandler2 = async (
    locus, genotype,filter, ref, observed_allele,
    type, no_call_reason, genes, locations, length,
    info, variant_id, variant_name, frequency, strand, exon,
    transcript, coding, amino_acid_change, variant_effect, phylop,
    sift, grantham, polyphen, fathmm, pfam,
    dbsnp, dgv, maf, emaf, amaf,
    gmaf,ucsc_common_snps, exac_laf, exac_eaaf, exac_oaf,
    exac_efaf, exac_saaf, exac_enfaf, exac_aaf, exac_gaf,
    cosmic, omim, gene_ontology, drugbank, clinvar,
    allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
    ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,
    loc1, loc2,loc3,loc4,loc5,loc6,loc7, testedID) => {

  await poolConnect; // ensures that the pool has been created
  
  const sql2 =`insert into filtered_raw_tsv (		   
     locus, genotype, filter, ref, observed_allele,
     type, no_call_reason, genes, locations, length,
     info, variant_id, variant_name, frequency, strand, exon,
     transcript, coding, amino_acid_change, variant_effect, phylop,
     sift, grantham, polyphen, fathmm, pfam,
     dbsnp, dgv, maf, emaf, amaf,
     gmaf, ucsc_common_snps, exac_laf, exac_eaaf, exac_oaf,
     exac_efaf, exac_saaf, exac_enfaf, exac_aaf, exac_gaf,
     cosmic, omim, gene_ontology, drugbank, clinvar,
     allele_coverage, allele_ratio, p_value, phred_qual_score, coverage,
     ref_ref_var_var, homopolymer_length, subset_of, krgdb_622_lukemia, krgdb_1100_leukemia, filename,
     loc1, loc2, loc3, loc4, loc5, loc6, loc7, testedID ) 
    values ( 
    @locus, @genotype, @filter, @ref, @observed_allele,
    @type, @no_call_reason, @genes, @locations, @length,
    @info, @variant_id, @variant_name, @frequency, @strand, @exon,
    @transcript, @coding, @amino_acid_change, @variant_effect, @phylop,
    @sift, @grantham, @polyphen, @fathmm, @pfam,
    @dbsnp, @dgv, @maf, @emaf, @amaf,
    @gmaf, @ucsc_common_snps, @exac_laf, @exac_eaaf, @exac_oaf,
    @exac_efaf, @exac_saaf, @exac_enfaf, @exac_aaf, @exac_gaf,
    @cosmic, @omim, @gene_ontology, @drugbank, @clinvar,
    @allele_coverage, @allele_ratio, @p_value, @phred_qual_score, @coverage,
    @ref_ref_var_var, @homopolymer_length, @subset_of, @krgdb_622_lukemia, @krgdb_1100_leukemia, @filename,
    @loc1, @loc2, @loc3, @loc4, @loc5, @loc6, @loc7, @testedID)`;

  try {
      const request = pool.request()
        .input('locus', mssql.VarChar, locus) // or: new sql.Request(pool1)
        .input('genotype', mssql.VarChar, genotype) // or: new sql.Request(pool1)
        .input('filter', mssql.VarChar, filter) // or: new sql.Request(pool1)
        .input('ref', mssql.VarChar, ref) // or: new sql.Request(pool1)
        .input('observed_allele', mssql.VarChar, observed_allele) // or: new sql.Request(pool1)
        .input('type', mssql.VarChar, type) // or: new sql.Request(pool1)
        .input('no_call_reason', mssql.VarChar, no_call_reason) // or: new sql.Request(pool1)
        .input('genes', mssql.VarChar, genes) // or: new sql.Request(pool1)
        .input('locations', mssql.VarChar, locations) // or: new sql.Request(pool1)
        .input('length', mssql.VarChar, length) // or: new sql.Request(pool1)
        .input('info', mssql.VarChar, info) // or: new sql.Request(pool1)
        .input('variant_id', mssql.VarChar, variant_id) // or: new sql.Request(pool1)
        .input('variant_name', mssql.VarChar, variant_name) // or: new sql.Request(pool1)
        .input('frequency', mssql.VarChar, frequency) // or: new sql.Request(pool1)
        .input('strand', mssql.VarChar, strand) // or: new sql.Request(pool1)
        .input('exon', mssql.VarChar, exon) // or: new sql.Request(pool1)
        .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
        .input('coding', mssql.VarChar, coding) // or: new sql.Request(pool1)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change) // or: new sql.Request(pool1)
        .input('variant_effect', mssql.VarChar, variant_effect) // or: new sql.Request(pool1)
        .input('phylop', mssql.VarChar, phylop) // or: new sql.Request(pool1)
        .input('sift', mssql.VarChar, sift) // or: new sql.Request(pool1)
        .input('grantham', mssql.VarChar, grantham) // or: new sql.Request(pool1)
        .input('polyphen', mssql.VarChar, polyphen) // or: new sql.Request(pool1)
        .input('fathmm', mssql.VarChar, fathmm) // or: new sql.Request(pool1)
        .input('pfam', mssql.VarChar, pfam) // or: new sql.Request(pool1)
        .input('dbsnp', mssql.VarChar, dbsnp) // or: new sql.Request(pool1)
        .input('dgv', mssql.VarChar, dgv) // or: new sql.Request(pool1)
        .input('maf', mssql.VarChar, maf) // or: new sql.Request(pool1)
        .input('emaf', mssql.VarChar, emaf) // or: new sql.Request(pool1)
        .input('amaf', mssql.VarChar, amaf) // or: new sql.Request(pool1)
        .input('gmaf', mssql.VarChar, gmaf) // or: new sql.Request(pool1)
        .input('ucsc_common_snps', mssql.VarChar, ucsc_common_snps) // or: new sql.Request(pool1)
        .input('exac_laf', mssql.VarChar, exac_laf) // or: new sql.Request(pool1)
        .input('exac_eaaf', mssql.VarChar, exac_eaaf) // or: new sql.Request(pool1)
        .input('exac_oaf', mssql.VarChar, exac_oaf) // or: new sql.Request(pool1)
        .input('exac_efaf', mssql.VarChar, exac_efaf) // or: new sql.Request(pool1)
        .input('exac_saaf', mssql.VarChar, exac_saaf) // or: new sql.Request(pool1)
        .input('exac_enfaf', mssql.VarChar, exac_enfaf) // or: new sql.Request(pool1)
        .input('exac_aaf', mssql.VarChar, exac_aaf) // or: new sql.Request(pool1)
        .input('exac_gaf', mssql.VarChar, exac_gaf) // or: new sql.Request(pool1)
        .input('cosmic', mssql.VarChar, cosmic) // or: new sql.Request(pool1)
        .input('omim', mssql.VarChar, omim) // or: new sql.Request(pool1)
        .input('gene_ontology', mssql.VarChar, gene_ontology) // or: new sql.Request(pool1)
        .input('drugbank', mssql.VarChar, drugbank) // or: new sql.Request(pool1)
        .input('clinvar', mssql.VarChar, clinvar) // or: new sql.Request(pool1)
        .input('allele_coverage', mssql.VarChar, allele_coverage) // or: new sql.Request(pool1)
        .input('allele_ratio', mssql.VarChar, allele_ratio) // or: new sql.Request(pool1)
        .input('p_value', mssql.VarChar, p_value) // or: new sql.Request(pool1)
        .input('phred_qual_score', mssql.VarChar, phred_qual_score) // or: new sql.Request(pool1)
        .input('coverage', mssql.VarChar, coverage) // or: new sql.Request(pool1)
        .input('ref_ref_var_var', mssql.VarChar, ref_ref_var_var) // or: new sql.Request(pool1)
        .input('homopolymer_length', mssql.VarChar, homopolymer_length) // or: new sql.Request(pool1)
        .input('subset_of', mssql.VarChar, subset_of) // or: new sql.Request(pool1)
        .input('krgdb_622_lukemia', mssql.VarChar, krgdb_622_lukemia) // or: new sql.Request(pool1)
        .input('krgdb_1100_leukemia', mssql.VarChar, krgdb_1100_leukemia) // or: new sql.Request(pool1)
        .input('filename', mssql.VarChar, filename) // or: new sql.Request(pool1)
        .input('loc1', mssql.VarChar, loc1) // or: new sql.Request(pool1)
        .input('loc2', mssql.VarChar, loc2) // or: new sql.Request(pool1)
        .input('loc3', mssql.VarChar, loc3) // or: new sql.Request(pool1)
        .input('loc4', mssql.VarChar, loc4) // or: new sql.Request(pool1)
        .input('loc5', mssql.VarChar, loc5) // or: new sql.Request(pool1)
        .input('loc6', mssql.VarChar, loc6) // or: new sql.Request(pool1)
        .input('loc7', mssql.VarChar, loc7) // or: new sql.Request(pool1)
        .input('testedID', mssql.VarChar, testedID); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
} 
////////////////////////////////////////////////////////////////////////////
exports.registerDB = async (path) => {

  //console.log()
  const data = loadData(path);
  const tsv_file_name = path.split('/')[1];
for (let i=0; i < data.length ; i++ ) { 
		const first_char = data[i][0].substring(0,1);	   
   if (first_char !== '#') {  
	   const title_char = data[i][0].substring(0,5);
	  if (title_char !== 'Locus') {
	 
	   field   = data[i].toString().split(',');
	   const locus             = field[0];
	   const genotype          = field[1];
	   const filter            = field[2];
	   const ref               = field[3];
	   const observed_allele   = field[4];
       const type              = field[5];
	   const no_call_reason    = field[6];
	   const genes             = field[7];
       const locations         = field[8];
	   const length            = field[9];
	   const info              = field[10];
	   const variant_id        = field[11];
	   const variant_name      = field[12];
       const frequency         = field[13];
	   const strand            = field[14];
	   const exon              = field[15];
	   const transcript        = field[16];
	   const coding            = field[17];
	   const amino_acid_change = field[18];
	   const variant_effect    = field[19];
	   const phylop            = field[20];
	   const sift              = field[21];
	   const grantham          = field[22];
	   const polyphen          = field[23];
       const fathmm            = field[24];
	   const pfam              = field[25];
	   const dbsnp             = field[26];
	   const dgv               = field[27];
	   const maf               = field[28];
	   const emaf              = field[29];
	   const amaf              = field[30];
	   const ucsc_common_snps  = field[32];
	   const exac_laf          = field[33];
	   const exac_eaaf         = field[34];
	   const exac_oaf          = field[35];
	   const exac_efaf         = field[36];
	   const exac_saaf         = field[37];
	   const exac_enfaf        = field[38];
	   const exac_aaf          = field[39];
	   const exac_gaf          = field[40];
	   const cosmic            = field[41];
	   const omim              = field[42];
	   const gene_ontology     = field[43];
	   const drugbank          = field[44];
	   const clinvar           = field[45];
	   const allele_coverage   = field[46];
	   const allele_ratio      = field[47];
	   const p_value           = field[48];
	   const phred_qual_score  = field[49];
	   const coverage          = field[50];
	   const ref_ref_var_var   = field[51];
	   const homopolymer_length= field[52];
	   const subset_of         = field[53];
	   const krgdb_622_lukemia = field[54];
	   let krgdb_1100_leukemia = field[55];
	   	 
	   if (krgdb_622_lukemia.length === 0) {
          krgdb_1100_leukemia = '';
	   }

	   const result = messageHandler(locus,genotype,filter,ref,observed_allele,
		   type,no_call_reason,genes,locations,length,
		   info, variant_id,variant_name,frequency,strand,exon,
		   transcript,coding,amino_acid_change,variant_effect, phylop,
		   sift,grantham,polyphen,fathmm, pfam,
		   dbsnp,dgv,maf,emaf,amaf,
		   ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
		   exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
		   cosmic,omim,gene_ontology,drugbank,clinvar,
		   allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
		   ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,tsv_file_name);
	   result.then(data => {
   
		  console.log(json.stringfy());
		  res.json(data);
	 })
	 .catch( err  => res.sendStatus(500));
		 
	 /////////////////////////////////////////////////////////////////////
       // Varian effect: Synonymous 제거 존재하면:false, 존재하지않으면: true
          const varian_effect_result = varianEffect(variant_effect);
		
       // PhredQualScoe: 10 이하 존재여부 있음: true, 없음: false
          const  phredQualScore_result = phredQualScore(phred_qual_score);
	   
       // Location: Exon 포함된것과 5-UTR 필드값 없음을 남김(그 외에 것들은 제거) 존재하면:true,  없으면: false
	   const locations_result = locationsProcess(locations);

	   // gmaf: 0.01 미만 남김 미만인경우: true, 이상인 경우: false
	   
	   const result_gmaf = gmaf.indexOf('E');
	    let gmaf_result;
	    if (result_gmaf !== -1 && gmaf.length) {
		    gmaf = convert(gmaf); // 7.0E-4 같은 경우처리 
            gmaf_result = gmafProcess(gmaf);
	    } else {
			if (gmaf.length === 0) { // 길이가 0 이면 true
				gmaf_result = true;
			} else {
               gmaf_result = gmafProcess(gmaf);
			}            
		}
       
       //  Krgdb에서 0.01  이상 제외 0.01 미만인경우: true, 0.01 이상인경우: false
	   // krgdb_622_lukemia , krgdb_1100_leukemia
	    let krgdb_lukemia_result = krgdb622(krgdb_622_lukemia, locus);
        let krgdb_leukemia_result = krgdb1100(krgdb_1100_leukemia, locus);
        
       // info HS 이고 Type REF 인것 제외 2개 존재하면 false, 존재 하지 않으면: true
	     info_result = infoProcess(info, type);
// fs.appendFileSync('./krgdb.txt','[' + i +'][' + locus + '][' + krgdb_lukemia_result + '][' + krgdb_622_lukemia + '], [' + krgdb_leukemia_result + '][' + krgdb_1100_leukemia + '][' +'\n');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		if(locations_result ) {
            if(varian_effect_result) {				 
              if ( phredQualScore_result) {				 
				  if (gmaf_result) {  				  
					  if (info_result) {	
 
					    		 if ( (krgdb_lukemia_result === true && krgdb_leukemia_result === "one")  || 
									   (krgdb_lukemia_result && krgdb_leukemia_result === "blank")        || 
									   (krgdb_lukemia_result == true && krgdb_leukemia_result === true)   ||
			                           (krgdb_lukemia_result === "one" && krgdb_leukemia_result === true) || 
									 (krgdb_lukemia_result === "blank" && krgdb_leukemia_result === true) ||
									 (krgdb_lukemia_result === "one" && krgdb_leukemia_result === "blank") ||
									 (krgdb_lukemia_result === "blank" && krgdb_leukemia_result === "one")
									 
									 ) {
									 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		  
		/*	 
    aconst result = messageHandler2(locus,genotype,filter,ref,observed_allele,
        type,no_call_reason,genes,locations,length,
        info, variant_id,variant_name,frequency,strand,exon,
        transcript,coding,amino_acid_change,variant_effect, phylop,
        sift,grantham,polyphen,fathmm, pfam,
        dbsnp,dgv,maf,emaf,amaf,
        gmaf,ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
        exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
        cosmic,omim,gene_ontology,drugbank,clinvar,
        allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
        ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,
        loc1, loc2,loc3,loc4,loc5,loc6,loc7, testedID);
    result.then(data => {

       console.log(json.stringfy());
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));
  */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

								 } // krgdb   
								 
					 } // info_result					 
		 		  } // gmaf_result if loop
              }     // phredQualScore_result if loop
			}       // varian_effect_result if loop
		}           // locations_result
/////////////////////////////////////////////////////////////////////////////////////////
       krgdb_lukemia_result = '';
       krgdb_leukemia_result = '';
	   krgdb1100val = '';
	   krgdb622val  = '';
        gmaf_result = '';
		gmaf = '';
	  } // Locus	   
   }  // #
  
} // end for loop

} // End of function

/*

      
  id=. / Ref_Freq=G:0.999091;Alt_Freq=T:0.000909091;id=.
  Ref_Freq=GCACACACACACACACA:0.983923;No_Allele=4;Alt_Freq=GCACACACACACACA:0.0137,GCACACACACACACACACA:0.0016,GCACACACACACA:0.0008;id=.  / Ref_Freq=GCA:0.993636;No_Allele=3;Alt_Freq=G:0.00545455, GCACA:0.000909091;id=rs140610549
  Ref_Freq=TCCCCCCC:0.999196;Alt_Freq=TCCCCCCCC:0.0008;id=. / 

*/
