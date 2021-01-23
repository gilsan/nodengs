const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const logger = require('../common/winston.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;   
	const functionName		= req.body.functionName; 
	const startDay			= req.body.startDay; 
    const endDay			= req.body.endDay;
    
    logger.info('[15][manageFunction list]data=' + functionName + ", " + startDay + ", " + endDay);
	 
	let sql =" select a.function_id, a.function_name, a.service_status,    " ; 
	sql = sql +" CONVERT(CHAR(19), create_date, 120) create_date,  " ;
	sql = sql +" CONVERT(CHAR(19), update_date, 120) update_date   " ;
	sql = sql +"  from diag_function a  " ;  
	sql = sql + " where 1 = 1 ";
	 
	if(functionName != "") 
		sql = sql + " and a.function_name like '%"+functionName+"%'";

	if(startDay != "") 
		sql = sql + " and CONVERT(CHAR(8), update_date, 112) >= '"+startDay+"'";
	if(endDay != "") 
		sql = sql + " and CONVERT(CHAR(8), update_date, 112) <= '"+endDay+"'"; 
    sql = sql + " order by a.function_id desc";

	logger.info('[32][manageFunction list]sql=' + sql);
    try {
       const request = pool.request() 
		 .input('functionName', mssql.VarChar, functionName) 
		 .input('startDay', mssql.VarChar, startDay) 
		 .input('endDay', mssql.VarChar, endDay)   ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[41][manageFunction list]err=' + error.message);
    }
}

const insertHandler = async (req) => {
    await poolConnect;    
    const functionName			= req.body.functionName;  
    
    logger.info('[49][manageFunction insert]data=' + functionName);
 
	let sql =" insert diag_function (   " ; 
	sql = sql +"   function_name  "; 
	sql = sql +" , service_status ";
	sql = sql +" , create_date  " ;  
	sql = sql +" , update_date ) " ;  
	sql = sql +" values(  ";
	sql = sql +"  @functionName "; 
	sql = sql +" , '0' ";
	sql = sql +" , getdate()  " ;  
	sql = sql +" , getdate() ) "; 

	logger.info('[64][manageFunction insert]sql=' + sql);
    try {
       const request = pool.request()  
		 .input('functionName', mssql.NVarChar, functionName)   ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[69][manageFunction insert]err=' + error.message);
    }
}

const updateHandler = async (req) => {
    await poolConnect;   
	const functionId			= req.body.functionId; 
	const functionName			= req.body.functionName; 
	const serviceStatus			= req.body.serviceStatus;

    logger.info('[79][manageFunction update]data=' + functionId + ", " + functionName + ", " + serviceStatus);

	let sql =" update diag_function set   " ; 
	sql = sql +"   function_name  = @functionName "; 
	sql = sql +" , service_status = @serviceStatus ";
	sql = sql +" , update_date    = getdate() " ; 
	sql = sql + " where function_id = @functionId ";  

	logger.info('[87][manageFunction update]sql=' + sql);
    try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId) 
		 .input('functionName', mssql.NVarChar, functionName)  
		 .input('serviceStatus', mssql.VarChar, serviceStatus)   ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[96][manageFunction update]err=' + error.message);
    }
}

// Delete functions
const deleteHandler = async (req) => {
    await poolConnect;   
	const functionId			= req.body.functionId;  
    
    logger.info('[64][manageFunction del]data=' + functionId);

	let sql =" delete  from diag_function    " ;  
	sql = sql + " where function_id = @functionId ";  

	logger.info('[64][manageFunction del]sql=' + sql);

    try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId)  ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[64][manageFunction del]err=' + error.message);
    }
}

// List functions
exports.listFunctions = (req, res, next) => {  
    logger.info('[124][manageFunction list]data-' + JSON.stringify(req.body));
    const result = listHandler(req);
    result.then(data => { 
        res.json(data);
     })
     .catch( error  => {
        logger.error('[130][manageFunction list]err=' + error.message);
        res.sendStatus(500)
    });
};

// Update functions
exports.updateFunctions = (req, res, next) => {  
    logger.info('[137][manageFunction update]data=' + JSON.stringify(req.body)); 
    
    const result = updateHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error  => {
        logger.error('[144][manageFunction update]err=' + error.message);
        res.sendStatus(500)
    });
};

// Insert functions
exports.insertFunctions = (req, res, next) => {  
    logger.info('[151][manageFunction insert]data=' + JSON.stringify(req.body)); 
    const result = insertHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error  => {
        logger.error('[156][manageFunction insert]err=' + error.message); 
        res.sendStatus(500)
    });
};

// Delete functions
exports.deleteFunctions = (req, res, next) => {  
    logger.info('[164][manageFunction del]data=' + JSON.stringify(req.body));
    
    const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error  => {
        logger.error('[171][manageFunction del]err=' + error.message); 
        res.sendStatus(500)}
    );
};