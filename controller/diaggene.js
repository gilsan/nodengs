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

    const sql ="select gene, rowno from genediag where type =@type";
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
exports.insertDiagGene = (req,res, next) => {


}

// 진검 유전자 변경
exports.updateDiagGene = (req,res, next) => {


}

// 진검 유전자 삭제
exports.deleteDiagGene = (req,res, next) => {


}