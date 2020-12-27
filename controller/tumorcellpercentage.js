//================================================
//
//병리 tumorcellpercentage 결과지, 보고서 입력/수정/삭제 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');
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
const poolConnect = pool.connect();

const  tumorcellpercentageMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  //입력 파라미터를 수신한다
  
  const tumorcellpercentage = req.body.percentage;
  const pathologyNum  =  req.body.pathologyNum;
  console.log('[37][tumorcellpercentageMessageHandler][messageHandler]',tumorcellpercentage, pathologyNum  );
 
  //insert Query 생성
  let sql2 = "delete from tumorcellpercentage where  pathologyNum = @pathologyNum ";

  console.log(sql2);
	
  try {
	   const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum); 
		
	const result = await request.query(sql2)
	
	//return result;
  } catch (err) {
	console.error('SQL error', err);
  }

  console.log("e1", tumorcellpercentage);
  console.log("e8", pathologyNum);

  //insert Query 생성;
  const qry = "insert into tumorcellpercentage (tumorcellpercentage, pathologyNum) \
	         values(@tumorcellpercentage, @pathologyNum)";
		   
	console.log("sql",qry);

    try {
        const request = pool.request()
        .input('tumorcellpercentage', mssql.VarChar, tumorcellpercentage)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result = await request.query(qry);
        
        return result;

    } catch (err) {
        console.error('SQL error', err);
    }
 
  
}
   
//병리 tumorcellpercentage
exports.tumorcellpercentagedata = (req,res, next) => {
  
  const result = tumorcellpercentageMessageHandler(req);
  result.then(data => {
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}

const  tumorcellpercentageMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  	
	const pathologyNum = req.body.pathologyNum;

	console.log('[90][tumorcellpercentage]pathologyNum]',pathologyNum);

	//insert Query 생성
	const qry = "select tumorcellpercentage  from tumorcellpercentage 	where pathologyNum = @pathologyNum ";
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
   
//병리 filteredOriginData 보고서 조회
exports.tumorcellpercentageList = (req,res, next) => {

console.log(req.body);

  const result = tumorcellpercentageMessageHandler2(req);


  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}