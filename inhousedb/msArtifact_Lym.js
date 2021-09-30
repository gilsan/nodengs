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

async function delData() {

  await poolConnect;
  
  const sql2 =`
    delete from artifacts 
    where type = 'LYM'
  `; 

  logger.info('[77][artifacts]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); /*, (err, recordset) => {
    if (err)
    {
         console.log("err=", err.message);  
    }
    console.log("recordset=", recordset);

    result = recordset;
  });*/
  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][artifacts]del err=' + err.message);
  } 
}

var tsvData = '../inhouseupload/Lym_Artifact.txt';
var rowCount = 0;
var type = 'LYM';

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);

  if (rowCount >= 0) {

      var genes = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[84][artifacts]genes=' + genes);

      var location = ""; 
      logger.info('[87][artifacts]location=' + location);

      var temp_data = nvl(row[3].replace( /"/gi, ''), "");
      var transcript = findChar(temp_data);        
      logger.info('[91][artifacts]transcript=' + transcript);

      temp_data = nvl(row[2].replace( /"/gi, ''), "");
      var exon = findChar(temp_data);
      logger.info('[95][artifacts]exon=' + exon);

      temp_data = nvl(row[4].replace( /"/gi, ''), "");
      var coding = findChar(temp_data);      
      logger.info('[99][artifacts]coding=' + coding);

      temp_data = nvl(row[5].replace( /"/gi, ''), "");
      var amino_acid_change = findChar(temp_data);     
      logger.info('[103][artifacts]amino_acid_change=' + amino_acid_change);
            
      const sql =`insert_Artifacts_Type` ;

      try {
          
          const request = pool.request()
            .input('genes', mssql.VarChar, genes)
            .input('location', mssql.NVarChar, location)  
            .input('transcript', mssql.VarChar, transcript)  
            .input('exon', mssql.VarChar, exon)
            .input('coding', mssql.VarChar, coding)  
            .input('amino_acid_change', mssql.VarChar, amino_acid_change)  
            .input('type2', mssql.VarChar, type)  
            .output('TOTALCNT', mssql.int, 0);
          
        let result =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[artifacts]err message=" + err.message);
            }

            console.log("[175][artifacts]recordset="+ recordset);
            console.log("[176][artifacts]returnValue="+ returnValue);

            result = returnValue;
            console.log("[179]result=" + JSON.stringify(result));
          }); 

          console.log("result=", result);

    } catch(err) {
        logger.error('[185][artifacts]err=' + err.message);
    }  
  } 
});// end of if loop