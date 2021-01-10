/**
 * 진검 유전자 관리
 */

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const config = {
    user: 'ngs',
    password: 'ngs12#$',
    server: 'localhost',
    database: 'ngs_data',  
    pool: {
        max: 200,
        min: 100,
        idleTimeoutMillis: 30000
    },
    enableArithAbort: true,
    options: {
        encrypt:false
    }
}

const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();


// 진검 유전자 목록출력
const listHandler = async (type) => {
    await poolConnect;

    const sql ="select isnull(gene, '') gene  from genediag where type =@type";
    console.log('[35][diaggene]', sql);
    try {
        const request = pool.request()
          .input('type', mssql.VarChar, type); 
          const result = await request.query(sql) 
          return result.recordset;
    } catch(err) {
        console.log('', err);
    }


}
exports.listDiagGene = (req,res, next) => {

    const type = req.body.type;

    const result = listHandler(type);
    result.then(data => {
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));

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
             
    } catch (err) {
        logger.info('[71][diaggene controller query error ]query=' +  err);
    }

    if ( count === 0 ) {
        const qry = 'insert into genediag (gene, type) values(@gene, @type)';
        try {
            const request = pool.request()
            .input('gene',mssql.VarChar, gene)
            .input('type', mssql.VarChar, type);
            const result = await request.query(qry);
            return result;   
        } catch(err) {
            logger.info('[87][diaggene controller insert error ]query=' +  err);
        }
    }

}
exports.insertDiagGene = (req,res, next) => {
     const type = req.body.type;
     const gene = req.body.gene;
    
     const result = inserHandler(type, gene);
     result.then(data => {
            res.json({ message: 'SUCCESS'});
     });

}

// 진검 유전자 변경
const updateHandler = async (type, gene, newgene) => {
    await poolConnect;
  
    const sql = 'update genediag set gene=@newgene   where type=@type and gene=@gene';
    logger.info('[l08][diaggene controller update ]query=' + sql);
    try {
        const request = pool.request()
             .input('type',mssql.VarChar, type)
             .input('newgene', mssql.VarChar, newgene)
             .input('gene',mssql.VarChar, gene);           
             const result = await request.query(sql);
             return result;
    } catch (err) {
        logger.info('[115][diaggene controller update error ]query=' +  err);
    }  
}
exports.updateDiagGene = (req,res, next) => {
    const type = req.body.type; 
    const gene = req.body.gene;
    const newgene = req.body.newgene;
    const result = updateHandler(type, gene, newgene);
    result.then(data => {
           res.json({ message: 'SUCCESS'});
    });

}

// 진검 유전자 삭제
const deleteHandler = async (type, gene) => {
    await poolConnect;
  
    const sql = ' delete  from genediag where type=@type and gene=@gene';
    logger.info('[ll4][diaggene controller delete ]query=' + sql);
    try {
        const request = pool.request()
             .input('gene', mssql.VarChar, gene)
             .input('type',mssql.VarChar, type);
            
             const result = await request.query(sql);
             return result;
    } catch (err) {
        logger.info('[122][diaggene controller delete error ]query=' +  err);
    }  
}
exports.deleteDiagGene = (req,res, next) => {
    const gene = req.body.gene;
    const type = req.body.type; 
    const result = deleteHandler(type,gene);
    result.then(data => {
           res.json({ message: 'SUCCESS'});
    });
}

const listAllHandler = async () => {
    await poolConnect;

    const sql ="select isnull(gene, '') gene, type  from genediag ";
    console.log('[35][diaggene]', sql);
    try {
        const request = pool.request(); 
          const result = await request.query(sql) 
          return result.recordset;
    } catch(err) {
        console.log('', err);
    }
}
exports.listAllDiagGene = (req,res, next) => {
    const result = listAllHandler( );
    result.then(data => {
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));

}