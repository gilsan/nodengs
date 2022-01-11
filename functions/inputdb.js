// select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv
//  select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv where type != 'REF' and info != 'HS'
//  select   count(*) as cnt from filtered_raw_tsv where type != 'REF' and info != 'HS' 
const mssql = require('mssql');
const logger             = require('../common/winston');


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
            .input('testedID', mssql.VarChar, testedID); 

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
    loc1, loc2,loc3,loc4,loc5,loc6,loc7, zygosity, testedID) => {

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

    logger.info ('[244][inputdb]locus=' + locus + ', genotype=' + genotype + ', filter= ' + filter );
    logger.info ('[244][inputdb]ref=' + ref + ', observed_allele=' + observed_allele  );
    logger.info ('[244][inputdb]type =' + type + ', no_call_reason=' + no_call_reason + ', genes=' + genes );
    logger.info ('[244][inputdb]locations=' + locations + ', length=' + length);
    logger.info ('[244][inputdb]info=' + info + ', variant_id=' + variant_id + ', variant_name=' + variant_name );
    logger.info ('[244][inputdb]frequency=' + frequency + ', strand=' + strand + ', exon=' + exon );
    logger.info ('[244][inputdb]transcript=' + transcript + ', coding=' + coding + ', amino_acid_change=' + amino_acid_change );
    logger.info ('[244][inputdb]variant_effect=' + variant_effect + ', phylop=' + phylop );
    logger.info ('[244][inputdb]sift=' + sift + ', grantham=' + grantham + ', polyphen=' + polyphen + ', fathmm=' + fathmm + ', pfam=' + pfam );
    logger.info ('[244][inputdb]dbsnp=' + dbsnp + ', dgv=' + dgv + ', maf=' + maf + ', emaf=' + emaf + ', amaf=' + amaf );
    logger.info ('[244][inputdb]gmaf=' + gmaf + ', ucsc_common_snps=' + ucsc_common_snps );
    logger.info ('[244][inputdb]exac_laf=' + exac_laf + ', exac_eaaf=' + exac_eaaf + ', exac_oaf=' + exac_oaf );
    logger.info ('[244][inputdb]exac_efaf=' + exac_efaf + ', exac_saaf=' + exac_saaf + ', exac_enfaf=' +exac_enfaf );
    logger.info ('[244][inputdb]exac_aaf=' + exac_aaf + ', exac_gaf=' + exac_gaf );
    logger.info ('[244][inputdb]cosmic=' + cosmic + ', omim=' + omim + ', gene_ontology=' + gene_ontology );
    logger.info ('[244][inputdb]drugbank=' + drugbank + ', clinvar=' + clinvar );
    logger.info ('[244][inputdb]allele_coverage=' + allele_coverage + ', allele_ratio=' + allele_ratio );
    logger.info ('[244][inputdb]p_value=' + p_value + ', phred_qual_score=' + phred_qual_score );
    logger.info ('[244][inputdb]ref_ref_var_var=' + ref_ref_var_var + ', homopolymer_length=' + homopolymer_length + ', subset_of=' + subset_of );
    logger.info ('[244][inputdb]krgdb_622_lukemia=' + krgdb_622_lukemia + ', krgdb_1100_leukemia=' + krgdb_1100_leukemia + ', filename=' + filename );
    logger.info ('[244][inputdb]loc1=' + loc1 + ', loc2=' + loc2 + ', loc3=' + loc3 + ', loc4=' + loc4);
    logger.info ('[244][inputdb]loc5=' + loc5 + ', loc6=' + loc6 + ', loc7=' + loc7 + ', zygosity=' + zygosity +  ', testedID=' + testedID );
    

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
     loc1, loc2, loc3, loc4, loc5, loc6, loc7, zygosity, testedID ) 
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
    @loc1, @loc2, @loc3, @loc4, @loc5, @loc6, @loc7, @zygosity, @testedID)`;

  try {
      const request = pool.request()
        .input('locus', mssql.VarChar, locus) 
        .input('genotype', mssql.VarChar, genotype) 
        .input('filter', mssql.VarChar, filter) 
        .input('ref', mssql.VarChar, ref) 
        .input('observed_allele', mssql.VarChar, observed_allele) 
        .input('type', mssql.VarChar, type) 
        .input('no_call_reason', mssql.VarChar, no_call_reason) 
        .input('genes', mssql.VarChar, genes) 
        .input('locations', mssql.VarChar, locations) 
        .input('length', mssql.VarChar, length) 
        .input('info', mssql.VarChar, info) 
        .input('variant_id', mssql.VarChar, variant_id) 
        .input('variant_name', mssql.VarChar, variant_name) 
        .input('frequency', mssql.VarChar, frequency) 
        .input('strand', mssql.VarChar, strand) 
        .input('exon', mssql.VarChar, exon) 
        .input('transcript', mssql.VarChar, transcript) 
        .input('coding', mssql.VarChar, coding) 
        .input('amino_acid_change', mssql.VarChar, amino_acid_change) 
        .input('variant_effect', mssql.VarChar, variant_effect) 
        .input('phylop', mssql.VarChar, phylop) 
        .input('sift', mssql.VarChar, sift) 
        .input('grantham', mssql.VarChar, grantham) 
        .input('polyphen', mssql.VarChar, polyphen) 
        .input('fathmm', mssql.VarChar, fathmm) 
        .input('pfam', mssql.VarChar, pfam) 
        .input('dbsnp', mssql.VarChar, dbsnp) 
        .input('dgv', mssql.VarChar, dgv) 
        .input('maf', mssql.VarChar, maf) 
        .input('emaf', mssql.VarChar, emaf) 
        .input('amaf', mssql.VarChar, amaf) 
        .input('gmaf', mssql.VarChar, gmaf) 
        .input('ucsc_common_snps', mssql.VarChar, ucsc_common_snps) 
        .input('exac_laf', mssql.VarChar, exac_laf) 
        .input('exac_eaaf', mssql.VarChar, exac_eaaf) 
        .input('exac_oaf', mssql.VarChar, exac_oaf) 
        .input('exac_efaf', mssql.VarChar, exac_efaf) 
        .input('exac_saaf', mssql.VarChar, exac_saaf) 
        .input('exac_enfaf', mssql.VarChar, exac_enfaf) 
        .input('exac_aaf', mssql.VarChar, exac_aaf) 
        .input('exac_gaf', mssql.VarChar, exac_gaf) 
        .input('cosmic', mssql.VarChar, cosmic) 
        .input('omim', mssql.VarChar, omim) 
        .input('gene_ontology', mssql.VarChar, gene_ontology) 
        .input('drugbank', mssql.VarChar, drugbank) 
        .input('clinvar', mssql.VarChar, clinvar) 
        .input('allele_coverage', mssql.VarChar, allele_coverage) 
        .input('allele_ratio', mssql.VarChar, allele_ratio) 
        .input('p_value', mssql.VarChar, p_value) 
        .input('phred_qual_score', mssql.VarChar, phred_qual_score) 
        .input('coverage', mssql.VarChar, coverage) 
        .input('ref_ref_var_var', mssql.VarChar, ref_ref_var_var) 
        .input('homopolymer_length', mssql.VarChar, homopolymer_length) 
        .input('subset_of', mssql.VarChar, subset_of) 
        .input('krgdb_622_lukemia', mssql.VarChar, krgdb_622_lukemia) 
        .input('krgdb_1100_leukemia', mssql.VarChar, krgdb_1100_leukemia) 
        .input('filename', mssql.VarChar, filename) 
        .input('loc1', mssql.VarChar, loc1) 
        .input('loc2', mssql.VarChar, loc2) 
        .input('loc3', mssql.VarChar, loc3) 
        .input('loc4', mssql.VarChar, loc4) 
        .input('loc5', mssql.VarChar, loc5) 
        .input('loc6', mssql.VarChar, loc6) 
        .input('loc7', mssql.VarChar, loc7) 
        .input('zygosity', mssql.VarChar, zygosity) 
        .input('testedID', mssql.VarChar, testedID); 
      const result = await request.query(sql2)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
      logger.error ('[244][inputdb]err=' + err.message);
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
		   loc1, loc2,loc3,loc4,loc5,loc6,loc7, zygosity, testedID ) => {
          console.log('inputdb: ', locus);

          logger.info('[255][inputdb ]testedID=' + testedID);
	

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
        loc1, loc2,loc3,loc4,loc5,loc6,loc7, zygosity, testedID);
    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}