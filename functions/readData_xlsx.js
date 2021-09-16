
XLSX = require('xlsx');
const fs = require('fs');

function loadData_xlsx(filePath) {
  if (fs.existsSync(filePath)) {
    var workbook = XLSX.readFile(filePath);
    let ws = workbook.Sheets['Sheet1'];

    ws['!ref'] = 'A15:J22';

    const records = XLSX.utils.sheet_to_json(ws, {header :'A'});
    console.log(records);

    return records;
  } else {
    return [];
  }
}


 exports.loadData_xlsx = ( filepath ) => {

   const data = loadData_xlsx(filepath);
   return data;

 }