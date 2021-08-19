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

    const sql_del =`delete from report_detected_variants where specimenNo = @testedID`;

    logger.info("[28][inputdb_form6 del][sql_del]" + sql_del);
    logger.info("[28][inputdb_form6 del][testedId]" + testedID);

    try {
        const request = pool.request()
            .input('testedID', mssql.VarChar, testedID); 

            const result = await request.query(sql_del);
        console.dir( result);
        
        //return result;
    } catch (err) {
        logger.error('SQL error=' + error.message);
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
   
    genes,  transcript,  exon,
    coding,  amino_acid_change , zygosity,
    cosmic,   testedID, i	) => {

  await poolConnect; // ensures that the pool has been created

    logger.info ('[244][inputdb_form6]genes=' + genes + ', exon=' + exon );
    logger.info ('[244][inputdb_form6]transcript=' + transcript + ', coding=' + coding + ', amino_acid_change=' + amino_acid_change );
    logger.info ('[244][inputdb_form6]cosmic=' + cosmic  );
    logger.info ('[244][inputdb_form6]zygosity=' + zygosity +  ', testedID=' + testedID );

    let functional_code = i;

    if (i < 10) {
      functional_code = '0' + i;
    }
    
     //insert Query 생성;
    const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
        transcript, exon, nucleotide_change, amino_acid_change, zygosity, 
        cosmic_id, functional_code) 
        values(@testedID, getdate(),  @genes,
        @transcript, @exon, @coding, @amino_acid_change, @zygosity, 
        @cosmic, @functional_code)`;
    
    logger.info('[282][inputdb_form6][insert detected_variants]sql=' + qry);

    try {
        const request = pool.request()
        .input('testedID', mssql.VarChar, testedID)
        .input('genes', mssql.VarChar, genes)
        .input('functional_code', mssql.VarChar, functional_code)
        .input('transcript', mssql.VarChar, transcript)
        .input('exon', mssql.VarChar, exon)
        .input('coding', mssql.VarChar, coding)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change)
        .input('zygosity', mssql.VarChar, zygosity)
        .input('cosmic', mssql.VarChar, cosmic);
        
        result = await request.query(qry);         
            console.dir( result);
        
        return result;
    } catch (err) {
        console.error('SQL error', err);
        logger.error ('[244][inputdb_form6]err=' + err.message);
    }
}

exports.inputdb_form6 = ( 
    genes,  transcript,  exon,
    coding,  amino_acid_change , zygosity,
    cosmic,   testedID, i	 ) => {
          console.log('inputdb_form6: ', genes);

    const result = messageHandler(
        genes,  transcript,  exon,
        coding,  amino_acid_change , zygosity,
        cosmic,   testedID, i	);
    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}