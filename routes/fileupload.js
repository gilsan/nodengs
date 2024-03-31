/*

fileupload: file: [
{
	"fieldname":"userfiles","originalname":"test_file_143.txt","encoding":"7bit","mimetype":"text/plain","destination":"uploads/","filename":"test_file_143.txt","path":"uploads/test_file_143.txt","size":60}][1] ==============
*/

const fs = require('fs');
const express = require('express');
const router = express.Router();
 
// const inputDB      = require('../controlDB/inputdb');
const main_mod     = require('../functions/main');
const main_form6   = require('../functions/main_form6');
const main_nu      = require('../functions/patient_nu');
const loadData_mod = require('../functions/readData');
const loadData_xlsx = require('../functions/readData_xlsx');
const main_xlsx   = require('../functions/main_xlsx');
const logger = require('../common/winston');

var multer = require('multer');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
//const { dir } = require('console');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const today = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();

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

      // directory check  
      let isDirExists = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
      
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

const  patientHandler = async (testedID) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[88][fileupload patient]testedID=' + testedID );
  const qry=`select isnull (patientID, '') patientID, isnull (test_code, '') test_code
                from patientinfo_diag
                 where specimenNo=@testedID `;
  logger.info('[93][fileupload patient]sql=' + qry);

  try {
      const request = pool.request() 
      .input('testedID', mssql.VarChar, testedID)
      const result = await request.query(qry)
      console.dir( result.recordset);
      
      return result.recordset[0];
  } catch (error) {
    logger.error('[104][fileupload patient]err=' + error.message);
  }
}

const  messageHandler = async (testedID, today) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[88][fileupload count]testedID=' + testedID + ", today=" + today);
  const qry=`select count(*) as count 
                from filtered_raw_tsv
                 where testedID=@testedID 
                 and left(createdate,10)=@today`;
  logger.info('[93][fileupload count]sql=' + qry);

  try {
      const request = pool.request() 
      .input('testedID', mssql.VarChar, testedID)
      .input('today', mssql.VarChar, today);
      const result = await request.query(qry)
      console.dir( result.recordset);
      
      return result.recordset[0].count;
  } catch (error) {
    logger.error('[104][fileupload count]err=' + error.message);
  }
}

const  messageHandler2 = async (testedID, today) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[88][fileupload del]testedID=' + testedID + ", today=" + today);
  
  const qry=`delete from filtered_raw_tsv
                 where testedID = @testedID 
                 and left(createdate,10) = @today`;
  logger.info('[88][fileupload del]sql=' + qry);
  
  try {
      const request = pool.request() 
        .input('testedID', mssql.VarChar, testedID)
        .input('today', mssql.VarChar, today);
      const result = await request.query(qry)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[128][fileupload del]err=' + error.message);
  }
}

const  deleteReportHandler = async (testedID) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[88][fileupload report_patientsInfo del]testedID=' + testedID );
  
  const qry=`delete from report_patientsInfo
                 where specimenNo = @testedID `;
  logger.info('[88][fileupload report_patientsInfo del]sql=' + qry);
  
  try {
      const request = pool.request() 
        .input('testedID', mssql.VarChar, testedID);
      const result = await request.query(qry)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[128][fileupload report_patientsInfo del]err=' + error.message);
  }
}

const  messageHandler3 = async (originalname, dirPath, testedID) => {
  await poolConnect; // ensures that the pool has been created
   const now = today();
   logger.info('[135][fileupload update][messageHandler3]now=' + now  + ",dirPath=" +  dirPath
                                        + ", originalname=" + originalname + ", testedID" + testedID);
  const qry=`update patientinfo_diag 
        set tsvFilteredFilename = @originalname, 
        tsvFilteredStatus= '처리완료',
        saveyn= 'T',
        screenstatus = '0',
        detected = '0',
        path=@dirPath,
        examin='', 
        recheck='',
        tsvFilteredDate=getdate()  
        where specimenNo = @testedID`;
  logger.info('[144][fileupload][update patientinfo_diag]sql=' +  qry) ;

  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('originalname', mssql.NVarChar, originalname)
      .input('dirPath',mssql.VarChar, dirPath)
      .input('testedID', mssql.VarChar, testedID);
      const result = await request.query(qry)
      console.dir( result);
    //  console.log('[158][update patientinfo_diag] ', result)
      return result;
  } catch (error) {
    logger.error('[156][fileupload]update patient diag err=' + error.message);
  }
}

const  messageHandler4 = async (originalname, dirPath, testedID) => {
  await poolConnect; // ensures that the pool has been created
 
  logger.info('[163][fileupload]insert jinTsvUpload originalname=' + originalname 
                                   + ", dirPath=" + dirPath + ", testedID=" + testedID);
  const sql ="insert into jinTsvUpload (filename, path, testedID ) "
                     + " values (@originalname, @dirPath, @testedID)";
  logger.info('[167][fileupload jinTsvUpload sql=' + sql);
       
  try {
      const request = pool.request() // or: new sql.Request(pool1)
      .input('originalname', mssql.NVarChar, originalname)
      .input('dirPath', mssql.VarChar, dirPath)
      .input('testedID', mssql.VarChar, testedID);
      const result = await request.query(sql)
      console.dir( result);
      
      return result;
  } catch (error) {
    logger.error('[179][fileupload jinTsvUpload err=' + error.message);
  }
}

// 2021.01.29  deleteDetectedVariantsHandler add
// delete Detected Variants Handler
const deleteDetectedVariantsHandler = async (specimenNo) => {
   
  logger.info('[415][screenList]delete detected_variants]specimenNo=' + specimenNo);
    //delete Query 생성;    
    const qry ="delete report_detected_variants where specimenNo=@specimenNo";
            
    logger.info("[419][screenList][del detected_variant]del sql=" + qry);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          
          result = await request.query(qry);         
  
    } catch (error) {
      logger.error('[428][screenList][del detected_variant]err=' +  error.message);
    }
      
    return result;
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
        let dirPath2 = '' ; 

        for(let item of req.files) {
                  uploadedFiles.push({filename: item.originalname});
                  
                  // 검체번호로 atientInfo_diag update 함
                  testedID = req.body.testedID;

                  let patient_id = '';
                  let test_code = '';

                  const res_patient = patientHandler(testedID);
                  res_patient.then(data => {       
                    
                    logger.info('[285][patient]data='+data);
                    
                    patient_id = data.patientID;
                    test_code = data.test_code;

                    //const surfix = item.originalname.split('.');
                    //let patientID = surfix[0].split('_');

                    let file_names = '';
                    file_names = item.originalname.toLowerCase(); 
                    let xlsx = file_names.indexOf('xlsx');
                    let tsv = file_names.indexOf('tsv');
                    let txt = file_names.indexOf('txt');
                    let patientID = file_names.indexOf(patient_id);

                    logger.info('[300]item.originalname=' + item.originalname);
                    logger.info('[301]xlsx=' + xlsx);
                    logger.info('[302]tsv=' + tsv);
                    logger.info('[303]txt=' + txt);
                    logger.info('[304]patientID=' + patientID);

                    if ( xlsx > 0) {
                        
                      if ( patientID <= 0  ) {

                        logger.error('[310][fileupload] patient dismatch' );
                        return res.status(500).json('{"err":"환자와 파일명이 일치하지 않습니다"}');
                      }
                    
                    }
                    else if ( tsv > 0) {
                        
                      if ( patientID <= 0  ) {

                        logger.error('[319][fileupload] patient dismatch' );
                        return res.status(500).json('{"err":"환자와 파일명이 일치하지 않습니다"}');
                      }
                    
                    }
                    else if ( txt > 0) {
                        
                      if ( patientID <= 0  ) {

                        logger.error('[328][fileupload] patient dismatch' );
                        return res.status(500).json('{"err":"환자와 파일명이 일치하지 않습니다"}');
                      }
                    
                    }
                    else {
                      logger.error('[334][fileupload] file dismatch' );
                      return res.status(500).json('{"err":"환자와 파일확장자(tsv, xlsx, tst) 가  일치하지 않습니다"}');
                      
                    } 
            
                    // 금일 날자와 검체번호로 존재 하는지 조사.
                    const year1  = new Date().getFullYear();
                    const month1 = new Date().getMonth() + 1;
                    const day1   = new Date().getDate();
                  
                    if (month1 < 10) {
                      thismonth = '0' + month1;
                    }

                    if (day1 < 10) {
                      thisday = '0' + day1;
                    }

                    if (month1 < 10) {
                    
                      if (day1 < 10) {
                        today = year1 + '-' + thismonth + '-' + thisday;
                        dirPath2 = 'diag_temp/' + year1 + '/' + thismonth + '/' + thisday;
                      } else {
                        today = year1 + '-' + thismonth + '-' + day1;
                        dirPath2 = 'diag_temp/' + year1 + '/' + thismonth + '/' + day1;
                      }
                    } else {
                      if (day1 < 10) {
                        today = year1 + '-' + month1 + '-' + thisday;
                        dirPath2 = 'diag_temp/' + year1 + '/' + month1 + '/' + thisday;
                      } else {
                        today = year1 + '-' + month1 + '-' + day1;
                        dirPath2 = 'diag_temp/' + year1 + '/' + month1 + '/' + day1;
                      }
                    }

                    // directory check  
                    let isDirExists = fs.existsSync(dirPath2) && fs.lstatSync(dirPath2).isDirectory();
                    
                    if (!isDirExists){
                        fs.mkdirSync( dirPath2, { recursive: true });
                    }
                    
                    // destination will be created or overwritten by default.
                    fs.copyFile(dirPath + '/' + item.originalname, dirPath2 + '/' + item.originalname, (err) => {
                      if (err) logger.error('[380][fileupload uplod]err=' + err.message);
                      logger.info('[screenList][381][fileupload uplod]File was copied to destination');
                    });
            
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////  
                    // 기존 count 체크
                    const result = messageHandler(testedID, today);
                    result.then(data => {

                    console.log('[389][fileupload][count] ', data);
                    logger.info('[390][fileupload][count]count=' + data);

                    const count = parseInt(data,10);
                    logger.info('[393][fileupload][count]count=' + count);
        
                    // console.log('[247] 시험용', count);
                    if (count > 0) {
                      // tsv 레코드 삭제
                      const result2 = messageHandler2(testedID, today);
                      result2.then(data => {       
                        console.log('[400][fileupload]',data);
                
                        //const count2 = parseInt(count,10);                      
                      // console.log('이전것 삭제');             
                      })
                      .catch( error  => {
                        logger.error('[406][fileupload]err=' + error.message);
                      })
                    }
                    })
                    .catch( error  => {
                      logger.error('[411][fileupload]err=' + error.message);
                    })

                    /////////////////////////////////////////////////////////////////////////////////////////////
                    console.log('Next...');
                    
                    logger.info('[417][fileupload][count]next 1');
                
                    // patient tsv 상태 update
                    const result3 = messageHandler3(item.originalname, dirPath, testedID);
                    result3.then(data => {

                      console.log('[423][fileupload] ', data);
                      //res.json(data);
                    })
                    .catch( error => {
                      logger.error('[427][fileupload] update patient diag err=' + error.message);
                    });
            
                    logger.info('[430][fileupload][count]next 2');
                    // console.log('insert...');
                  
                    // jintsv insert
                    const result4 = messageHandler4(item.originalname, dirPath, testedID);
                    result4.then(data => {

                      console.log(data);
                      //res.json(data);
                    })
                    .catch( error => {
                      logger.error('[441][fileupload] inset jintsv err=' + error.message)
                    });	  

                    logger.info('[444][fileupload][count]next 3');

                    // 2021.01.29  deleteDetectedVariantsHandler add
                    //  deleteDetectedVariantsHandler
                    const result5 =  deleteDetectedVariantsHandler(testedID);
                    result5.then(data => {
          
                      console.log(data);
                      //res.json(data);
                    })
                    .catch( error => {
                      logger.error('[455][fileupload] inset jintsv err=' + error.message);
                    });	  

                    logger.info('[458][fileupload][count]next 4');

                    // 2021.02.02  deleteReportHandler add
                    //  deleteReportHandler
                    const result6 =  deleteReportHandler(testedID);
                    result6.then(data => {
          
                      console.log(data);
                      //res.json(data);
                    })
                    .catch( error => {
                      logger.error('[469][fileupload] deleteReportHandler err=' + error.message);
                    });	  
                  
                    logger.info('[472][fileupload][count]next 5');

                    if ( tsv > 0) {
                      console.log('필터링한 화일', item.originalname);

                        main_nu.patient_nu(testedID, test_code);

                        main_mod.main(loadData_mod.loadData(item.path),item.originalname,testedID);
                    }	
                    else if ( txt > 0) {
                      console.log('필터링한 화일', item.originalname);

                        main_nu.patient_nu(testedID, test_code);

                        main_form6.main(loadData_mod.loadData(item.path),item.originalname,testedID);
                    }	
                    else if ( xlsx > 0) {
                      console.log('[489][fileupload] 필터링한 화일 XLSX', item.originalname + "  === " + patient_id);

                        //main_nu.patient_nu(testedID);

                        main_xlsx.main(loadData_xlsx.loadData_xlsx(item.path),item.originalname,testedID,patient_id);
                    }		
                
                  })
                  .catch( error  => {
                    logger.error('[498][fileupload]err=' + error.message);
                  })
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