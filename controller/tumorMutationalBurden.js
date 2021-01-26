//================================================
//
//병리 tumorMutationalBurden 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

//
const pool = new mssql.ConnectionPool(config);
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  tumorMutationalBurdenMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[33][save][messageHandler]data' + JSON.stringify( req.body));
    
  //입력 파라미터를 수신한다
  
  const tumorMutationalBurden = req.body.tumorMutationalBurden;
  const pathologyNum  =  req.body.pathologyNum;
  
  logger.info("[33][save][messageHandler]pathologyNum=" + pathologyNum);
  logger.info("[33][save][messageHandler]tumorMutationalBurden=" + tumorMutationalBurden);
 
  //insert Query 생성
  let sql2 = "delete from tumorMutationalBurden where  pathologyNum = @pathologyNum ";

  logger.info("[33][save][messageHandler]sql=" + sql2);
	
  try {
	const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum); 
		
	const result = await request.query(sql2)
	
	//return result;
  } catch (error) {
	  logger.error('[33][save][messageHandler]error=' + error.message);
  }

  //insert Query 생성;
  const qry = "insert into tumorMutationalBurden (tumorMutationalBurden, pathologyNum) \
	         values(@tumorMutationalBurden, @pathologyNum)";
	   
	logger.info("[33][save][messageHandler]sql=" + qry);

    try {
        const request = pool.request()
        .input('tumorMutationalBurden', mssql.VarChar, tumorMutationalBurden)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
         const result2 = await request.query(qry);       
        return result2;

    } catch (error) {
        logger.error('[33][save][tumorMutationalBurden messageHandler]error=' + error.message);
    }
     
  //const uuid = uuidv4();
  //console.log('uuid:', uuid);
  // return result;
  
}
   
//병리 tumorMutationalBurden 보고서 입력
exports.tumorMutationalBurdendata = (req,res, next) => {

  logger.info("[88][save][messageHandler]data=" + JSON.stringify( req.body));

  const result = tumorMutationalBurdenMessageHandler(req);
  result.then(data => {

     logger.info('[94][tumorMutationalBurdendata][]' + JSON.stringify( data));
     res.json({message: 'SUCCESS'});
  })
  .catch( error  => {
    logger.error('[97][tumorMutationalBurdendata][err]',error.message);
    res.sendStatus(500);
  }); 

}

const  tumorMutationalBurdenMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. tumorMutationalBurden
	
	const pathologyNum = req.body.pathologyNum;

	console.log('[113][tumorMutationalBurden select]pathologyNum',pathologyNum);

	//insert Query 생성
	const qry = "select tumorMutationalBurden from tumorMutationalBurden \
				where pathologyNum = @pathologyNum ";

	console.log("sql",qry);
		   
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (error) {
		  logger.error('[127][tumorMutationalBurden] error=' + error.message);
	}
}
   
//병리 filteredOriginData 보고서 조회
exports.tumorMutationalBurdenList = (req,res, next) => {

  logger.info("[134][tumorMutationalBurden]select data=" + req.body);

  const result = tumorMutationalBurdenMessageHandler2(req);

  result.then(data => {

     logger.info('[140][tumorMutationalBurdenList]data=', JSON.stringify( data));
     res.send(data);
  })
  .catch( error => {
    logger.error('[127][tumorMutationalBurden] error=' + error.message);
    res.sendStatus(500);
  }); 

}