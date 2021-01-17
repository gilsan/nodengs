
 module.exports = {
  user: 'ngs',
  password: 'ngs12#$',
  server: 'localhost',
  database: 'ngs_data',  
  pool: {
      max: 200,
      min: 100,
      idleTimeoutMillis: 30000
  },
  enableArithAbort: true,
  options: {
      encrypt:false
  }
};