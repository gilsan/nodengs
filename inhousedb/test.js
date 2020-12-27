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

workbook.xlsx.readFile('../inhouseupload/Acute_leukemia_in_house_database.xlsx').then((workbook) =>{
  const worksheet = workbook.getWorksheet('Mutation');
  console.log(worksheet.rowCount);

});