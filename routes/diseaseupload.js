const express = require('express');
const fs = require('fs');
// const diseasetoDB = require('../controlDB/diseasedb');
var multer = require('multer');
const router = express.Router();
const logger = require('../common/winston');
const main_nu = require('../functions/path_patient_nu');

const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
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

const insertOR = async (originalname, dirPath, pathology_num) => {
  await poolConnect;
  logger.info('[32][dieaseupload]insertOR]originalname=' + originalname + ", dirPath=" + dirPath
                                    + ", pathology_num=" + pathology_num); 
  const sql = "insert into pathTsvUpload (filename, path, pathology_num) "
    + "values (@originalname, @dirPath, @pathology_num)";
  logger.info('[36][dieaseupload][INSERT OR SQL=' + sql) ;
  try {
      const request = pool.request()
      .input('originalname', mssql.VarChar, originalname)
      .input('dirPath', mssql.VarChar, dirPath)
      .input('pathology_num', mssql.VarChar, pathology_num);
      const result = await request.query(sql);
      console.dir(result);
      return result;
  } catch(error) {
    logger.error('[46][dieaseupload][insertOR]err=' + error.message);
  }   
}

const updateORpath = async (filename, orpath, pathology_num) => {
   await poolConnect;

   logger.info('[53][dieaseupload]update patient path]filename=' + filename
                                      + ", dirPath=" + dirPath + ", pathology_num=" + pathology_num); 

   const sql ="update  patientinfo_path set tsvorfilename = @filename, orpath = @orpath where pathology_num=@pathology_num";
   logger.info('[57][dieaseupload][insertORpath]sql=' + sql);

   try {
    const request = pool.request()
      .input('filename', mssql.VarChar, filename)
      .input('pathology_num', mssql.VarChar, pathology_num)
      .input('orpath', mssql.VarChar, orpath);

    const result = await request.query(sql);
   } catch(error) {
    logger.error('[66][dieaseupload][insertORpath]err=' + error.message)
   }
}

const updateIRpath = async (filename, irpath, pathology_num) => {
  await poolConnect;

  logger.info('[73][dieaseupload]update IR path]filename=' + filename
                             + ", dirPath=" + dirPath + ", pathology_num=" + pathology_num); 

  const sql ="update patientinfo_path set tsvirfilename = @filename, irpath = @irpath , screenstatus = '0' where pathology_num=@pathology_num";
  logger.info('[73][dieaseupload]update IR path]sql=' + sql);
  try {
   const request = pool.request()
     .input('filename', mssql.VarChar, filename)
     .input('pathology_num', mssql.VarChar, pathology_num)
     .input('irpath', mssql.VarChar, irpath);

   const result = await request.query(sql);
  } catch(err) {
    logger.error('[86][dieaseupload][insertIRpath]err='+ error.message);
  }
}

const updatePatient = async (pathology_num) => {

  logger.info('[92][dieaseupload]update patient path]pathology_num=' + pathology_num);
  await poolConnect;
  const sql ="update  patientinfo_path \
                set screenstatus = '0'  \
              where pathology_num=@pathology_num";
  logger.info('[97][dieaseupload][updatePatient]sql=' + sql);
  try {
    const request = pool.request()
      .input('pathology_num', mssql.VarChar, pathology_num);

    const result = await request.query(sql);
  } catch(error) {
    logger.error('[103][dieaseupload][updatePatient]err=' + error.message);
  }
}

const insertIR = async (originalname, dirPath, pathology_num) => {
  await poolConnect;
  logger.info('[112][dieaseupload]insert pathTsv]originalname=' + originalname
                             + ", dirPath=" + dirPath + ", pathology_num=" + pathology_num); 

  const sql = "insert into pathTsvUpload (filename, path, pathology_num) "
    + "values (@originalname, @dirPath, @pathology_num)";
  logger.info('[73][dieaseupload][insert pathTsv]sql=' + sql); 
   
    try {
      const request = pool.request()
       .input('originalname', mssql.VarChar, originalname)
       .input('dirPath', mssql.VarChar, dirPath)
       .input('pathology_num', mssql.VarChar, pathology_num);

       const result = await request.query(sql);
       console.dir(result);
       return result;
    } catch(error) {
      logger.info('[73][dieaseupload][insertIR]err=' + error.message);
    }   
}

let dirPath = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      // directory make
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
    
      // directory exist
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
        let dirPath2 = '' ; 
         
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
        //  let s_Rna = filename.search("RNA");
          let s_Rna = filename.search("Non-Filtered"); // 2022.04.20 수정

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
              dirPath2 = 'path_temp/' + year1 + '/' + thismonth + '/' + thisday;
            } else {
              today = year1 + '-' + thismonth + '-' + day1;
              dirPath2 = 'path_temp/' + year1 + '/' + thismonth + '/' + day1;
            }
          } else {
            if (day1 < 10) {
              today = year1 + '-' + month1 + '-' + thisday;
              dirPath2 = 'path_temp/' + year1 + '/' + month1 + '/' + thisday;
            } else {
              today = year1 + '-' + month1 + '-' + day1;
              dirPath2 = 'path_temp/' + year1 + '/' + month1 + '/' + day1;
            }       
          }

          // directory check  
          let isDirExists = fs.existsSync(dirPath2) && fs.lstatSync(dirPath2).isDirectory();
          
          if (!isDirExists){
              fs.mkdirSync( dirPath2, { recursive: true });
          }
             
        // destination will be created or overwritten by default.
        fs.copyFile(dirPath + '/' + filename, dirPath2 + '/' + filename, (err) => {
          if (err) logger.error('[293][fileupload uplod]err=' + err.message);
          logger.info('[screenList][293][fileupload uplod]File was copied to destination');
        });



          /////////////////////////////////////////////////////////////////////////////////////////////////  
          ///    (originalname, dirPath, pathology_num)
          logger.info('[73][dieaseupload]diseaseupload [230][검체번호] ' + pathologyNum + '  [경로] ' + dirPath
                                                         + ' [화일명] ' + filename + '  [타입] ' + type + '[화일타입]' + fileType);
          if (type === 'N') {  // 신규 입력

            if (fileType === 'IR') {
              const irPathUpdate = updateIRpath(filename, dirPath ,pathologyNum);
              irPathUpdate.then(data => {
              // res.json({message: ' IR 추가 했습니다.'});
              })
              .catch(error => {
                logger.error('[73][dieaseupload][update IR Path]err=' + error.message);
              });

              const irResult = insertIR(filename, dirPath, pathologyNum);
              irResult.then(data => {
                // console.log('[IR insert result] ', data);
                // res.json({message: ' IR 추가 했습니다.'});         
              }).catch( error => {
                logger.error('[282][dieaseupload][insert IR]err='  + error.message);
              });

              logger.info("ir 추가"); 

            } else if (fileType === 'OR') {

              const irPathUpdate = updateORpath(filename, dirPath, pathologyNum);
              irPathUpdate.then(data => {
                // res.json({message: ' OR 추가 했습니다.'});
              }).catch( error => {
                logger.error('[289][dieaseupload][update or path]err=' + error.message);
              });

              const orResult = insertOR(filename, dirPath, pathologyNum);
              orResult.then(data => {
                // console.log('[OR insert result] ', data);      
              }).catch( error => {
                logger.error('[296][dieaseupload][insert OR]err=' + error.message);
              });

              logger.info("or 추가"); 
          }
    
        } else if (type === 'R') {  // 재입력
          if (fileType === 'RNA') {
      
            logger.info("rna 추가"); 

          } else if (fileType === 'OR') {
 
            const irPathUpdate = updateORpath(filename,dirPath, pathologyNum);
            irPathUpdate.then(data => {
              // res.json({message: ' OR 추가 했습니다.'});
              }).catch( error => {
                logger.info('[313][dieaseupload][update IR path]err=' + error.message);
              });

              const orResult = insertOR(filename, dirPath, pathologyNum);
              orResult.then(data => {
                  // console.log('[OR insert result] ', data);      
              }).catch( error => {
                logger.error('[320][dieaseupload][insert OR]err=' + error.message);
              });      

              logger.info("or 추가"); 

          } else {
            const irPathUpdate = updateIRpath(filename,dirPath, pathologyNum);
            irPathUpdate.then(data => {
              // res.json({message: ' IR 추가 했습니다.'}); 
            }).catch(error => {
              logger.error('[330][dieaseupload][update IR path]err=' + error.message);
            });

            const irResult = insertIR(filename, dirPath, pathologyNum);
            irResult.then(data => {
              // console.log('[IR insert result] ', data);
              // res.json({message: ' IR 추가 했습니다.'});         
            }).catch( error => {
              logger.error('[338][dieaseupload][insert IR]err=' + error.message);
            });

            logger.info("ir 추가"); 
          } 
        }
  
        /////////////////////////////////////////////////////////////////////////////////////////////////
      }  // End Of For loop
 
    console.log(pathologyNum, exceluploadedFiles, returnValue);

    logger.info("pathologyNum" + pathologyNum ); 
    logger.info("exceluploadedFiles" + exceluploadedFiles ); 
    logger.info("returnValue" + returnValue ); 

    main_nu.path_patient_nu(pathologyNum);
  
    // patientInof_path 사용자 초기화
    const PatientUpdate = updatePatient(pathologyNum);
    PatientUpdate.then(data => {
           // res.json({message: ' OR 추가 했습니다.'});
    }).catch( error => {
      logger.error('[359][dieaseupload] err=' + error.message);
    });
  
    // Everything went fine.
    res.json({progress: 100, files: exceluploadedFiles, value: returnValue })
  }); // End Of Upload;
});     // End Of Post

module.exports = router;