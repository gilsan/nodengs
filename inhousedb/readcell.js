const Excel = require('exceljs');

const workbook = new Excel.Workbook();  

workbook.xlsx.readFile('../inhouseupload/Acute_leukemia_in_house_database.xlsx').then((workbook) =>{
   // 읽어 작업 하는 객체는 workbook 으로 진행하면 됨

    const worksheet = workbook.getWorksheet('Benign');
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
		 console.log(row.values[2]);
         // console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        });	
    

      /*
     workbook.eachSheet((sheet, id)=> {
      // console.log(sheet.getCell('A2').value);
      
        sheet.eachRow((row, rowIndex) => {
          console.log(row.values, rowIndex)
        });
		

        sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
         });
     });
	   */


});
