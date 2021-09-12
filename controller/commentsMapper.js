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
    logger.info('[13][get comments list]data=' + genes+ ", sheet=" + sheet);
	
	let sql ="select id, type, gene, comment, reference, variant_id";
    sql = sql + " from comments ";
	if(genes != "") 
		sql = sql + " where gene like '%"+genes+"%'";

    if(sheet.length > 0 )
    {
        if (sheet == 'AMLALL') {
            sql = sql +  " and test_code in ('LPE471', 'LPE545')";
        } else if (sheet == 'MDSMPN') {  // MDS/MPN 
            sql = sql +  " and test_code in ('LPE473')";
        } else if (sheet == '악성림프종') {  // 악성림프종
            sql = sql +  " and test_code in ('LPE474', 'LPE475')";
        } else if (sheet == '유전성유전질환') {  // 유전성유전질환
            sql = sql +   ` and test_code in ('LPE548', 'LPE439', 'LPE452', 'LPE453', 'LPE454', 'LPE455', 
                                    'LPE456', 'LPE488', 'LPE489', 'LPE490', 'LPE497', 'LPE498', 'LPE499',
                                    'LPE517', 'LPE518', 'LPE519', 'LPE520', 'LPE521', 'LPE522', 'LPE523',
                                    'LPE524', 'LPE525', 'LPE526', 'LPE527', 'LPE528', 'LPE529', 'LPE530',
                                    'LPE531', 'LPE532', 'LPE533', 'LPE534', 'LPE535', 'LPE536', 'LPE537',
                                    'LPE538', 'LPE539', 'LPE540', 'LPE541', 'LPE542', 'LPE543')`;
        } else if (sheet == 'Sequencing') {  // Sequencing
            sql = sql +   ` and test_code in ('LPC100', 'LPC101', 'LPC117', 'LPC118', 'LPC194',
                                    'LPE115', 'LPE141', 'LPE156', 'LPE194', 'LPE221', 'LPE227', 'LPE229',
                                    'LPE231', 'LPE233', 'LPE236', 'LPE237', 'LPE238', 
                                    'LPE241', 'LPE242', 'LPE243', 'LPE245', 'LPE247', 'LPE249',
                                    'LPE251', 'LPE258', 'LPE262', 'LPE267', 'LPE272', 'LPE276', 
                                    'LPE280', 'LPE282', 'LPE285', 'LPE287', 'LPE289', 'LPE290', 'LPE295',
                                    'LPE302', 'LPE306', 'LPE308', 'LPE310', 'LPE313', 'LPE316', 'LPE320',
                                    'LPE334', 'LPE337', 'LPE340', 'LPE341', 'LPE342', 'LPE343', 'LPE349', 
                                    'LPE352', 'LPE354', 'LPE356', 'LPE358', 'LPE360', 'LPE362', 'LPE364', 
                                    'LPE366', 'LPE368', 'LPE371', 'LPE374', 'LPE375', 'LPE378', 'LPE379', 
                                    'LPE384', 'LPE391', 'LPE392', 'LPE410', 'LPE412', 'LPE414', 'LPE418', 
                                    'LPE420', 'LPE428', 'LPE431', 'LPE433', 'LPE436', 'LPE457', 'LPE460', 
                                    'LPE462', 'LPE469', 'LPE477', 'LPE482', 'LPE494', 'LPE495') `
        } else if (sheet == 'MLPA') {  // MLPA
            sql = sql +  ` and test_code in ('LPE232', 'LPE294', 'LPE322', 'LPE332', 'LPE351', 'LPE369', 
                                    'LPE377', 'LPE464')`;
        } 
    }
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