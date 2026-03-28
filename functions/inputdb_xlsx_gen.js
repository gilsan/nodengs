// select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv
//  select  id, locus, locations, variant_effect, gmaf, phred_qual_score, type,info, krgdb_622_lukemia, krgdb_1100_leukemia from filtered_raw_tsv where type != 'REF' and info != 'HS'
//  select   count(*) as cnt from filtered_raw_tsv where type != 'REF' and info != 'HS' 
const mssql = require('mssql');
const logger  = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandlerTsv_del = async (testedID) => {

    await poolConnect; // ensures that the pool has been created

    const sql_del =`delete from filtered_raw_tsv where testedID = @testedID`;

    logger.info("[18][inputdb_xlsx_gen del][tsv_del]", sql_del);
    logger.info("[18][inputdb_xlsx_gen del][testedId]", testedID);

    try {
        const request = pool.request()
            .input('testedID', mssql.VarChar, testedID); 

            const result = await request.query(sql_del);
        console.dir( result);
        
        //return result;
    } catch (err) {
        logger.error('[29][inputdb_xlsx_gen]SQL error', err);
    }
}

exports.inputTsv_db_del = ( testedID ) => {
   console.log('testedID: ', testedID);
   logger.info("[38][inputdb_xlsx_gen tsv del][testedId]", testedID);

const result = messageHandlerTsv_del(testedID);
result.then(data => {

console.log(data);
// res.json(data);
})
.catch( err  => console.log(err));

}


const  messageHandler_del = async (testedID) => {

    await poolConnect; // ensures that the pool has been created

    const sql_del =`delete from report_detected_variants where specimenNo = @testedID`;

    logger.info("[57][inputdb_xlsx_gen del][sql_del]" + sql_del);
    logger.info("[57][inputdb_xlsx_gen del][testedId]" + testedID);

    try {
        const request = pool.request()
            .input('testedID', mssql.VarChar, testedID); 

            const result = await request.query(sql_del);
        console.dir( result);
        
        //return result;
    } catch (err) {
        logger.error('[65][inputdb_xlsx_gen del]SQL error=' + error.message);
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
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change , zygosity,
    GnomAD_AF,   testedID, i	) => {

  await poolConnect; // ensures that the pool has been created

    logger.info ('[56][inputdb_xlsx_gen]genes=' + genes + ', exon=' + exon  + ', functional_impact=' + functional_impact);
    logger.info ('[56][inputdb_xlsx_gen]transcript=' + transcript + ', coding=' + coding + ', amino_acid_change=' + amino_acid_change );
    logger.info ('[56][inputdb_xlsx_gen]GnomAD_AF=' + GnomAD_AF + 'zygosity=' + zygosity );
    logger.info ('[56][inputdb_xlsx_gen]testedID=' + testedID );

    let functional_code = i;

    if (i < 10) {
      functional_code = '0' + i;
    }
    
     //insert Query 생성;
    const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
        transcript, functional_impact, exon, nucleotide_change, amino_acid_change, zygosity, 
        gnomADEAS, functional_code, saveyn) 
        values(@testedID, getdate(),  @genes,
        @transcript, @functional_impact, @exon, @coding, @amino_acid_change, @zygosity, 
        @gnomADEAS, @functional_code, 'T')`;
    
    logger.info('[72][inputdb_gen][insert detected_variants]sql=' + qry);

    try {
        const request = pool.request()
        .input('testedID', mssql.VarChar, testedID)
        .input('genes', mssql.VarChar, genes)
        .input('functional_code', mssql.VarChar, functional_code)
        .input('functional_impact', mssql.VarChar, functional_impact)
        .input('transcript', mssql.VarChar, transcript)
        .input('exon', mssql.VarChar, exon)
        .input('coding', mssql.VarChar, coding)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change)
        .input('zygosity', mssql.VarChar, zygosity)
        .input('gnomADEAS', mssql.VarChar, GnomAD_AF);
        
        result = await request.query(qry);         
            console.dir( result);
        
        return result;
    } catch (err) {
        console.error('SQL error', err);
        logger.error ('[95][inputdb_xlsx_gen]err=' + err.message);
    }
}

exports.inputdb_xlsx = ( 
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change , zygosity,
    GnomAD_AF,  testedID, i	 ) => {

    console.log('inputdb_xlsx: ', genes);
    logger.info ('[95][inputdb_xlsx_gen]genes=' + genes);
    logger.info ('[95][inputdb_xlsx_gen]functional_impact=' + functional_impact);

    const result = messageHandler(
        genes,   functional_impact, transcript,  exon,
        coding,  amino_acid_change , zygosity,
        GnomAD_AF,   testedID, i	);
    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}

// 25.10.24 vaf references cosmic_id 추가
const  messageHandler2 = async (
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change , zygosity,
    vaf,  references, cosmic,   testedID, i	) => {

  await poolConnect; // ensures that the pool has been created

    logger.info ('[56][inputdb_xlsx_gen]genes=' + genes + ', exon=' + exon  + ', functional_impact=' + functional_impact);
    logger.info ('[56][inputdb_xlsx_gen]transcript=' + transcript + ', coding=' + coding + ', amino_acid_change=' + amino_acid_change );
    logger.info ('[56][inputdb_xlsx_gen]cosmic=' + cosmic + ', vaf=' + vaf + ', references=' + references);
    logger.info ('[56][inputdb_xlsx_gen]zygosity=' + zygosity +  ', testedID=' + testedID );

    let functional_code = i;

    if (i < 10) {
      functional_code = '0' + i;
    }
    
     //insert Query 생성;
    const qry = `insert into report_detected_variants (specimenNo, report_date, gene, 
        transcript, functional_impact, exon, nucleotide_change, amino_acid_change, zygosity, 
        vaf, reference, cosmic_id, functional_code, saveyn) 
        values(@testedID, getdate(),  @genes,
        @transcript, @functional_impact, @exon, @coding, @amino_acid_change, @zygosity, 
        @vaf, @references, @cosmic, @functional_code, 'T')`;
    
    logger.info('[72][inputdb_xlsx_gen][insert detected_variants]sql=' + qry);

    try {
        const request = pool.request()
        .input('testedID', mssql.VarChar, testedID)
        .input('genes', mssql.VarChar, genes)
        .input('functional_code', mssql.VarChar, functional_code)
        .input('functional_impact', mssql.VarChar, functional_impact)
        .input('transcript', mssql.VarChar, transcript)
        .input('exon', mssql.VarChar, exon)
        .input('coding', mssql.VarChar, coding)
        .input('amino_acid_change', mssql.VarChar, amino_acid_change)
        .input('zygosity', mssql.VarChar, zygosity)
        .input('vaf', mssql.VarChar, vaf)
        .input('references', mssql.VarChar, references)
        .input('cosmic', mssql.VarChar, cosmic);
        
        result = await request.query(qry);         
            console.dir( result);
        
        return result;
    } catch (err) {
        console.error('SQL error', err);
        logger.error ('[95][inputdb_xlsx_gen]err=' + err.message);
    }
}

// 25.10.24 vaf references cosmic_id 추가
exports.inputdb_xlsx_gen = ( 
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change , zygosity,
    vaf,  references, cosmic,   testedID, i	 ) => {
          console.log('inputdb_xlsx_gen: ', genes);

    const result = messageHandler2(
        genes,   functional_impact, transcript,  exon,
        coding,  amino_acid_change , zygosity,
        vaf,  references, cosmic,   testedID, i	);
    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}

// vus message 환자 정보에 저장
const put_vus_message_handler = async (patientID, vusmsg) => {
            await poolConnect;
            logger.info ('[123]][inputdb_xlsx_gen inputdb_vus_메세지] ======> ' + patientID  +  '   '  + vusmsg);

        // 환자정보에 vus 내용 저장;
        const query =`update patientinfo_diag set vusmsg=@vusmsg where patientID=@patientID`;
        logger.info ('[127]][inputdb_xlsx_gen inputdb_vus_query] ======> ' + query);
        try {
            const request = pool.request()
                            .input('vusmsg', mssql.NVarChar, vusmsg)
                            .input('patientID', mssql.VarChar, patientID);
            result = await request.query(query); 
            return result;
        } catch (err) {
            console.error('[135][inputdb_xlsx_gen put_vus_message_handler] SQL error', err);
        }
 
}

exports.input_vusmsg_xlsx =  (patientID, vusmsg) => {

    const result = put_vus_message_handler(patientID, vusmsg)
         result.then(data => {
            console.log(data);
         })
         .catch( err  => console.log(err));
    
}


const  messageHandler_tsv = async (
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change ,
    vaf,  references,  cosmic,   zygosity,
     testedID) => {

  await poolConnect; // ensures that the pool has been created
    
  logger.info ('[56][inputdb_xlsx_gen_tsv]genes=' + genes + ', exon=' + exon  + ', functional_impact=' + functional_impact  );
  logger.info ('[56][inputdb_xlsx_gen_tsv]transcript=' + transcript + ', coding=' + coding + ', amino_acid_change=' + amino_acid_change );
  logger.info ('[56][inputdb_xlsx_gen_tsv]vaf=' + vaf + ', references=' + references + ', cosmic=' + cosmic );
  logger.info ('[56][inputdb_xlsx_gen_tsv]zygosity=' + zygosity + ',testedID=' + testedID );


  const sql2 =`insert into filtered_raw_tsv ( 
    genes,  exon, frequency, clinvar, zygosity, cosmic, reference,
     transcript, coding, amino_acid_change,  testedID ) 
    values ( 
     @genes,  @exon, @frequency, @clinvar, @zygosity,  @cosmic, @references,
    @transcript, @coding, @amino_acid_change,  @testedID)`;

  try {
      const request = pool.request()
      .input('testedID', mssql.VarChar, testedID)
      .input('genes', mssql.VarChar, genes)
      .input('transcript', mssql.VarChar, transcript)
      .input('exon', mssql.VarChar, exon)
      .input('coding', mssql.VarChar, coding)
      .input('frequency', mssql.VarChar, vaf)
      .input('zygosity', mssql.VarChar, zygosity)
      .input('clinvar', mssql.VarChar, functional_impact)
      .input('cosmic', mssql.VarChar, cosmic)
      .input('references', mssql.VarChar, references)
      .input('amino_acid_change', mssql.VarChar, amino_acid_change);

      const result = await request.query(sql2)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
      logger.error ('[244][inputdb_xlsx_gen]err=' + err.message);
  }
}

exports.inputdb_tsv = ( 
    genes,   functional_impact, transcript,  exon,
    coding,  amino_acid_change , 
    vaf,  references,  cosmic,   zygosity,
    testedID ) => {
          // console.log('inputdb: ======>', locus);
          console.log('[253][inputdb_xlsx_gen][genes][tracing]===> ', genes);
          logger.info('[255][inputdb_xlsx_gen ]testedID=' + testedID);	

    const result = messageHandler_tsv(
        genes,   functional_impact, transcript,  exon,
        coding,  amino_acid_change ,  
        vaf,  references,  cosmic,   zygosity,
        testedID);
    result.then(data => {

       console.log(data);
      // res.json(data);
  })
  .catch( err  => console.log(err));
    
}