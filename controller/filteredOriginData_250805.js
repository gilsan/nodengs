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

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// filteredOrigindata insert
const  filteredOrigindataSaveHandler = async (body_data) => {
  await poolConnect; // ensures that the pool has been created

  //insert Query 생성;
  //for 루프를 돌면서 filteredOriginData 카운트 만큼 
  const len = body_data.length;
  let result;
  if (len > 0 ) {
    for (let i = 0; i < len; i++) {

      const aminoAcidChange = body_data[i].aminoAcidChange;
      const coding = body_data[i].coding;
      const comsmicID  =  body_data[i].comsmicID;
      const cytoband  =  body_data[i].cytoband;
      const frequency  =  body_data[i].frequency;
      const gene  =  body_data[i].gene;
      const locus  =  body_data[i].locus;
      const oncomine  =  body_data[i].oncomine;
      const OncomineVariant = body_data[i].OncomineVariant;
      const pathologyNum  =  body_data[i].pathologyNum;
      const readcount  =  body_data[i].readcount;
      const type  =  body_data[i].type; 
      const variantID  =  body_data[i].variantID;
      const variantName  =  body_data[i].variantName;
      const transcript  =  body_data[i].transcript;

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
      logger.info("[51][filteredOriginData]transcript=" + transcript);

      const qry = "insert into filteredOriginData (aminoAcidChange, coding, comsmicID, cytoband, \
          frequency, gene, locus, oncomine, pathologyNum, readcount, type, \
          variantID, variantName, OncomineVariant, transcript) \
          values(@aminoAcidChange, @coding, @comsmicID, @cytoband, \
            @frequency, @gene, @locus, @oncomine, @pathologyNum, @readcount, @type, \
          @variantID, @variantName, @OncomineVariant, @transcript)";
        
      logger.info("[109][filteredOriginData] sql=" + qry);

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
          .input('OncomineVariant', mssql.VarChar, OncomineVariant)
          .input('transcript', mssql.VarChar, transcript);
          
          result = await request.query(qry);
          
          //return result;
  
      } catch (error) {
        logger.error('[115]filteredOrigindata err=' + error.message);
      }
    }
  } // End of If
}

const  filteredOrigindataMessageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  logger.info('[19][save][messageHandler][filteredOriginData]req=' + JSON.stringify( req.body));
    
  //입력 파라미터를 수신한다
  const pathologyNum  =  req.body.data[0].pathologyNum;
  const data_body  =  req.body.data;

  logger.info("[25][filteredOriginData]pathologyNum="+ pathologyNum);
 
  //insert Query 생성
  let sql2 = "delete from filteredOriginData where  pathologyNum = @pathologyNum ";

  logger.info('[30]filteredOrigindata sql=' + sql2);
  
  
  let result;

  try {
    const request = pool.request()
      .input('pathologyNum', mssql.VarChar, pathologyNum); 
      
      result = request.query(sql2);
    
    result.then( data => {
      console.log (data);

      result = filteredOrigindataSaveHandler(data_body);

      result.then (data_ins => {
        console.log (data_ins);
      })
      .catch(error => {
        logger.error('[40][filteredOrigindata ins err]err=' + error.message);
      })
    });
	
	//return result;
  } catch (error) {
	  logger.error('[40][filteredOrigindata del err]err=' + error.message);
  }
  
  return result;
}
   
//병리 filteredOrigindata 보고서 입력
exports.filteredOrigindata = (req,res, next) => {

  logger.info("[127][filteredOrigindata]req=" + JSON.stringify( req.body));

  const result = filteredOrigindataMessageHandler(req);

  result.then(data => {

     console.log('[132][filteredOrigindata][insert]', data);
     res.json({message: 'SUCCESS'});
  })
  .catch( error => {
    logger.error('[137][filteredOrigindata]err=' + error.message);
    res.sendStatus(500);
  }); 

}

const  filteredOrigindataMessageHandler2 = async (req) => {
	await poolConnect; // ensures that the pool has been created
	  
	//입력 파라미터를 수신한다
	//1. Detected Variants
	
	const pathologyNum = req.body.pathologyNum;

	logger.info('[151][filteredOrigindata][select]pathologyNum=' + pathologyNum);

	//insert Query 생성
	const qry = "select aminoAcidChange, coding \
                ,comsmicID ,cytoband \
                ,frequency ,gene \
                ,locus ,oncomine \
                ,pathologyNum ,readcount \
                ,type  ,variantID \
                ,variantName \
                ,OncomineVariant \
                , transcript \
				from filteredOriginData  \
				where pathologyNum = @pathologyNum ";

	logger.info("[163][filteredOrigindata]select sql=" + qry);
		   
	try {
		  const request = pool.request()
			.input('pathologyNum', mssql.VarChar, pathologyNum); 
			
		  const result = await request.query(qry);
		  
		 return result.recordset;
	} catch (error) {
		  logger.error('[175][filteredOrigindata] select error=' + error.message);
	}
}
   
//병리 filteredOriginData 보고서 조회
exports.filteredOriginList = (req,res, next) => {

  logger.info('[182]filteredOrigindata req=' + JSON.stringify(req.body));

  const result = filteredOrigindataMessageHandler2(req);

  result.then(data => {

     //console.log(json.stringfy());
     res.json(data);
  })
  .catch( error => {
    logger.error('[192]filteredOrigindata err=' + error.message); 
    res.sendStatus(500);
  }); 

}