// Beign ������ �ʿ���� �������� 
const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;  
    const genes			= req.body.genes; 
    logger.info('[13][get comments list]data=' + genes);
	
	let sql ="select id, type, gene, comment, reference, variant_id";
    sql = sql + " from comments ";
	if(genes != "") 
		sql = sql + " where gene like '%"+genes+"%'";
    sql = sql + " order by id";
    logger.info('[20][get comments list]sql=' + sql);
    
    try {
       const request = pool.request()
         .input('genes', mssql.VarChar, genes); 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (error) {
    logger.error('[28][get comments list]err=' + error.message);
   }
 }

// insert
const insertHandler = async (req) => { 
    const type				 = req.body.commentsType;
    const gene              = req.body.gene;
    const variant_id        = req.body.variant_id;
    const comment           = req.body.comment;
    const reference         = req.body.reference; 

    logger.info('[40]insertComments data=' + type + ", " + gene + ", " + variant_id
                               + comment + ", " + reference);

    let sql = "insert into comments " ;
    sql = sql + "  (type, gene, variant_id, comment, reference) " 
    sql = sql + " values(  "
    sql = sql + " @type, @gene, @variant_id, @comment, @reference) ";
    logger.info('[47]insertComments sql=' + sql); 
     
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type) 
          .input('gene', mssql.VarChar, gene) 
		  .input('variant_id', mssql.VarChar, variant_id) 	
          .input('comment', mssql.NVarChar, comment) 
          .input('reference', mssql.NVarChar, reference)   
        const result = await request.query(sql)
      //  console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[60]insertComments err=' + error.message);
    }
}

// update
const updateHandler = async (req) => { 
	 const id                = req.body.id;
     const type				 = req.body.commentsType;
     const gene              = req.body.gene;
	 const variant_id        = req.body.variant_id;
     const comment           = req.body.comment;
     const reference         = req.body.reference; 
    
     logger.info('[73]updateComments data=' + id + ', type=' + type  + ', gene=' + gene
                            + ', comment=' + comment + ', reference=' + reference);
	
     let sql = "update comments set " ;
     sql = sql + "  type = @type, gene = @gene , variant_id = @variant_id ";
     sql = sql + "  ,comment = @comment ,reference = @reference  "; 
     sql = sql + "where id = @id";
     
     logger.info('[81]updateComments sql=' + sql);
    
	 try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
          .input('gene', mssql.VarChar, gene) 
		  .input('variant_id', mssql.VarChar, variant_id) 	
          .input('type', mssql.VarChar, type)  
		  .input('comment', mssql.NVarChar, comment) 
          .input('reference', mssql.NVarChar, reference)  
        const result = await request.query(sql)
        console.dir( result); 
        return result;
     } catch (error) {
        logger.error('[95]updateComments err=' + error.message);
     }
}

// Delete
const deleteHandler = async (req) => { 
	const id        = req.body.id; 
    logger.info('[102]delete Comments id=' + id); 
    let sql = "delete comments  " ; 
    sql = sql + "where id = @id"; 
    logger.info('[105]delete Comments sql=' + sql);

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[114]delete Comments err=' + error.message);
    }
}

// List comments
exports.listComments = (req, res, next) => { 
    logger.info('[120][listComments]req=' + JSON.stringify(req.body));
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[126]listComments err=' + error.message);
        res.sendStatus(500)
    });
};

// comments Insert
exports.insertComments = (req,res,next) => {
    logger.info('[117]insertComments req=' + JSON.stringify(req.body));

    const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( error =>{
        logger.error('[117]insertComments err=' + error.message);
        res.sendStatus(500)
    });
};

// comments Update
 exports.updateComments = (req,res,next) => {
    logger.info('[147]updateComments]req=' + JSON.stringify(req.body));

	const result = updateHandler(req);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[154]updateComments err=' + error.message);
        res.sendStatus(500)
    });	
};

// comments Delete
 exports.deleteComments = (req,res,next) => {
    logger.info('[161][this.deleteComments] req=' + JSON.stringify(req.body) );

	const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
     })
     .catch( error => {
        logger.error('[167]deleteComments err=' + error.message);
        res.sendStatus(500)
    });
 };