// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const e = require('express');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
 function nvl(st, defaultStr){
    
  console.log('st=', st);
  if(st === undefined || st == null || st == "") {
      st = defaultStr ;
  }
      
  return st ;
}


// select mutation
const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const type = nvl(req.body.type, '');

  logger.info('[17][geneinfo]select data=' + gene + ", " + nucleotide_change + ", " + type); 
 
  const sql =`select top 1 functional_impact,transcript,exon_intro, amino_acid_change, zygosity,vaf,reference, cosmic_id, type
                from mutation 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change `
  if (type !== '') {
    sql = sql +  `and type='` + type + `'`;
  }
  sql = sql +  `order by id desc`;
  logger.info('[26][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change); 
      const result = await request.query(sql);
    //  console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[32][geneinfo]list err=' + error.message);
  }
}

// In-House get Mutation
exports.getMutationInfoLists = (req,res, next) => {

  logger.info('[39][geneinfo]getMutation req=' + JSON.stringify(req.body));

    const result = messageHandler(req);
    result.then(data => {

      // console.log('[52][getMutationInfoLists]',data);
       res.json(data);
  })
  .catch( error  => {
    logger.error('[54][geneinfo]getMutation err=' + error.message);
    res.sendStatus(500);
  });
}

// gene exist
const  messageHandler2 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
  const id   =  req.body.id;
  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const type = nvl(req.body.type, 'AMLALL');
  logger.info('[60][geneinfo]getGeneExist data=' +  id + ", " + gene + "," + nucleotide_change + ", type=" + type) ;
 
  let sql ="select  count(*) as count from mutation where gene=@gene"; 
  sql = sql  + "  and nucleotide_change =@nucleotide_change "

  if (type !== '') {
    sql = sql +  `and type='` + type + `'`;
  }

  sql = sql +  " order by desc";
  logger.info('[64][geneinfo]getGeneExist sql=' + sql);
 
  try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) 
         .input('nucleotide_change', nssql.VarChar, nucleotide_change); 
       const result = await request.query(sql)
     //  console.dir( result);
       
       return result.recordset;
  } catch (error) {
    logger.error('[81][geneinfo]geneExist err=' + error.message);
  }
}

exports.getGeneExist = (req,res,next) => {
  logger.info('[80][geneinfo]geneExist req=' + JSON.stringify(req.body));
  
  const result = messageHandler2(req);
  result.then(data => {
   
    // console.log('[86][getGeneExist]',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[88][geneinfo]geneExist err=' + error.message);
    res.sendStatus(500);
  });
}

// insert mutation
const  messageHandler3 = async (req) => {
  await poolConnect; // ensures that the pool has been created
  
  const patientName     = req.body.name;
	const patientID       = req.body.patientID;
  const gene            = req.body.gene;	
	const transcript      = req.body.transcript;
	const nucleotide_change = req.body.coding;
	const cosmicID        = req.body.cosmicID;
  const type = nvl(req.body.type, 'AMLALL');
  logger.info('[104][geneinfo]addGeneToMutation data=' + patientName + ", " + patientID + ", " + gene
                      + ", " + transcript + "," + nucleotide_change  + "," + cosmicID + ", type=" + type); 
  
  let sql ="insert into mutation ";
  sql = sql + " (patient_name, register_number,gene,";
  sql = sql + "   transcript, amino_acid_change, cosmic_id, type) ";
  sql = sql + " values(@patientName, @patientID, @gene, ";
  sql = sql + "        @transcript, @nucleotide_change, @cosmicID, @type)";
  logger.info('[112][geneinfo]addGeneMutation sql=' + sql );
	 
  try {
    const request = pool.request()
        .input('patientName', mssql.VarChar, patientName) 
        .input('patientID', mssql.VarChar, patientID) 
        .input('transcript', mssql.VarChar, transcript) 
        .input('cosmicID', mssql.VarChar, cosmicID) 
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('type', mssql.VarChar, type); 
    const result = await request.query(sql)
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[132][geneinfo]mutation insert err=' + error.message);
  }
}

// add gene to mutation
exports.addGeneToMutation = (req, res, next) => {

  logger.info('[139][geneinfo]addGeneToMutation req=' + JSON.stringify(req.body));

  const result = messageHandler3(req);
  result.then(data => {
   
        //  console.log('[132][addGeneToMutation]', data);
          res.json(data);
  })
  .catch( error => {
    logger.error('[150][geneinfo]addGeneToMutation err=' + error.message);
    res.sendStatus(500);
  });
 };

// get Comemnts
const  messageHandler4 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene   = req.body.gene;
  const type   = req.body.type;
  logger.info('[159][geneinfo]comments select data=' + gene + ", " + type);

  let sql ="select gene, comment, reference, variant_id ";
  sql = sql + " from comments ";
  sql = sql + " where gene=@gene ";
  sql = sql + " and type=@type";
  logger.info('[165][geneinfo]comments selet sql' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql)
    // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[177][geneinfo]comments select err=' + error.message);
  }
}

// In house Comments
exports.getCommentInfoLists = (req, res, next) => {

  logger.info('[183][geneinfo]getCommentInfoLists req=' + JSON.stringify(req.body));

  const result = messageHandler4(req);
  result.then(data => {
  
        // console.log('[168][getCommentInfoLists]',data);
        res.json(data);
  })
  .catch( error => {
    logger.error('[191][geneinfo]getCommentInfoLists err=' + error.message);
    res.sendStatus(500);
  });
};

const  messageHandler5 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene   = req.body.gene;
  const type   = req.body.type;
  logger.info('[202][geneinfo]getCommentCounts data=' + gene + ", " + type);

	let sql ="select   count(*) as count ";
    sql = sql + " from comments "
    sql = sql + " where gene=@gene "
    sql = sql + " and type=@type";
  logger.info('[207][geneinfo]getCommentCounts sql=' + sql);
    
  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql);
     //  console.dir( result.recordset);
       
      return result.recordset;
  } catch (error) {
    logger.error('[219][geneinfo]getCommentInfoCount err=' + error.message);
  }
}

exports.getCommentInfoCount = (req, res, next) => {

  logger.info('[225][geneinfo]getCommentInfoCount req=' + JSON.stringify(req.body));

  const result = messageHandler5(req);
  result.then(data => {
   
    // console.log('[203][getCommentInfoCount]', data);
    res.json(data);
  })
  .catch( error  => {
    logger.error('[234][geneinfo]getCommentInfoCount err=' + error.message);
    res.sendStatus(500);
  });
};

const  messageHandler6 = async (req) => {
  await poolConnect; // ensures that the pool has been created
 
  const gene   = req.body.gene;
  const coding = req.body.coding;
  const type = nvl(req.body.type, '');
  logger.info('[244][geneinfo]getArtifactInfoLists data=' + gene + ", " + coding  + ", type=" + type );

	let sql =`select  transcript, amino_acid_change "
              from artifacts "
              where gene=@gene "
              and coding=@coding`;

  if (type !== '') {
    sql = sql +  `and type='` + type + `'`;
  }

  logger.info('[250][geneinfo]getArtifactInfoLists sql=' + sql);
    
  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result.recordset);
       
    return result.recordset;
  } catch (error) {
    logger.error('[260][geneinfo]getArtifactInfoLists err=' + error.message);
  }
}

// In house Artifacts
exports.getArtifactInfoLists = (req, res, next) => {

  logger.info('[268][geneinfo]getArtifactInfoLists req=' + JSON.stringify(req.body));
  const result = messageHandler6(req);
  result.then(data => {
   
    //  console.log('[240][getArtifactInfoLists] ',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[276][geneinfo]getArtifactInfoLists err=' + error.message);
    res.sendStatus(500);
  });

};

// insert Artifacts
const  messageHandler7 = async (req) => {
  await poolConnect; // ensures that the pool has been created
 
  const gene              = req.body.gene;
  const locat             = req.body.loc2;
  const exon              = req.body.exon;
  const transcript        = req.body.transcript;
  const coding            = req.body.coding;
	const amino_acid_change = req.body.aminoAcidChange;
	const type              = nvl(req.body.type, 'AMLALL');
  logger.info('[292][geneinfo]insertArtifacts data=' + gene + ", " + locat + ", " + exon
                           + ", " + transcript + ", " + coding + ", " + amino_acid_change + ", type = " + type );

  let sql = "insert into artifacts "
    sql = sql + "  (genes, location, exon, "
    sql = sql + " transcript,coding, amino_acid_change, type)  "
    sql = sql + " values( @gene, @locat, @exon, "
    sql = sql + " @transcript, @coding, @amino_acid_change, @type)";
  logger.info('[299][geneinfo]insertArtifacts sql=' + sql); 

  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('locat', mssql.VarChar, locat) 
      .input('exon', mssql.VarChar, exon) 
      .input('transcript', mssql.VarChar, transcript) 
      .input('coding', mssql.VarChar, coding) 
      .input('amino_acid_change', mssql.VarChar, amino_acid_change)
      .input('type', mssql.VarChar, type); 
    const result = await request.query(sql)
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[315][geneinfo]insertArtifacts err=' + error.message);
  }
}

// Artifacts 입력
exports.insertArtifacts = (req, res,next) => {

  logger.info('[322][geneinfo]insertArtifacts req' + JSON.stringify(req.body));
  const result = messageHandler7(req);
  result.then(data => {
  
    //  console.log('[285][insertArtifacts]', data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[330][geneinfo]insertArtifacts err=' + error.message); 
    res.sendStatus(500);
  });
}

const  messageHandler8 = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  const gene      = req.body.gene;
  const coding    = req.body.coding;
  const type      = nvl(req.body.type, '');
  logger.info('[363][geneinfo]getArtifactsInfoCount data=' + gene + ", " + coding + ", type = " + type);

	let sql =`select count(*) as count  
            from artifacts 
            where genes=@gene 
            and coding=@coding `;

    if (type !== '') {
      sql = sql +  "and type='" + type + "'";
    }

  logger.info('[346][geneinfo]getArtifactsInfoCount sql=' + sql);

  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result);
    //  console.log('[308][getArtifactsInfoCount] ', result);
    return result.recordset;
  } catch (error) {
    logger.error('[357][geneinfo]getArtifactsInfoCount err=' + error.message);
  }
}

// get Artifacts Info Count
exports.getArtifactsInfoCount = (req, res, next) => {
  logger.info('[363][geneinfo]getArtifactsInfoCount req=' + JSON.stringify(req.body) );
  
  const result = messageHandler8(req);
  result.then(data => {
   
    //  console.log('[320][getArtifactsInfoCount]',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[371][geneinfo]getArtifactsInfoCount err=' + error.message);
    res.sendStatus(500);
  });
};

//get benign Info lists
const  messageHandler9 = async (req) => {
  await poolConnect; // ensures that the pool has been created
 
  const gene   = req.body.gene;
  const coding = req.body.coding;
  logger.info('[383][geneinfo]get benignInfolists data=' + gene + ", " + coding );
	
	let sql =`select  transcript, amino_acid_change  
              from benign 
              where genes=@gene 
              and coding=@coding`;

  logger.info('[390][geneinfo]get benignInfolists sql=' + sql);
    
  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result);
       
    return result.recordset;
  } catch (error) {
    logger.error('[401][geneinfo]get benignInfolists err=' + error.message);
  }
}

// In-House benign
exports.benignInfolists = (req, res, next) => {

  logger.info('[407][geneinfo]get benignInfolists req=' + JSON.stringify(req.body));
   
  const result = messageHandler9(req);
  result.then(data => {
   
    //  console.log('[357][benignInfolists] ',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[416][geneinfo]get benignInfolists err=' + error.messageP);
    res.sendStatus(500);
  });
};

// insert Benign info
const  messageHandler10 = async (req) => {
 
  const gene              = req.body.gene;
  const locat             = req.body.loc2;
  const exon              = req.body.exon;
  const transcript        = req.body.transcript;
  const coding            = req.body.coding;
  const amino_acid_change = req.body.aminoAcidChange;
  logger.info('[431][geneinfo]insertBenign data=' + gene + ", " + locat
                          + ", " + exon + ", " + transcript + ", " + coding + ", " + amino_acid_change);

  let sql = "insert into benign " ;
  sql = sql + "  (genes, location, exon, "
  sql = sql + " transcript,coding, amino_acid_change)  "
  sql = sql + " values( @gene, @locat, @exon, "
  sql = sql + " @transcript, @coding, @amino_acid_change)";
  logger.info('[439][geneinfo]insertBenign sql=' + sql);
    
  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('locat', mssql.VarChar, locat) 
      .input('exon', mssql.VarChar, exon) 
      .input('transcript', mssql.VarChar, transcript) 
      .input('coding', mssql.VarChar, coding) 
      .input('amino_acid_change', mssql.VarChar, amino_acid_change); 
    const result = await request.query(sql)
  //  console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[454][geneinfo]insertBenign err=' + error.message);
  }
}

// insert Benign
exports.insertBenign = (req,res,next) => {
  
  logger.info('[460][geneinfo]insertBenign req=' + JSON.stringify(req.body));
  const result = messageHandler10(req);
  result.then(data => {
  
    //  console.log('[402][insertBenign][]',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[468][geneinfo]insertBenign err=' + error.message)
    res.sendStatus(500);
  });
}

//get benign Info Count
const  messageHandler11 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene    = req.body.gene;
  const coding = req.body.coding;
  logger.info('[480][geneinfo]benignInfoCount data=' + gene + ", " + coding );

  let sql ="select  count(*) as count  ";
  sql = sql + " from benign "
  sql = sql + " where genes=@gene "
  sql = sql + " and coding=@coding";
  logger.info('[486][geneinfo]benignInfoCount sql=' + sql);
  
  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('coding', mssql.VarChar, coding); 
      const result = await request.query(sql)
    // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[497][geneinfo]benignInfoCount err=' + error.message);
  }
}

// get benign Info Count
exports.benignInfoCount = (req, res, next) => {

  logger.info('[504][geneinfo]get benignInfoCount req=' + JSON.stringify(req.body)); 
  const result = messageHandler11(req);
  result.then(data => {

    //  console.log('[437][benignInfoCount]', data);
    res.json(data);
  })
  .catch( error  => {
    logger.error('[512][geneinfo]get benignInfoCount err=' + error.message);
    res.sendStatus(500);
  });

}

// get comments Count
const commentCountHandler = async (gene, type) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[523][geneinfo]get commentCount data=' + gene + ", " + type);
  const sql ="select count(1) as count from comments \
           where gene = '" + gene + "' and type = '" + type + "'";
  logger.info('[526][geneinfo]get commentCountHandler sql=' + sql);  

  try {
    const request = pool.request(); 
    const result = await request.query(sql)
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[535][geneinfo]commentCountHandler err=' + error.message);
  }
}

//get Comment Counts
exports.getCommentCounts = (req,res, next) => {

  logger.info('[542][geneinfo]getCommentCounts req=' + JSON.stringify(req.body));
   const gene =  req.body.gene;
   const type =  req.body.type;
    
  const result = commentCountHandler(gene, type);
  result.then(data => {

    //  console.log(json.stringfy());
      res.json(data[0].cnt);
  })
  .catch( error  => {
    logger.error('[553][geneinfo]getCommentCounts err=' + error.message);
    res.sendStatus(500);
  });
}

// comments insert
const insertCommentHandler = async(comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;

  logger.info('[563][geneinfo]insertCommentHandler req' + JSON.stringify(req.body));
  logger.info('[563][geneinfo]insertCommentHandler length=' + comments.length);  

  for (i = 0; i < comments.length; i++)
  {
    const gene       = comments[i].gene;
    const type       = comments[i].type;
    const comment    = comments[i].comment;
    const reference  = comments[i].reference;
    const variant_id  = comments[i].variant_id;
    logger.info('[574][geneinfo]insertCommentHandler data=' + gene + "," + type
                                  + ", " + comment + ", " + reference + ", " + variant_id);

    let result = commentCountHandler(gene, type);
    let qry; 
    result.then(data => {

      let resultCnt = data[0].count;

      console.log ("cnt=", resultCnt);

      if (resultCnt > 0)
      {
        //update Query 생성
        qry = `update comments 
                set comment = @comment, 
                    reference = @reference, 
                    variant_id = @variant_id 
                where  gene = @gene 
                and  type =   @type  `;
      }
      else
      {
        //insert Query 생성
        qry = `insert into comments (gene, type, comment, reference, variant_id )
                        values( @gene, @type, @comment, @reference, @variant_id ) `;
      }

      logger.info('[602][geneinfo]Comments Insert sql=' +qry);
          
      try {
        const request = pool.request()
          .input('gene', mssql.VarChar, gene)
          .input('type', mssql.VarChar, type)
          .input('comment', mssql.NVarChar, comment)
          .input('reference', mssql.NVarChar, reference)
          .input('variant_id', mssql.VarChar, variant_id); 
          
        commentResult = request.query(qry);
                  
      } catch (error) {
        logger.error('[615][geneinfo]insert Comment err=', error.message);
      }
    })
    .catch( error => {
      logger.error('[619][geneinfo]insertCommentHandler count err=' + error.message);
      res.sendStatus(500);
    });
  } // End of For Loop

  return commentResult;
}
 
// Comment Insert
exports.getCommentInsert = (req,res, next) => {
 
  logger.info('[630][geneinfo]getCommentInsert req=' + JSON.stringify(req.body));
  const comments =  req.body.comments;
  
  const result = insertCommentHandler(comments);
  result.then(data => {

    //  console.log(json.stringfy());
    res.json("1");
  })
  .catch( error => {
    logger.error('[638][geneinfo]getCommentInsert err=' +error.message);
    res.sendStatus(500);
  });
}