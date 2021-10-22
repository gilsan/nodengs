const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


// 목록
const  liststHandler = async (type) => {
    await poolConnect;  

    const sql=`select  id, isnull(code, '') code, isnull(report, '') report, isnull(target, '') target, isnull(specimen, '') specimen,
       isnull(analyzedgene, '') analyzedgene, isnull(method, '') method, isnull(comment1, '') comment1, isnull(comment2, '') comment2 
       from codedefaultvalue where type=@type`;

    logger.info('[19][codedefaultvalue][liststHandler] =' + sql);
    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type);
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[28][codedefaultvalue][liststHandler] err=' + error.message);
    }

}
exports.getLists = (req, res, next) => {
    logger.info('[31][codedefaultvalue][getLists] req=' + JSON.stringify(req.body)); 
    const pathologyNum = req.body.type;
 
    const result = liststHandler(type);
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[39][codedefaultvalue][getLists] err=' + error.message);
        res.sendStatus(500);
    });
}


// 입력
const insertHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
    const target= req.body.target;
    const specimen= req.body.specimen;
    const analyzedgene= req.body.analyzedgene;
    const method= req.body.method;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;

    sql=`insert into codedefaultvalue (type, code, report, target,specimen, analyzedgene, method, comment1, comment2)
      vlaues(@type, @code, @report, @target, @specimen, @analyzedgene, @method, @comment1, @comment2)`

      logger.info('[61][codedefaultvalue][insertHandler] =' + sql);

      try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.VarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input(' analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2);

        const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[78][codedefaultvalue][insertHandler] err=' + error.message);
    }     

}

exports.itemInsert = (req, res, next) => {
    logger.info('[84][codedefaultvalue][itemInsert] req=' + JSON.stringify(req.body)); 
 
    const result = insertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[91][codedefaultvalue][itemInsert] err=' + error.message);
        res.sendStatus(500);
    });
}


// 수정
const updateHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
    const target= req.body.target;
    const specimen= req.body.specimen;
    const analyzedgene= req.body.analyzedgene;
    const method= req.body.method;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;

    sql=`update into codedefaultvalue set   code=@code, report=@report, target=@target,
    specimen=@specimen, analyzedgene=@analyzedgene, method=@method, comment1=@comment1, comment2=@comment2
      where type=@type`;

    logger.info('[114][codedefaultvalue][updateHandler] =' + sql);

    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.VarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input(' analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[131][codedefaultvalue][updateHandler] err=' + error.message);
    }  

}

exports.itemUpdate = (req, res, next) => {
    logger.info('[137][codedefaultvalue][temUpdate] req=' + JSON.stringify(req.body)); 
 
    const result = updateHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[141][codedefaultvalue][temUpdate] err=' + error.message);
        res.sendStatus(500);
    });

}


// 삭제
const deleteHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
 
    sql=`delete from codedefaultvalue  where type=@type`;

    logger.info('[159][codedefaultvalue][deleteHandler] =' + sql);

    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[168][codedefaultvalue][deleteHandler] err=' + error.message);
    }  

}


exports.itemDelete = (req, res, next) => {
    logger.info('[175][codedefaultvalue][itemDelete] req=' + JSON.stringify(req.body)); 
 
    const result = deleteHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[182][codedefaultvalue][itemDelete] err=' + error.message);
        res.sendStatus(500);
    });



}
