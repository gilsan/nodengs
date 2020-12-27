const express = require('express');
const fs = require('fs');
const diseasetoDB = require('../controlDB/diseasedb');
var multer = require('multer');


const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'path/')
    },
    filename: function (req, file, cb) {
      let thisMonth = '';
      let thisDay = '';
      const year = new Date().getFullYear();
      let month = new Date().getMonth();
      const day = new Date().getDay();
      if (month < 10) {
         thisMonth = '0' + month;
      }

      if (day < 10) {
        thisDay = '0' + day;
      }
     // cb(null, year+'-'+ thisMonth + '-' + thisDay + '-'+file.originalname)
	 cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage }).array('userfiles', 10);

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(500).json(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(500).json(err);
        }
        
        let exceluploadedFiles = [];
	    let returnValue = '';
        for(let item of req.files) {
            exceluploadedFiles.push({filename: item.originalname});	 
		   // returnValue =  diseasetoDB.registerDB(item.path, item.filename);
        }
        // Everything went fine.
        res.json({progress: 100, files: exceluploadedFiles, value: returnValue });
    })
});



module.exports = router;