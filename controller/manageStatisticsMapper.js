const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;  
    const userId			= req.body.userId; 
	const userNm			= req.body.userNm; 
	const startDay			= req.body.startDay; 
	const endDay			= req.body.endDay;
	const dept			    = req.body.dept;
	
	logger.info('[17][manageStatistics list]data=' + userId + ", " + userNm + ", "  + startDay + ", "  + endDay + ", " +  dept);
  
	let sql =" select a.seq, a.patientID, a.name, substring(a.accept_date,1,4) + '-' + " ;
	sql = sql +" + substring(a.accept_date,5,2) +'-' + substring(a.accept_date,7,2)  accept_date , " ;
	sql = sql +" CONVERT(CHAR(19), send_time, 120) send_time, a.dept , b.user_nm  sender, send_result  " ;
	sql = sql +"  from stat_Log  a  " ;
	sql = sql +"  inner join  (select user_id, user_nm from users b where  dept = @dept )  b " ;
	sql = sql +" on a.sender = b.user_id  " ; 
	sql = sql + " where 1=1 ";
	if(userId != "") 
		sql = sql + " and a.patientID like '%"+userId+"%'";
	if(userNm != "") 
		sql = sql + " and a.name like '%"+userNm+"%'";

	if(startDay != "") 
		sql = sql + " and a.send_time >= '"+startDay+"'";
	if(endDay != "") 
		sql = sql + " and a.send_time <= DATEADD(d, 1, '"+endDay+ "')";

    sql = sql + " order by a.seq desc";

	logger.info('[17][manageStatistics sql' + sql);
    try {
       const request = pool.request()
         .input('userId', mssql.VarChar, userId)
		 .input('userNm', mssql.VarChar, userNm) 
		 .input('startDay', mssql.VarChar, startDay) 
		 .input('endDay', mssql.VarChar, endDay) 
		 .input('dept', mssql.VarChar, dept)   ; 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
		logger.error('[49][manageStatistics list]err=' + error.message);
    }
}


// List statistics
 exports.listStatistics = (req, res, next) => {  

	logger.info('[57][manageStatistics list]data=' + JSON.stringify(req.body));

    const result = listHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
		logger.error('[64][manageStatistics list]err=' + error.message);
		res.sendStatus(500)
	});
};
