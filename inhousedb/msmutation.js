const Excel = require('exceljs');
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const workbook = new Excel.Workbook();  
const fs = require('fs');

// 특수문자찿기 변경하기
function findChar(findChar) {
    const check = findChar.toString().indexOf(',');
    let result = '';
	if(check === -1) {
		result = findChar;
	} else {
        result = findChar.replace( /,/gi, '\,');
	}

	return result;
}

workbook.xlsx.readFile('../inhouseupload/mutation2.xlsx').then( async (workbook) =>{
  
  const worksheet = workbook.getWorksheet('Sheet1');
  worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
		  
     if (rowNumber > 1) {             
          if(row.values[1] === undefined){
               buccal = '';
          } else {
               buccal = row.values[1];
          }

          logger.info('[37][msmutation]buccal=' + buccal);

          if(row.values[2] === undefined){
               patient_name = '';
          } else {					 
               patient_name = row.values[2];  
          }
          logger.info('[44][msmutation]patient_name=' + patient_name);

          if(row.values[3] === undefined){
               register_number = '';
          } else {
               register_number = findChar(row.values[3]);
          }
          logger.info('[51][msmutation]register_number=' + register_number);

          if(row.values[4] === undefined){
               fusion = '';
          } else {
               fusion = findChar(row.values[4]);
          }
          logger.info('[57][msmutation]fusion='+ fusion);
               
          if(row.values[5] === undefined){
               gene = '';
          } else {
               gene = findChar(row.values[5]);
          }
          logger.info('[65][msmutation]gene=' + gene);

          if(row.values[6] === undefined){
               functional_impact = '';
          } else {			   
               functional_impact = findChar(row.values[6]);                  
          }
          logger.info('[72][msmutation]functional_impact=' + functional_impact);
               
          if(row.values[7] === undefined){
               transcript = '';
          } else {
               transcript = findChar(row.values[7]);
          }
          logger.info('[79][msmutation]transcript=' + transcript);

          if(row.values[8] === undefined){
               exon_intro = '';
          } else {
               exon_intro = findChar(row.values[8]);
          }
          logger.info('[86][msmutation]exon_intro=' + exon_intro);

          if(row.values[9] === undefined){
               nucleotide_change = '';
          } else {
               nucleotide_change = findChar(row.values[9]);
          }
          logger.info('[93][msmutation]nucleotide_change=' + nucleotide_change);

          if(row.values[10] === undefined){
               amino_acid_change = '';
          } else {
               amino_acid_change = findChar(row.values[10]);
          }
          logger.info('[100][msmutation]amino_acid_change=' + amino_acid_change);

          if(row.values[11] === undefined){
               zygosity = '';
          } else {
               zygosity = findChar(row.values[11]);
          }
          logger.info('[107][msmutation]zygosity=' + zygosity);

          if(row.values[12] === undefined){
               vaf = '';
          } else {
               vaf = findChar(row.values[12]);
          }
          logger.info('[114][msmutation]vaf=' + vaf);

          if(row.values[13] === undefined){
               reference = '';
          } else {
               reference = findChar(row.values[13]);
          }
          logger.info('[121][msmutation]reference=' + reference);

          if(row.values[14] === undefined){
               cosmic_id = '';
          } else {
               cosmic_id = findChar(row.values[14]);
          }
          logger.info('[128][msmutation]cosmic_id=' + cosmic_id);

          if(row.values[15] === undefined){
               sift_polyphen_mutation_taster = '';
          } else {
               sift_polyphen_mutation_taster = findChar(row.values[15]);
          }
          logger.info('[135][msmutation]sift_polyphen_mutation_taster=' + sift_polyphen_mutation_taster);

          if(row.values[16] === undefined){
               buccal2 = '';
          } else {
               buccal2 = findChar(row.values[16]);
          }
          logger.info('[142][msmutation]buccal2=' + buccal2);
          
          const sql =`
                    insert into mutation (
                    patient_name,
                    register_number,
                    fusion,
                    gene,
                    functional_impact,
                    transcript,
                    exon_intro,
                    nucleotide_change,
                    amino_acid_change,
                    zygosity,
                    vaf,
                    reference,
                    cosmic_id,
                    sift_polyphen_mutation_taster,
                    buccal2
                    ) 
                    values (
               
                    @patient_name,
                    @register_number,
                    @fusion,
                    @gene,
                    @functional_impact,
                    @transcript,
                    @exon_intro,
                    @nucleotide_change,
                    @amino_acid_change,
                    @zygosity,
                    @vaf,
                    @reference,
                    @cosmic_id,
                    @sift_polyphen_mutation_taster,
                    @buccal2                       
                    );
               ` 

               logger.info('[86][msmutation]sql=' + sql);

               try {
                         
                    const request = pool.request()
                    .input('patient_name', mssql.VarChar, patient_name)  
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
                    .input('buccal2', mssql.VarChar, buccal2);
                    
                    //let result =  '';
                    const result = request.query(sql); /*, (err, recordset) => {
                         if (err)
                         {
                              console.log("err=", err.message);  
                         }
                         console.log("recordset=", recordset);

                         result = recordset;
                    });*/
                    result.then(data => {
                    console.dir(data);
                    }).catch( err => console.log(err))
               
                    console.log("result=", result);

               }   
               catch(err) {
                 console.error('SQL error', err);
               }  
                    
          } // end of if loop
               
     });	
});


