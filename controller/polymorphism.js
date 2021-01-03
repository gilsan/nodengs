const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const config = {
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
}

const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

const geneHandler = async (req) => {
    await poolConnect;  

    const sql = 'select  * from polymorphism';
    logger.info('[29][polymorphism select]sql=' + sql);
    try {
        const request = pool.request();
        const result = await request.query(sql)
 
        return result.recordset;

    } catch (error) {
        logger.error('[37][polymorphism select]err=' + error.message);
    }
}

exports.select = (req, res, next) => {

     const gene       = req.body.gene;
     const amino      = req.body.amino;
     const nucleotide = req.body.naucleotide;

     const result = geneHandler(req);
     result.then(data => { 
        //  console.log('[320][getArtifactsInfoCount]',data);
          res.json(data);
     })
     .catch( error  => {
        logger.info('[53][polymorphism select]err=' + error.message);
          res.sendStatus(500)
     });    

}