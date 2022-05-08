
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
 function nvl(st, defaultStr){
    
  console.log('st=', st);
  if(st === undefined || st == null || st == "") {
      st = defaultStr ;
  }
      
  return st ;
}

// 정도관리 리스트
const  statecontrolSelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    //select Query 생성
        const qry = `SELECT
            isnull( dnaRnasep, '') dnaRnasep
            , isnull(rna18s, '') rna18s
            , isnull(averageBase, '') averageBase
            , isnull(uniformity, '%') uniformity
            , isnull(meanRead, 'bp') meanRead
            , isnull(meanRaw, '%') meanRaw
            , isnull(mapd, '') mapd
            , isnull(rnaMapped, '') rnaMapped
        FROM statecontrol 
        where pathology_num=@pathologyNum`;

        logger.info('[50]statecontrolSelect sql=' + qry);
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[60]statecontrolSelectHandler err=' + error.message);
    }
}

// get statecontrol List
exports.statecontrolList = (req, res, next) => {
    logger.info('[67]statecontrolList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = statecontrolSelectHandler(pathologyNum);
    result.then(data => {  
        //console.log('[108][statecontrolList]', data);
         

        // 2021.08.03 
        // 정도관리 데이타 없으면 강제로 json 만들어서 클라이언트에 보낸다.
        if (data.length == 0)
        {
            //console.log("000");

            const json2 = '[{"dnaRnasep":"", "rna18s":"", "averageBase":"", "uniformity":"%", "meanRead":"bp", "meanRaw":"%", "mapd":"", "rnaMapped":""}]';
            let data2 = JSON.parse(json2);

            //console.log(JSON.stringify(data2));

            res.json(data2);
        }
        else
        {

          res.json(data);
        }
    })
    .catch( error => {
        logger.error('[76]statecontrolList err=' + error.message);
        res.sendStatus(500)
    }); 
 };

 // 정도관리 입력
 const  statecontrolInsertHandler = async (pathologyNum, mapd, totalMappedFusionPanelReads) => {
    logger.info('[94][statecontrolInsertHandler]pathologyNum=' + pathologyNum  );
    logger.info('[95][statecontrolInsertHandler] mapd =' + mapd);
    logger.info('[96][statecontrolInsertHandler]totalMappedFusionPanelReads=' + totalMappedFusionPanelReads  );
 
    let result;  
    //insert Query 생성;
    const query = `select count(*) as cnt from statecontrol where pathology_num = @pathologyNum`;
    try {
        request = pool.request()
        .input('pathologyNum', mssql.VarChar, pathologyNum);

        result = await request.query(query); 
       
        console.log(result.recordset[0].cnt);
        if (result.recordset[0].cnt === 0) {
            qry = `insert into statecontrol 
                (dnaRnasep, pathology_num ,rna18s, averageBase, uniformity, meanRead, meanRaw, mapd, rnaMapped)
            values('', @pathology_num, '', '', '%', 'bp', '%', @mapd,@totalMappedFusionPanelReads)`;
        } else {
            qry = `update statecontrol   
                        set  mapd = @mapd, 
                        rnaMapped =  @totalMappedFusionPanelReads 
                        where pathology_num = @test_code`;
        }
        console.log(qry);
        request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum)
            .input('mapd', mssql.VarChar, mapd)
            .input('totalMappedFusionPanelReads', mssql.VarChar, totalMappedFusionPanelReads);

        result = request.query(qry);     
        return result;

    } catch (error) {
        logger.error('[825] *** [limsDnactSaveHandler] *** err=  ****  ' + error.message);
    }

    /*
   
    // 삭제
    const sql = "delete from statecontrol where pathology_num = @pathologyNum ";
    logger.info('[100][statecontrolInsertHandler]delete sql=' + sql);
    const insertSql = "insert into  statecontrol (pathology_num, mapd, rnaMapped) values(@pathologyNum, @mapd, @totalMappedFusionPanelReads)"
    logger.info('[102][statecontrolInsertHandler]delete sql=' + insertSql);
     try {
        const request = pool.request()
		.input('pathologyNum', mssql.VarChar, pathologyNum)
        .input('mapd', mssql.VarChar, mapd)
        .input('totalMappedFusionPanelReads', mssql.VarChar, totalMappedFusionPanelReads);
		
        const deleteResult = request.query(sql);
        deleteResult.then( async (data)  => {
            console.log('[111][statecontrolInsertHandler]' , data);
            const result = await request.query(insertSql);
            return result;
        });
         
     } catch(err) {
        logger.error('[117][statecontrolInsertHandler] err=' + error.message);
     }
     */

 }

 exports.statecontrolInsert = (req, res, next) => {
    logger.info('[123] statecontrolInsert req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const mapd = req.body.mapd;
    const totalMappedFusionPanelReads = req.body.totalMappedFusionPanelReads;

    const result = statecontrolInsertHandler(pathologyNum, mapd, totalMappedFusionPanelReads);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[134] statecontrolInsert err=' + error.message);
        res.sendStatus(500)
    }); 

 }


