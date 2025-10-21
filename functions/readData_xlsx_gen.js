
XLSX = require('xlsx');
const fs = require('fs');

function loadData_xlsx_gen(filePath) {
  if (fs.existsSync(filePath)) {
    var workbook = XLSX.readFile(filePath);
    let ws = workbook.Sheets['Sheet1'];

    // 8
    //ws['!ref'] = 'A15:J22';
    // max 20
    ws['!ref'] = 'A1:Z35';

    const records = XLSX.utils.sheet_to_json(ws, {header :'A'});
    console.log(records);

    return records;
  } else {
    return [];
  }
}


 exports.loadData_xlsx_gen = ( filepath ) => {

   const data = loadData_xlsx_gen(filepath);
   return data;

 }