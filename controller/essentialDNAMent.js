
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const amlReportInsert = require('./amlReportInsert');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


// 필수유전자 코멘트

// 입력
const  dnaInsertHandler = async (req) => {
    await poolConnect; // ensures that the pool has been created
    const title = req.body.title;
    const mutationDna = req.body.mutationDna;
    const amplificationDna = req.body.amplificationDna;
    const fusionDna = req.body.funsionDna;

    const qry = "insert into essentialDNAMent (title, mutation, amplification, fusion )\
         values(@title, @mutationDna,  @amplificationDna, @fusionDna)";
    
         try {
            const request = pool.request()
            .input('title', mssql.VarChar, title)
            .input('mutationDna', mssql.NVarChar, mutationDna)
			.input('amplificationDna', mssql.VarChar, amplificationDna)
            .input('fusionDna', mssql.NVarChar, fusionDna); 
			
		    result = await request.query(qry);
            return result;
         } catch (error) {
		  logger.error('[37][essentialDNAMent][insert comments]err=' + error.message);
	  }
}

exports.dnainsert = (req, res, next) => {

    const result = dnaInsertHandler(req);
    result.then(data => { 
       res.json(data);
  })
  .catch( error => {
    logger.error('[48][essentialDNAMent][insert Error] err=' + error.message);
    res.sendStatus(500);
  });

}

