module.exports = {
	user: 'ngs',
	password: 'ngs12#$',
	server: '112.169.53.30',
	port :  4306,
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