//================================================
//
//병리 filteredOriginData 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
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

//
const pool = new mssql.ConnectionPool(config);
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  msiscoreMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[33][msiscore save][messageHandler]data=' + JSON.stringify( req.body));
    
  //입력 파라미터를 수신한다
  const msiscore = req.body.msiscore;
  const pathologyNum  =  req.body.pathologyNum;
  
  logger.info("[40][msiscore]pathologyNum" +  pathologyNum  + ",msiscore" +  msiscore);
 
  //insert Query 생성
  let sql2 = "delete from msiscore where  pathologyNum = @pathologyNum ";

  logger.info("[50][msiscore]del sql=" + sql2);
	
  try {
	const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum); 
		
	const result = await request.query(sql2)
	
	//return result;
  } catch (error) {
    logger.error('[60][msiscore]del err=' + error.message);
  }

  //insert Query 생성;
  const qry = "insert into msiscore (msiscore, pathologyNum)  values(@msiscore, @pathologyNum)";
		   
	logger.info("[65][msiscore]insert sql=" + qry);
    try {
        const request = pool.request()
        .input('msiscore', mssql.VarChar, msiscore)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result = await request.query(qry);
        
        return result;

    } catch (error) {
      logger.error('[77][msiscore]err=' + error.message);
    }
    
  //const uuid = uuidv4();
  //console.log('uuid:', uuid);
  //return result;
}
   
//병리 msiscore 보고서 입력
exports.msiscoreData = (req,res, next) => {

console.log(req.body);

  const result = msiscoreMessageHandler(req);

  result.then(data => {

     res.json({message: 'SUCCESS'});
  })
  .catch( error  => {
    console.log('[99][msiscore][message handler]err=' + error.message);
    res.sendStatus(500);
  }); 

}

const  msiscoreMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. Detected Variants
	
	const pathologyNum = req.body.pathologyNum;

	console.log('[150][select]pathologyNum',pathologyNum);

	//insert Query 생성
	const qry = "select msiscore  from msiscore\
				where pathologyNum = @pathologyNum ";

	console.log("sql",qry);
		   
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (err) {
		  console.error('SQL error', err);
	}
}
   
//병리 msiscore 보고서 조회
exports.msiscoreList = (req,res, next) => {

console.log(req.body);

  const result = msiscoreMessageHandler2(req);


  result.then(data => {
     console.log('[142][msiscoreValue][]', data);
     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}