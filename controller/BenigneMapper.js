// Beign ������ �ʿ���� �������� 
const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const { json } = require('body-parser');
const { errorMonitor } = require('winston-daily-rotate-file');
const { insertBenign } = require('./geneInfolists');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
function nvl(st, defaultStr){
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }
        
    return st ;
}

const listHandler = async (req) => {
    await poolConnect;  
    const genes			= req.body.genes; 
    const coding		= req.body.coding; 

    logger.info('[13]benign listHandler genes=' + genes + ", coding= " + coding );
	
	let sql ="select id, genes, location, exon, transcript, coding, amino_acid_change ";
    sql = sql + " from benign ";
    sql = sql + " where 1 = 1 ";
	if(genes != "") 
		sql = sql + " and genes like '%"+genes+"%'";
    if(coding != "") 
        sql = sql + " and coding like '%"+coding+"%'";
    sql = sql + " order by id";

	logger.info('[21]benign listHandler sql=' + sql);
    try {
       const request = pool.request(); 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[28]benign listHandler err=' + error.message);
    }
 }

// insert
const insertHandler = async (req) => { 
     const genes             = req.body.genes;
     const locat	         = req.body.locat;
     const exon              = req.body.exon;
     const transcript        = req.body.transcript;
     const coding            = req.body.coding;
     const aminoAcidChange   = req.body.aminoAcidChange;

     logger.info('[41]benign insertHandler data=' + genes + ", locat=" + locat + ", exon=" + exon
                                + ", transcript=" + transcript 
                                + ", coding=" + coding + ", aminoAcidChange=" + aminoAcidChange); 
 
     let sql = "insert into benign " ;
     sql = sql + " (genes, location, exon, "
     sql = sql + " transcript,coding, amino_acid_change)  "
     sql = sql + " values(  " 
	 sql = sql + " @genes, @locat, @exon, "
     sql = sql + " @transcript, @coding, @aminoAcidChange)";
     logger.info('[51]benign insertHandler sql=' + sql);
     
    try {
        const request = pool.request()
          .input('genes', mssql.VarChar, genes) 
          .input('locat', mssql.VarChar, locat) 
          .input('exon', mssql.VarChar, exon) 
          .input('transcript', mssql.VarChar, transcript) 
          .input('coding', mssql.VarChar, coding) 
          .input('aminoAcidChange', mssql.VarChar, aminoAcidChange); 
        const result = await request.query(sql)
      //  console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[64]benign insertHandler err=' + error.message);
    }
}

// update
const updateHandler = async (req) => { 
	 const id                = req.body.id;
     const genes             = req.body.genes;
     const locat			 = req.body.locat;
     const exon              = req.body.exon;
     const transcript        = req.body.transcript;
     const coding            = req.body.coding;
     const aminoAcidChange   = req.body.aminoAcidChange;

     logger.info('[79]benign updateHandler data='+ id + ", genes=" + genes + ", locat=" + locat + ", exon=" + exon
     + ", transcript=" + transcript 
     + ", coding=" + coding + ", aminoAcidChange=" + aminoAcidChange); 

     let sql = "update benign set " ;
     sql = sql + "  genes = @genes, location = @locat, exon =  @exon "
     sql = sql + "  ,transcript = @transcript ,coding = @coding  "
     sql = sql + "  ,amino_acid_change =  @aminoAcidChange "
     sql = sql + "where id = @id";
     logger.info('[88]benign updateHandler sql=' + sql); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
          .input('genes', mssql.VarChar, genes) 
          .input('locat', mssql.VarChar, locat) 
          .input('exon', mssql.VarChar, exon) 
          .input('transcript', mssql.VarChar, transcript) 
          .input('coding', mssql.VarChar, coding) 
          .input('aminoAcidChange', mssql.VarChar, aminoAcidChange); 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[103]benign updateHandler err=' + err);
    }
 }

// Delete
const deleteHandler = async (req) => { 
    const id        = req.body.id; 
    logger.info('[110]benign deleteHandler id-' + id);
 
    let sql = "delete benign  " ; 
    sql = sql + "where id = @id";
    logger.info('[114]benign deleteHandler sql=' + sql); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[41]benign deleteHandler err=' + error.message);
    }
 }


// List benign
 exports.listBenign = (req, res, next) => { 
    logger.info('[[130][listBenign] req' + JSON.stringify(req.body) );
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[137]listBenign err=' + error.message);
        res.sendStatus(500);
    });
 };

// Benign Insert
 exports.insertBenign = (req,res,next) => {
    logger.info('[145]insertBenign req=' + JSON.stringify( req.body)); 
    const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[152]insertBenign err=' + error.message);
        res.sendStatus(500)
    });
 };

// Benign Update
 exports.updateBenign = (req,res,next) => {
    logger.info('[159][updateBenign] req=' + JSON.stringify(req.body) );

	const result = updateHandler(req);
    result.then(data => {
          res.json(data);
     })
     .catch( error => {
        logger.error('[165]updateBenign err=' + error.message);
        res.sendStatus(500);
    });
	
 };

// Benign Delete
 exports.deleteBenign = (req,res,next) => {
    logger.info('[174][deleteBenign] req=' + JSON.stringify(req.body) );

	const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
        logger.error('[181]deleteBenign err=' +error.message);
        res.sendStatus(500)
    });
	
 };