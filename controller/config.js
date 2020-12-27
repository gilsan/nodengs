
  const mssql = require('mssql');
  exports.pool = mssql.createPool({
    host     : '127.0.0.1', //db접속 주소
    user     : 'ngs', //db접속id
    password : 'ngs12#$', //db접속pw
    database : 'ngs_data', //db명
    connectionLimit: 50,
  });