const Excel = require('exceljs');
const mariadb = require('mariadb');

const workbook = new Excel.Workbook();  


var pool = mariadb.createPool({
  host     : '127.0.0.1', //db접속 주소
  user     : 'wirex', //db접속id
  password : 'wirex', //db접속pw
  database : 'sainthospital', //db명
   connectionLimit: 5
});

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

workbook.xlsx.readFile('../inhouseupload/Acute_leukemia_in_house_database.xlsx').then((workbook) =>{
  
    let genes,locations,exon,transcript, coding, amino_acid_change;
    const worksheet = workbook.getWorksheet('Benign');
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
 
	if (rowNumber === 200 || rowNumber === 202) {
         coding = JSON.stringify(row.values[6].richText[0].text.split('\n')[0])+' '+ JSON.stringify(row.values[6].richText[1].text);
		 coding = coding.replace(/"/gi, '\,');
		 
		 console.log(coding);
				  }
		  
		  /*
         if (rowNumber > 1) {
              //  console.log(rowNumber + '  4 ['+row.values[4]+']  5 ['+ row.values[5] + ']');
                const no = row.values[1];
                if(row.values[2] === undefined){
					genes = '';
				} else {
                    genes = findChar(row.values[2]);
				}

                if(row.values[3] === undefined){
					locations = '';
				} else {
                    locations = findChar(row.values[3]);
				}
                
                if(row.values[4] === undefined){
					exon = '';
				} else {
                    exon = findChar(row.values[4]);
				}
				 
                if(row.values[5] === undefined){
					transcript = '';
				} else {
                    transcript= findChar(row.values[5]);
				}

				if(row.values[6] === undefined){
					coding = '';
				} else {
				  if (rowNumber === 200 || rowNumber === 202) {
                     coding = JSON.stringify(row.values[6].richText[0].text.split('\n')[0])+' '+ JSON.stringify(row.values[6].richText[1].text);
				  } else {
                     coding = findChar(row.values[6]);
				  }
                   
				}
				 
				if(row.values[7] === undefined){
					amino_acid_change = '';
				} else {
                    amino_acid_change = findChar(row.values[7]);
				}
				 
                           
                const sql= 'insert into benign (no, genes,location,exon,transcript,coding,amino_acid_change) values (?,?,?,?,?,?,?)';
				const params = [no, genes,locations,exon, transcript, coding, amino_acid_change];

                pool.getConnection()
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
                
			//	console.log(rowNumber + ': ' +genes + ',' + locations + ',' + exon + ',' + transcript + ',' + coding + ',' + amino_acid_change);				 
		  }
		   */

        });	
    
});