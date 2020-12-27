
const Excel = require('exceljs');

const workbook = new Excel.Workbook();  

exports.inhousetodb = async (path) => {
  
  const filename = path.split('/')[1];
  console.log('엑셀 화일명:', path, filename);
  /// 파일 읽기 수행  
workbook.xlsx.readFile('./'+path).then((workbook) =>{
   // 읽어 작업 하는 객체는 workbook 으로 진행하면 됨
     workbook.eachSheet((sheet, id)=> {
      // console.log(sheet.getCell('A2').value);
       /*
        sheet.eachRow((row, rowIndex) => {
          console.log(row.values, rowIndex)
        });
		*/

        sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
         });
         
     });


});

};

