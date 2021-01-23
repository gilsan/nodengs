// 유전자 정보로 필요사항 가져오기

const express = require('express');
const router = express.Router();
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  messageHandler = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const specimenNo = req.body.specimenNo;

  const sql ="select top 1 screenstatus from [dbo].[patientinfo_diag] where specimenNo=@specimenNo ";

  try {
      const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
    //  console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
  }
}

// patientinfo_diag  조회
 exports.screenLists = (req,res, next) => {

    const result = messageHandler(req);
    result.then(data => {

      // console.log('[50][screenstatus]',data);
 
       res.json(data);
  })
  .catch( err  => res.sendStatus(500));
 };

 const  messageHandler2 = async (req) => {
    await poolConnect; // ensures that the pool has been created
  
    const screenstatus     = req.body.screenstatus;
    const specimenNo       = req.body.specimenNo;
  
    console.log('insertScreen',screenstatus,specimenNo); 
     let sql ="update [dbo].[patientinfo_diag] \
             set screenstatus=@screenstatus \
             where specimenNo=@specimenNo ";
	 
    try {
        const request = pool.request()
            .input('screenstatus', mssql.VarChar, screenstatus) // or: new sql.Request(pool1)
            .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
  }

 // 스크린 완료
 exports.insertScreen = (req, res, next) => {

    console.log(req);

    /*
    const result = messageHandler2(req);
    result.then(data => {
   
          console.log('[86][insertScreen]', data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
     */
 };

 const  messageHandler3 = async (req) => {
  await poolConnect; // ensures that the pool has been created

  const screenstatus     = req.body.screenstatus;
  const specimenNo       = req.body.specimenNo;

  console.log('finishScreen',screenstatus,specimenNo); 
   let sql ="update [dbo].[patientinfo_diag] \
           set screenstatus=@screenstatus \
           where specimenNo=@specimenNo ";
 
  try {
      const request = pool.request()
          .input('screenstatus', mssql.VarChar, screenstatus) // or: new sql.Request(pool1)
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
      const result = await request.query(sql)
     // console.dir( result);
      
      return result.recordset;
  } catch (err) {
      console.error('SQL error', err);
  }
}

// 판독 완료
 exports.finishScreen = (req, res, next) => {

    const result = messageHandler3(req);
    result.then(data => {
   
         // console.log('[168][getCommentInfoLists]',data);
          res.json(data);
     })
     .catch( err  => res.sendStatus(500));
 };



