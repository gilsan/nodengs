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
    let sheet =  nvl(req.body.sheet, "");

    logger.info('[13]benign listHandler genes=' + genes + ", coding= " + coding + ", sheet=" + sheet);
	
	let sql ="select id, genes, location, exon, transcript, coding, amino_acid_change ";
    sql = sql + " from benign ";
    sql = sql + " where 1 = 1 ";
	if(genes != "") 
		sql = sql + " and genes like '%"+genes+"%'";
    if(coding != "") 
        sql = sql + " and coding like '%"+coding+"%'";

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