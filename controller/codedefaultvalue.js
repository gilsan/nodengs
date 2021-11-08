const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
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

// 전체목록
const  listsHandler = async () => {
    await poolConnect;  

    const sql=`select  id, isnull(type, '') type, isnull(code, '') code, isnull(report, '') report, 
    isnull(target, '') target, isnull(specimen, '') specimen,
       isnull(analyzedgene, '') analyzedgene, isnull(method, '') method, isnull(Mutation_Comment, '') mutationComment,
       isnull(comment1, '') comment1, isnull(comment2, '') comment2 , isnull(comment, '') comment
       from codedefaultvalue`;
 
    logger.info('[19][codedefaultvalue][listsHandler] =' + sql);
    try {
        const request = pool.request();
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[28][codedefaultvalue][listsHandler] err=' + error.message);
    }

}
exports.getLists = (req, res, next) => {
   
    const result = listsHandler();
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[36][codedefaultvalue][getLists] err=' + error.message);
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
    const analyzedgene= nvl(req.body.analyzedgene, '');
    const method= req.body.method;
    const comment = req.body.comment;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;
    const mutationComment= req.body.mutationComment;

    sql=`insert into codedefaultvalue (type, code, report, target,specimen, analyzedgene,
         method, comment1, comment2, comment, Mutation_Comment)
      values(@type, @code, @report, @target, @specimen, @analyzedgene,
         @method, @comment1, @comment2, comment, @mutationComment)`

      logger.info('[61][codedefaultvalue][insertHandler] =' + sql);

      try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.NVarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input('analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment', mssql.NVarChar, comment)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2)
            .input('mutationComment', mssql.NVarChar, mutationComment);

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
    const analyzedgene= nvl(req.body.analyzedgene, '');
    const method= req.body.method;
    const comment = req.body.comment;
    const comment1= req.body.comment1;
    const comment2= req.body.comment2;
    const mutationComment= req.body.mutationComment;

    sql=`update  codedefaultvalue 
    set  type=@type,  code=@code, report=@report, target=@target,
        specimen=@specimen, analyzedgene=@analyzedgene, 
        method=@method, comment1=@comment1, comment2=@comment2, comment=@comment,
        Mutation_Comment = @mutationComment
      where id=@id`;

    logger.info('[114][codedefaultvalue][updateHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id)
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.NVarChar, report)
            .input('target', mssql.VarChar, target)
            .input('specimen', mssql.VarChar, specimen)
            .input('analyzedgene', mssql.VarChar,  analyzedgene)
            .input('method', mssql.VarChar, method)
            .input('comment', mssql.NVarChar, comment)
            .input('comment1', mssql.NVarChar, comment1)
            .input('comment2', mssql.NVarChar, comment2)
            .input('mutationComment', mssql.NVarChar, mutationComment);

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
    const id = req.body.id;
 
    sql=`delete from codedefaultvalue  where id=@id`;

    logger.info('[159][codedefaultvalue][deleteHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id);

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

    const sql=`select  id, isnull(type,'') type, isnull(code, '') code, isnull(report, '') report, 
        isnull(target, '') target, isnull(specimen, '') specimen,
        isnull(analyzedgene, '') analyzedgene, isnull(method, '') method, isnull(Mutation_Comment, '') mutationComment,
        isnull(comment1, '') comment1, isnull(comment2, '') comment2 , isnull(comment,'') comment
       from codedefaultvalue where code=@code`;

    logger.info('[196][codedefaultvalue][listHandler] =' + sql);
    try {
        const request = pool.request()
            .input('code', mssql.VarChar, code);
        result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[203][codedefaultvalue][listHandler] err=' + error.message);
    }

}
exports.getList = (req, res, next) => {
    logger.info('[205][codedefaultvalue][getList] req=' + JSON.stringify(req.body)); 
    const code = req.body.code;
    const result = listHandler(code);
    result.then(data => {  
        logger.info('[209][codedefaultvalue][getList] data=' + data);
        res.json(data);
    })
    .catch( error => {
        logger.error('[212][codedefaultvalue][getList] err=' + error.message);
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

      logger.info('[227][codedefaultvalue][codeinsertHandler] =' + sql);

      try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.NVarChar, report);

        const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[238][codedefaultvalue][codeinsertHandler] err=' + error.message);
    }     

}

exports.codeitemInsert = (req, res, next) => {
    logger.info('[244][codedefaultvalue][codeInsert] req=' + JSON.stringify(req.body)); 
 
    const result = codeinsertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[251][codedefaultvalue][codeInsert] err=' + error.message);
        res.sendStatus(500);
    });
}

// 전체리스트
const  codelistsHandler = async () => {
    await poolConnect;  

    const sql=`select id,    isnull(code, '') code, isnull(report, '') report, isnull(type, '') type from testcodelists `;

    logger.info('[262][codedefaultvalue][codelistsHandler] =' + sql);
    try {
        const request = pool.request();
            
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[272][codedefaultvalue][codelistsHandler] err=' + error.message);
    }
}

exports.getcodeLists = (req, res, next) => {

    const result = codelistsHandler();
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[280][codedefaultvalue][getcodeLists] err=' + error.message);
        res.sendStatus(500);
    });
}

// 개별리스트
const  codelistHandler = async (code) => {
    await poolConnect;  

    const sql=`select id,    isnull(code, '') code, isnull(report, '') report, 
       isnull(type, '') type from testcodelists where code=@code `;

    logger.info('[292][codedefaultvalue][codelisttHandler] =' + sql);
    try {
        const request = pool.request()
        .input('code', mssql.VarChar, code);
            
        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[300][codedefaultvalue][codelisHandler] err=' + error.message);
    }
}

exports.getcodeList = (req, res, next) => {
    logger.info('[305][codedefaultvalue][getcodeList] req=' + JSON.stringify(req.body)); 

    const result = codelistHandler();
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[312][codedefaultvalue][getcodeList] err=' + error.message);
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
 

    sql=`update  testcodelists set  type=@type,  code=@code, report=@report  where id=@id`;

    logger.info('[329][codedefaultvalue][codeupdateHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id)
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code)
            .input('report', mssql.NVarChar, report);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[342][codedefaultvalue][codeupdateHandler] err=' + error.message);
    }  
}

exports.codeitemUpdate = (req, res, next) => {
    logger.info('[347][codedefaultvalue][codeitemUpdate] req=' + JSON.stringify(req.body)); 
 
    const result = codeupdateHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[354][codedefaultvalue][codeitemUpdate] err=' + error.message);
        res.sendStatus(500);
    });
}

// 삭제
const codedeleteHandler = async (req) => {
    await poolConnect;
    const id = req.body.id;
 
    sql=`delete from testcodelists  where id=@id`;

    logger.info('[366][codedefaultvalue][codedeleteHandler] =' + sql);

    try {
        const request = pool.request()
            .input('id', mssql.Int, id);

    const result = await request.query(sql);
        return result; 
    }catch (error) {
        logger.error('[375][codedefaultvalue][codedeleteHandler] err=' + error.message);
    }  

}


exports.codeitemDelete = (req, res, next) => {
    logger.info('[382][codedefaultvalue][codeitemDeletee] req=' + JSON.stringify(req.body)); 
 
    const result = codedeleteHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[389][codedefaultvalue][codeitemDelete] err=' + error.message);
        res.sendStatus(500);
    });

}

///////////////////// readingcomment 읽어오기
const commentHandler = async (type, code) => {
    await poolConnect;
    
    sql=`select  id, type, code, isnull(comment, '') comment, isnull(seq, '0') seq  from readingcomment where type=@type and code=@code `;
    logger.info('[400][codedefaultvalue][commentHandler] =' + sql);
    try {
        const request = pool.request()
            .input('type', mssql.VarChar, type)
            .input('code', mssql.VarChar, code);

    const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[409][codedefaultvalue][commentHandler] err=' + error.message);
    }  
}

exports.getCommentLists = (req, res, next) => {
    logger.info('[414][codedefaultvalue][getCommentLists] req=' + JSON.stringify(req.body)); 
 
    const result = commentHandler(req.body.type, req.body.code);
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[421][codedefaultvalue][getCommentLists] err=' + error.message);
        res.sendStatus(500);
    });
}

//////////// 입력
const commentInsertHandler = async (req) => {
    await poolConnect;
    const reading = req.body.reading;
    
    for ( i=0; i < reading.length; i++) {
        const type = reading[i].type;
        const code = reading[i].code
        const comment= reading[i].comment;
     
        sql=`insert into readingcomment (type, code, comment, seq )
          values(@type, @code, @comment, '0')`    
          logger.info('[436][codedefaultvalue][commentInsertHandler] =' + sql);
    
          try {
            const request = pool.request()
                .input('type', mssql.VarChar, type)
                .input('code', mssql.VarChar, code)
                .input('comment', mssql.NVarChar, comment);    
            result = await request.query(sql);           
        }catch (error) {
            logger.error('[447][codedefaultvalue][commentInsertHandler] err=' + error.message);
        }    
    }
    return result;
}

exports.insertComment=  (req, res, next) => {
    logger.info('[452][codedefaultvalue][insertComment] req=' + JSON.stringify(req.body));

    const result = commentInsertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[459][codedefaultvalue][insertComment] err=' + error.message);
        res.sendStatus(500);
    });    
}

///////////////// 1개 입력
const commentOneInsertHandler = async (req) => {
    await poolConnect;

    const type = req.body.type;
    const code = req.body.code
    const comment= req.body.comment;
     
        sql=`insert into readingcomment (type, code, comment, seq )
          values(@type, @code, @comment, '0')`    
          logger.info('[506][codedefaultvalue][commentOneInsertHandler] =' + sql);
    
          try {
            const request = pool.request()
                .input('type', mssql.VarChar, type)
                .input('code', mssql.VarChar, code)
                .input('comment', mssql.NVarChar, comment);    
            result = await request.query(sql);           
        }catch (error) {
            logger.error('[515][codedefaultvalue][commentOneInsertHandler] err=' + error.message);
        }    
    
    return result;
}

exports.insertOneComment=  (req, res, next) => {
    logger.info('[522][codedefaultvalue][insertOneComment] req=' + JSON.stringify(req.body));

    const result = commentOneInsertHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[529][codedefaultvalue][insertOneComment] err=' + error.message);
        res.sendStatus(500);
    });    
}

////////////// 수정
const commentUpdateHandler = async (req) => {
    await poolConnect;
    const reading = req.body.reading;

    for (let i =0; i < reading.length; i++ ){
        const id = reading[i].id;
        const type = reading[i].type;
        const code = reading[i].code
        const comment= reading[i].comment;
        sql=`update  readingcomment set  type=@type,  code=@code,   comment=@comment  where id=@id`;

        logger.info('[478][codedefaultvalue][commentInsertHandler] =' + sql);
    
        try {
            const request = pool.request()
                .input('id', mssql.Int, id)
                .input('type', mssql.VarChar, type)
                .input('code', mssql.VarChar, code)
                .input('comment', mssql.NVarChar, comment);
    
        result = await request.query(sql);
           
        }catch (error) {
            logger.error('[490][codedefaultvalue][codeupdateHandler] err=' + error.message);
        } 
    }

    return result;  
}

exports.updateComment=  (req, res, next) => {
    logger.info('[498][codedefaultvalue][updateComment] req=' + JSON.stringify(req.body));

    const result = commentUpdateHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[499][codedefaultvalue][updateComment] err=' + error.message);
        res.sendStatus(500);
    });
}


// 삭제
const commentDeleteHandler = async (req) => {
    await poolConnect;
    const reading = req.body.reading;
    for(let i =0; i < reading.length; i++){
        const id =  reading[i].id
        sql=`delete from readingcomment  where id=@id`;
        logger.info('[518][codedefaultvalue][commentDeleteHandler] =' + sql);
    
        try {
            const request = pool.request()
                .input('id', mssql.Int, id);
    
        result = await request.query(sql);
        
        }catch (error) {
            logger.error('[520][codedefaultvalue][commentDeleteHandler] err=' + error.message);
        } 
    }

    return result;
 
 
}

exports.deleteComment=  (req, res, next) => {
    logger.info('[537][codedefaultvalue][deleteComment] req=' + JSON.stringify(req.body));

    const result = commentDeleteHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[544][codedefaultvalue][deleteComment] err=' + error.message);
        res.sendStatus(500);
    });
}


/////// 순서 갱신
const commentUpdateSeqHandler = async (req) => {
    await poolConnect;
    const reading = req.body.reading;

    for (let i =0; i < reading.length; i++ ){
        const id     = reading[i].id;
        const type   = reading[i].type;
        const code   = reading[i].code
        const comment= reading[i].comment;
        const seq    = reading[i].seq;
        sql=`update  readingcomment set  type=@type,  code=@code,   comment=@comment, seq=@seq where id=@id`;
        console.log('[563]', id, type, code, comment,seq)
        logger.info('[564][codedefaultvalue][commentUpdateSeqHandler] =' + sql);
    
        try {
            const request = pool.request()
                .input('id', mssql.Int, id)
                .input('type', mssql.VarChar, type)
                .input('code', mssql.VarChar, code)
                .input('seq', mssql.Int, seq)
                .input('comment', mssql.NVarChar, comment);
    
            result = await request.query(sql);
           
        }catch (error) {
            logger.error('[577][codedefaultvalue][commentUpdateSeqHandler] err=' + error.message);
        } 
    }

    return result;  
}

exports.updateCommentSeq=  (req, res, next) => {
    logger.info('[585][codedefaultvalue][updateCommentSeq] req=' + JSON.stringify(req.body));

    const result = commentUpdateSeqHandler(req);
    result.then(data => {  
        res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[592][codedefaultvalue][updateCommentSeq] err=' + error.message);
        res.sendStatus(500);
    });

}

////////////////////////////////////////////////////////////////////
/////   Gene, nucleotide 정보로 mutation에서 다른 정보첯기
const infofindHandler = async (req) => {
    await poolConnect;
    const gene = req.body.gene;
    const nucleotide = req.body.nucleotide;

    sql=`select functional_impact, reference, cosmic_id from mutation  where gene=@gene and nucleotide_change=@nucleotide order by id desc limit 1`;
    logger.info('[606][codedefaultvalue][nucleotide] =' + sql);

    try {
        const request = pool.request()
            .input('gene', mssql.VarChar, gene)
            .input('nucleotide', mssql.NVarChar, nucleotide);

        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[616][codedefaultvalue][nucleotide] err=' + error.message);
    } 
}

exports.findmutation=  (req, res, next) => {
    logger.info('[621][codedefaultvalue][findmutation] req=' + JSON.stringify(req.body));

    const result = infofindHandler(req);
    result.then(data => {  
        res.json(data);
    })
    .catch( error => {
        logger.error('[628][codedefaultvalue][findmutation] err=' + error.message);
        res.sendStatus(500);
    });

}






