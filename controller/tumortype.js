// 
//================================================
//
//병리 tumortype 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  tumorMutationalBurdenMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[33][save][messageHandler]data=' + JSON.stringify( req.body));
    
  //입력 파라미터를 수신한다
  
  const tumortype = req.body.tumortype;
  const pathologyNum  =  req.body.pathologyNum;
  
  logger.info('[33][save][messageHandler]pathologyNum=' + pathologyNum);
  logger.info('[33][save][messageHandler]tumortype=' + tumortype);
  
  //insert Query 생성
  let sql2 = "delete from tumortype where  pathologyNum = @pathologyNum ";

  logger.info('[33][save][messageHandler]sql=' + sql2);
  
  try {
	  const request = pool.request()
		  .input('pathologyNum', mssql.VarChar, pathologyNum); 
		
	  const result = await request.query(sql2, (error, result2)=> {
      if (error)
      {
          logger.error('[58][tumortype]error= ' + error.message);
      }
      logger.info("[58][tumortype]result=" + JSON.stringify( result2))
    });
	
	//return result;
  } catch (err) {
	  logger.error('[tumortype]del error=' + err);
  }

  //insert Query 생성;
  const qry = "insert into tumortype (tumortype, pathologyNum) \
	         values(@tumortype, @pathologyNum)";
  
  logger.info('[33][save][messageHandler]qry=' + qry);

    try {
        const request = pool.request()
        .input('tumortype', mssql.VarChar, tumortype)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result2 = await request.query(qry);
        
        return result2;
    } catch (error) {
        logger.error('[58][tumortype] error=' + error.message);
    }
}
   
//병리 tumorMutationalBurden 보고서 입력
exports.tumortypedata = (req,res, next) => {

  logger.error('[58][tumortypeBurden]save=' + JSON.stringify(req.body));

  const result = tumorMutationalBurdenMessageHandler(req);
  result.then(data => {
     res.json({message: 'SUCCESS'});
  })
  .catch( error  => {
    logger.error('[58][tumortypeBurden]save err=' + error.message);
    res.sendStatus(500);
  }); 
}

const  tumorMutationalBurdenMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
 
	const pathologyNum = req.body.pathologyNum;

	logger.info('[150][select]pathologyNum=' + pathologyNum);

	//insert Query 생성
	const qry = "select tumortype  from tumortype\
				where pathologyNum = @pathologyNum ";

	logger.info("[116][tumortype]select sql=" + qry);
		   
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (error) {
		  logger.error('[127][tumortype select] error=' + error.message);
	}
}
   
//병리 filteredOriginData 보고서 조회
exports.tumortypeList = (req,res, next) => {

  logger.info("[58][tumortype list]data=" + JSON.stringify( req.body));

  const result = tumorMutationalBurdenMessageHandler2(req);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( error => {
    logger.error('[58][tumortype list]err=' + error.message); 
    res.sendStatus(500);
  }); 

}