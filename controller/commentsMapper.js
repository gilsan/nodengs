// Beign ������ �ʿ���� �������� 
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const dbConfigMssql = require('./dbconfig-mssql.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect(); 

const listHandler = async (req) => {
    await poolConnect;  
    const genes			= req.body.genes; 
	
	let sql ="select id, type, gene, comment, reference, variant_id";
    sql = sql + " from comments ";
	if(genes != "") 
		sql = sql + " where gene like '%"+genes+"%'";
    sql = sql + " order by id";

	//console.log("sql", sql);
   try {
       const request = pool.request()
         .input('genes', mssql.VarChar, genes); 
       const result = await request.query(sql) 
       return result.recordset;
   } catch (err) {
       console.error('SQL error', err);
   }
 }

// insert
const insertHandler = async (req) => { 
	 const type				 = req.body.commentsType;
     const gene              = req.body.gene;
	 const variant_id        = req.body.variant_id;
     const comment           = req.body.comment;
     const reference         = req.body.reference; 
 

     let sql = "insert into comments " ;
     sql = sql + "  (id, type, gene, variant_id, comment, reference) " 
	 sql = sql + " values( (select isnull(max(id),0)+1 from comments), "
     sql = sql + " @type, @gene, @variant_id, @comment, @reference) "; 
     
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
    } catch (err) {
        console.error('SQL error', err);
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
	/*
	 console.error('id-->', id);
	 console.error('type-->', type);
	 console.error('gene-->', gene);
	 console.error('comment-->', comment);
	 console.error('reference-->', reference);
	*/
     let sql = "update comments set " ;
     sql = sql + "  type = @type, gene = @gene , variant_id = @variant_id ";
     sql = sql + "  ,comment = @comment ,reference = @reference  "; 
     sql = sql + "where id = @id";
     
	// console.error('sql-->', sql);
    
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
     } catch (err) {
        console.error('SQL error', err);
     }
 }

// Delete
const deleteHandler = async (req) => { 
	const id        = req.body.id; 
 
    let sql = "delete comments  " ; 
    sql = sql + "where id = @id"; 

    try {
        const request = pool.request()
		  .input('id', mssql.VarChar, id) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
 }


// List comments
 exports.listComments = (req, res, next) => { 
  //  console.log('[200][listComments]');
    const result = listHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

// comments Insert
 exports.insertComments = (req,res,next) => {
    const result = insertHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };

// comments Update
 exports.updateComments = (req,res,next) => {
  //  console.log('[200][updateBenign]');

	const result = updateHandler(req);
    result.then(data => {
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
	
 };

// comments Delete
 exports.deleteComments = (req,res,next) => {
   // console.log('[200][deleteBenign]');

	const result = deleteHandler(req);
    result.then(data => { 
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
	
 };