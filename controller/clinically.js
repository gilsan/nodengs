
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  clinicallyInsertHandler = async (pathologyNum, clinically) => {
    await poolConnect; // ensures that the pool has been created
    let result2;
    logger.info('[27][clinically]pathologyNum=' + pathologyNum);
    const query = "delete from clinically where  pathologyNum = @pathologyNum ";
    logger.info('[27][clinically]query=' + query);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (error) {
        logger.info('[27][clinically ins]err='+ error.message);
      }
 
    const len = clinically.length;

    if (len > 0) {
        
        clinically.forEach( async (item) => {
            const clinically = item;
            logger.info('[51][clinically]data=' +  pathologyNum + "," + clinically);
            const qry = "insert into clinically (pathologyNum, clinically) values(@pathologyNum, @clinically)"; 
            logger.info('[27][clinically]query=' + qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input('clinically', mssql.VarChar, clinically);
    
                result2 = await request.query(qry);
    
            } catch (error) {
                logger.error('[45]SQL error'+ error.message);
            }            
        })
     
        return result2;
    }
}
 
exports.clinicallydata = (req, res, next) => {
    
    logger.info('[56]this.clinicallydata]req=' + JSON.stringify(req.body)); 
    const pathologyNum = req.body.pathologyNum;
    const clinically = req.body.clinically;
    logger.info('[67][clinicallydata]data=' + clinically);

    const result = clinicallyInsertHandler(pathologyNum, clinically);
    result.then(data => {
   
        console.log('[72][clinicallydata]', data);
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[67][clinicallydata]err=' + error.message);
        res.sendStatus(500);
    });
 };

 const  clinicallySelectHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    //select Query 생성
    const qry = "select clinically, seq  from clinically   where pathologyNum = @pathologyNum ";
    logger.info("[78][clinicallySelectHandler]sql=" + qry );
    logger.info("[78][clinicallySelectHandler] pathologyNum" + pathologyNum);
    
    try {

        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[89][clinicallySelectHandler]err=' + error.message);
    }
  }

  exports.clinicallyList = (req, res, next) => {
    logger.info('[94]ClientRectList req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = clinicallySelectHandler(pathologyNum);
    result.then(data => {  
          console.log('[97]clinicallyList]data=' + data);
          res.json(data);
         // res.send(data.map(item => item.clinically));
    })
    .catch( error  => {
        logger.error('[103]clinicallyList err=' +error.message);
        res.sendStatus(500);
    });; 
};

/////////////////////////////////////////////////////////////////
// clinicallydata2 { gene: string , seq: string} 형식
const  clinicallyInsertHandler2 = async (pathologyNum, clinically) => {
    await poolConnect; // ensures that the pool has been created
    let result2;
    logger.info('[122][clinically2]pathologyNum=' + pathologyNum);
    const query = "delete from clinically where  pathologyNum = @pathologyNum ";
    logger.info('[124][clinically2]query=' + query);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (error) {
        logger.error('[124]==== SQL error ======='+ error.message);
      }
 
    const len = clinically.length;

    if (len > 0) {
        
        clinically.forEach( async (item) => {
            const clinically = item.gene;
            const seq        = item.seq;
            logger.info('[134][clinically2]data=' +  pathologyNum + "," + clinically);
            const qry = "insert into clinically (pathologyNum, clinically, seq) values(@pathologyNum, @clinically, @seq)"; 
            logger.info('[134][clinically2]query=' + qry);
            try {
                const request = pool.request()
                .input('pathologyNum', mssql.VarChar, pathologyNum)
                .input ('seq', mssql.VarChar, seq)
                .input('clinically', mssql.VarChar, clinically);
    
                result2 = await request.query(qry);
    
            } catch (error) {
                logger.error('SQL error'+ error.message);
            }            
        })
     
        return result2;
    }
}

 exports.clinicallydata2 = (req, res, next) => {
    
    logger.info('[156]clinicallydata2 req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const clinically = req.body.clinically;

    logger.info('[161][clinicallydata2] data=' + clinically);

    const result = clinicallyInsertHandler2(pathologyNum, clinically);
    result.then(data => {
   
        console.log('[166][clinicallydata2 ]', data);
          res.json({message: 'SUCCESS'});
     })
     .catch( error  => {
        logger.error('[117]clinicallydata2 err=' + error.message);
        res.sendStatus(500);
    });
 };

 /////////////////////////////////////////////////////////////////////////////////////
//// Genomic Alteration
//// Genomic 입력
const  genomicInsertHandler = async (pathologyNum, genomic) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    logger.info('[181][genomicInsertHandler]pathologyNum=' + pathologyNum);
    const query = "delete from genomic where  pathologyNum = @pathologyNum ";
    logger.info('[183][genomicInsertHandler]query=' + query);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);            
        const result = await request.query(query);
        
        //return result;
      } catch (error) {
        logger.error('[192]==== SQL error ======='+ error.message);
      }
 
    const len = genomic.length;

    if (len > 0) {
        
        genomic.forEach( async (item) => {
            const gene         = item.gene;
            const relevant1    = item.relevant1;
            const relevant2    = item.relevant2;
            const trial        = item.trial;
            logger.info('[204][genomicInsertHandler]data=' +  pathologyNum );
            logger.info('[204][genomicInsertHandler]data=' +  gene );
            logger.info('[204][genomicInsertHandler]data=' +  relevant1 );
            logger.info('[204][genomicInsertHandler]data=' +  relevant2 );
            logger.info('[204][genomicInsertHandler]data=' +  trial );

            const qry = "insert into genomic (gene,relevant1, relevant2, trial,pathologyNum ) values(@gene,@relevant1, @relevant2, @trial,@pathologyNum)"; 
            logger.info('[206][genomicInsertHandler]query=' + qry);

            try {
                const request = pool.request()
                .input('gene', mssql.VarChar, gene)
                .input ('relevant1', mssql.VarChar, relevant1)
                .input('relevant2', mssql.VarChar, relevant2)
                .input('trial', mssql.VarChar, trial)
                .input('pathologyNum', mssql.VarChar, pathologyNum)            
    
                result = await request.query(qry);
    
            } catch (error) {
                logger.error('SQL error'+ error.message);
            }  

        })
     
        return result;
    }
}


exports.genomicInsert = (req, res, next) => {
    
    logger.info('[228]genomicInsert req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const genomic = req.body.genomic;

    logger.info('[233][genomicInsert] data=' + genomic);

    const result = genomicInsertHandler(pathologyNum, genomic);
    result.then(data => {

          res.json({message: 'SUCCESS'});
     })
     .catch( error  => {
        logger.error('[241]genomicInsert err=' + error.message);
        res.sendStatus(500);
    });
 };


/// Genomic 목록
const  genomicListstHandler = async (pathologyNum) => {
    await poolConnect; // ensures that the pool has been created

    //select Query 생성
    const qry = "select gene, isnull(relevant1, '') relevant1,   isnull(relevant2, '') relevant2, isnull(trial, '') trial  from genomic   where pathologyNum = @pathologyNum ";
    logger.info("[253]][genomicListstHandler]sql=" + qry );
    logger.info("[254[genomicListstHandler] pathologyNum" + pathologyNum);
    
    try {
        const request = pool.request()
            .input('pathologyNum', mssql.VarChar, pathologyNum);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[263][genomicListstHandler]err=' + error.message);
    }
  }

  exports.genomicList = (req, res, next) => {
    logger.info('[268][genomicList] req=' + JSON.stringify(req.body));

    const pathologyNum = req.body.pathologyNum;
    const result = genomicListstHandler(pathologyNum);
    result.then(data => {  
          res.json(data);
    })
    .catch( error  => {
        logger.error('[276][genomicList] err=' +error.message);
        res.sendStatus(500);
    });; 
};


