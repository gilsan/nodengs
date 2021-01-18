//================================================
//
//병리 filteredOriginData 결과지, 보고서 입력/수정/삭제 기능
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

const  filteredOrigindataMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  //console.log('[33][save][messageHandler][filteredOriginData]',req.body);
    
  //입력 파라미터를 수신한다
  
  const pathologyNum  =  req.body.data[0].pathologyNum;

  logger.info("[51][filteredOriginData]pathologyNum="+ pathologyNum);
 
  //insert Query 생성
  let sql2 = "delete from filteredOriginData where  pathologyNum = @pathologyNum ";

  logger.info(sql2);
	
  try {
    const request = pool.request()
      .input('pathologyNum', mssql.VarChar, pathologyNum); 
      
    const result = await request.query(sql2)
	
	//return result;
  } catch (err) {
	  logger.error('[del err]SQL error=' + err);
  }

  //insert Query 생성;
  //for 루프를 돌면서 filteredOriginData 카운트 만큼 
  const len = req.body.data.length;
  let result;
  if (len > 0 ) {
      for (let i = 0; i < len; i++) {

        const aminoAcidChange = req.body.data[i].aminoAcidChange;
        const coding = req.body.data[i].coding;
        const comsmicID  =  req.body.data[i].comsmicID;
        const cytoband  =  req.body.data[i].cytoband;
        const frequency  =  req.body.data[i].frequency;
        const gene  =  req.body.data[i].gene;
        const locus  =  req.body.data[i].locus;
        const oncomine  =  req.body.data[i].oncomine;
        const OncomineVariant = req.body.data[i].OncomineVariant;
        const pathologyNum  =  req.body.data[i].pathologyNum;
        const readcount  =  req.body.data[i].readcount;
        const type  =  req.body.data[i].type; 
        const variantID  =  req.body.data[i].variantID;
        const variantName  =  req.body.data[i].variantName;

        logger.info("[51][filteredOriginData]aminoAcidChange=" + aminoAcidChange);
        logger.info("[51][filteredOriginData]coding=" + coding);
        logger.info("[51][filteredOriginData]comsmicID=" + comsmicID);
        logger.info("[51][filteredOriginData]cytoband=" + cytoband);
        logger.info("[51][filteredOriginData]frequency=" + frequency);
        logger.info("[51][filteredOriginData]gene=" + gene);
        logger.info("[51][filteredOriginData]locus=" + locus);
        logger.info("[51][filteredOriginData]oncomine=" + oncomine);
        logger.info("[51][filteredOriginData]pathologyNum=" + pathologyNum);
        logger.info("[51][filteredOriginData]readcount=" + readcount);
        logger.info("[51][filteredOriginData]type=" + type);
        logger.info("[51][filteredOriginData]variantID=" + variantID);
        logger.info("[51][filteredOriginData]variantName=" + variantName);

        const qry = "insert into filteredOriginData (aminoAcidChange, coding, comsmicID, cytoband, \
            frequency, gene, locus, oncomine, pathologyNum, readcount, type, \
            variantID, variantName, OncomineVariant) \
            values(@aminoAcidChange, @coding, @comsmicID, @cytoband, \
              @frequency, @gene, @locus, @oncomine, @pathologyNum, @readcount, @type, \
            @variantID, @variantName, @OncomineVariant)";
          
        console.log("[109][filteredOriginData] sql=" + qry);

         try {
            const request = pool.request()
            .input('aminoAcidChange', mssql.VarChar, aminoAcidChange)
            .input('coding', mssql.VarChar, coding)
            .input('comsmicID', mssql.VarChar, comsmicID)
            .input('cytoband', mssql.VarChar, cytoband)
            .input('frequency', mssql.VarChar, frequency)
            .input('gene', mssql.VarChar, gene)
            .input('locus', mssql.VarChar, locus)
            .input('oncomine', mssql.VarChar, oncomine)
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('readcount', mssql.VarChar, readcount)
            .input('type', mssql.VarChar, type)
            .input('variantID', mssql.VarChar, variantID)
            .input('variantName', mssql.VarChar, variantName)
            .input('OncomineVariant', mssql.VarChar, OncomineVariant);
            
            result = await request.query(qry, (error, result)=> {
              if (error)
              {
                  logger.error('[124][filteredOriginData][error= ' + error);
              }
              logger.info("result=" + result);
            });
            
            //return result;
    
        } catch (err) {
            console.error('SQL error', err);
        }

      }
  } // End of If
  
  
  //const uuid = uuidv4();
  //console.log('uuid:', uuid);
  return result;
  
}
   
//병리 filteredOrigindata 보고서 입력
exports.filteredOrigindata = (req,res, next) => {

  logger.info("[147][filteredOrigindata]req=" + JSON.stringify( req.body));

  const result = filteredOrigindataMessageHandler(req);

  result.then(data => {

     console.log('[162][filteredOrigindata][insert]', data);
     res.json({message: 'SUCCESS'});
  })
  .catch( err  => res.sendStatus(500)); 

}

const  filteredOrigindataMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. Detected Variants
	
	const pathologyNum = req.body.pathologyNum;

	logger.info('[168][filteredOrigindata][select]pathologyNum=' + pathologyNum);

	//insert Query 생성
	const qry = "select aminoAcidChange, coding \
                ,comsmicID ,cytoband \
                ,frequency ,gene \
                ,locus ,oncomine \
                ,pathologyNum ,readcount \
                ,type  ,variantID \
                ,variantName \
                ,OncomineVariant \
				from filteredOriginData  \
				where pathologyNum = @pathologyNum ";

	logger.info("[183][filteredOrigindata]select sql=" + qry);
		   
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (err) {
		  logger.error('[filteredOrigindata] select error=' + err);
	}
}
   
//병리 filteredOriginData 보고서 조회
exports.filteredOriginList = (req,res, next) => {

console.log(req.body);

  const result = filteredOrigindataMessageHandler2(req);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( err  => res.sendStatus(500)); 

}