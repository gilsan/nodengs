 
const fs = require('fs');
const mssql = require('mssql');

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
				  homopolymer_length, subset_of, krgdb_622_lukemia, krgdb_1100_leukemia, tsv_file_name,testedId) => {
	await poolConnect; // ensures that the pool has been created
  
	const diagSql =`insert into diag_raw_tsv (
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
		ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,testedId	    
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
		@krgdb_622_lukemia, @krgdb_1100_leukemia, @tsv_file_name, @testedId		
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
        .input('tsv_file_name', mssql.VarChar, tsv_file_name)
        .input('testedId', mssql.VarChar, testedId); // or: new sql.Request(pool1)
		const result = await request.query(diagSql)
		console.dir( result);
		
		return result;
	} catch (err) {
		console.error('SQL error', err);
	}
  }

///////////////////////////////////////////////////////////////////////
/*
  const  messageHandler_del = async (testedID) => {

  await poolConnect; // ensures that the pool has been created

  const sql_del =`delete from diag_raw_tsv where testedID = @testedID`;

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
*/
////////////////////////////////////////////////////////////////////////////
makeDiagToDB = async (path, filename, testedId) => {

  //console.log()
  const data = loadData(path);
   
  const tsv_file_name = filename;
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
     const gmaf              = field[31];
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
	   	 
 

	   const result = messageHandler(locus,genotype,filter,ref,observed_allele,
		   type,no_call_reason,genes,locations,length,
		   info, variant_id,variant_name,frequency,strand,exon,
		   transcript,coding,amino_acid_change,variant_effect, phylop,
		   sift,grantham,polyphen,fathmm, pfam,
		   dbsnp,dgv,maf,emaf,amaf,gmaf,
		   ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
		   exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
		   cosmic,omim,gene_ontology,drugbank,clinvar,
		   allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
		   ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,tsv_file_name, testedId);
	   result.then(data => {
   
		 console.log(data);
		  
	 })
	 .catch( err  => console.log(err));
 
 
	  } // Locus	   
   }  // #
  
} // end for loop

} // End of function


makeDiagToDB('../uploads/01_18819070_HJI.tsv', '01_18819070_HJI.tsv','I27460050');
 
