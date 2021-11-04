const express = require('express');

const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

//////// essential mutaion 입력
const  mutationInsertHandler = async (req) => {
    await poolConnect;



}


exports.mutationInsert = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}


//////////////// essential mutaion  갱신
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

/////////////////// essential mutaion  삭제
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

//////////////// essential mutaion 목록
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}


/////////////////////////////////////////////////////

//////////////////// essential amplification 입력
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

///////////////////// essential amplification  갱신
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

//////////////////// essential amplification  삭제
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

/////////////////////////// essential amplification 목록

///////////////////////////////////////////////
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

////////////////////// essentil fusion 입력
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

/////////////////////// essentil fusion 갱신
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}


/////////////////// essentil fusion 삭제
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}

//////////////// essentil fusion 목록
const  messageHandler = async (req) => {
    await poolConnect;

}


exports.saveMutation = (req,res, next) => {
    logger.info('[93][mutation insert]data=' + JSON.stringify(req.body));

}
