const express = require('express');
const fs = require('fs');
// const diseasetoDB = require('../controlDB/diseasedb');
var multer = require('multer');
const router = express.Router();
const logger = require('../common/winston');

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

const pool = new mssql.ConnectionPool(config);
*/

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
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


const insertOR = async (originalname, dirPath, pathology_num) => {
   await poolConnect;
   const sql = "insert into pathTsvUpload (filename, path, pathology_num) "
     + "values (@originalname, @dirPath, @pathology_num)";
   console.log('[INSERT OR SQL]', sql) ;
     try {
       const request = pool.request()
        .input('originalname', mssql.VarChar, originalname)
        .input('dirPath', mssql.VarChar, dirPath)
        .input('pathology_num', mssql.VarChar, pathology_num);
        const result = await request.query(sql);
        console.dir(result);
        return result;
     } catch(err) {
       console.error('SQL error [insertOR][58]', err);
     }   
}

const updateORpath = async (filename, orpath, pathology_num) => {
   await poolConnect;

   logger.info("pathologyNum=" + pathology_num ); 

   const sql ="update  patientinfo_path set tsvorfilename = @filename, orpath = @orpath where pathology_num=@pathology_num";
   console.log('[insertORpath] [64]', sql);
   try {
    const request = pool.request()
      .input('filename', mssql.VarChar, filename)
      .input('pathology_num', mssql.VarChar, pathology_num)
      .input('orpath', mssql.VarChar, orpath);
    const result = await request.query(sql);
   } catch(err) {
     console.log('SQL error [insertORpath][72]\n', err)
   }
}

const updateIRpath = async (filename, irpath, pathology_num) => {
  await poolConnect;

  logger.info("pathologyNum=" + pathology_num ); 

  const sql ="update  patientinfo_path set tsvirfilename = @filename, irpath = @irpath , screenstatus = '0' where pathology_num=@pathology_num";
  console.log('[diseaseupload][insertIRpath] [78]', sql, irpath, pathology_num,filename);
  try {
   const request = pool.request()
     .input('filename', mssql.VarChar, filename)
     .input('pathology_num', mssql.VarChar, pathology_num)
     .input('irpath', mssql.VarChar, irpath);
   const result = await request.query(sql);
  } catch(err) {
    console.log('SQL error [insertIRpath][86]\n', err)
  }
}

const updatePatient = async (pathology_num) => {
   await poolConnect;
   const sql ="update  patientinfo_path \
                set screenstatus = '0'  \
              where pathology_num=@pathology_num";
   console.log('[updatePatient] [104]', sql);
   try {
    const request = pool.request()
      .input('pathology_num', mssql.VarChar, pathology_num)
    const result = await request.query(sql);
   } catch(err) {
     console.log('SQL error [updatePatient][72]\n', err)
   }
}

const updateOR = async (originalname, dirPath, pathology_num) => {
    await poolConnect;
    const sql = "update pathTsvUpload set filename = @originalname, path = @dirPath"
           + " where pathology_num = @pathology_num";
    console.log('[updateIR] [93]\n', sql);       
    try {
          const request = pool.request()
            .input('originalname', mssql.VarChar, originalname)
            .input('dirPath', mssql.VarChar, dirPath)
            .input('pathology_num', mssql.VarChar, pathology_num);
            const result = await request.query(sql);
            console.dir(result);
            return result;
    } catch(err) {
      console.error('SQL error [updateOR][104]\n', err);
    }      
}

const insertIR = async (originalname, dirPath, pathology_num) => {
  await poolConnect;
  const sql = "insert into pathTsvUpload (filename, path, pathology_num) "
    + "values (@originalname, @dirPath, @pathology_num)";
   
    try {
      const request = pool.request()
       .input('originalname', mssql.VarChar, originalname)
       .input('dirPath', mssql.VarChar, dirPath)
       .input('pathology_num', mssql.VarChar, pathology_num);
       const result = await request.query(sql);
       console.dir(result);
       return result;
    } catch(err) {
      console.error('SQL error [insertIR]', err);
    }   
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
			  dirPath = 'path/'+ year + '/' + thisMonth + '/' + thisDay;
		} else {
              dirPath = 'path/'+ year + '/' + thisMonth + '/' + day;
		}
	  } else {
  		   if (day < 10) {
			        dirPath = 'path/'+ year + '/' + month + '/' + thisDay;
		     } else {
			        dirPath = 'path/'+ year + '/' + month + '/' + day;
		     }
    }
    
    let isDirExists = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
    //  console.log('directory: ', isDirExists, dirPath);
    if (!isDirExists){
          fs.mkdirSync( dirPath, { recursive: true });
    }    

    cb(null, dirPath)

    },
    filename: function (req, file, cb) {
	     cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).array('userfiles', 10);

router.post('/upload', function (req, res) {
  
  let pathologyNum = '';
  let exceluploadedFiles = [];
  let returnValue = '';
 
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(500).json(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(500).json(err);
        }
        
        let today ='';
         
      console.log("len", req.files.length);

      for(let item of req.files) {
        if (item.originalname == '')
        {
          break;
        }
        exceluploadedFiles.push({filename: item.originalname});	 
              // returnValue =  diseasetoDB.registerDB(item.path, item.filename);
		          // 검체번호로 patientInfo_diag update 함 pathologyNum
              pathologyNum = req.body.pathologyNum; // 검체번호
              const type         = req.body.type;         // N: 신규, R: 재입력    
              let fileType     = req.body.fileType;         // IR, OR
              const filename     = item.originalname;     // 화일명

          logger.info("pathologyNum=" + pathologyNum ); 
          logger.info("exceluploadedFiles=" + filename ); 

          // file name compare
              let s_All = filename.search("All");
              let s_Rna = filename.search("RNA");

            logger.info("s_all=" + s_All ); 
            logger.info("s_Rna=" + s_Rna ); 

              
              if ( s_Rna > 0) {
                fileType = 'RNA';
              } else if ( s_All > 0) { 
                fileType = 'OR';
              } else {
                fileType = 'IR';
              }

              console.log(' diseaseupload [198][검체번호] ' + pathologyNum + '  [타입] ' + type + ' [화일명] ' + filename + '[화일타입]' + fileType);
              logger.info(' diseaseupload [198][검체번호] ' + pathologyNum + '  [타입] ' + type + ' [화일명] ' + filename + '[화일타입]' + fileType);
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
    /////////////////////////////////////////////////////////////////////////////////////////////////  
    ///    (originalname, dirPath, pathology_num)
    console.log(' diseaseupload [230][검체번호] ' + pathologyNum + '  [경로] ' + dirPath + ' [화일명] ' + filename + '  [타입] ' + type + '[화일타입]' + fileType);
    if (type === 'N') {  // 신규 입력

      if (fileType === 'IR') {
        const irPathUpdate = updateIRpath(filename, dirPath ,pathologyNum);
        irPathUpdate.then(data => {
          // res.json({message: ' IR 추가 했습니다.'});
        }).catch(err => console.log('error', err));

        const irResult = insertIR(filename, dirPath, pathologyNum);
        irResult.then(data => {
          // console.log('[IR insert result] ', data);
          // res.json({message: ' IR 추가 했습니다.'});         
        }).catch( err  => console.log('error', err));

        logger.info("ir 추가"); 

     } else if (fileType === 'OR') {

        const irPathUpdate = updateORpath(filename, dirPath, pathologyNum);
         irPathUpdate.then(data => {
            // res.json({message: ' OR 추가 했습니다.'});
         }).catch( err  => console.log('error', err));

         const orResult = insertOR(filename, dirPath, pathologyNum);
         orResult.then(data => {
            // console.log('[OR insert result] ', data);      
          }).catch( err  => console.log('error', err));

          logger.info("or 추가"); 
     }
    
    } else if (type === 'R') {  // 재입력
     if (fileType === 'RNA') {
      //  const irPathUpdate = updateIRpath(filename,dirPath, pathologyNum);
      //  irPathUpdate.then(data => {
      //    // res.json({message: ' IR 추가 했습니다.'}); 
      //  }).catch(err => console.log('error', err));

      // const irResult = insertIR(filename, dirPath, pathologyNum);
      // irResult.then(data => {
      //   // console.log('[IR insert result] ', data);
      //   // res.json({message: ' IR 추가 했습니다.'});         
      // }).catch( err  => console.log('error', err));

      logger.info("rna 추가"); 

     } else if (fileType === 'OR') {
 
      const irPathUpdate = updateORpath(filename,dirPath, pathologyNum);
      irPathUpdate.then(data => {
         // res.json({message: ' OR 추가 했습니다.'});
      }).catch( err  => console.log('error', err));

      const orResult = insertOR(filename, dirPath, pathologyNum);
      orResult.then(data => {
         // console.log('[OR insert result] ', data);      
       }).catch( err  => console.log('error', err));      

       logger.info("or 추가"); 

     } else {
        const irPathUpdate = updateIRpath(filename,dirPath, pathologyNum);
        irPathUpdate.then(data => {
          // res.json({message: ' IR 추가 했습니다.'}); 
        }).catch(err => console.log('error', err));

        const irResult = insertIR(filename, dirPath, pathologyNum);
        irResult.then(data => {
          // console.log('[IR insert result] ', data);
          // res.json({message: ' IR 추가 했습니다.'});         
        }).catch( err  => console.log('error', err));

        logger.info("ir 추가"); 
     } 
    }
    

    /////////////////////////////////////////////////////////////////////////////////////////////////
    }  // End Of For loop
 
    console.log(pathologyNum, exceluploadedFiles, returnValue);

    logger.info("pathologyNum" + pathologyNum ); 
    logger.info("exceluploadedFiles" + exceluploadedFiles ); 
    logger.info("returnValue" + returnValue ); 
  
    // patientInof_path 사용자 초기화
    const PatientUpdate = updatePatient(pathologyNum);
    PatientUpdate.then(data => {
           // res.json({message: ' OR 추가 했습니다.'});
    }).catch( err  => console.log('error', err));
  
    // Everything went fine.
    res.json({progress: 100, files: exceluploadedFiles, value: returnValue })
  }); // End Of Upload;
});     // End Of Post

module.exports = router;