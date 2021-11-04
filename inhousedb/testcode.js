const fs = require('fs');
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// 특수문자찿기 변경하기
function findChar(findChar) {
  const check = findChar.toString().indexOf('"');
  let result4 = '';

	if(check === -1) {
		result4 = findChar;
	} else {
        result4 = findChar.replace( /"/gi, '');
	}

	return result4;
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
  s = s.replace(/"/g, " ").replace( "\r", '');
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
    delete from testcodelists 
  `; 

  logger.info('[77][testcodelists]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); 
  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][testcodelists]del err=' + err.message);
  } 
}

var tsvData = '../inhouseupload/testcode.txt';
var rowCount = 0;

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

    // 	code	report	type
      var code = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[87][testcodelists][seq]=' + code);

      var report =nvl(row[2].replace( /"/gi, ''), "");
      logger.info('[87][testcodelists][site]=' + report);
    
      var report_type = nvl(row[3].replace( /"/gi, ''), "");
      logger.info('[84][testcodelists]report_type=' + report_type);

            
      const sql =`insert_testcodelists` ;

      try {
          
          const request = pool.request()
            .input('report_type', mssql.VarChar, report_type)
            .input('code', mssql.VarChar, code)  
            .input('report', mssql.NVarChar, report) 
            .output('TOTALCNT', mssql.int, 0);
          
        let result2 =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[testcodelists]err message=" + err.message);
            }

            console.log("[175][testcodelists]recordset="+ recordset);
            console.log("[176][testcodelists]returnValue="+ returnValue);

            result3 = returnValue;
            console.log("[179]result=" + JSON.stringify(result3));
          }); 

          console.log("result=", result2);

    } catch(err) {
        logger.error('[185][testcodelists]err=' + err.message);
    }  
  } 
});// end of if loop