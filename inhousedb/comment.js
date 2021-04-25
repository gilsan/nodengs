const Excel = require('exceljs');
const mssql = require('mssql');
const xlsxFile = require('read-excel-file/node');

const workbook = new Excel.Workbook();  
const fs = require('fs');
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
 

 /*
 const sql2 =`
   delete from comments
 ` 

 try {      
   const request2 = pool.request();

   //let result =  '';
   const result2 = request2.query(sql2); 
   result2.then(data => {
       console.dir(data);
   })
 }
 catch(err) {
   console.error('SQL error', err);
 } 
 */

xlsxFile('../inhouseupload/comment.xlsx').then((rows) => {
      
  for (i in rows){

    console.log(rows[i]);
                
    type = nvl(rows[i][0], "");
    gene = nvl(rows[i][1], "");
    comment = nvl(rows[i][2], "");
    reference = nvl(rows[i][3], "");
     
    
        const sql =`
        insert into comments (
            
          type,
            gene,
            comment,
            reference
            ) 
            values (
          
            @type,
            @gene,
            @comment,
            @reference
            )
        ` 
    try {
        
        const request = pool.request()
        .input('type', mssql.NVarChar, type)  
        .input('gene', mssql.VarChar, gene)  
        .input('comment', mssql.NVarChar, comment) 
        .input('reference', mssql.VarChar, reference) ;
        
      //let result =  '';
      const result = request.query(sql); 
        result.then(data => {
            console.dir(data);
        })//.catch( err => console.log(err))
      
        console.log("result=", result);

    }   catch(err) {
        console.error('SQL error', err);
    }  

    
  }


});