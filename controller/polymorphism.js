const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const geneHandler = async (req) => {
    await poolConnect;  

    let sql = `select id, gene, amino_acid_change, nucleotide_change, reason from polymorphism
    where 1 = 1 `;
    sql = sql + " order by id";

    logger.info('[29][polymorphism select]sql=' + sql);
    try {
        const request = pool.request();
        const result = await request.query(sql)
 
        return result.recordset;

    } catch (error) {
        logger.error('[37][polymorphism select]err=' + error.message);
    }
}

// insert
const listHandler = async (req) => {
    await poolConnect;  
    let gene			    = req.body.gene; 
    let aminoacidchange	= req.body.amino_acid_change; 
    let nucleotidechange	= req.body.nucleotide_change; 
    logger.info('[16]BlackList listHandler gene=' + gene 
                + ", aminoacidchange= " + aminoacidchange
                + ", nucleotidechange=" + nucleotidechange );
	
	let sql =`select id, gene, 
                isnull(amino_acid_change, '') amino_acid_change, 
                isnull(nucleotide_change, '') nucleotide_change, 
                isnull(reason, '') reason 
            from polymorphism 
            where 1 = 1 `;

	if(gene != "") 
		sql = sql + " and gene like '%"+gene+"%'";
    if(aminoacidchange != "") 
        sql = sql + " and amino_acid_change like '%"+aminoacidchange+"%'";
    if(nucleotidechange != "") 
        sql = sql + " and nucleotide_change like '%"+nucleotidechange+"%'";
    sql = sql + " order by id";

	logger.info('[34]BlackList listHandler sql=' + sql);
    try {
       const request = pool.request(); 
       const result = await request.query(sql) 
       return result.recordset;
    } catch (error) {
        logger.error('[40]BlackList listHandler err=' + error.message);
    }
}

// insert
const insertHandler = async (req) => { 
    await poolConnect;  
    let gene              = req.body.gene;
    let reason            = req.body.reason;
    let nucleotidechange  = req.body.nucleotide_change;
    let aminoAcidChange   = req.body.amino_acid_change;

     logger.info('[51]BlackList insertHandler data=' + gene + ", reason=" + reason 
                                + ", nucleotidechange=" + nucleotidechange 
                                + ", aminoAcidChange=" + aminoAcidChange); 
 
     let sql = "insert into polymorphism " ;
     sql = sql + " (gene, reason, "
     sql = sql + " nucleotide_change, amino_acid_change)  "
     sql = sql + " values(  " 
	 sql = sql + " @gene, @reason, "
     sql = sql + " @nucleotidechange, @aminoAcidChange)";
     logger.info('[61]BlackList insertHandler sql=' + sql);
     
    try {
        const request = pool.request()
          .input('gene', mssql.VarChar, gene) 
          .input('reason', mssql.VarChar, reason) 
          .input('nucleotidechange', mssql.VarChar, nucleotidechange) 
          .input('aminoAcidChange', mssql.VarChar, aminoAcidChange); 
        const result = await request.query(sql)
      //  console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[73]BlackList insertHandler err=' + error.message);
    }
}

// update
const updateHandler = async (req) => { 
    await poolConnect;  
    let id                = req.body.id;
    let gene              = req.body.gene;
    let reason			 = req.body.reason;
    let nucleotidechange  = req.body.nucleotide_change;
    let aminoAcidChange   = req.body.amino_acid_change;

     logger.info('[85]BlackList updateHandler data='+ id + ", gene=" + gene + ", reason=" + reason 
            + ", nucleotidechange=" + nucleotidechange + ", aminoAcidChange=" + aminoAcidChange); 

     let sql = `update polymorphism set 
                        gene = @gene, reason = @reason ,
                        nucleotide_change = @nucleotidechange  ,
                        amino_acid_change =  @aminoAcidChange 
                        where id = @id`;
     logger.info('[93]BlackList updateHandler sql=' + sql); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
          .input('gene', mssql.VarChar, gene) 
          .input('reason', mssql.VarChar, reason) 
          .input('nucleotidechange', mssql.VarChar, nucleotidechange) 
          .input('aminoAcidChange', mssql.VarChar, aminoAcidChange); 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (err) {
        logger.error('[106]BlackList updateHandler err=' + err);
    }
}

// Delete
const deleteHandler = async (req) => { 
    await poolConnect;  
    let id        = req.body.id; 
    logger.info('[113]BlackList deleteHandler id-' + id);
 
    let sql = "delete polymorphism  " ; 
    sql = sql + "where id = @id";
    logger.info('[117]BlackList deleteHandler sql=' + sql); 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[126]BlackList deleteHandler err=' + error.message);
    }
}

//get blackList Info Count
const  messageHandler11 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  let gene    = req.body.gene;
  let nucleotidechange = req.body.nucleotide_change;
  let aminoAcidChange   = req.body.amino_acid_change;
  logger.info('[480][blackList]benignInfoCount data=' + gene 
                        + ", nucleotidechange=" + nucleotidechange 
                        + ", aminoAcidChange=" + aminoAcidChange);

  let sql =`select  count(*) as count  
                from benign 
                where genes=@gene 
                and nucleotide_change=@nucleotidechange
                and amino_Acid_Change=@aminoAcidChange`;
  logger.info('[486][blackList]benignInfoCount sql=' + sql);
  
  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotidechange', mssql.VarChar, nucleotidechange)
        .input('aminoAcidChange', mssql.VarChar, aminoAcidChange); 
      const result = await request.query(sql)
    // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[497][blackList]blackListInfoCount err=' + error.message);
  }
}

// get blackList Info Count
exports.blackListInfoCount = (req, res, next) => {
 
   logger.info('[504][blackList]get blackListInfoCount req=' + JSON.stringify(req.body)); 
   const result = messageHandler11(req);
   result.then(data => {
 
     //  console.log('[437][blackListInfoCount]', data);
     res.json(data);
   })
   .catch( error  => {
     logger.error('[512][blackList]get blackListInfoCount err=' + error.message);
     res.sendStatus(500);
   });
 
}

// List BlackList
exports.listBlackList = (req, res, next) => { 
    logger.info('[133][list BlackListm] req' + JSON.stringify(req.body) );
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[139]list BlackList err=' + error.message);
        res.sendStatus(500);
    });
};

// BlackList Insert
exports.insertBlackList = (req,res,next) => {
    logger.info('[146]insert BlackList req=' + JSON.stringify( req.body)); 
    const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
    })
    .catch( error => {
        logger.error('[152]insert BlackList err=' + error.message);
        res.sendStatus(500)
    });
};

// BlackList Update
exports.updateBlackList = (req,res,next) => {
    logger.info('[159][update BlackList] req=' + JSON.stringify(req.body) );

	const result = updateHandler(req);
    result.then(data => {
          res.json(data);
     })
     .catch( error => {
        logger.error('[166]update BlackList err=' + error.message);
        res.sendStatus(500);
    });
	
};

// BlackList Delete
exports.deleteBlackList = (req,res,next) => {
    logger.info('[174][delete BlackList] req=' + JSON.stringify(req.body) );

	const result = deleteHandler(req);
    result.then(data => { 
        res.json(data);
    })
    .catch( error => {
        logger.error('[181]delete BlackList err=' +error.message);
        res.sendStatus(500)
    });
	
};

exports.select = (req, res, next) => {

    /*
     const gene       = req.body.gene;
     const amino      = req.body.amino;
     const nucleotide = req.body.naucleotide;
    */
     const result = geneHandler(req);
     result.then(data => { 
        //  console.log('[320][getArtifactsInfoCount]',data);
          res.json(data);
     })
     .catch( error  => {
        logger.error('[53][polymorphism select]err=' + error.message);
          res.sendStatus(500)
     });    

}