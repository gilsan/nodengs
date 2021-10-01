// Beign ������ �ʿ���� �������� 
const express = require('express');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
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
    let sheet =  nvl(req.body.sheet, "");
    logger.info('[13][get comments list]genes=' + genes+ ", sheet=" + sheet);
	
	let sql ="select id, type, gene, comment, reference, isnull(variant_id, '') variant_id, isnull(sheet, 'AMLALL') sheet ";
    sql = sql + " from comments ";
    sql = sql + " where 1=1 " 
	if(genes != "") 
		sql = sql + " and gene like '%"+genes+"%'";

    if(sheet.length > 0 )
    {
        sql = sql +  " and type = '"+ sheet + "'";
    }

    sql = sql + " order by id";
    logger.info('[20][get comments list]sql=' + sql);
    
    try {
       const request = pool.request()
         .input('genes', mssql.VarChar, genes)
         .input('sheet', mssql.VarChar, sheet); 
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
    let sheet =  nvl(req.body.sheet, "AMLALL");

    logger.info('[40]insertComments data=' + type + ", " + gene + ", " + variant_id
                               + comment + ", " + reference + "," + sheet);

    let sql = "insert into comments " ;
    sql = sql + "  (type, gene, variant_id, comment, reference, sheet) " 
    sql = sql + " values(  "
    sql = sql + " @type, @gene, @variant_id, @comment, @reference, @sheet) ";
    logger.info('[47]insertComments sql=' + sql); 
     
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type) 
          .input('gene', mssql.VarChar, gene) 
		  .input('variant_id', mssql.VarChar, variant_id) 	
          .input('comment', mssql.NVarChar, comment) 
          .input('reference', mssql.NVarChar, reference)  
          .input('sheet', mssql.NVarChar, sheet)   ;

        const result = await request.query(sql);
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
     let sheet =  nvl(req.body.sheet, "AMLALL");
    
     logger.info('[73]updateComments data=' + id + ', type=' + type  + ', gene=' + gene
                            + ', comment=' + comment + ', reference=' + reference + ', sheet=' + sheet);
	
     let sql = "update comments set " ;
     sql = sql + "  type = @type, gene = @gene , variant_id = @variant_id ";
     sql = sql + "  ,comment = @comment ,reference = @reference, sheet=@sheet  "; 
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
          .input('sheet', mssql.NVarChar, sheet);

        const result = await request.query(sql);
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