const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


// 전체목록
const  listsHandler = async (type) => {
    await poolConnect;  

    const sql=`select  id, isnull(code, '') code, isnull(report, '') report, isnull(target, '') target, isnull(specimen, '') specimen,
       isnull(analyzedgene, '') analyzedgene, isnull(method, '') method, isnull(comment1, '') comment1, isnull(comment2, '') comment2 
       from codedefaultvalue where type=@type`;

    logger.info('[19][codedefaultvalue][listsHandler] =' + sql);
    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type);
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[28][codedefaultvalue][listsHandler] err=' + error.message);
    }

}
exports.getLists = (req, res, next) => {
    logger.info('[31][codedefaultvalue][getLists] req=' + JSON.stringify(req.body)); 
    const type = req.body.type;
 
    const result = listsHandler(type);
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[39][codedefaultvalue][getLists] err=' + error.message);
        res.sendStatus(500);
    });
}


// 입력
const insertHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
    const target= req.body.target;
    const specimen= req.body.specimen;
    const analyzedgene= req.body.analyzedgene;
    const method= req.body.method;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;

    sql=`insert into codedefaultvalue (type, code, report, target,specimen, analyzedgene, method, comment1, comment2)
      values(@type, @code, @report, @target, @specimen, @analyzedgene, @method, @comment1, @comment2)`

      logger.info('[61][codedefaultvalue][insertHandler] =' + sql);

      try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.VarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input('analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2);

        const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[78][codedefaultvalue][insertHandler] err=' + error.message);
    }     

}

exports.itemInsert = (req, res, next) => {
    logger.info('[84][codedefaultvalue][itemInsert] req=' + JSON.stringify(req.body)); 
 
    const result = insertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[91][codedefaultvalue][itemInsert] err=' + error.message);
        res.sendStatus(500);
    });
}

// 수정
const updateHandler = async (req) => {
    await poolConnect;
    const id = req.body.id;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
    const target= req.body.target;
    const specimen= req.body.specimen;
    const analyzedgene= req.body.analyzedgene;
    const method= req.body.method;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;

    sql=`update  codedefaultvalue set  type=@type,  code=@code, report=@report, target=@target,
    specimen=@specimen, analyzedgene=@analyzedgene, method=@method, comment1=@comment1, comment2=@comment2
      where id=@id`;

    logger.info('[114][codedefaultvalue][updateHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id)
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.VarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input('analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[131][codedefaultvalue][updateHandler] err=' + error.message);
    }  

}

exports.itemUpdate = (req, res, next) => {
    logger.info('[137][codedefaultvalue][temUpdate] req=' + JSON.stringify(req.body)); 
 
    const result = updateHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[141][codedefaultvalue][temUpdate] err=' + error.message);
        res.sendStatus(500);
    });

}


// 삭제
const deleteHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
 
    sql=`delete from codedefaultvalue  where type=@type`;

    logger.info('[159][codedefaultvalue][deleteHandler] =' + sql);

    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[168][codedefaultvalue][deleteHandler] err=' + error.message);
    }  

}


exports.itemDelete = (req, res, next) => {
    logger.info('[175][codedefaultvalue][itemDelete] req=' + JSON.stringify(req.body)); 
 
    const result = deleteHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[182][codedefaultvalue][itemDelete] err=' + error.message);
        res.sendStatus(500);
    });

}

// 개별목록
const  listHandler = async (code) => {
    await poolConnect;  

    const sql=`select  id, isnull(type,'') type, isnull(code, '') code, isnull(report, '') report, isnull(target, '') target, isnull(specimen, '') specimen,
       isnull(analyzedgene, '') analyzedgene, isnull(method, '') method, isnull(comment1, '') comment1, isnull(comment2, '') comment2 
       from codedefaultvalue where code=@code`;

    logger.info('[196][codedefaultvalue][listHandler] =' + sql);
    try {
        const request = pool.request()
            .input('code', mssql.VarChar, code);
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[203][codedefaultvalue][listHandler] err=' + error.message);
    }

}
exports.getList = (req, res, next) => {
    logger.info('[208][codedefaultvalue][getList] req=' + JSON.stringify(req.body)); 
    const code = req.body.code;
    const result = listHandler(code);
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[39][codedefaultvalue][getList] err=' + error.message);
        res.sendStatus(500);
    });
}
//////////////////////////////////////////////////////////////////////////////
// 시험코드, 시험코드 보고서, 유형 입력(임시)
const codeinsertHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
 
    sql=`insert into testcodelists (type, code, report )
      values(@type, @code, @report)`

      logger.info('[230][codedefaultvalue][codeinsertHandler] =' + sql);

      try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.NVarChar, report);

        const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[241][codedefaultvalue][codeinsertHandler] err=' + error.message);
    }     

}

exports.codeInsert = (req, res, next) => {
    logger.info('[247][codedefaultvalue][codeInsert] req=' + JSON.stringify(req.body)); 
 
    const result = codeinsertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[254][codedefaultvalue][codeInsert] err=' + error.message);
        res.sendStatus(500);
    });
}

// 전체리스트
const  codelistsHandler = async () => {
    await poolConnect;  

    const sql=`select id, isnull(comment, '') comment,  isnull(code, '') code, isnull(report, '') report, isnull(type, '') type from testcodelists `;

    logger.info('[265][codedefaultvalue][codelistsHandler] =' + sql);
    try {
        const request = pool.request();
            
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[272][codedefaultvalue][codelistsHandler] err=' + error.message);
    }
}

exports.getcodeLists = (req, res, next) => {
    logger.info('[277][codedefaultvalue][getcodeLists] req=' + JSON.stringify(req.body)); 

    const result = codelistsHandler();
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[284][codedefaultvalue][getcodeLists] err=' + error.message);
        res.sendStatus(500);
    });
}

// 개별리스트
const  codelistHandler = async (code) => {
    await poolConnect;  

    const sql=`select id, isnull(comment, '') comment,  isnull(code, '') code, isnull(report, '') report, 
       isnull(type, '') type from testcodelists where code=@code `;

    logger.info('[296][codedefaultvalue][codelisttHandler] =' + sql);
    try {
        const request = pool.request()
        .input('code', mssql.VarChar, code);
            
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[304][codedefaultvalue][codelisHandler] err=' + error.message);
    }
}

exports.getcodeList = (req, res, next) => {
    logger.info('[308][codedefaultvalue][getcodeList] req=' + JSON.stringify(req.body)); 

    const result = codelistHandler();
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[316][codedefaultvalue][getcodeList] err=' + error.message);
        res.sendStatus(500);
    });
}


// 수정
const codeupdateHandler = async (req) => {
    await poolConnect;
    const id = req.body.id;
    const type = req.body.type;
    const code = req.body.code
    const report= req.body.report;
    const comment= req.body.comment;

    sql=`update  testcodelists set  type=@type,  code=@code, report=@report,   comment=@comment  where id=@id`;

    logger.info('[33][codedefaultvalue][codeupdateHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id)
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.VarChar, report)
            .input('comment', mssql.NVarChar, comment);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[381][codedefaultvalue][codeupdateHandler] err=' + error.message);
    }  
}

exports.codeitemUpdate = (req, res, next) => {
    logger.info('[351][codedefaultvalue][codeitemUpdate] req=' + JSON.stringify(req.body)); 
 
    const result = codeupdateHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[358][codedefaultvalue][codeitemUpdate] err=' + error.message);
        res.sendStatus(500);
    });
}

// 삭제
const codedeleteHandler = async (req) => {
    await poolConnect;
    const type = req.body.type;
 
    sql=`delete from testcodelists  where type=@type`;

    logger.info('[370][codedefaultvalue][codedeleteHandler] =' + sql);

    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[379][codedefaultvalue][codedeleteHandler] err=' + error.message);
    }  

}


exports.codeitemDelete = (req, res, next) => {
    logger.info('[386][codedefaultvalue][codeitemDeletee] req=' + JSON.stringify(req.body)); 
 
    const result = codedeleteHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[393][codedefaultvalue][codeitemDelete] err=' + error.message);
        res.sendStatus(500);
    });

}




