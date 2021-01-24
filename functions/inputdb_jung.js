// select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv
//  select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv where type != 'REF' and info != 'HS'
//  select   count(*) as cnt from filtered_raw_tsv where type != 'REF' and info != 'HS' 
const mssql = require('mssql');
const logger = require('../common/winston');
const dbConfigMssql = require('../common/dbconfig-mssql.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);

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
const poolConnect = pool.connect();

const  messageHandler_daig_del = async (testedID) => {

    await poolConnect; // ensures that the pool has been created

    const sql_del =`delete from diag_raw_tsv where testedID = @testedID`;

    logger.info("[28][diaag_raw_tsv del]sql_del=" + sql_del);
    logger.info("[28][diag_raw_tsv del]testedId=", testedID);

    try {
        const request = pool.request()
            .input('testedID', mssql.VarChar, testedID); // or: new sql.Request(pool1)

            const result = await request.query(sql_del);
        console.dir( result);
        
        //return result;
    } catch (error) {
        logger.error('[28][diag_raw_tsv del]err=' + error.message);
    }
}

exports.inputdb_diag_del = ( testedID ) => {
    logger.info("[49][diag_raw_tsv del]testedID=" + testedID);

    const result = messageHandler_daig_del(testedID);
    result.then(data => {

        console.log(data);
        // res.json(data);
    })
    .catch( error  => { 
        logger.error('[49][diag_raw_tsv del]err=' + error.message );
    });
}

const  messageHandler_diag_insert = async (
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
    testedID) => {

  await poolConnect; // ensures that the pool has been created

  const sql2 =`insert into diag_raw_tsv (		   
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
     testedID ) 
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
     @testedID)`;

    logger.info("[105][diag_raw_tsv ins]data=" + locus + " " + testedID);
    // logger.info("[105][diag_raw_tsv ins]sql=" + sql2);

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
        .input('testedID', mssql.VarChar, testedID); // or: new sql.Request(pool1)
      const result = await request.query(sql2)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[177][inputdb_jung]err=' + error.message);
  }
}

exports.inputdb_jung = ( 
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
        ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,
        testedID ) => {
        console.log('inputdb: ', locus);

    const result = messageHandler_diag_insert(locus,genotype,filter,ref,observed_allele,
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
        testedID);

    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( error => {
    logger.log('[215][inputdb_jugn]err=' + error.message);
  });
    
}