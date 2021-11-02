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
    delete from path_testcode 
  `; 

  logger.info('[77][path_testcode]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); 

  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][path_testcode]del err=' + err.message);
  } 
}

var tsvData = '../inhouseupload/path_testcode.txt';
var rowCount = 0;

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

      var test_code = nvl(row[0].replace( /"/gi, ''), "");
      logger.info('[84][path_testcode]test_code=' + test_code);

      var report_title = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[87][path_testcode]report_title=' + report_title);
            
      const sql =`insert_path_testcode` ;

      try {
          
          const request = pool.request()
            .input('test_code', mssql.VarChar, test_code)
            .input('report_title', mssql.NVarChar, report_title) 
            .output('TOTALCNT', mssql.int, 0);
          
        let result =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[path_testcode]err message=" + err.message);
            }

            console.log("[175][path_testcode]recordset="+ recordset);
            console.log("[176][path_testcode]returnValue="+ returnValue);

            result = returnValue;
            console.log("[179[path_testcode]]result=" + JSON.stringify(result));
          }); 

          console.log("result=", result);

    } catch(err) {
        logger.error('[185][path_testcode]err=' + err.message);
    }  
  } 
});// end of if loop