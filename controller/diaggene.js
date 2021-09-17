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

// 진검 유전자 목록출력
const listHandler = async (type, test_code) => {
    await poolConnect;

    let test_cd = nvl(test_code, '');

    logger.info('[20][diaggene]type=' + type + ', test_code=' + test_cd) ;
    let sql =`select isnull(gene, '') gene  from genediag where type ='` + type + `'`;
    if (test_cd != '') {
        sql = sql + ` and test_code = '` + test_cd + `'`;
    }

    logger.info('[20][diaggene]sql=' + sql);
    try {
        const request = pool.request()
          const result = await request.query(sql) 
          return result.recordset;
    } catch(error) {
        logger.error('[28]selectDiagGene err=' + error.message);
    }
}

// list Diag Gene
exports.listDiagGene = (req,res, next) => {

    logger.info('[32]listDiagGene req=' + JSON.stringify( req.body)); 
    const type = req.body.type;
    const test_code = req.body.test_code;

    const result = listHandler(type, test_code);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[41][listDiagGene]err=' + error.message); 
        res.sendStatus(500);
    });
}

// 진검 유전자 목록 입력
const inserHandler = async (type, gene, test_code) => {
    await poolConnect;
    let count;
    let test_cd = nvl(test_code, '');

    const sql = `select count(*) as cnt  from genediag
                     where type=@type 
                     and gene=@gene 
                     and test_code= @test_cd`;
    logger.info('[65][diaggene controller query ]query=' + sql);
    try {
        const request = pool.request()
            .input('gene',mssql.VarChar, gene)
            .input('type', mssql.NVarChar, type)
            .input('test_cd', mssql.VarChar, test_cd);
        const result = await request.query(sql);
             
        count = result.recordset[0].cnt;
             
    } catch (error) {
        logger.error('[71][diaggene controller query err=' +  error.message);
    }

    if ( count === 0 ) {
        const qry = 'insert into genediag (gene, type, test_code) values(@gene, @type, @test_cd)';
        logger.info('[66][DiagGene controller]insert sql=' + sql); 
        try {
            const request = pool.request()
            .input('gene',mssql.VarChar, gene)
            .input('type', mssql.VarChar, type)
            .input('test_cd', mssql.VarChar, test_cd);
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
    const test_code = req.body.test_code;
    
    const result = inserHandler(type, gene, test_code);
    result.then(data => {
        res.json({ message: 'SUCCESS'});
    })
    .catch(error => {
        logger.error('[91]insertDiagGene err=' + error.message);
    });

}

// 진검 유전자 변경
const updateHandler = async (type, gene, newgene, test_code) => {
    await poolConnect;
    let test_cd = nvl(test_code, '');
  
    logger.info('[100]updateDiagGene controller data=' + type + ", " + gene + ", " + newgene + ", " + test_cd);
    const sql = `update genediag
                     set gene=@newgene 
                     where type=@type 
                     and gene=@gene 
                     and test_code= @test_cd`;
    logger.info('[l02][diaggene controller update ]query=' + sql);
    try {
        const request = pool.request()
             .input('type',mssql.VarChar, type)
             .input('newgene', mssql.VarChar, newgene)
             .input('gene',mssql.VarChar, gene)
             .input('test_cd',mssql.VarChar, test_cd);           
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
    const test_code = req.body.test_code;
    const result = updateHandler(type, gene, newgene, test_code);
    result.then(data => {
           res.json({ message: 'SUCCESS'});
    })
    .catch(error => {
        logger.error('[128]updateDiagGene err=' + error.message );
    }) ;

}

// 진검 유전자 삭제
const deleteHandler = async (type, gene, test_code) => {
    await poolConnect;
    let test_cd = nvl(test_code, '');
  
    logger.info('[137]updateDiagGene controller data=' + type + ", " + gene + "," + test_cd );
    const sql = ' delete  from genediag where type=@type and gene=@gene';
    logger.info('[ll4][diaggene controller delete ]query=' + sql);
    try {
        const request = pool.request()
             .input('gene', mssql.VarChar, gene)
             .input('type',mssql.VarChar, type)
             .input('test_cd',mssql.VarChar, test_cd);
            
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
    const test_code = req.body.test_code;
    const result = deleteHandler(type,gene, test_code);
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

    const sql ="select isnull(gene, '') gene, type , isnull(test_code, '') test_code from genediag ";
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
const checkHandler = async (type, gene, test_code) => {
  await poolConnect;
  
  logger.info('[201]count DiagGene controller data=' + type + ", " + gene );
  const sql = `select count(*) as count 
                    from genediag 
                    where type=@type 
                    and gene=@gene
                    and test_code=@test_code`;
  logger.info('[293]count DiagGene controller sql=' + sql );

    try {
        const request = pool.request()
             .input('type',mssql.VarChar, type)
             .input('gene',mssql.VarChar, gene)
             .input('test_code',mssql.VarChar, test_code);           
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
    const test_code = req.body.test_code;    
    const result = checkHandler(type, gene, test_code);
    result.then(data => {
        res.json(data);
    })
    .catch( error => {
        logger.error('[179]diggene dup err=' + error.message);
        res.sendStatus(500);
    });    
}

// mutation, gene, nucleotide_change 숫자 알아내기.
const counterHandler = async (gene, nucleotide_change, specimenNo) => {
    await poolConnect;

    logger.info('[281]mutation gene amino-acid controller data=' + gene + ", " + nucleotide_change, );
    const sql = `select count(*) as count 
                      from report_detected_variants 
                      where gene=@gene and type='M' 
                      and nucleotide_change=@nucleotide_change`;
    logger.info('[286]mutation gene amino-acid controller sql=' + sql );
  
      try {
          const request = pool.request()
               .input('gene',mssql.VarChar, gene)
               .input('specimenNo',mssql.VarChar, specimenNo)
               .input('nucleotide_change',mssql.VarChar, nucleotide_change);           
               const result = await request.query(sql);
               return result.recordsets[0];
      } catch (error) {
          logger.error('[295][mutation gene amino-acid count err=' +  error.message);
      } 
}

exports.count = (req,res, next) => {
    logger.info('[300] mutation gene amino-acid -' + JSON.stringify(req.body));

    const gene = req.body.gene;
    const coding= req.body.coding; 
    const specimenNo = req.body.specimenNo  
    const result = counterHandler(gene, coding, specimenNo);
    result.then(data => {
        res.json(data[0]);
    })
    .catch( error => {
        logger.error('[309] mutation gene amino-acid  err=' + error.message);
        res.sendStatus(500);
    });     
}