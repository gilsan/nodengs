const fs = require('fs');
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

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

   
/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
function nvl(st, defaultStr){
    
  //console.log('st=', st);
  if(st === undefined || st == null || st == "") {
      st = defaultStr ;
  }
      
  return st ;
}

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

var tsvData = '../inhouseupload/mutation.txt';
var rowCount = 0;

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

      var buccal = nvl(row[0], "");
      logger.info('[84][msmutation2]buccal=' + buccal);

      var patient_name = nvl(row[1], "");
      logger.info('[87][msmutation2]patient_name=' + patient_name);

      var temp_data = nvl(row[2], "");
      var register_number = findChar(temp_data);        
      logger.info('[91][msmutation2]register_number=' + register_number);

      temp_data = nvl(row[3], "");
      var fusion = findChar(temp_data);
      logger.info('[95][msmutation2]fusion=' + fusion);

      temp_data = nvl(row[4], "");
      var gene = findChar(temp_data);      
      logger.info('[99][msmutation2]gene=' + gene);

      temp_data = nvl(row[5], "");
      var functional_impact = findChar(temp_data);     
      logger.info('[103][msmutation2]functional_impact=' + functional_impact);
     
      temp_data = nvl(row[6], "");
      var transcript = findChar(temp_data);      
      logger.info('[107][msmutation2]transcript=' + transcript);

      temp_data = nvl(row[7], "");
      var exon_intro = findChar(temp_data);      
      logger.info('[111][msmutation2]exon_intro=' + exon_intro);

      temp_data = nvl(row[8], "");
      var nucleotide_change = findChar(temp_data);
      logger.info('[115][msmutation2]nucleotide_change=' + nucleotide_change);

      temp_data = nvl(row[9], "");
      var amino_acid_change = findChar(temp_data);      
      logger.info('[119][msmutation2]amino_acid_change=' + amino_acid_change);

      temp_data = nvl(row[10], "");
      var zygosity = findChar(temp_data);
      logger.info('[123][msmutation2]zygosity=' + zygosity);

      temp_data = nvl(row[11], "");
      var vaf = findChar(temp_data);
      logger.info('[127][msmutation2]vaf=' + vaf);

      temp_data = nvl(row[12], "");
      var reference = findChar(temp_data);
      logger.info('[131][msmutation2]reference=' + reference);

      temp_data = nvl(row[13], "");
      var cosmic_id = findChar(temp_data);
      logger.info('[135][msmutation2]cosmic_id=' + cosmic_id);

      temp_data = nvl(row[14], "");
      var sift_polyphen_mutation_taster = findChar(temp_data);
      logger.info('[139][msmutation2]sift_polyphen_mutation_taster=' + sift_polyphen_mutation_taster);

      temp_data = nvl(row[15], "");
      var buccal2 = findChar(temp_data);
      logger.info('[142][msmutation2]buccal2=' + buccal2);
            
      const sql =`insert_mutation` ;

      try {
          
          const request = pool.request()
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
            .output('TOTALCNT', mssql.int, 0);
          
        let result =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[mutation]err message=" + err.message);
            }

            console.log("[175][mutation]recordset="+ recordset);
            console.log("[176][mutation]returnValue="+ returnValue);

            result = returnValue;
            console.log("[179]result=" + JSON.stringify(result));
          }); 

          console.log("result=", result);

    } catch(err) {
        logger.error('[185][msmutation2]err=' + err.message);
    }  
  } 
});// end of if loop