const fs = require('fs');
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

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
  s = s.replace(/:/g, ";");
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
    delete from essentialDNAMent 
  `; 

  logger.info('[77][path_essential]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); 

  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][path_essential]del err=' + err.message);
  } 
}

var tsvData = '../inhouseupload/path_essential.txt';
var rowCount = 0;

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

      var title = nvl(row[0].replace( /"/gi, ''), "");
      logger.info('[84][path_essential]title=' + title);

      var mutation = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[87][path_essential]mutation=' + mutation);

      var amplification = nvl(row[2].replace( /"/gi, ''), "");
      logger.info('[87][path_essential]amplification=' + amplification);

      var fusion = nvl(row[3].replace( /"/gi, ''), "");
      logger.info('[87][path_essential]fusion=' + fusion);
            
      const sql =`insert_path_essential` ;

      try {
          
          const request = pool.request()
            .input('title', mssql.VarChar, title)
            .input('mutation', mssql.NVarChar, mutation) 
            .input('amplification', mssql.NVarChar, amplification) 
            .input('fusion', mssql.NVarChar, fusion) 
            .output('TOTALCNT', mssql.int, 0);
          
        let result =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[path_essential]err message=" + err.message);
            }

            console.log("[175][path_essential]recordset="+ recordset);
            console.log("[176][path_essential]returnValue="+ returnValue);

            result = returnValue;
            console.log("[179[path_essential]]result=" + JSON.stringify(result));
          }); 

          console.log("result=", result);

    } catch(err) {
        logger.error('[185][path_essential]err=' + err.message);
    }  
  } 
});// end of if loop