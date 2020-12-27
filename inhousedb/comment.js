const Excel = require('exceljs');
const mariadb = require('mariadb');

const workbook = new Excel.Workbook();  
const fs = require('fs');

var pool = mariadb.createPool({
  host     : '127.0.0.1', //db접속 주소
  user     : 'wirex', //db접속id
  password : 'wirex', //db접속pw
  database : 'sainthospital', //db명
   connectionLimit: 100
});


const inputData= async (sql, params) => {
            await pool.getConnection()
                   .then(conn => {    
                          conn.query(sql, params)
                          .then((rows) => {
                               console.log('결과', rows);  
				               conn.end();
                           }) 
                    })
					.catch(err => {
                        console.log('not connect');	        
                    });	
 }

workbook.xlsx.readFile('../inhouseupload/comment.xlsx').then( async (workbook) =>{

let comment;
 const worksheet = workbook.getWorksheet('Sheet1');
  worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
       
	   if (rowNumber === 2)
	   {
		   console.log(row.values);
		   comment = JSON.stringify(row.values[3].richText[1].text);
	   }

       if (rowNumber > 1) {
             if(row.values[1] === undefined){
				type = '';
				} else {
                 type = row.values[1];
				}

             if(row.values[2] === undefined){
				gene = '';
				} else {
                 gene = row.values[2];
				}


		    if (rowNumber === 2) {
               comment = JSON.stringify(row.values[3].richText[1].text);
		     } else {
               if(row.values[3] === undefined){
				   comment = '';
				} else {
                 comment = row.values[3];
				}
		   }

             if(row.values[4] === undefined){
				reference = '';
				} else {
                 reference = row.values[4];
				}

           const sql='insert into comment (type, gene, comment, reference) values(?,?,?,?)';
		   params = [type, gene, comment, reference]; 
          inputData(sql, params)
       }


  });


});