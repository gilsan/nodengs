const express = require('express');
const fs = require('fs');
// const diseasetoDB = require('../controlDB/diseasedb');
var multer = require('multer');
const router = express.Router();
const logger = require('../common/winston');

const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();
 
  
const insertImage = async (pathology_num,  dirPath, img1, img2, img3) => {
  
    logger.info('[17][imageupload] update patient path]pathology_num=' + pathology_num);
    await poolConnect;
    let imgpath1;
    let imgpath2;
    let imgpath3;

    if (img1.length !== 0) {
      imgpath1 = dirPath + '/' + img1;
    } else {
      imgpath1 = '';
    }

    if (img2.length !== 0) {
      imgpath2 = dirPath + '/' + img2;
    } else {
      imgpath2 = '';
    } 

    if (img3.length !== 0) {
      imgpath3 = dirPath + '/' + img3;
    } else {
      imgpath3 = '';
    }

 

    const sql ="update patientinfo_path \
                  set img1 = @imgpath1 ,  \
                  img2 = @imgpath2, img3=@imgpath3 \
                where pathology_num=@pathology_num";
    logger.info('[28][researchupload][updatePatient]sql=' + sql);
    try {
      const request = pool.request()
        .input('pathology_num', mssql.VarChar, pathology_num)
        .input('imgpath1', mssql.VarChar, imgpath1)
        .input('imgpath2', mssql.VarChar, imgpath2)
        .input('imgpath3', mssql.VarChar, imgpath3);
  
      const result = await request.query(sql);
    } catch(error) {
      logger.error('[38][imageupload][updatePatient]err=' + error.message);
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
                  dirPath = 'images/'+ year + '/' + thisMonth + '/' + thisDay;
              } else {
            dirPath = 'images/'+ year + '/' + thisMonth + '/' + day;
              }
          } else {
               if (day < 10) {
                      dirPath = 'images/'+ year + '/' + month + '/' + thisDay;
               } else {
                      dirPath = 'images/'+ year + '/' + month + '/' + day;
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
  
  var upload = multer({ storage: storage }).array('imagefiles', 10);
  
  router.post('/imagefileupload', function (req, res) {
    
    let pathologyNum = '';
    let uploadedImageFiles = [];
    let returnValue = '';
    let img1 = '';
    let img2 = '';
    let img3 = '';

    upload(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).json(err);
          } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json(err);
          }
                            
        // console.log("len", req.files.length);
  
        for(let i=0; i < req.files.length; i++) {
           let item = req.files[i];
          if (item.originalname == '')
          {
            break;
          }
          uploadedImageFiles.push({filename: item.originalname, path: dirPath});	 
            // returnValue =  diseasetoDB.registerDB(item.path, item.filename);
            // 검체번호로 patientInfo_diag update 함 pathologyNum
            pathologyNum = req.body.pathologyNum; // 검체번호
            if (i === 0) {
                img1     = item.originalname;     // 화일명
            } else if (i === 1) {
                img2     = item.originalname;     // 화일명
            } else if (i === 2) {
                img3     = item.originalname;     // 화일명
            }
         
        }  // End Of For loop
        console.log(pathologyNum, dirPath, img1, img2, img3)

        const imgResult = insertImage(pathologyNum, dirPath, img1, img2, img3);
        imgResult.then(() => {  
               
        }).catch( error => {
          logger.error('[136][imageupload][update image upload]err='  + error.message);
        });



      // Everything went fine.
      res.json({progress: 100, files: uploadedImageFiles, value: returnValue })
    }); // End Of Upload;
  });     // End Of Post
  
  module.exports = router;