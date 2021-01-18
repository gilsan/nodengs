// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');
/*
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
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const gene =  req.body.gene;	 
  const nucleotide_change = req.body.coding;

  const sql ="select top 1 functional_impact,transcript,exon_intro, amino_acid_change, zygosity,vaf,reference, cosmic_id from mutation where gene=@gene  and nucleotide_change =@nucleotide_change order by id desc";

  try {
      const request = pool.request()
        .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
        .input('nucleotide_change', mssql.VarChar, nucleotide_change); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
  }
}

// In-House Mutation
 exports.getMutationInfoLists = (req,res, next) => {

    const result = messageHandler(req);
    result.then(data => {

      // console.log('[52][getMutationInfoLists]',data);
 
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));
 }

 const  messageHandler2 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
   const id   =  req.body.id;
    const gene =  req.body.gene;	 
   const nucleotide_change = req.body.coding;
   console.log('getGeneExist: ', id, gene, nucleotide_change);
 
   let sql ="select  count(*) as count from mutation where gene=@gene"; 
   sql = sql  + "  and nucleotide_change =@nucleotide_change order by desc limit 1";
 
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('nucleotide_change', nssql.VarChar, nucleotide_change); // or: new sql.Request(pool1)
       const result = await request.query(sql)
     //  console.dir( result);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

 exports.getGeneExist = (req,res,next) => {
    const result = messageHandler2(req);
    result.then(data => {
   
         // console.log('[86][getGeneExist]',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 }

 

 const  messageHandler3 = async (req) => {
    await poolConnect; // ensures that the pool has been created
  
  const patientName     = req.body.name;
	const patientID       = req.body.patientID;
  const gene            = req.body.gene;	
	const transcript      = req.body.transcript;
	const nucleotide_change = req.body.coding;
	const cosmicID        = req.body.cosmicID;
  console.log('addGeneToMutation',patientName,patientID,gene,transcript,nucleotide_change, cosmicID); 
     let sql ="insert into mutation ";
     sql = sql + " (patient_name, register_number,gene,";
     sql = sql + "   transcript, amino_acid_change, cosmic_id) ";
     sql = sql + " values(@patientName, @patientID, @gene, ";
     sql = sql + "        @transcript, @nucleotide_change, @cosmicID)";
	 
    try {
        const request = pool.request()
            .input('patientName', mssql.VarChar, patientName) // or: new sql.Request(pool1)
            .input('patientID', mssql.VarChar, patientID) // or: new sql.Request(pool1)
            .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
            .input('cosmicID', mssql.VarChar, cosmicID) // or: new sql.Request(pool1)
            .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
            .input('nucleotide_change', mssql.VarChar, nucleotide_change); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
  }

 exports.addGeneToMutation = (req, res, next) => {

    const result = messageHandler3(req);
    result.then(data => {
   
        //  console.log('[132][addGeneToMutation]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

 const  messageHandler4 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
    const gene   = req.body.gene;
    const type   = req.body.type;
    
	  let sql ="select gene, comment, reference, variant_id ";
    sql = sql + " from comments ";
    sql = sql + " where gene=@gene ";
    sql = sql + " and type=@type";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('type', mssql.VarChar, type); // or: new sql.Request(pool1)
       const result = await request.query(sql)
      // console.dir( result);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

// In house Comments
 exports.getCommentInfoLists = (req, res, next) => {

    const result = messageHandler4(req);
    result.then(data => {
   
         // console.log('[168][getCommentInfoLists]',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

 const  messageHandler5 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
   const gene   = req.body.gene;
    const type   = req.body.type;
    
	let sql ="select   count(*) as count ";
    sql = sql + " from comments "
    sql = sql + " where gene=@gene "
    sql = sql + " and type=@type";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('type', mssql.VarChar, type); // or: new sql.Request(pool1)
       const result = await request.query(sql)
     //  console.dir( result.recordset);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

 exports.getCommentInfoCount = (req, res, next) => {

    const result = messageHandler5(req);
    result.then(data => {
   
         // console.log('[203][getCommentInfoCount]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

 const  messageHandler6 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
   const gene   = req.body.gene;
    const coding            = req.body.coding;
	
	 let sql ="select  transcript, amino_acid_change "
    sql = sql + " from artifacts "
    sql = sql + " where gene=@gene "
    sql = sql + " and coding=@coding";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('coding', mssql.VarChar, coding); // or: new sql.Request(pool1)
       const result = await request.query(sql)
     //  console.dir( result.recordset);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }


// In house Artifacts
 exports.getArtifactInfoLists = (req, res, next) => {

    const result = messageHandler6(req);
    result.then(data => {
   
        //  console.log('[240][getArtifactInfoLists] ',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));

 };

 const  messageHandler7 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
    const gene              = req.body.gene;
    const locat             = req.body.loc2;
    const exon              = req.body.exon;
    const transcript        = req.body.transcript;
    const coding            = req.body.coding;
	const amion_acid_change = req.body.aminoAcidChange;

    let sql = "insert into artifacts "
    sql = sql + "  (genes, location, exon, "
    sql = sql + " transcript,coding, amino_acid_change)  "
    sql = sql + " values( @gene, @locat, @exon, "
    sql = sql + " @transcript, @coding, @amino_acid_change)";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('locat', mssql.VarChar, locat) // or: new sql.Request(pool1)
         .input('exon', mssql.VarChar, exon) // or: new sql.Request(pool1)
         .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
         .input('coding', mssql.VarChar, coding) // or: new sql.Request(pool1)
         .input('amion_acid_change', mssql.VarChar, amion_acid_change); // or: new sql.Request(pool1)
       const result = await request.query(sql)
      // console.dir( result);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }
// Artifacts 입력
 exports.insertArtifacts = (req, res,next) => {
   
    const result = messageHandler7(req);
    result.then(data => {
   
        //  console.log('[285][insertArtifacts]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 }

 const  messageHandler8 = async (req) => {
   await poolConnect; // ensures that the pool has been created
    
    const gene              = req.body.gene;
    const coding            = req.body.coding;

	  
	 let sql ="select   count(*) as count  ";
    sql = sql + " from artifacts "
    sql = sql + " where genes=@gene "
    sql = sql + " and coding=@coding";
 //  console.log(sql); 
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('coding', mssql.VarChar, coding); // or: new sql.Request(pool1)
       const result = await request.query(sql)
     //  console.dir( result);
     //  console.log('[308][getArtifactsInfoCount] ', result);
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

 exports.getArtifactsInfoCount = (req, res, next) => {
     // console.log(req);
    const result = messageHandler8(req);
    result.then(data => {
   
        //  console.log('[320][getArtifactsInfoCount]',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));

 };

 const  messageHandler9 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
   const gene   = req.body.gene;
    const coding            = req.body.coding;
	
	let sql ="select  transcript, amino_acid_change  ";
    sql = sql + " from benign ";
    sql = sql + " where genes=@gene ";
    sql = sql + " and coding=@coding";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('coding', mssql.VarChar, coding); // or: new sql.Request(pool1)
       const result = await request.query(sql)
     //  console.dir( result);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

// In-House benign
 exports.benignInfolists = (req, res, next) => {
   
    const result = messageHandler9(req);
    result.then(data => {
   
       //   console.log('[357][benignInfolists] ',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

 const  messageHandler10 = async (req) => {
 
     const gene              = req.body.gene;
     const locat             = req.body.loc2;
     const exon              = req.body.exon;
     const transcript        = req.body.transcript;
     const coding            = req.body.coding;
     const amion_acid_change = req.body.aminoAcidChange;
 
     let sql = "insert into benign " ;
     sql = sql + "  (genes, location, exon, "
     sql = sql + " transcript,coding, amino_acid_change)  "
     sql = sql + " values( @gene, @locat, @exon, "
     sql = sql + " @transcript, @coding, @amino_acid_change)";
     
    try {
        const request = pool.request()
          .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
          .input('locat', mssql.VarChar, locat) // or: new sql.Request(pool1)
          .input('exon', mssql.VarChar, exon) // or: new sql.Request(pool1)
          .input('transcript', mssql.VarChar, transcript) // or: new sql.Request(pool1)
          .input('coding', mssql.VarChar, coding) // or: new sql.Request(pool1)
          .input('amion_acid_change', mssql.VarChar, amion_acid_change); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
 }

// Benign
 exports.insertBenign = (req,res,next) => {
    const result = messageHandler10(req);
    result.then(data => {
   
        //  console.log('[402][insertBenign][]',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 }

 const  messageHandler11 = async (req) => {
   await poolConnect; // ensures that the pool has been created
 
   const gene    = req.body.gene;
    const coding = req.body.coding;
	
	  let sql ="select  count(*) as count  ";
    sql = sql + " from benign "
    sql = sql + " where genes=@gene "
    sql = sql + " and coding=@coding";
    
   try {
       const request = pool.request()
         .input('gene', mssql.VarChar, gene) // or: new sql.Request(pool1)
         .input('coding', mssql.VarChar, coding); // or: new sql.Request(pool1)
       const result = await request.query(sql)
      // console.dir( result);
       
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

  exports.benignInfoCount = (req, res, next) => {

    const result = messageHandler11(req);
    result.then(data => {
   
        //  console.log('[437][benignInfoCount]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));

 }
 
 const commentCountHandler = async (gene, type) => {
  await poolConnect; // ensures that the pool has been created
 
  const sql ="select count(1) as count from comments where gene = '" + gene + "' and type = '" + type + "'";

  try {
      const request = pool.request(); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
  }
}

exports.getCommentCounts = (req,res, next) => {

   const gene =  req.body.gene;
   const type =  req.body.type;
    
   const result = commentCountHandler(gene, type);
   result.then(data => {

    //  console.log(json.stringfy());
      res.json(data[0].cnt);
 })
 .catch( err  => res.sendStatus(500));
}

// comments insert
const insertCommentHandler = async(comments) => {
   //for 루프를 돌면서 Commencts 만큼       //Commencts Count
   let commentResult;

console.log("length=", comments.length);  

   for (i = 0; i < comments.length; i++)
   {
      const gene       = comments[i].gene;
      const type       = comments[i].type;
      const comment    = comments[i].comment;
      const reference  = comments[i].reference;
      const variant_id  = comments[i].variant_id;

      let result = commentCountHandler(gene, type);
      let qry; 
      result.then(data => {

        let resultCnt = data[0].count;

        console.log ("cnt=", resultCnt);

        if (resultCnt > 0)
        {
          //update Query 생성
          qry = "update comments \
                    set comment = @comment, \
                        reference = @reference, \
                        variant_id = @variant_id \
                    where  gene = @gene \
                    and  type =   @type  ";
          }
          else
          {
          //insert Query 생성
          qry = "insert into comments (gene, type, comment, reference, variant_id )   \
                          values( @gene, @type, @comment, @reference, @variant_id )";
          }
 
          console.log("Comments Insert sql",qry);
            
          try {
              const request = pool.request()
                  .input('gene', mssql.VarChar, gene)
                  .input('type', mssql.VarChar, type)
                  .input('comment', mssql.NVarChar, comment)
                  .input('reference', mssql.NVarChar, reference)
                .input('variant_id', mssql.VarChar, variant_id); 
                
                commentResult = request.query(qry);
                        
          } catch (err) {
              console.error('SQL error', err);
          }
      })
      .catch( err  => res.sendStatus(500));
    }  // End of For Loop

    return commentResult;
   }
 
  exports.getCommentInsert = (req,res, next) => {
 
    console.log(req.body);

     const comments =  req.body.comments;
      
     const result = insertCommentHandler(comments);
     result.then(data => {
 
      //  console.log(json.stringfy());
          res.json("1");
   })
   .catch( err  => res.sendStatus(500));
  }