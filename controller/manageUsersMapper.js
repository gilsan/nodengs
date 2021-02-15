const express = require('express');
const router = express.Router();
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const { json } = require('body-parser');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;  

    const userId			= req.body.userId; 
	const userNm			= req.body.userNm; 
	const startDay			= req.body.startDay; 
	const endDay			= req.body.endDay;
    const dept				= req.body.dept;
    
    logger.info('[17][manageUser list]data=' + userId + ", " + userNm + ", " + startDay + ", " + endDay + ", " + dept );
	
	let sql ="select id, user_id, password, user_nm, user_gb, dept, CONVERT(CHAR(19), login_date, 120) login_date, isnull(approved,'N') approved ,";
	sql = sql + " case when dept ='P' then 'Pathology' when dept ='D' then 'Diagnostic' else '' end dept_nm ,"
	sql = sql + " case when user_gb  ='U' then 'User' when dept ='A' then 'Manager' else '' end user_gb_nm ,"
	sql = sql + " uuid , reg_date, pickselect, case when part ='T' then 'Tester' when part = 'D' then 'Doctor' end part_nm ";
    sql = sql + " from users  ";
	sql = sql + " where dept = @dept ";
	if(userId != "") 
		sql = sql + " and user_id like '%"+userId+"%'";
	if(userNm != "") 
		sql = sql + " and user_nm like '%"+userNm+"%'";
	
	if(startDay != "") 
		sql = sql + " and isnull(login_date, getdate()) >= '"+startDay+"'";
	if(endDay != "") 
		sql = sql + " and isnull(login_date, getdate()) <= DATEADD(d, 1, '"+endDay+ "')";
	

    sql = sql + " order by id";

    logger.info('[41][manageUser list]sql=' + sql);
    try {
       const request = pool.request()
         .input('userId', mssql.VarChar, userId)
		 .input('userNm', mssql.VarChar, userNm)  
		 .input('dept', mssql.VarChar, dept); 
       const result = await request.query(sql)  
       return result.recordset;
   } catch (error) {
    logger.error('[17][manageUser]err=' + error.message);
   }
}

// insert
const insertHandler = async (req) => {  
 
     const user_id			= req.body.userId;
     const password			= req.body.password;
     const user_nm			= req.body.userNm;	
     const user_gb			= req.body.userGb;
     const dept				= req.body.dept;
     const part				= req.body.part; 

     logger.info('[64][manageUser insert]data=' + user_id + ", " + user_nm + ", " + user_gb 
                                                + ", " + dept + ", " + part);
 
     let sql = "insert into users ( "
        +"	user_id		"
        +"	,password	"
        +"	,user_nm	"
        +"	,user_gb	"
        +"	,dept		"
        +"	,reg_date	"
        +"	,part		"
        +"	,approved ) " 
        +" values( "
        +" @user_id, @password, @user_nm, 'U',  @dept "
        +" , getdate(),  @part, 'N') ";
        
    logger.info('[17][manageUser insert]sql=' + sql); 
     
    try {
        const request = pool.request()
          .input('user_id', mssql.VarChar, user_id) 
          .input('password', mssql.VarChar, password) 
          .input('user_nm', mssql.NVarChar, user_nm) 
          .input('user_gb', mssql.VarChar, user_gb) 
          .input('dept', mssql.VarChar, dept) 
		  .input('part', mssql.VarChar, part); 

        const result = await request.query(sql)
      //  console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[92][manageUser insert] err=' + error.message);
    }
}

// update
const updateHandler = async (req) => { 
    const user_id			= req.body.userId;
    const password			= req.body.password;
    const user_nm			= req.body.userNm;	
    const user_gb			= req.body.userGb;
    const dept				= req.body.dept;
    const pickselect		= req.body.pickselect;
    const part				= req.body.part; 
    const id				= req.body.id; 

    logger.info('[107][manageUser updte]user_id=' + user_id + ", " + password + ", " + user_nm + ", " + user_gb 
                    + dept + ", " + pickselect + ", " + part + ", id=" + id);

    let sql = "update users set " ;
    sql = sql + " password = @password, user_nm= @user_nm, "
    sql = sql + " user_gb= @user_gb, dept= @dept, pickselect= @pickselect, part= @part ";
    sql = sql + "where id = @id";

    logger.info('[115][manageUser update]sql=' + sql);
     
    try {
        const request = pool.request()
		  .input('id', mssql.Int, id) 
          .input('password', mssql.VarChar, password) 
          .input('user_nm', mssql.NVarChar, user_nm) 
          .input('user_gb', mssql.VarChar, user_gb) 
          .input('dept', mssql.VarChar, dept) 
		  .input('pickselect', mssql.VarChar, pickselect)
		  .input('part', mssql.VarChar, part); 

        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[129][manageUser error', error.message);
    }
}

// Delete
const deleteHandler = async (req) => { 
    const id        = req.body.id; 
    
    logger.info('[137][manageUser delete]data=' + id);
 
    let sql = "delete users  " ; 
    sql = sql + "where id = @id"; 

    logger.info('[142][manageUser del]sql=' + sql); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[147][manageUser err=' + error.message);
    }
}

// approved
const approvedHandler = async (req) => { 
	const id				= req.body.id; 
    const approved			= req.body.approved; 
    
    logger.info('[164][manageUser approved]data=' + id + ", " + approved);

    let sql = "update users set approved = @approved  " ; 
    sql = sql + "where id = @id"; 

    logger.info('[169][manageUser approved]sql=' + sql);

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id)
		  .input('approved', mssql.VarChar, approved );  
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[179][manageUser approved]err=' + error.message);
    }
}

// List users
exports.listUsers = (req, res, next) => {  
    logger.info('[186][manageUser]data=' + JSON.stringify(req.body));

    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( error  => {
        logger.error('[17][manageUser list]err=' + error.message); 
        res.sendStatus(500);
    });
};

// users Insert
 exports.insertUsers = (req,res,next) => {

    logger.info('[201][manageUser insert]data=' + JSON.stringify(req.body)); 

    const result = insertHandler(req);
    result.then(data => { 
        res.json(data);
     })
     .catch( error  => {
        logger.error('[208][manageUser insert]err=' + error.message); 
        res.sendStatus(500);
    });
};

// users Update
 exports.updateUsers = (req,res,next) => { 

    logger.info('[216][manageUser Update]data=' + JSON.stringify(req.body));

	const result = updateHandler(req);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[223][manageUser update]err=' + error.message);
        res.sendStatus(500);
    });
	
};

// users Delete
 exports.deleteUsers = (req,res,next) => { 

    logger.info('[232][manageUser del]data=' + JSON.stringify(req.body)); 

	const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error  => {
        logger.error('[17][manageUser del]err=' + error.message);
        res.sendStatus(500);
    });
	
};

// user approved
 exports.approvedUsers= (req,res,next) => {
     
    logger.info('[17][manageUser approved]data=' + JSON.stringify(req.body));

	const result = approvedHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error  => {
        logger.error('[17][manageUser approved]err=' + error.message);
        res.sendStatus(500);
    });
	
};