const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
/*
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
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

function getFormatDate(date){

    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

function getFormatDate2(date){

    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + month +  day;
}

const  messageHandler = async (today) => {
    await poolConnect; // ensures that the pool has been created
   
    const sql ="select * from [dbo].[patientinfo_path] where left(prescription_date, 10) = '" + today + "'";
    logger.info('[49][patientinfo_path select]sql=' + sql);
    
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (error) {
        logger.error('[58][patientinfo_path select]err=' + error.message);
    }
  }

 exports.getLists = (req,res, next) => {
    
	const  now = new Date();
    const today = getFormatDate2(now);
    const result = messageHandler(today);
    result.then(data => {
   
       // console.log(json.stringfy());
        res.json(data);
    })
    .catch( error  => {
        logger.error('[58][patientinfo_path getLists]err=' + error.message);
        res.sendStatus(500)}
    ); 
}

const  messageHandler2 = async (start, end) => {
    await poolConnect; // ensures that the pool has been created
   
    const sql = "select * from [dbo].[patientinfo_path]"
               + " where left(prescription_date, 8) >= '" + start 
               + "' and left(prescription_date, 8) <= '" + end + "'";
    logger.info('[58][patientinfo_path select2]sql=' + sql);
  
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
        console.dir( result);
 
        return result.recordset;
    } catch (error) {
        logger.error('[58][patientinfo_path select2]err=' + error.message);
    }
  }

exports.patientSearch = (req, res,next) => {

   const start =  req.body.start;  
   let end   =  req.body.end;  

   const  now = new Date();
   const today = getFormatDate(now);

   const nowTime = new Date().getTime();
   const requestTime = new Date(end).getTime();

   if (requestTime > nowTime) {
	   end = today; 
   }

   logger.info('[112][patientinfo_path select2]start=' + start);
   logger.info('[112][patientinfo_path select2]end=' + end);
   logger.info('[112][patientinfo_path select2]today=' + today );

   const dataset = messageHandler2(start, end);
   dataset.then(data => {
      res.json(data);
   })
   .catch( error  => {
    logger.error('[120][patientinfo_path select2]err=' + error.message);
    res.status(500).send('That is Not good...config.database.anchor.apply.')
   }); 
}