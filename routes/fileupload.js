/*

fileupload: file: [
{
	"fieldname":"userfiles","originalname":"test_file_143.txt","encoding":"7bit","mimetype":"text/plain","destination":"uploads/","filename":"test_file_143.txt","path":"uploads/test_file_143.txt","size":60}][1] ==============
*/

const fs = require('fs');
const express = require('express');
const router = express.Router();
 
const inputDB      = require('../controlDB/inputdb');
const main_mod     = require('../functions/main');
const loadData_mod = require('../functions/readData');

var multer = require('multer');
 
const mssql = require('mssql');
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

const today = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
// console.log(year, month, day);
  if (month < 10) {
     month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  return year + '-' + month + '-' + day;
}

let dirPath = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
		
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();
	 // console.log(year, month, day);
      if (month < 10) {
         thisMonth = '0' + month;
      }

      if (day < 10) {
        thisDay = '0' + day;
      }
	  if (month < 10) {             
		if (day < 10) {
			  dirPath = 'diag/'+ year + '/' + thisMonth + '/' + thisDay;
		} else {
              dirPath = 'diag/'+ year + '/' + thisMonth + '/' + day;
		}
	  } else {
  		if (day < 10) {
			  dirPath = 'diag/'+ year + '/' + month + '/' + thisDay;
		} else {
			  dirPath = 'diag/'+ year + '/' + month + '/' + day;
		}
	  }

           
      let isDirExists = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
    //  console.log('directory: ', isDirExists, dirPath);
      if (!isDirExists){
          fs.mkdirSync( dirPath, { recursive: true });
      }

     // cb(null, 'uploads/');
	    cb(null,  dirPath); 
    },
    filename: function (req, file, cb) {
	 cb(null, file.originalname)
    }
})



const  messageHandler = async (testedID, today) => {
  await poolConnect; // ensures that the pool has been created
 
  const qry=`select count(*) as count 
                from filtered_raw_tsv
                 where testedID=@testedID 
                 and left(createdate,10)=@today`;

  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('testedID', mssql.VarChar, testedID)
      .input('today', mssql.VarChar, today);
      const result = await request.query(qry)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

const  messageHandler2 = async (testedID, today) => {
  await poolConnect; // ensures that the pool has been created
 
  const qry=`delete from filtered_raw_tsv
                 where testedID = @testedID 
                 and left(createdate,10) = @today`;

  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('testedID', mssql.VarChar, testedID)
      .input('today', mssql.VarChar, today);
      const result = await request.query(qry)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

const  messageHandler3 = async (originalname, dirPath, testedID) => {
  await poolConnect; // ensures that the pool has been created
   const now = today();
   console.log('[145][fileupload][messageHandler3] ', now, dirPath, originalname, testedID);
  const qry=`update patientinfo_diag 
        set tsvFilteredFilename = @originalname, 
        tsvFilteredStatus= '처리완료',
        screenstatus = '0',
        path=@dirPath,
        tsvFilteredDate=getdate()  
        where specimenNo = @testedID`;
     console.log('[152][fileupload][update patientinfo_diag]',  qry) ;
  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('originalname', mssql.VarChar, originalname)
      .input('dirPath',mssql.VarChar, dirPath)
      .input('testedID', mssql.VarChar, testedID);
      const result = await request.query(qry)
      console.dir( result);
    //  console.log('[158][update patientinfo_diag] ', result)
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}

const  messageHandler4 = async (originalname, dirPath,  testedID) => {
  await poolConnect; // ensures that the pool has been created
 
  const sql ="insert into jinTsvUpload (filename, path, testedID ) "
                     + " values (@originalname, @dirPath, @testedID)";
       
  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('originalname', mssql.VarChar, originalname)
      .input('dirPath', mssql.VarChar, dirPath)
      .input('testedID', mssql.VarChar, testedID);
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (err) {
      console.error('SQL error', err);
  }
}


const updatePatient = async (testedID) => {
  await poolConnect;
  const sql ="update  patientinfo_diag \
               set IKZK1Deletion = '', \
               chromosomalanalysis = '', \
               FLT3ITD = '' \
             where specimenNo=@testedID";
  console.log('[updatePatient] [195]', sql);
  try {
   const request = pool.request()
     .input('testedID', mssql.VarChar, testedID)
   const result = await request.query(sql);
  } catch(err) {
    console.log('SQL error [updatePatient][201]\n', err)
  }
}


 
var upload = multer({ storage: storage, limits: { fileSize : 3 *1024 * 1000 * 1000, fieldSize: 3 *1024 * 1000 * 1000, fieldNameSize: 1000  } }).array('userfiles', 10);

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(500).json(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(500).json(err);
        }

        
        let uploadedFiles = [];
        let today ='';
        let testedID = '';

        for(let item of req.files) {
              uploadedFiles.push({filename: item.originalname});
 
		          // 검체번호로 atientInfo_diag update 함
		          testedID = req.body.testedID;
       
              // 금일 날자와 검체번호로 존재 하는지 조사.
              const year1  = new Date().getFullYear();
              const month1 = new Date().getMonth() + 1;
              const day1   = new Date().getDate();
	            // console.log(year, month, day);
              if (month1 < 10) {
                thismonth = '0' + month1;
              }

              if (day1 < 10) {
                thisday = '0' + day1;
              }

	            if (month1 < 10) {
              
		            if (day1 < 10) {
			            today = year1 + '-' + thismonth + '-' + thisday;
		            } else {
                  today = year1 + '-' + thismonth + '-' + day1;
			          }
	            } else {
  		          if (day1 < 10) {
			            today = year1 + '-' + month1 + '-' + thisday;
		            } else {
			            today = year1 + '-' + month1 + '-' + day1;
              }
            }
	     
       ///////////////////////////////////////////////////////////////////////////////////////////////////////  
            // 기존 count 체크
            const result = messageHandler(testedID, today);
            result.then(data => {

            console.log('[243][fileupload][count] ', data.recordset[0].count);

            const count = parseInt(data.recordset[0].count,10);
                
           // console.log('[247] 시험용', count);
            if (count > 0) {
              // tsv 레코드 삭제
              const result2 = messageHandler2(testedID, today);
              result2.then(data => {       
                console.log('[252][]',data);
        
                const count2 = parseInt(data.recordset[0].count,10);                      
               // console.log('이전것 삭제');             
              })
              .catch( err  => console.log('[258][fileupload] ', err))
            }
          })
          .catch( err  => console.log('error', err))

    /////////////////////////////////////////////////////////////////////////////////////////////
          console.log('Next...');
      
          // patient tsv 상태 update
          const result3 = messageHandler3(item.originalname, dirPath, testedID);
          result3.then(data => {

            console.log('[268][fileupload] ', data);
            //res.json(data);
          })
          .catch( err  => console.log('error', err));
    
         // console.log('insert...');
      
         // jintsv insert
          const result4 = messageHandler4(item.originalname, dirPath, testedID);
          result4.then(data => {

            console.log(data);
            //res.json(data);
          })
          .catch( err  => console.log('error', err));	  
          
		      const surfix = item.originalname.split('.');
		      if ( surfix[1] === 'tsv') {
			      console.log('필터링한 화일', surfix, item.originalname);
              // var data = loadData(item.path);
              // inputDB.registerDB(item.path);
              main_mod.main(loadData_mod.loadData(item.path),item.originalname,testedID);
          }	
          
          
      /////////////////////////////////////////////////////////////////////////////////////////////
	 
        }  // End of For Loop

        /*
          // patientInfo_diag 사용자 초기화 FLT3-ITD, IKZK1Deletion, chromosomalanalysis
          const PatientUpdate = updatePatient(testedID);

          PatientUpdate.then(data => {
             // res.json({message: ' OR 추가 했습니다.'});
          }).catch( err  => console.log('error', err));
          */

        // Everything went fine.
        res.json({progress: 100, files: uploadedFiles});
    })
});

module.exports = router;
