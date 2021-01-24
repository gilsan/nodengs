const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');

const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();
 

const  listHandler = async (user_id) => {
  await poolConnect;   
  const sql= `select id, user_id  from users \
         where user_id = @user_id`; 

	console.error('SQL-->', sql);	

  try {
      const request = pool.request()
        .input('user_id', mssql.VarChar, user_id) // id 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (err) {
      console.error('SQL error', err);
  }
}
    

const  insertHandler = async (req) => {
  await poolConnect;   

console.log(req.body);

  const user_id     = req.body.user_id;
  
  const password	= req.body.password;
  const user_nm     = req.body.user_nm;
  const dept		= req.body.dept;
  const part		= req.body.part;
 
  const sql = "insert into users ( "
			  +"	user_id		"
			  +"	,password	"
			  +"	,user_nm		"
			  +"	,user_gb		"
			  +"	,dept		"
			  +"	,reg_date	"
			  +"	,part		"
			  +"	,approved ) " 
			  +" values( "
			  +" @user_id, @password, @user_nm, 'U',  @dept "
			  +" , getdate(),  @part, 'N') "; 
       
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
  } catch (err) {
      console.error('SQL error', err);
  }
}

exports.register = (req,res, next) => {
  
  console.log(req.body);

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
			.catch( err  => res.sendStatus(500)); 
		}   
  }).catch( err  => res.sendStatus(500)); 

}
