// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const e = require('express');
const { input } = require('../common/winston');
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
const  messageHandler_mut = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const type = nvl(req.body.type, '');

  logger.info('[39][geneinfo]select data=' + gene + ", " + nucleotide_change + ", " + type); 
 
  let sql =`select top 1 functional_impact,transcript,exon_intro, amino_acid_change, zygosity,vaf,reference, cosmic_id, type
                from mutation 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change `
  if (type !== '') {
    sql = sql +  ` and type='` + type + `'`;
  }
  sql = sql +  ` order by id desc`;
  logger.info('[49][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql);
    //  console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[61][geneinfo]list err=' + error.message);
  }
}


// select mutation
const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const type = nvl(req.body.type, '');

  logger.info('[74][geneinfo]select data=' + gene + ", " + nucleotide_change + ", " + type); 
 
  let sql =`select top 1 functional_impact,transcript,   amino_acid_change, zygosity,vaf,reference, cosmic_id, type
                from mutation 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change`
  
  if (type !== '') {
    sql = sql +  ` and type='` + type + `'`;
  }
  
  sql = sql +  `  order by id desc`;
  /*
  sql = sql +  ` and reference != ''
                  and cosmic_id != ''
                  order by id desc`;
   */               
  logger.info('[84][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql);
      console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[98][geneinfo]list err=' + error.message);
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
    logger.error('[77][geneinfo]getMutation err=' + error.message);
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
  logger.info('[90][geneinfo]getGeneExist data=' +  id + ", " + gene + "," + nucleotide_change + ", type=" + type) ;
 
  let sql ="select  count(*) as count from mutation where gene=@gene"; 
  sql = sql  + "  and nucleotide_change =@nucleotide_change "

  if (type !== '') {
    sql = sql +  ` and type='` + type + `'`;
  }

  sql = sql +  " order by desc";
  logger.info('[100][geneinfo]getGeneExist sql=' + sql);
 
  try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) 
         .input('nucleotide_change', nssql.VarChar, nucleotide_change); 
       const result = await request.query(sql)
     //  console.dir( result);
       
       return result.recordset;
  } catch (error) {
    logger.error('[111][geneinfo]geneExist err=' + error.message);
  }
}

exports.getGeneExist = (req,res,next) => {
  logger.info('[116][geneinfo]geneExist req=' + JSON.stringify(req.body));
  
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
  logger.info('[141][geneinfo]addGeneToMutation data=' + patientName + ", " + patientID + ", " + gene
                      + ", " + transcript + "," + nucleotide_change  + "," + cosmicID + ", type=" + type); 
  
  let sql ="insert into mutation ";
  sql = sql + " (patient_name, register_number,gene,";
  sql = sql + "   transcript, amino_acid_change, cosmic_id, type) ";
  sql = sql + " values(@patientName, @patientID, @gene, ";
  sql = sql + "        @transcript, @nucleotide_change, @cosmicID, @type)";
  logger.info('[149][geneinfo]addGeneMutation sql=' + sql );
	 
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
    logger.error('[165][geneinfo]mutation insert err=' + error.message);
  }
}

// add gene to mutation
exports.addGeneToMutation = (req, res, next) => {

  logger.info('[172][geneinfo]addGeneToMutation req=' + JSON.stringify(req.body));

  const result = messageHandler3(req);
  result.then(data => {
   
        //  console.log('[132][addGeneToMutation]', data);
          res.json(data);
  })
  .catch( error => {
    logger.error('[181][geneinfo]addGeneToMutation err=' + error.message);
    res.sendStatus(500);
  });
 };

// get Comemnts
const  messageHandler4 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene   = req.body.gene;
  const type   = req.body.type;
  logger.info('[192][geneinfo]comments select data=' + gene + ", " + type);

  let sql ="select gene, comment, reference, isnull(variant_id, '') variant_id ";
  sql = sql + " from comments ";
  sql = sql + " where gene=@gene ";
  sql = sql + " and type=@type";
  logger.info('[198][geneinfo]comments selet sql' + sql);

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

  logger.info('[216][geneinfo]getCommentInfoLists req=' + JSON.stringify(req.body));

  const result = messageHandler4(req);
  result.then(data => {
  
        // console.log('[168][getCommentInfoLists]',data);
        res.json(data);
  })
  .catch( error => {
    logger.error('[225][geneinfo]getCommentInfoLists err=' + error.message);
    res.sendStatus(500);
  });
};

const  messageHandler5 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene   = req.body.gene;
  const type   = req.body.type;
  logger.info('[235][geneinfo]getCommentCounts data=' + gene + ", " + type);

	let sql ="select   count(*) as count ";
    sql = sql + " from comments "
    sql = sql + " where gene=@gene "
    sql = sql + " and type=@type";
  logger.info('[241][geneinfo]getCommentCounts sql=' + sql);
    
  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('type', mssql.VarChar, type); 
      const result = await request.query(sql);
     //  console.dir( result.recordset);
       
      return result.recordset;
  } catch (error) {
    logger.error('[252][geneinfo]getCommentInfoCount err=' + error.message);
  }
}

exports.getCommentInfoCount = (req, res, next) => {

  logger.info('[258][geneinfo]getCommentInfoCount req=' + JSON.stringify(req.body));

  const result = messageHandler5(req);
  result.then(data => {
   
    // console.log('[203][getCommentInfoCount]', data);
    res.json(data);
  })
  .catch( error  => {
    logger.error('[267][geneinfo]getCommentInfoCount err=' + error.message);
    res.sendStatus(500);
  });
};

const  messageHandler6 = async (req) => {
  await poolConnect; // ensures that the pool has been created
 
  const gene   = req.body.gene;
  const coding = req.body.coding;
  const type = nvl(req.body.type, '');
  logger.info('[278][geneinfo]getArtifactInfoLists data=' + gene + ", " + coding  + ", type=" + type );

	let sql =`select  transcript, amino_acid_change "
              from artifacts "
              where gene=@gene "
              and coding=@coding`;

  if (type !== '') {
    sql = sql +  ` and type='` + type + `'`;
  }

  logger.info('[289][geneinfo]getArtifactInfoLists sql=' + sql);
    
  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result.recordset);
       
    return result.recordset;
  } catch (error) {
    logger.error('[300][geneinfo]getArtifactInfoLists err=' + error.message);
  }
}

// In house Artifacts
exports.getArtifactInfoLists = (req, res, next) => {

  logger.info('[307][geneinfo]getArtifactInfoLists req=' + JSON.stringify(req.body));
  const result = messageHandler6(req);
  result.then(data => {
   
    //  console.log('[240][getArtifactInfoLists] ',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[315][geneinfo]getArtifactInfoLists err=' + error.message);
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
  logger.info('[332][geneinfo]insertArtifacts data=' + gene + ", " + locat + ", " + exon
                           + ", " + transcript + ", " + coding + ", " + amino_acid_change + ", type = " + type );

  let sql = "insert into artifacts "
    sql = sql + "  (genes, location, exon, "
    sql = sql + " transcript,coding, amino_acid_change, type)  "
    sql = sql + " values( @gene, @locat, @exon, "
    sql = sql + " @transcript, @coding, @amino_acid_change, @type)";
  logger.info('[340][geneinfo]insertArtifacts sql=' + sql); 

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
    logger.error('[356][geneinfo]insertArtifacts err=' + error.message);
  }
}

// Artifacts 입력
exports.insertArtifacts = (req, res,next) => {

  logger.info('[363][geneinfo]insertArtifacts req' + JSON.stringify(req.body));
  const result = messageHandler7(req);
  result.then(data => {
  
    //  console.log('[285][insertArtifacts]', data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[371][geneinfo]insertArtifacts err=' + error.message); 
    res.sendStatus(500);
  });
}

const  messageHandler8 = async (req) => {
  await poolConnect; // ensures that the pool has been created
    
  const gene      = req.body.gene;
  const coding    = req.body.coding;
  const type      = nvl(req.body.type, '');
  logger.info('[382][geneinfo]getArtifactsInfoCount data=' + gene + ", " + coding + ", type = " + type);

	let sql =`select count(*) as count  
            from artifacts 
            where genes=@gene 
            and coding=@coding `;

    if (type !== '') {
      sql = sql +  " and type='" + type + "'";
    }

  logger.info('[393][geneinfo]getArtifactsInfoCount sql=' + sql);

  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result);
    //  console.log('[308][getArtifactsInfoCount] ', result);
    return result.recordset;
  } catch (error) {
    logger.error('[404][geneinfo]getArtifactsInfoCount err=' + error.message);
  }
}

// get Artifacts Info Count
exports.getArtifactsInfoCount = (req, res, next) => {
  logger.info('[410][geneinfo]getArtifactsInfoCount req=' + JSON.stringify(req.body) );
  
  const result = messageHandler8(req);
  result.then(data => {
   
    //  console.log('[320][getArtifactsInfoCount]',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[419][geneinfo]getArtifactsInfoCount err=' + error.message);
    res.sendStatus(500);
  });
};

//get benign Info lists
const  messageHandler9 = async (req) => {
  await poolConnect; // ensures that the pool has been created
 
  const gene   = req.body.gene;
  const coding = req.body.coding;
  logger.info('[430][geneinfo]get benignInfolists data=' + gene + ", " + coding );
	
	let sql =`select  transcript, amino_acid_change  
              from benign 
              where genes=@gene 
              and coding=@coding`;

  logger.info('[437][geneinfo]get benignInfolists sql=' + sql);
    
  try {
    const request = pool.request()
      .input('gene', mssql.VarChar, gene) 
      .input('coding', mssql.VarChar, coding); 
    const result = await request.query(sql)
    //  console.dir( result);
       
    return result.recordset;
  } catch (error) {
    logger.error('[448][geneinfo]get benignInfolists err=' + error.message);
  }
}

// In-House benign
exports.benignInfolists = (req, res, next) => {

  logger.info('[455][geneinfo]get benignInfolists req=' + JSON.stringify(req.body));
   
  const result = messageHandler9(req);
  result.then(data => {
   
    //  console.log('[357][benignInfolists] ',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[464][geneinfo]get benignInfolists err=' + error.messageP);
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
  logger.info('[478][geneinfo]insertBenign data=' + gene + ", " + locat
                          + ", " + exon + ", " + transcript + ", " + coding + ", " + amino_acid_change);

  let sql = "insert into benign " ;
  sql = sql + "  (genes, location, exon, "
  sql = sql + " transcript,coding, amino_acid_change)  "
  sql = sql + " values( @gene, @locat, @exon, "
  sql = sql + " @transcript, @coding, @amino_acid_change)";
  logger.info('[486][geneinfo]insertBenign sql=' + sql);
    
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
  
  logger.info('[508][geneinfo]insertBenign req=' + JSON.stringify(req.body));
  const result = messageHandler10(req);
  result.then(data => {
  
    //  console.log('[402][insertBenign][]',data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[516][geneinfo]insertBenign err=' + error.message)
    res.sendStatus(500);
  });
}

//get benign Info Count
const  messageHandler11 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene    = req.body.gene;
  const coding = req.body.coding;
  logger.info('[527][geneinfo]benignInfoCount data=' + gene + ", " + coding );

  let sql ="select  count(*) as count  ";
  sql = sql + " from benign "
  sql = sql + " where genes=@gene "
  sql = sql + " and coding=@coding";
  logger.info('[533][geneinfo]benignInfoCount sql=' + sql);
  
  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('coding', mssql.VarChar, coding); 
      const result = await request.query(sql)
    // console.dir( result);
      
      return result.recordset;
  } catch (error) {
    logger.error('[544][geneinfo]benignInfoCount err=' + error.message);
  }
}

// get benign Info Count
exports.benignInfoCount = (req, res, next) => {

  logger.info('[551][geneinfo]get benignInfoCount req=' + JSON.stringify(req.body)); 
  const result = messageHandler11(req);
  result.then(data => {

    //  console.log('[437][benignInfoCount]', data);
    res.json(data);
  })
  .catch( error  => {
    logger.error('[559][geneinfo]get benignInfoCount err=' + error.message);
    res.sendStatus(500);
  });

}

// get comments Count
const commentCountHandler = async (gene, type) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[569][geneinfo]get commentCount data=' + gene + ", " + type);
  const sql ="select count(1) as count from comments \
           where gene = '" + gene + "' and type = '" + type + "'";
  logger.info('[572][geneinfo]get commentCountHandler sql=' + sql);  

  try {
    const request = pool.request(); 
    const result = await request.query(sql)
    // console.dir( result);
    
    return result.recordset;
  } catch (error) {
    logger.error('[581][geneinfo]commentCountHandler err=' + error.message);
  }
}

//get Comment Counts
exports.getCommentCounts = (req,res, next) => {

  logger.info('[588][geneinfo]getCommentCounts req=' + JSON.stringify(req.body));
   const gene =  req.body.gene;
   const type =  req.body.type;
    
  const result = commentCountHandler(gene, type);
  result.then(data => {

    //  console.log(json.stringfy());
      res.json(data[0].cnt);
  })
  .catch( error  => {
    logger.error('[599][geneinfo]getCommentCounts err=' + error.message);
    res.sendStatus(500);
  });
}

// comments insert
const insertCommentHandler = async(comments) => {
  //for 루프를 돌면서 Commencts 만큼       //Commencts Count
  let commentResult;

  logger.info('[609][geneinfo]insertCommentHandler req' + JSON.stringify(req.body));
  logger.info('[610][geneinfo]insertCommentHandler length=' + comments.length);  

  for (i = 0; i < comments.length; i++)
  {
    const gene       = comments[i].gene;
    const type       = comments[i].type;
    const comment    = comments[i].comment;
    const reference  = comments[i].reference;
    const variant_id  = comments[i].variant_id;
    logger.info('[619][geneinfo]insertCommentHandler data=' + gene + "," + type
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
        logger.error('[660][geneinfo]insert Comment err=', error.message);
      }
    })
    .catch( error => {
      logger.error('[664][geneinfo]insertCommentHandler count err=' + error.message);
      res.sendStatus(500);
    });
  } // End of For Loop

  return commentResult;
}
 
// Comment Insert
exports.getCommentInsert = (req,res, next) => {
 
  logger.info('[675][geneinfo]getCommentInsert req=' + JSON.stringify(req.body));
  const comments =  req.body.comments;
  
  const result = insertCommentHandler(comments);
  result.then(data => {

    //  console.log(json.stringfy());
    res.json("1");
  })
  .catch( error => {
    logger.error('[685][geneinfo]getCommentInsert err=' +error.message);
    res.sendStatus(500);
  });
}


// AMLALL, LYM,MDS는  report_detected_variants 테이블에서 찿음
const  variantsHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;
  const gubun = req.body.gubun;
  
  logger.info('[742][geneinfo]select data=' + gene + ", " + nucleotide_change + ", " + gubun); 
 
  let sql =`select top 1 functional_impact , reference, cosmic_id, type
                from report_detected_variants 
                where gene=@gene 
                and nucleotide_change =@nucleotide_change and (gubun='AMLALL' or gubun = 'LYM' or gubun='MDS')
                and reference != ''
                and cosmic_id != ''
                order by id desc`;
               
  logger.info('[749][geneinfo]list sql=' + sql);

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) 
        .input('nucleotide_change', mssql.VarChar, nucleotide_change)
        .input('gubun', mssql.VarChar, gubun); 
      const result = await request.query(sql);
      return result.recordset;
  } catch (error) {
    logger.error('[759][geneinfo]list err=' + error.message);
  }
}

exports.getVariantsLists = (req,res, next) => {
  logger.info('[764][geneinfo]getCommentInsert req=' + JSON.stringify(req.body));
   
  const result = variantsHandler(req);
  result.then(data => {
    console.log('[771][받은데이터]', data);
    res.json(data);
  })
  .catch( error => {
    logger.error('[771][geneinfo][getVariantsLists] err=' +error.message);
    res.sendStatus(500);
  });
}

