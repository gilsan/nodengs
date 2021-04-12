const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
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

const  messageHandler = async (user, dept) => {
  await poolConnect; // ensures that the pool has been created
    
  //const uuid = uuidv4();

  //console.log('uuid:', uuid);

  logger.info('[17][loginUser 진검]data=' + user + ", " + dept);
 
  const sql= `select user_id, password from users \
         where user_id = @user \
         and dept = @dept
         and approved = 'Y'`;
  logger.info('[38][loginUser 진검]sql=' + sql);  
  try {
      const request = pool.request()
        .input('user', mssql.VarChar, user) // id
        .input('dept', mssql.VarChar, dept); // dept 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[48][loginUser 진검]err=' + error.message);
  }
}

// 로그인 시각 변경
const updateLoginTime = async (user) =>{
  await poolConnect; // ensures that the pool has been created

  logger.info('[56][loginUser 진검][updateDiagLoginTime]data=' + user);
  sql =`update users set login_date=getdate() where user_id=@user`;
  logger.info('[57][loginUser 진검][updateDiagLoginTime]sql=' + sql);

  try {

      const request = pool.request()
               .input('user', mssql.VarChar, user);
      const result = await request.query(sql);       
      return result;        
    
  } catch(error) {
    logger.error('[17][loginUser 진검][updateDiagLoginTime]err=' + error.message);
  }
}

// 진검
exports.loginDiag = (req,res, next) => {

  logger.info('[75][loginDiag 진검]data=' + JSON.stringify(req.body));

  const user     = req.body.user;
  const password = req.body.password;

  logger.info('[75][loginDiag 진검]data=' + user + ", " + password);

  const dept  = "D";
  const result = messageHandler(user, dept);
  
  result.then(data => {
    //  res.json(data);
    console.log('[진검질의 결과][62]', data);

    let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: 'WRONGID'});
    }
    else if ( data.password === password) {

      let resultLogin = updateLoginTime(user);
      
      resultLogin.then(data => {
        console.log("result=", data);
      })
      .catch( error  => {
        logger.error('[75][loginUser 진검]err=' + error.message);
        res.sendStatus(500)
      });

      res.json({message: 'success'});
    } else {
      res.json({message: 'WRONGPW'});
    }
    
  })
  .catch( error  => {
    logger.error('[75][loginUser 진검]err=' + error.message);
    res.sendStatus(500)
  }); 
}

// 병리 쿼리
const  messageHandler2 = async (user, dept) => {
  await poolConnect; // ensures that the pool has been created

  logger.info('[122][loginUser 병리]data=' + user + ", " + dept);

  //const uuid = uuidv4();

  //console.log('uuid:', uuid);

  const sql= `select user_id, password from users 
         where user_id = @user 
         and dept = @dept
         and approved = 'Y'`;
  
  logger.info('[132][loginUser 병리]sql=' + sql);

  try {
      const request = pool.request()
        .input('user', mssql.VarChar, user) // id
        .input('dept', mssql.VarChar, dept); // dept 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (error) {
    logger.error('[75][loginUser 병리]err=' + error.message);
  }
}
   
// 병리
exports.loginPath = (req,res, next) => {
  
  logger.info('[150][loginUser 병리]data=' + JSON.stringify(req.body));

  const user     = req.body.user;
  const password = req.body.password;
 
  logger.info('[155][loginUser 병리]data=' + user + ", " + password);

  const dept  = "P";
  const result = messageHandler2(user, dept);
  result.then(data => {

    let data2 =  nvl(data, "");

    if (data2 === "") {
      res.json({message: 'WRONGID'});
    }
    else if ( data.password === password) {

      let resultLogin = updateLoginTime(user);
      
      resultLogin.then(data => {
        console.log("result=", data);
      })
      .catch( error  => {
        logger.error('[175][loginUser 병리]err=' + error.message);
        res.sendStatus(500)
      });

      res.json({message: 'success'});
    } else {
      res.json({message: 'WRONGPW'});
    }
    
  })
  .catch( error  => {
    logger.error('[185][loginUser 병리]err=' + error.message);
    res.sendStatus(500)
  }); 
}

// 병리 리스트 검색
const  listPathHandler = async (dept) => {
  await poolConnect;
  
  logger.info('[194][loginUser 병리]dept=' + dept);
  const sql= "select user_id, user_nm, part, pickselect from users where dept=@dept";
  logger.info('[75][loginUser 병리]sql=' + sql);

  try {
    const request = pool.request()
    .input('dept', mssql.VarChar, dept);
    const result = await request.query(sql);
    const data = result.recordset;
      return data;

  } catch(error) {
    logger.error('[75][loginUser 병리]err=' + error.message);
  }

}

exports.listPath = (req, res, next) => {
  logger.info('[213][loginUser 병리]data=' + JSON.stringify(req.body));
  
  const dept = req.body.dept;
  logger.info('[215][loginUser 병리]dept=' + dept);

  const result = listPathHandler(dept);
  result.then(data => {
        res.json(data);
  })
  .catch(error => {
    logger.error('[223][loginUser 병리]err=' + error.message);
  });
}

// 병리 검사자 pickselect 변경
const  updatePickselect = async (user_id, pickselect, part) => {
  await poolConnect; 
  logger.info('[230][loginUser 병리][updatePickselect]data=' + user_id + ", " + pickselect + ", " + part);
  const query ="update users set pickselect='N' where dept='P' and part=@part";
  logger.info('[232][loginUser 병리][updatePickselect]sql=' + query);
  try {
    const request = pool.request()
     .input('part', mssql.VarChar, part);
    const result = await request.query(query);
  } catch(error) {
    logger.error('[238][loginUser 병리]err=' + error.message );
  }

  const sql= "update users set  pickselect=@pickselect where user_id=@user_id";
  logger.info('[242][loginUser 병리][updatePickselect]sql=' + sql);

  try {
    const request = pool.request()
    .input('user_id', mssql.VarChar, user_id)
    .input('pickselect', mssql.VarChar, pickselect);

    const result = await request.query(sql);
    const data = result.recordset;
      return data;

  } catch(error) {
    logger.error('[75][loginUser 병리][updatePickSelect]err=', error.message);
  }

}
// 병리 확인자 pickselect 변경
exports.listPathUpdate = (req, res, next) => {
   const user_id = req.body.userId;
   const pickselect = req.body.pickselect;
   const part = req.body.part;
   const result = updatePickselect(user_id, pickselect, part);
   result.then(data => {
      res.json({message: 'SUCCESS'});
   })
   .catch(error)
   {
    logger.error('[269][loginUser 병리][updatePickerSelect]err=' + error.message);
   }

}


// 진검 사용자 목록조회
const diagList = async (user_id, pickselect, part) => {
  await poolConnect;
  
  const sql = "select  user_nm from users where dept = 'D'";
  logger.info('[75][loginUser 진검]diagList sql=' + sql);
  try {
      const request = pool.request();
      const result = await request.query(sql);
      return result;
  } catch(error) {
    logger.error('[285][loginUser 진검]diagList err=' + error.message);
  }
}

exports.listDiagList = (req, res, next) => {

  logger.info('[292][loginUser 진검]listDiag req=' + JSON.stringify(req.body));
  //const userPart = req.body.userPart;
  const result = diagList();
  result.then(data => {
       res.json({message: 'SUCCESS'});
  })
  .catch(error => {
    logger.error('[299][loginUser 진검]listDiag err=' + error.message);
  });
}

// 진검 리스트 검색
const  listDiagHandler = async (dept) => {
  await poolConnect;
  
  logger.info('[307][loginUser 진검]list data=' + dept);
  const sql= "select user_id, user_nm, part, pickselect from users where dept=@dept";
  logger.info('[309][loginUser 진검]lust sql=' + sql);

  try {
    const request = pool.request()
    .input('dept', mssql.VarChar, dept);
    const result = await request.query(sql);
    const data = result.recordset;
      return data;
  } catch(error) {
    logger.error('[318][loginUser 진검]listDiag err=' + error.message);
  }

}
exports.listDiag = (req, res, next) => {
    logger.info('[323][loginUser 진검]listDiag req=' + JSON.stringify(req.body));
    const dept = req.body.dept;
    const result = listDiagHandler(dept);
    result.then(data => {
        res.json(data);
    })
    .catch(error => {
      logger.error('[75][loginUser 진검]err=' + error.message);
    });
}