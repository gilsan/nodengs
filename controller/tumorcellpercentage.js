//================================================
//
//병리 tumorcellpercentage 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const { json } = require('body-parser');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  tumorcellpercentageInsertHandler = async (pathologyNum, tumorcellpercentage ) => {
  await poolConnect; // ensures that the pool has been created
   
  //insert Query 생성;
  const qry = "insert into tumorcellpercentage (tumorcellpercentage, pathologyNum  ) \
	         values(@tumorcellpercentage, @pathologyNum )"; 
		   
  logger.info('[24][tumorcellpercentageMessageHandler]insert sql=' + qry  );

    try {
        const request = pool.request()
        .input('tumorcellpercentage', mssql.VarChar, tumorcellpercentage)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result = await request.query(qry);
        
        return result;

    } catch (error) {
      logger.error('[36][tumorcellpercentageMessageHandler]insert error=' + error.message  );
    }
}

const  tumorcellpercentageMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  //입력 파라미터를 수신한다
  logger.info('[44][tumorcellpercentageMessageHandler]req=' + JSON.stringify(req.body));

  const tumorcellpercentage = req.body.percentage;
  const pathologyNum  =  req.body.pathologyNum;

  logger.info('[47][tumorcellpercentageMessageHandler]tumorcellpercentage=' + tumorcellpercentage);
  logger.info('[47][tumorcellpercentageMessageHandler]pathologyNum=' + pathologyNum  );
 
  //insert Query 생성
  let sql2 = "delete from tumorcellpercentage where pathologyNum = @pathologyNum ";
 
  logger.info('[54][tumorcellpercentageMessageHandler]delete sql=' + sql2  );
 
  try {
	   const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum); 
		
    const result = request.query(sql2);
    
    result.then(data => {
      console.log(data);

      const res_ins = tumorcellpercentageInsertHandler(pathologyNum, tumorcellpercentage );
      res_ins.then(data_ins => {
        console.log(data_ins);
      });
    });


	  //return result;
    } catch (error) {
	  logger.error('[76][tumorcellpercentageMessageHandler]err=' + error.message);
  }
}
   
//병리 tumorcellpercentage
exports.tumorcellpercentagedata = (req,res, next) => {

  logger.info('[82][tumorcellpercentageList]data=' + JSON.stringify(req.body) );

  const result = tumorcellpercentageMessageHandler(req);
  result.then(data => {
     res.json(data);
  })
  .catch( error => {
    logger.error('[86][tumorcellpercentageMessageHandler]insert err=' + error.message);  
    res.sendStatus(500)
  }); 
}

const  tumorcellpercentageMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  	
	const pathologyNum = req.body.pathologyNum;

	logger.info('[96][tumorcellpercentageMessageHandler2]pathologyNum=' + pathologyNum  );

	//insert Query 생성
	const qry = "select tumorcellpercentage   from tumorcellpercentage where pathologyNum = @pathologyNum ";
  
  logger.info('[101][tumorcellpercentageMessageHandler2]select qry=' + qry );
 
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (error) {
    logger.error('[111][tumorcellpercentageList]select error=' + error.message  );
	}
}
   
//병리 filteredOriginData 보고서 조회
exports.tumorcellpercentageList = (req,res, next) => {

  logger.info('[118][tumorcellpercentageList]data=' + JSON.stringify(req.body) );
 
  const result = tumorcellpercentageMessageHandler2(req);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( error  =>
     {
      logger.error('[130][tumorcellpercentageList]error=' + error.message  );
       res.sendStatus(500)
      }
  ); 

}