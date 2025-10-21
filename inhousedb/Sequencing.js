const fs = require('fs');
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// 특수문자찿기 변경하기
function findChar(findChar) {
  const check = findChar.toString().indexOf('"');
  let result = '';

	if(check === -1) {
		result = findChar;
	} else {
        result = findChar.replace( /"/gi, '');
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
  if(
    st === undefined ||
    st === null ||
    (typeof st === 'string' && st.trim().toUpperCase() === 'NULL') ||
    (typeof st === 'string' && st.trim() === '')
  ) {
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
    delete from sequncing_list 
  `; 

  logger.info('[77][sequncing_list]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); 
  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][sequncing]del err=' + err.message);
  } 
}

async function processData() {
  var tsvData = '../inhouseupload/sequencing.txt';
  var rowCount = 0;

  delData();

  var rowData = loadData(tsvData);

  rowData.forEach ( async (row, index) =>  {

    await poolConnect;
    rowCount++;
    console.log(rowCount);
    if (rowCount >= 0) {

        var report_type = nvl(row[0].replace( /"/gi, ''), "");
        logger.info('[84][sequncing]report_type=' + report_type);

        var temp_data = nvl(row[1].replace( /"/gi, ''), "");
        var method = findChar(temp_data);   
        logger.info('[87][sequncing][method]=' + method);
              
        const sql =`insert_Sequncings` ;

        try {
            
            const request = pool.request()
              .input('report_type', mssql.VarChar, report_type)
              .input('method', mssql.NVarChar, method)  
              .output('TOTALCNT', mssql.int, 0);
            
          let result =  '';
          await request.execute(sql, (err, recordset, returnValue) => {
              if (err)
              {
                console.log ("172[sequncing]err message=" + err.message);
              }

              console.log("[175][sequncing]recordset="+ recordset);
              console.log("[176][sequncing]returnValue="+ returnValue);

              result = returnValue;
              console.log("[179]result=" + JSON.stringify(result));
            }); 

            console.log("result=", result);

      } catch(err) {
          logger.error('[185][sequncing]err=' + err.message);
      }  
    } 
  });// end of if loop
}

processData();