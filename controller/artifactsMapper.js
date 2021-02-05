const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const { listBenign } = require('./BenigneMapper');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;  
    const genes			= req.body.genes;  
    const coding			= req.body.coding; 
    logger.info('[12]artifcats listHandler genes=' + genes + ", coding=" + coding);
	
	let sql ="select id, genes, location, exon, transcript, coding, amino_acid_change ";
    sql = sql + " from artifacts ";
    sql = sql + " where 1=1 " 
	if(genes != "") 
		sql = sql + " and genes like '%"+genes+"%'";
    if(coding != "") 
        sql = sql + " and coding like '%"+coding+"%'";
    sql = sql + " order by id ";

	logger.info('[12]artifcats listHandler sql' + sql);
    try {
       const request = pool.request(); 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[27]artifcats listHandler err=' + error.message);
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
     logger.info('[39]artifcats insertHandler genes=' + genes + ', locat=' + locat + ", exon" + exon
                                    + ", transcript" + transcript + ', coding=' + coding
                                    + ', aminoAcidChange=' + aminoAcidChange);   
 
     let sql = "insert into artifacts " ;
     sql = sql + " (genes, location, exon, "
     sql = sql + " transcript,coding, amino_acid_change)  "
     sql = sql + " values(  "
	 sql = sql + " @genes, @locat, @exon, "
     sql = sql + " @transcript, @coding, @aminoAcidChange)";
     
    logger.info('[50]artifcats insertHandler sql=' + sql);

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
        logger.error('[64]artifcats insertHandler err=' + error.message);
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

    logger.info('[78]artifcats updateHandler id=' + id + ', genes=' + genes
                   + ', locat=' + locat + ", exon" + exon
     + ", transcript" + transcript + ', coding=' + coding
     + ', aminoAcidChange=' + aminoAcidChange);   

     let sql = "update artifacts set " ;
     sql = sql + "  genes = @genes, location = @locat, exon =  @exon "
     sql = sql + "  ,transcript = @transcript ,coding = @coding  "
     sql = sql + "  ,amino_acid_change =  @aminoAcidChange "
     sql = sql + "where id = @id";
     logger.info('[88]artifcats updateHandler sql=' + sql);
     
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
        logger.error('[103]artifcats updateHandler err=' + error.message);
    }
 }

// Delete
const deleteHandler = async (req) => { 
	const id        = req.body.id; 
 
    let sql = "delete artifacts " ; 
    sql = sql + "where id = @id";
    
    logger.info('[114]artifcats deleteHandler id=' + id); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[123]artifcats deleteHandler err=' + error.message);
    }
}

// List artifacts
exports.listArtifacts = (req, res, next) => { 
    logger.info('[130]artifcats listBenign]req=' + JSON.stringify(req.body));
    const result = listHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
        logger.error('[136]artifcats listBenign err=' + error.message);
        res.sendStatus(500);
    });
 };

// artifacts Insert
 exports.insertArtifacts = (req,res,next) => {
    logger.info('[143]artifcats insertHandler req=' + JSON.stringify(req.body));

    const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[150]artifcats insertArtifacts err=' + error.body);
        res.sendStatus(500);
    });
 };

// artifacts Update
 exports.updateArtifacts = (req,res,next) => {
    logger.info('[157]artifcats updateArtifacts req=' + JSON.stringify(req.body));

	const result = updateHandler(req);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[164]artifcats updateArtifacts err=' + error.message);
        res.sendStatus(500);
    });
	
 };

// artifacts Delete
 exports.deleteArtifacts = (req,res,next) => {
    logger.info('[172]artifcats deleteArtifacts req=' + JSON.stringify(req.body));

	const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
        logger.error('[179]artifcats delete err=' + error.message);  
        res.sendStatus(500)
    });
	
 };