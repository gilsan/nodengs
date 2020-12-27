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

const  tumorMutationalBurdenMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  console.log('[33][save][messageHandler]',req.body);
    
  //입력 파라미터를 수신한다
  
  const tumortype = req.body.tumortype;
  const pathologyNum  =  req.body.pathologyNum;
  
  console.log("e8", pathologyNum);
 
  //insert Query 생성
  let sql2 = "delete from tumortype where  pathologyNum = @pathologyNum ";

  console.log(sql2);
	
  try {
	const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum); 
		
	const result = await request.query(sql2)
	
	//return result;
  } catch (err) {
	console.error('SQL error', err);
  }

  console.log("e1", tumortype);
  console.log("e8", pathologyNum);

  //insert Query 생성;
  const qry = "insert into tumortype (tumortype, pathologyNum) \
	         values(@tumortype, @pathologyNum)";
		   
	console.log("sql",qry);

    try {
        const request = pool.request()
        .input('tumortype', mssql.VarChar, tumortype)
        .input('pathologyNum', mssql.VarChar, pathologyNum);
        
        const result = await request.query(qry);
        
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
}
   
//병리 tumorMutationalBurden 보고서 입력
exports.tumortypedata = (req,res, next) => {

console.log(req.body);

  const result = tumorMutationalBurdenMessageHandler(req);
  result.then(data => {
     res.json({message: 'SUCCESS'});
  })
  .catch( err  => res.sendStatus(500)); 
}

const  tumorMutationalBurdenMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
 
	const pathologyNum = req.body.pathologyNum;

	console.log('[150][select]pathologyNum',pathologyNum);

	//insert Query 생성
	const qry = "select tumortype  from tumortype\
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
   
//병리 filteredOriginData 보고서 조회
exports.tumortypeList = (req,res, next) => {

console.log(req.body);

  const result = tumorMutationalBurdenMessageHandler2(req);


  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}