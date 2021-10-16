// 결과지 담당자
const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  updateHandler = async (req) => {
    await poolConnect; // ensures that the pool has been created

    const type     = req.body.type;
    const checker =  req.body.checker; // 검사자
    const reader  = req.body.reader;   // 판독자
    
    logger.info('[18][resultmanager][updateHandelr] type=' + type);
    logger.info('[19][resultmanager][updateHandelr] reader=' + reader);
    logger.info('[20][resultmanager][updateHandelr] checker=' + checker);

    const sql="update resultmanager set reader=@reader, checker=@checker  where type =@type";
    logger.info('[23][resultmanager][updateHandelr] sql=' + sql);

    try {

        const request = pool.request()
        .input('type', mssql.VarChar, type)
        .input('checker', mssql.NVarChar, checker)
        .input('reader', mssql.NVarChar, reader); // or: new sql.Request(pool1)
      const result = await request.query(sql)
      console.dir( result);
      
      return result;

    } catch {
        logger.error('[37][resultmanager][updateHandelr]  err=' + error.message);
    }

}

exports.update = (req,res, next) => {

    logger.info('[44][resultmanager][update] data=' + JSON.stringify( req.body));

    const result = updateHandler(req);
    result.then(data => {
       res.json(data);
    })
    .catch( error  => {
        logger.error('[51][resultmanager][update] err= ' + error.message);
        res.sendStatus(500);
    }); 
 }

 ////////////////////////////////////////////////////////////////////////////
 const  listHandler = async (req) => {
    await poolConnect; // ensures that the pool has been created

    const type     = req.body.type;   
    logger.info('[61][resultmanager][listHandelr] type=' + type);

    const sql=`select   isnull(type, '') type, isnull(checker, '') checker, isnull(reader, '') reader  from resultmanager  where type =@type`;
    logger.info('[64][resultmanager][listHandelr] sql=' + sql);

    try {

        const request = pool.request()
        .input('type', mssql.VarChar, type);
      const result = await request.query(sql);      
      return result.recordset;
    } catch {
        logger.error('[74][resultmanager][listHandelr]  err=' + error);
    }

}

exports.list = (req,res, next) => {

    logger.info('[80][resultmanager][list] data=' + JSON.stringify( req.body));

    const result = listHandler(req);
    result.then(data => {
        console.log(data);
       res.json(data);
    })
    .catch( error  => {
        logger.error('[87][resultmanager][list] err=' + error.message);
        res.sendStatus(500);
    }); 

 }
 ///////////////////////////////////////////////////////////////////
 const  listsHandler = async () => {
    await poolConnect; // ensures that the pool has been created
    const sql=`select   isnull(type, '') type, isnull(checker, '') checker, isnull(reader, '') reader  from resultmanager`;
    logger.info('[97][resultmanager][listHandelr] sql=' + sql);

    try {
      const request = pool.request();
      const result = await request.query(sql);      
      return result.recordset;
    } catch {
        logger.error('[104][resultmanager][listsHandelr]  err=' + error);
    }

}

exports.lists = (req,res, next) => {

    const result = listsHandler(req);
    result.then(data => {
        console.log(data);
       res.json(data);
    })
    .catch( error  => {
        logger.error('[117][resultmanager][lists] err=' + error.message);
        res.sendStatus(500);
    }); 

 }

