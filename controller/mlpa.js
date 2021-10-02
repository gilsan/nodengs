const express = require('express');
const router = express.Router();
const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
//const { json } = require('body-parser');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 


/////////////////////////////////////////////////////////////////////
// mlpa 삭제

const deleteHandlerMlpa = async (type) => {
    await poolConnect;

    logger.info('[18][deleteHandlerMlpa]delete Mlpa] type=' + type);
    //delete Query 생성;    
    const qry ="delete mlpa where type=@type";           
    logger.info("[21][screenList][del Mlpa]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type);
          result = await request.query(qry);          
    } catch (error) {
      logger.error('[28][deleteHandlerMlpa][del Mlpa]err=' +  error.message);
    }
      
    return result;
};

// MLPA DATA 삭제
const deleteMlpaDataHandler = async (type) => {
    await poolConnect;

    logger.info('[38][deleteMlpaDataHandler]delete MlpaData] type=' + type);
    //delete Query 생성;    
    const qry ="delete mlpaData where type=@type";           
    logger.info("[41][deleteMlpaDataHandler][del Mlpa Data]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type);
          result = await request.query(qry);          
    } catch (error) {
      logger.error('[48][deleteMlpaDataHandler][del Mlpa Data]err=' +  error.message);
    }
      
    return result;
};

// MLPA 입력
const insertMlpaHandler = async (type, title, result, conclusion, technique, comment ) => {
    await poolConnect;
 
    const  sql =`insert  into mlpa (type, title, result,comment, technique, conclusion)
                 values ( @type, @title, @result, @comment, @technique, @conclusion)`;

    logger.info('[61][insertMlpaHandler]qry=' + sql);
    try {
        const request = pool.request()
                .input('type', mssql.NVarChar, type)  
                .input('title',mssql.NVarChar, title)
                .input('result', mssql.NVarChar, result)
                .input('comment', mssql.NVarChar, comment)
                .input('technique', mssql.NVarChar,technique)
                .input('conclusion', mssql.NVarChar,conclusion);

        const finish = await request.query(sql)
        return finish;

    }  catch (err) {
		console.error('[75][insertMlpaHandler]  SQL error', err);
	} 
 
};

// MLPA DATA 입력
const insertMlpaDataHandler = async (type, mlpaData) => {
    await poolConnect;

  // for 루프를 돌면서 report_mlpa 카운트 만큼       //report_mlpa Count
  logger.info('[85][insertMlpaDataHandler][ type ] =' + type);
  logger.info('[86][insertMlpaDataHandler][ mlpaData ]=' + JSON.stringify(mlpaData));

  for (i = 0; i < mlpaData.length; i++)
  {
    let site              = mlpaData[i].site;
    let result            = mlpaData[i].result;
    let seq               = mlpaData[i].seq;

 
    logger.info('[101][insertMlpaDataHandler][insert mlpa data]seq = ' + seq + ', site=' + site 
                          + ', result=' + result + ', type=' + type );

    //insert Query 생성;
    const qry = `insert into mlpaData (type, site,  result,  seq)  values(@type, @site,  @result,   @seq)`;           
    logger.info('[106][insertMlpaDataHandler][insert mlpa data]sql=' + qry);

      try {
          const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('site', mssql.VarChar, site)
            .input('seq', mssql.VarChar, seq)
            .input('result', mssql.VarChar, result);
           
           finish = await request.query(qry);         
          
      } catch (error) {
        logger.error('[124][insertMlpaDataHandler][insert mlpa data]err=' + error.message);
      }
      
  } // End of For Loop
   return finish;
};

// 검사자 갱신
const checkerHandler = async (specimenNo, examin, recheck) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[129][checkerHandler][update screen]data=' + specimenNo + ", "  + examin  + ", " + recheck,); 

    let sql ="update [dbo].[patientinfo_diag]   set examin=@examin, recheck=@recheck  where specimenNo=@specimenNo ";   
    logger.info('[132][checkerHandler][set screen]sql=' + sql);
    try {
        const request = pool.request()
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('specimenNo', mssql.VarChar, specimenNo); 
        const result = await request.query(sql)

        return result.recordset;
    } catch (error) {
      logger.error('[142][checkerHandler][set screen]err=' + error.message);
    }

};

 
exports.saveScreenMlpa = (req,res, next) => {
    logger.info('[149][MLPA][saveScreenMlpa]req=' + JSON.stringify(req.body));
    
    const specimenNo        = req.body.specimenNo;
    let type = req.body.type;
    let title = req.body.title;
    let result = req.body.result;
    let conclusion = req.body.conclusion;
    let technique = req.body.technique;
    const comment = req.body.comment;
    const mlpaData = req.body.data;
 
    const examin    = '';
    const recheck   = '';

    logger.info('[169][MLPA][saveScreenMlpa]specimenNo=, ' + specimenNo); 
    const mlpaDel = deleteHandlerMlpa(type);
    mlpaDel.then(data => {

      const mlpaDataDel = deleteMlpaDataHandler(type);
      mlpaDataDel.then(data => {
    
        const mlpaInsert = insertMlpaHandler(type, title, result, conclusion, technique, comment);
        mlpaInsert.then(data => {
    
          const  mlpaDataInsert = insertMlpaDataHandler(type, mlpaData);
          mlpaDataInsert.then(data => {
              // 검사지 변경
              const check = checkerHandler(specimenNo,  examin, recheck);
              check.then(data => {
                    res.json({message: 'OK'});
                });
            });
        });
      });
            
    })
    .catch( error  => {
      logger.error('[185][screenList][saveScreenMlpa]err=' + error.message);
      res.sendStatus(500)
    });
   
}


/////////////////////////////////////////////////////////////////////
// mlpa 조회
const getMlpaContentHandler = async (type) => {
    await poolConnect;

    const sql=`select isnull(title, '') title, isnull(result, '') result, isnull(comment, '') comment, isnull(technique, '') technique,
        isnull(conclusion, '') conclusion from mlpa where type=@type`;
    logger.info('[198][getMlpaContentHandler][sql]=' + sql);
    try {
        const request = pool.request()
                .input('type', mssql.NVarChar, type); 
        const finish = await request.query(sql)
        return finish.recordsets[0];

    }  catch (err) {
		console.error('[206][insertMlpaHandler]  SQL error', err);
	} 
}

exports.mlpaContent = (req,res, next) => {
    logger.info('[211][mlpaContent][mlpaLists]req=' +  req.body.type);
    let type = req.body.type;

    const mlpaContents = getMlpaContentHandler(type);
    mlpaContents.then(data => {
        res.json(data);           
    })
    .catch( error  => {
      logger.error('[220][screenList][saveScreenMlpa]err=' + error.message);
      res.sendStatus(500)
    });

}

//////
// MLPA DATA 조회
const getMlpaDataHandler = async (type) => {
    await poolConnect;

    const sql=`select isnull(site, '') site, isnull(result, '') result, isnull(seq, '') seq from mlpaData where type=@type`;
    logger.info('[231][getMlpaContentHandler][sql]=' + sql);
    try {
        const request = pool.request()
                .input('specimenno', mssql.NVarChar, specimenno); 
        const finish = await request.query(sql)
        return finish.recordsets[0];
    }  catch (err) {
		console.error('[238][insertMlpaHandler]  SQL error', err);
	} 
}

exports.mlpaDatas = (req,res, next) => {
    logger.info('[243][screenList][mlpaLists]req=' +  req.body.type);
    let type       = req.body.type

    const mlpaContents =  getMlpaDataHandler(specimenno, type);
    mlpaContents.then(data => {
        res.json(data);          
    })
    .catch( error  => {
      logger.error('[251][screenList][saveScreenMlpa]err=' + error.message);
      res.sendStatus(500)
    });


}

/////////////////////////////////////////

 