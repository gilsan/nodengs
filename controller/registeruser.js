const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');

const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  listHandler = async (user_id) => {
  await poolConnect;   

  logger.info("[14][registeruser list]user_id=" + user_id );
  const sql= `select id, user_id  from users \
         where user_id = @user_id`; 
  logger.info("[17][registeruser SQL=" + sql);	

  try {
      const request = pool.request()
        .input('user_id', mssql.VarChar, user_id) // id 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[27][registeruser list]err=' + error.message);
  }
}

// insert user
const  insertHandler = async (req) => {
  await poolConnect;  

  const user_id     = req.body.user_id;
  
  const password	= req.body.password;
  const user_nm     = req.body.user_nm;
  const dept		= req.body.dept;
  const part		= req.body.part;

  logger.info('[42][registeruser insert]user_id=' + user_id + ', password=' + password
                      + ', user_nm=' + user_nm + ', dept=' + dept + ', part=' + part);
 
  const sql = "insert into users ( "
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
  logger.info("[57][registeruser insert]sql=" + sql);

  try {
      const request = pool.request()
        .input('user_id', mssql.VarChar, user_id)
        .input('password', mssql.VarChar, password)
		    .input('user_nm', mssql.NVarChar, user_nm)
        .input('dept', mssql.VarChar, dept)
        .input('part', mssql.VarChar, part); 
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error("[71][registeruser insert]error="  + error.message);
  }
}

exports.register = (req,res, next) => {
  
  logger.info("[77][registeruser ]req=" + JSON.stringify(req.body));

  const user_id    = req.body.user_id;  
  const result  = listHandler(user_id);
  result.then(data => {     
    	 if (data != undefined) { 
			 res.json({message: 'DUPID'});
		 }else{ 
			console.log('register->>>>>>step1');
			const regist = insertHandler(req);
			regist.then(data => {  
				console.log('register->>>>>>step2');
				res.json({message: 'success'});
			})
			.catch( error =>{
        logger.error("[92][registeruser insert]err=" + error.message);
        res.sendStatus(500);
      }); 
		}   
  }).catch( error => {
    logger.error("[97][registeruser list]err=" + error.message);
    res.sendStatus(500)
  }); 

}
