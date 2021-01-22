//================================================
//
//    mentlists 입력/수정/삭제/조회 기능
//
//================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


//mentlists 입력
exports.mentlistsInsert = (req,res, next) => {
}

//mentlists 수정
exports.mentlistsUpdate = (req,res, next) => {
}

//mentlists 삭제
exports.mentlistsDelete = (req,res, next) => {
}

//mentlists 조회
exports.mentlistsList = (req,res, next) => {
}