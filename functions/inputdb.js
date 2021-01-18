// select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv
//  select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv where type != 'REF' and info != 'HS'
//  select   count(*) as cnt from filtered_raw_tsv where type != 'REF' and info != 'HS' 
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

const  messageHandler_del = async (testedID) => {

    await poolConnect; // ensures that the pool has been created

    const sql_del =`delete from filtered_raw_tsv where testedID = @testedID`;

    console.log("[28][del][sql_del]", sql_del);
    console.log("[28][del][testedId]", testedID);

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

exports.inputdb_del = ( testedID ) => {
   console.log('testedID: ', testedID);

const result = messageHandler_del(testedID);
result.then(data => {

console.log(data);
// res.json(data);
})
.catch( err  => console.log(err));

}

const  messageHandler = async (
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
     /*
    locus = locusreplace(/;/g, ",");
    genotype = genotypereplace(/;/g, ",");
    ref = ref.replace(/;/g, ",");
    observed_allele= observed_allele.replace(/;/g, ",");
    type = type.replace(/;/g, ",");
    no_call_reason =  no_call_reason.replace(/;/g, ",");
    genes = genes.replace(/;/g, ",");
    locations = locations.replace(/;/g, ",");
   
    info = info.replace(/;/g, ",");
    variant_id = variant_id.replace(/;/g, ",");
    variant_name = variant_name.replace(/;/g, ",");
    frequency = frequency.replace(/;/g, ",");
    strand= strand.replace(/;/g, ",");
    exon = exon.replace(/;/g, ",");
    transcript = transcript.replace(/;/g, ",");
    coding = coding.replace(/;/g, ",");
    amino_acid_change = amino_acid_change.replace(/;/g, ",");
    variant_effect = variant_effect.replace(/;/g, ",");
    phylop = phylop.replace(/;/g, ",");
    sift = sift.replace(/;/g, ",");
    grantham = grantham.replace(/;/g, ",");
    polyphen = polyphen.replace(/;/g, ",");
    fathmm = fathmm.replace(/;/g, ",");
    pfam = pfam.replace(/;/g, ",");
    dbsnp = dbsnp.replace(/;/g, ",");
    dgv = dgv.replace(/;/g, ",");
    maf = maf.replace(/;/g, ",");
    emaf = emaf.replace(/;/g, ",");
    amaf = amaf.replace(/;/g, ",");
    gmaf = gmaf.replace(/;/g, ",");
    ucsc_common_snps = ucsc_common_snps.replace(/;/g, ",");
    exac_laf = exac_laf.replace(/;/g, ",");
    exac_eaaf = exac_eaaf.replace(/;/g, ",");
    exac_gaf = exac_gaf.replace(/;/g, ",");
    cosmic = cosmic.replace(/;/g, ",");
    omim = omim.replace(/;/g, ",");
    gene_ontology = gene_ontology.replace(/;/g, ",");
    drugbank = drugbank.replace(/;/g, ",");    
    clinvar = clinvar.replace(/;/g, ",");
    allele_coverage = allele_coverage.replace(/;/g, ",");
    allele_ratio = allele_ratio.replace(/;/g, ",");

    ref_ref_var_var = ref_ref_var_var.replace(/;/g, ",");
    krgdb_622_lukemia = krgdb_622_lukemia.replace(/;/g, ",");
    krgdb_1100_leukemia = krgdb_1100_leukemia.replace(/;/g, ",");
     */

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
      const result = await request.query(sql2)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

exports.inputdb = ( 
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
		   loc1, loc2,loc3,loc4,loc5,loc6,loc7, testedID ) => {
          console.log('inputdb: ', locus);

    const result = messageHandler(locus,genotype,filter,ref,observed_allele,
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

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}