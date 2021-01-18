const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

// 진검 궈리
const pool = new mssql.ConnectionPool(config);
*/

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
    
  const uuid = uuidv4();

  console.log('uuid:', uuid);

  const sql= `select user_id, password from users \
         where user_id = @user \
         and dept = @dept`;
         console.log('[진검][40]sql:', sql, user, dept);  
  try {
      const request = pool.request()
        .input('user', mssql.VarChar, user) // id
        .input('dept', mssql.VarChar, dept); // dept 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (err) {
      console.error('SQL error', err);
  }
}

// 로그인 시각 변경
const updateLoginTime = async (user) =>{
  await poolConnect; // ensures that the pool has been created

  console.log('==[68][updateDiagLoginTime]', user);
  sql =`update users set login_date=getdate() where user_id=@user`;
  try {

      const request = pool.request()
               .input('user', mssql.VarChar, user);
      const result = await request.query(sql);       
               return result;        
    
  } catch(err) {
      console.error('SQL error', err);
  }
}

// 진검
exports.loginDiag = (req,res, next) => {

  const user     = req.body.user;
  const password = req.body.password;
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
      .catch( err  => res.sendStatus(500));

      res.json({message: 'success'});
    } else {
      res.json({message: 'WRONGPW'});
    }
    
  })
  .catch( err  => res.sendStatus(500)); 
}



// 병리 궈리
const  messageHandler2 = async (user, dept) => {
  await poolConnect; // ensures that the pool has been created

  const uuid = uuidv4();

  console.log('uuid:', uuid);

  const sql= `select user_id, password from users 
         where user_id = @user 
         and dept = @dept`;
  
  console.log('[병리]sql:', sql, user, dept);

  try {
      const request = pool.request()
        .input('user', mssql.VarChar, user) // id
        .input('dept', mssql.VarChar, dept); // dept 
      const result = await request.query(sql)
      console.dir(result);
      const data = result.recordset[0];
      return data;
  } catch (err) {
      console.error('SQL error', err);
  }
}
   
// 병리
exports.loginPath = (req,res, next) => {
    
  const user     = req.body.user;
  const password = req.body.password;
 
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
      .catch( err  => res.sendStatus(500));

      res.json({message: 'success'});
    } else {
      res.json({message: 'WRONGPW'});
    }
    
  })
  .catch( err  => res.sendStatus(500)); 
}

// 병리 리스트 검색
const  listPathHandler = async (dept) => {
  await poolConnect; 
  const sql= "select user_id, user_nm, part, pickselect from users where dept=@dept";

  try {
    const request = pool.request()
    .input('dept', mssql.VarChar, dept);
    const result = await request.query(sql);
    const data = result.recordset;
      return data;

  } catch(err) {
    console.error('SQL error', err);
  }

}
exports.listPath = (req, res, next) => {
    const dept = req.body.dept;
    const result = listPathHandler(dept);
    result.then(data => {
        res.json(data);
    });
}



// 병리 검사자 pickselect 변경
const  updatePickselect = async (user_id, pickselect, part) => {
  await poolConnect; 
  console.log('[172][loginuser][updatePickselect] ', user_id, pickselect, part);
  const query ="update users set pickselect='N' where dept='P' and part=@part";
  try {
    const request = pool.request()
     .input('part', mssql.VarChar, part);
    const result = await request.query(query);
  } catch(err) {
    console.error('SQL error',err);
  }

  const sql= "update users set  pickselect=@pickselect where user_id=@user_id";

  try {
    const request = pool.request()
    .input('user_id', mssql.VarChar, user_id)
    .input('pickselect', mssql.VarChar, pickselect);

    const result = await request.query(sql);
    const data = result.recordset;
      return data;

  } catch(err) {
    console.error('SQL error', err);
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

}


// 진검 사용자 목록조회

const diagList = async (user_id, pickselect, part) => {
  await poolConnect;
  
  const sql = "select  user_nm from users where dept = 'D'";
  try {
      const request = pool.request();
      const result = await request.query(sql);
      return result;
  } catch(err) {
     console.error('SQL error', err);
  }
}

exports.listDiagList = (req, res, next) => {

  const userPart = req.body.userPart;
  const result = diagList();
  result.then(data => {
       res.json({message: 'SUCCESS'});
  });
}



// 병리 리스트 검색
const  listDiagHandler = async (dept) => {
  await poolConnect; 
  const sql= "select user_id, user_nm, part, pickselect from users where dept=@dept";

  try {
    const request = pool.request()
    .input('dept', mssql.VarChar, dept);
    const result = await request.query(sql);
    const data = result.recordset;
      return data;

  } catch(err) {
    console.error('SQL error', err);
  }

}
exports.listDiag = (req, res, next) => {
    const dept = req.body.dept;
    const result = listDiagHandler(dept);
    result.then(data => {
        res.json(data);
    });
}