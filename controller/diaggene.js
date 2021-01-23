/**
 * 진검 유전자 관리
 */

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('../common/winston');
const e = require('express');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// 진검 유전자 목록출력
const listHandler = async (type) => {
    await poolConnect;

    const sql ="select isnull(gene, '') gene  from genediag where type =@type";
    console.log('[20][diaggene]', sql);
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type); 
          const result = await request.query(sql) 
          return result.recordset;
    } catch(error) {
        logger.error('[15]selectDiagGene err=' + error.message);
    }
}

// list Diag Gene
exports.listDiagGene = (req,res, next) => {

    logger.info('[32]listDiagGene req=' + JSON.stringify( req.body)); 
    const type = req.body.type;

    const result = listHandler(type);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[41][listDiagGene]err=' + error.message); 
        res.sendStatus(500);
    });
}

// 진검 유전자 목록 입력
const inserHandler = async (type, gene) => {
    await poolConnect;
    let count;
    const sql = 'select count(*) as cnt  from genediag where type=@type and gene=@gene';
    logger.info('[65][diaggene controller query ]query=' + sql);
    try {
        const request = pool.request()
            .input('gene',mssql.VarChar, gene)
            .input('type', mssql.VarChar, type);
        const result = await request.query(sql);
             
        count = result.recordset[0].cnt;
             
    } catch (error) {
        logger.error('[71][diaggene controller query err=' +  error.message);
    }

    if ( count === 0 ) {
        const qry = 'insert into genediag (gene, type) values(@gene, @type)';
        logger.info('[66][DiagGene controller]insert sql=' + sql); 
        try {
            const request = pool.request()
            .input('gene',mssql.VarChar, gene)
            .input('type', mssql.VarChar, type);
            const result = await request.query(qry);
            return result;   
        } catch(error) {
            logger.error('[87][diaggene controller insert err=' +  err);
        }
    }
}

exports.insertDiagGene = (req,res, next) => {
    
    logger.info('[81]insertDiagGene req=' + JSON.stringify(req.body));
    const type = req.body.type;
    const gene = req.body.gene;
    
    const result = inserHandler(type, gene);
    result.then(data => {
        res.json({ message: 'SUCCESS'});
    })
    .catch(error => {
        logger.error('[91]insertDiagGene err=' + error.message);
    });

}

// 진검 유전자 변경
const updateHandler = async (type, gene, newgene) => {
    await poolConnect;
  
    logger.info('[100]updateDiagGene controller data=' + type + ", " + gene + ", " + newgene);
    const sql = 'update genediag set gene=@newgene where type=@type and gene=@gene';
    logger.info('[l02][diaggene controller update ]query=' + sql);
    try {
        const request = pool.request()
             .input('type',mssql.VarChar, type)
             .input('newgene', mssql.VarChar, newgene)
             .input('gene',mssql.VarChar, gene);           
             const result = await request.query(sql);
             return result;
    } catch (error) {
        logger.error('[115][diaggene controller update err=' +  error.message);
    }  
}

// update Diag Gene
exports.updateDiagGene = (req,res, next) => {
    logger.info('[117]updateDiagGene req-' + JSON.stringify(req.body));
    
    const type = req.body.type; 
    const gene = req.body.gene;
    const newgene = req.body.newgene;
    const result = updateHandler(type, gene, newgene);
    result.then(data => {
           res.json({ message: 'SUCCESS'});
    })
    .catch(error => {
        logger.error('[128]updateDiagGene err=' + error.message );
    }) ;

}

// 진검 유전자 삭제
const deleteHandler = async (type, gene) => {
    await poolConnect;
  
    logger.info('[137]updateDiagGene controller data=' + type + ", " + gene );
    const sql = ' delete  from genediag where type=@type and gene=@gene';
    logger.info('[ll4][diaggene controller delete ]query=' + sql);
    try {
        const request = pool.request()
             .input('gene', mssql.VarChar, gene)
             .input('type',mssql.VarChar, type);
            
        const result = await request.query(sql);
        return result;
    }
    catch (error) {
        logger.error('[122][diaggene controller delete err=' + error.message);
    }  
}

// delete DiagGene
exports.deleteDiagGene = (req,res, next) => {
    logger.info('[117]deleteDiagGene req-' + JSON.stringify(req.body));
    
    const gene = req.body.gene;
    const type = req.body.type; 
    const result = deleteHandler(type,gene);
    result.then(data => {
           res.json({ message: 'SUCCESS'});
    })
    .catch(error => {
        logger.error('[128]updateDiagGene err=' + error.message );
    });
}

//list gene diag
const listAllHandler = async () => {
    await poolConnect;

    const sql ="select isnull(gene, '') gene, type  from genediag ";
    logger.info('[173][list diaggene]sql=' + sql);
    try {
        const request = pool.request(); 
        const result = await request.query(sql) 
        return result.recordset;
    } catch(error) {
        logger.error('[179]list diggene err=' + error.message);
    }
}

// list gene diag
exports.listAllDiagGene = (req,res, next) => {
    const result = listAllHandler( );
    
    result.then(data => {
       res.json(data);
    })
    .catch( error => {
        logger.error('[179]list diggene err=' + error.message);
        res.sendStatus(500);
    });

}

// 중복검사
const checkHandler = async (type, gene) => {
  await poolConnect;
  
  logger.info('[201]count DiagGene controller data=' + type + ", " + gene );
  const sql = "select count(*) as count from genediag where type=@type and gene=@gene";
  logger.info('[293]count DiagGene controller sql=' + sql );

    try {
        const request = pool.request()
             .input('type',mssql.VarChar, type)
             .input('gene',mssql.VarChar, gene);           
             const result = await request.query(sql);
             return result.recordsets[0];
    } catch (error) {
        logger.error('[212][diaggene controller count err=' +  error.message);
    } 
}

exports.duplicateGene = (req, res, next) => {
    logger.info('[117]DiagGene dup req-' + JSON.stringify(req.body));

    const gene = req.body.gene;
    const type = req.body.type;
    const result = checkHandler(type, gene);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[179]diggene dup err=' + error.message);
        res.sendStatus(500);
    });    
}