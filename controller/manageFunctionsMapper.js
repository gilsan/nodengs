const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const dbConfigMssql = require('./dbconfig-mssql.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;   
	const functionName		= req.body.functionName; 
	const startDay			= req.body.startDay; 
	const endDay			= req.body.endDay;
	 
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

	console.log("sql", sql);
   try {
       const request = pool.request() 
		 .input('functionName', mssql.VarChar, functionName) 
		 .input('startDay', mssql.VarChar, startDay) 
		 .input('endDay', mssql.VarChar, endDay)   ; 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

const updateHandler = async (req) => {
    await poolConnect;   
	const functionId			= req.body.functionId; 
	const functionName			= req.body.functionName; 
	const serviceStatus			= req.body.serviceStatus;
	
	if(serviceStatus =='1') {
		let sql =" update diag_function set   " ;  
		sql = sql +"  service_status = '0' ";
		sql = sql +" , update_date    = getdate() " ;  
	}
	let sql =" update diag_function set   " ; 
	sql = sql +"   function_name  = @functionName "; 
	sql = sql +" , service_status = @serviceStatus ";
	sql = sql +" , update_date    = getdate() " ; 
	sql = sql + " where function_id = @functionId ";  

	console.log("sql", sql);
   try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId) 
		 .input('functionName', mssql.NVarChar, functionName)  
		 .input('serviceStatus', mssql.VarChar, serviceStatus)   ; 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

// List functions
 exports.listFunctions = (req, res, next) => {  
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

// Update functions
 exports.updateFunctions = (req, res, next) => {  
    const result = updateHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };
