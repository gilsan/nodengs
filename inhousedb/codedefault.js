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
    delete from codedefaultvalue 
  `; 

  logger.info('[77][codedefault]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); 
  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][codedefault]del err=' + err.message);
  } 
}

var tsvData = '../inhouseupload/codedefault.txt';
var rowCount = 0;

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await poolConnect;
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

    // 	code	report	target	specimen	analyzedgene	method	comment1	comment2

      var report_type = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[84][codedefault]report_type=' + report_type);

      var code = nvl(row[2].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][seq]=' + code);

      var report =nvl(row[3].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][site]=' + report);

      var target = nvl(row[4].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][target]=' + target);

      specimen = nvl(row[5].replace( /"/gi, ''), "");
      logger.info('[84][codedefault]specimen=' + specimen);

      var analyzedgene = nvl(row[6].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][analyzedgene]=' + analyzedgene);

      var method =nvl(row[7].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][method]=' + method);

      var comment1 = nvl(row[8].replace( /"/gi, ''), "");   
      logger.info('[87][codedefault][comment1]=' + comment1);

      var comment2 = nvl(row[9].replace( /"/gi, ''), "");
      logger.info('[87][codedefault][comment2]=' + comment2);
            
      const sql =`insert_codedefault` ;

      try {
          
          const request = pool.request()
            .input('report_type', mssql.VarChar, report_type)
            .input('code', mssql.VarChar, code)  
            .input('report', mssql.NVarChar, report)  
            .input('target', mssql.VarChar, target)  
            .input('specimen', mssql.VarChar, specimen)  
            .input('analyzedgene', mssql.VarChar, analyzedgene) 
            .input('method', mssql.VarChar, method)   
            .input('comment1', mssql.NVarChar, comment1)   
            .input('comment2', mssql.NVarChar, comment2)  
            .output('TOTALCNT', mssql.int, 0);
          
        let result2 =  '';
        await request.execute(sql, (err, recordset, returnValue) => {
            if (err)
            {
              console.log ("172[codedefault]err message=" + err.message);
            }

            console.log("[175][codedefault]recordset="+ recordset);
            console.log("[176][codedefault]returnValue="+ returnValue);

            result3 = returnValue;
            console.log("[179]result=" + JSON.stringify(result3));
          }); 

          console.log("result=", result2);

    } catch(err) {
        logger.error('[185][codedefault]err=' + err.message);
    }  
  } 
});// end of if loop