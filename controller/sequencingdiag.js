const express = require('express');
const router = express.Router();
const mssql = require('mssql');

const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
const { json } = require('body-parser');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
 function nvl(st, defaultStr){
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }      
    return st ;
}

// 병리 sequencing 삭제
const deleteHandler = async (patientid) => { 
    await poolConnect;
    let sql = "delete sequencing_path " ; 
    sql = sql + "where patientid = @patientid";
    
    logger.info('[34] sequencing deleteHandler testCode=' + patientid); 

    try {
        const request = pool.request()
		  .input('patientid', mssql.VarChar, patientid) 
        const result = await request.query(sql)
        console.dir( result); 
        return result;
    } catch (error) {
        logger.error('[43] sequencing deleteHandler err=' + error.message);
    }
}



// 병리 sequencing 입력
const insertHandler = async (req) => { 
    await poolConnect;

    const mutation          = req.body.mutation;
    const reportDate	    = req.body.reportDate;
    const examiner          = req.body.examiner;
    const rechecker         = req.body.rechecker;
    const title             = req.body.title;
    const descriptionCode   = req.body.descriptionCode;
    const testCode          = req.body.testCode;
    const patientid         = req.body.patientid;
    const comments          = req.body.comments;

    const examin  = req.body.patientinfo.examin;  // 검사자
    const recheck = req.body.patientinfo.recheck; // 확인자 

    const   qry = "update patientinfo_path set examin=@examin, recheck=@recheck  where  patientID = @patientid ";
    try {
        const request = pool.request()
        .input('examin', mssql.NVarChar, examin)
        .input('recheck', mssql.NVarChar, recheck)
        .input('patientid', mssql.VarChar, patientid);
        const result = await request.query(qry)
    } catch (error) {
       logger.error('[70]sequencing insertHandler err=' + error.message);
   }


    logger.info('[61]sequencing insertHandler mutation=' + mutation + ', reportDate=' + reportDate + ", examiner" + examiner
                                   + ", rechecker" + rechecker + ', title=' + title
                                   + ', descriptionCode=' + descriptionCode + ', patientid=' + patientid);   

    let sql = "insert into sequencing_path " ;
    sql = sql + " (mutation, reportDate, examiner, "
    sql = sql + " rechecker,title, descriptionCode, patientid, comments)  "
    sql = sql + " values(  "
    sql = sql + " @mutation, @reportDate, @examiner, "
    sql = sql + " @rechecker, @title, @descriptionCode, @patientid, @comments)";
    
   logger.info('[72] sequencing insertHandler sql=' + sql);

   try {
       const request = pool.request()
         .input('mutation', mssql.VarChar, mutation) 
         .input('reportDate', mssql.VarChar, reportDate) 
         .input('examiner', mssql.NVarChar, examiner) 
         .input('rechecker', mssql.NVarChar, rechecker) 
         .input('title', mssql.NVarChar, title) 
         .input('descriptionCode', mssql.VarChar, descriptionCode)
         .input('patientid', mssql.VarChar, patientid)
         .input('comments', mssql.NVarChar, comments);

       const result = await request.query(sql)
       return result;
   } catch (error) {
       logger.error('[87]sequencing insertHandler err=' + error.message);
   }
}


exports.insertsequencing = (req,res,next) => {
    logger.info('[94] sequencing insertHandler req=' + JSON.stringify(req.body));

    const testCode          = req.body.testCode;
    const patientid         = req.body.patientid;
    const result = deleteHandler(patientid);
    result.then(() => { 
        const result = insertHandler(req);
        result.then(data => {
            res.json(data);
        })
          
    })
    .catch( error => {
        logger.error('[107] sequencing insertHandler err=' + error.body);
        res.sendStatus(500);
    });
 };

// List Sequencing

const listHandler= async (patientid) => {
    await poolConnect;

    
    logger.info('[119][sequencing list]data=' + patientid );
	
	let sql =`select   isnull(mutation,'') mutation ,
	            isnull(reportDate, '') reportDate, isnull(examiner, '') examiner,
                isnull(rechecker, '') rechecker, isnull(patientid, '') patientid, isnull(title, '') title,
                isnull(descriptionCode, '') descriptionCode, isnull(comments, '') comments
                from sequencing_path  
	            where patientid = @patientid `;
 
    logger.info('[128][sequencing list]sql=' + sql);
    try {
       const request = pool.request()
		 .input('patientid', mssql.VarChar, patientid); 
       const result = await request.query(sql)  
       console.dir(result);
       return result.recordset;
   } catch (error) {
    logger.error('[136][sequencing ]err=' + error.message);
   }

};


 exports.listsequencing = (req,res,next) => {
    logger.info('[143] sequencing listequencing req=' + JSON.stringify(req.body));
    const patientid = req.body.patientid;
    const result = listHandler(patientid);
    result.then((data) => { 
        res.json(data);         
    })
    .catch( error => {
        logger.error('[151] sequencing insertHandler err=' + error.body);
        res.sendStatus(500);
    });
 };


 /// 유저자 이동 내역
/// 목록
const listMoveHandler= async (req) => {
    await poolConnect; 
    const pathologyNum = req.body.pathologyNum;
    const type = req.body.type;
    logger.info('[177][listMoveHandler]data=' + pathologyNum );
	
	let sql =`select  id,  isnull( CONVERT(VARCHAR(19), convert(datetime, date, 112), 126) , '') date , 
                isnull(gene, '') gene, isnull(amino, '') amino,
                isnull(direction, '') direction, isnull(comment, '') comment , isnull(pathologyNum, '') pthologyNum
                from movehistory where pathologyNum=@pathologyNum and type=@type`;
 
    logger.info('[183][listMoveHandler]sql=' + sql);
    try {
       const request = pool.request()
         .input('type', mssql.VarChar, type)
		 .input('pathologyNum', mssql.VarChar, pathologyNum); 
       const result = await request.query(sql)  
       console.dir(result);
       return result.recordset;
    } catch (error) {
       logger.error('[191][listMoveHandler ]err=' + error.message);
   }
};

 exports.listMoveHistory = (req,res,next) => {
    logger.info('[196][listMoveHandler]data=' +  JSON.stringify(req.body));
    const result = listMoveHandler(req);
    result.then((data) => { 
        res.json(data);         
    })
    .catch( error => {
        logger.error('[201] listMoveHistory err=' + error.body);
        res.sendStatus(500);
    });
 };

/// 입력
const insertMoveHandler= async (req) => {
    await poolConnect; 
    const date = req.body.date;
    const gene = req.body.gene;
    const amino = req.body.amino;
    const direction = req.body.direction;
    const comment = req.body.comment;
    const pathologyNum = req.body.pathologyNum;
    const type = req.body.type;

    logger.info('[214][insertMoveHandler]data=' +  JSON.stringify(req.body) );
	
	let sql =`insert into moveHistory ( date, gene, amino, direction, comment, pathologyNum, type)
        values( getdate(), @gene, @amino, @direction, @comment, @pathologyNum, @type)`;
 
    logger.info('[220][insertMoveHandler]sql=' + sql);
    try {
       const request = pool.request()
         .input('date', mssql.DateTime,date)
         .input('gene', mssql.VarChar,gene)
         .input('amino', mssql.VarChar,amino)
         .input('direction', mssql.VarChar,direction)
         .input('comment', mssql.NVarChar,comment)
		 .input('pathologyNum', mssql.VarChar, pathologyNum)
         .input('type', mssql.VarChar, type);
       const result = await request.query(sql)  
       console.dir(result);
       return result.recordset;
    } catch (error) {
       logger.error('[233][insertMoveHandler ]err=' + error.message);
   }
};

 exports.insertMoveHistory = (req,res,next) => {
    const result = insertMoveHandler(req);
    result.then((data) => { 
        res.json({message: 'OK'});         
    })
    .catch( error => {
        logger.error('[243] insertMoveHistory err=' + error.body);
        res.sendStatus(500);
    });
 };

// 수정 
const updateMoveHandler= async (req) => {
    await poolConnect; 
    const id   = req.body.id;
    const comment = req.body.comment;
 

    logger.info('[258][updateMoveHandler]data=' +  JSON.stringify(req.body) );
	
	let sql =`update  moveHistory set  comment=@comment  where id=@id`;
 
    logger.info('[263][updateMoveHandler]sql=' + sql);
    try {
       const request = pool.request()
         .input('id', mssql.Int, id)
         .input('comment', mssql.NVarChar,comment);

       const result = await request.query(sql)  
       return result ;
    } catch (error) {
       logger.error('[276][updateMoveHandler ]err=' + error.message);
   }
};

 exports.updateMoveHistory = (req,res,next) => {
    const result = updateMoveHandler(req);
    result.then((data) => { 
        res.json({message: 'OK'});         
    })
    .catch( error => {
        logger.error('[286] updateMoveHistory err=' + error.body);
        res.sendStatus(500);
    });
 };

/// 삭제
const deleteMoveHandler= async (req) => {
    await poolConnect; 
    const id   = req.body.id;

    logger.info('[296][deleteMoveHandler]data=' + id );
	
	let sql =`delete from moveHistory   where id=@id`;
 
    logger.info('[300][deleteMoveHandler]sql=' + sql);
    try {
       const request = pool.request()     
         .input('id', mssql.Int, id);
 
       const result = await request.query(sql)  
       return result ;
    } catch (error) {
       logger.error('[308][deleteMoveHandler ]err=' + error.message);
   }
};

 exports.deleteMoveHistory = (req,res,next) => {
    const result = deleteMoveHandler(req);
    result.then((data) => { 
        res.json({message: 'OK'});         
    })
    .catch( error => {
        logger.error('[318] deleteMoveHistory err=' + error.body);
        res.sendStatus(500);
    });
 };
////////////////////////////////////////////////////////////////////

