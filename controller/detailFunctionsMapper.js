const express = require('express');
const router = express.Router();
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const functionHandler = async (req) => {
    await poolConnect;   
	const functionId		= req.body.functionId; 
	
	logger.info('[14][detailFunctionsMapper]function functionId=' + functionId);
	let	  sql =" select  a.service_status		";
	sql = sql +"		,a.function_name		"; 
	sql = sql +" from diag_function	a		";
	sql = sql +" where a.function_id = @functionId ";

	logger.info('[20][detailFunctionsMapper]function sql' + sql);
   try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId)   ; 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (error) {
	logger.error('[27][detailFunctionsMapper]function err=' + error.message);
   }
}

const listHandler = async (req) => {
	await poolConnect;   
	
	const functionId		= req.body.functionId;  
	logger.info('[35][detailFunctionsMapper]list functionId=' + functionId);
  
	let sql =" select a.seq						";
		sql = sql + "	,a.function_id			"; 
		sql = sql 	+"	,a.variable				";
		sql = sql 	+"	,a.data_type			";
		sql = sql 	+"	,a.leave_yn				";
		sql = sql 	+"	,a.inner_variable		";
		sql = sql 	+"	,a.condition			";
		sql = sql 	+"	,a.data_value			";
		sql = sql 	+"	,a.outer_condition		";	  
		sql = sql 	+"  from diag_functions a	"; 
		sql = sql 	+" where a.function_id = @functionId ";

	logger.info('[49][detailFunctionsMapper]list sql=' + sql);

   try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId)   ; 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (error) {
	logger.error('[20][detailFunctionsMapper]list err=' + error.message);
   }
}
 
const insertHandler = async (req) => {
    await poolConnect;   
	const functionId		= req.body.functionId;
	const variable			= req.body.variable; 
	const dataType			= req.body.dataType; 
	const leaveYn			= req.body.leaveYn; 
	const innerVariable		= req.body.innerVariable; 
	const condition			= req.body.condition; 
	const dataValue			= req.body.dataValue; 
	const outerCondition	= req.body.outerCondition;  

	logger.info('[72][detailFunctionsMapper]insert functionId=' + functionId
						  + ', variable=' + variable + ', dataType=' + dataType
						  + ', leaveYn=' + leaveYn + ', innerVariable=' + innerVariable
						  + ', condition=' + condition + ', dataValue=' + dataValue
						  + ', outerCondition=' + outerCondition);
  
	let sql =" insert diag_functions(			";
		sql = sql + "	function_id				"; 
		sql = sql 	+"	,variable				";
		sql = sql 	+"	,data_type				";
		sql = sql 	+"	,leave_yn				";
		sql = sql 	+"	,inner_variable			";
		sql = sql 	+"	,condition				";
		sql = sql 	+"	,data_value				";
		sql = sql 	+"	,outer_condition)		";	  
		sql = sql 	+"  values	(				"; 
		sql = sql	+ "	@functionId				"; 
		sql = sql 	+"	,@variable				";
		sql = sql 	+"	,@dataType				";
		sql = sql 	+"	,@leaveYn				";
		sql = sql 	+"	,@innerVariable			";
		sql = sql 	+"	,@condition				";
		sql = sql 	+"	,@dataValue				";
		sql = sql 	+"	,@outerCondition)		";	 
		
   logger.info('[97][detailFunctionsMapper]insert sql=' + sql);
   
   try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId) 
		 .input('variable'	, mssql.VarChar, variable) 
		 .input('dataType', mssql.VarChar, dataType) 
		 .input('leaveYn', mssql.VarChar, leaveYn) 
		 .input('innerVariable', mssql.VarChar, innerVariable)
		 .input('condition', mssql.VarChar, condition) 
		 .input('dataValue', mssql.VarChar, dataValue) 
		 .input('outerCondition', mssql.VarChar, outerCondition) ; 

       const result = await request.query(sql) 
       return result.recordset;
   } catch (error) {
       logger.error('[113][detailFunctionsMapper]insert err=' + error.message);
   }
}

const updateHandler = async (req) => {
    await poolConnect;   
	const functionId		= req.body.functionId;
	const seq				= req.body.seq;
	const variable			= req.body.variable; 
	const dataType			= req.body.dataType; 
	const leaveYn			= req.body.leaveYn; 
	const innerVariable		= req.body.innerVariable; 
	const condition			= req.body.condition; 
	const dataValue			= req.body.dataValue; 
	const outerCondition	= req.body.outerCondition;

	logger.info('[130][detailFunctionsMapper]update functionId=' + functionId
						  + ', variable=' + variable + ', dataType=' + dataType
						  + ', leaveYn=' + leaveYn + ', innerVariable=' + innerVariable
						  + ', condition=' + condition + ', dataValue=' + dataValue
						  + ', outerCondition=' + outerCondition);  
  
	let sql =" update diag_functions  set					"; 
		sql = sql 	+"	 variable		=	@variable		";
		sql = sql 	+"	,data_type		=	@dataType		";
		sql = sql 	+"	,leave_yn		=	@leaveYn		";
		sql = sql 	+"	,inner_variable	=	@innerVariable	";
		sql = sql 	+"	,condition		=	@condition		";
		sql = sql 	+"	,data_value		=	@dataValue		";
		sql = sql 	+"	,outer_condition=	@outerCondition	"; 
		sql = sql 	+" where function_id=	@functionId		"; 
		sql = sql 	+" and	seq			=	@seq			"; 

	logger.info('[146][detailFunctionsMapper]update sql=' + sql);

    try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId) 
		 .input('seq'		, mssql.VarChar, seq) 
		 .input('variable'	, mssql.VarChar, variable) 
		 .input('dataType', mssql.VarChar, dataType) 
		 .input('leaveYn', mssql.VarChar, leaveYn) 
		 .input('innerVariable', mssql.VarChar, innerVariable)
		 .input('condition', mssql.VarChar, condition) 
		 .input('dataValue', mssql.VarChar, dataValue) 
		 .input('outerCondition', mssql.VarChar, outerCondition) ; 

       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
		logger.error('[97][detailFunctionsMapper]update err=' + error.message);
    }
}

const deleteHandler = async (req) => {
    await poolConnect;   
	const functionId		= req.body.functionId;  
	const seq				= req.body.seq;   

	logger.info('[146][detailFunctionsMapper]del functionId=' + functionId + ', seq=' + seq);

	let	  sql =" delete  from diag_function			";
	sql = sql 	+" where function_id = @functionId	";
	sql = sql 	+" and	seq			   = @seq		"; 
	
	logger.info('[146][detailFunctionsMapper]del sql' + sql);
    try {
       const request = pool.request() 
		 .input('functionId', mssql.VarChar, functionId)  
		 .input('seq', mssql.VarChar, seq)   ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
		logger.error('[146][detailFunctionsMapper]del err=' + error.message);
	}
}
 
// Function Info 
exports.functionInfo = (req, res, next) => { 
	logger.error('[146][detailFunctionsMapper function]req=' + JSON.stringify(req.body));
    const result = functionHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
		logger.error('[146][detailFunctionsMapper function]err=' + error.message);
		res.sendStatus(500);
	});
};

// List functions
exports.listDetails = (req, res, next) => { 
	logger.error('[146][detailFunctionsMapper List]req=' + JSON.stringify(req.body));
    const result = listHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
		logger.error('[146][detailFunctionsMapper List]err=' +error.message);
		res.sendStatus(500)
	});
};

// insert functions
exports.insertDetails = (req, res, next) => {  
	logger.error('[146][detailFunctionsMapper insert]req=' + JSON.stringify(req.body));
	
	const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
		logger.error('[146][detailFunctionsMapper insert]err=' + error.message);
		res.sendStatus(500);
	});
};


// update functions
exports.updateDetails = (req, res, next) => {  
	logger.error('[146][detailFunctionsMapper update]req=' + JSON.stringify(req.body)); 
	const result = updateHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
		logger.error('[146][detailFunctionsMapper update]err=' + error.message); 
		res.sendStatus(500);
	});
};

// Delete functions
exports.deleteDetails = (req, res, next) => {
	logger.error('[146][detailFunctionsMapper del]req=' + JSON.stringify(req.body));  
    const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
		logger.error('[146][detailFunctionsMapper del]err=' +error.message);
		res.sendStatus(500);
	}); 
};
 