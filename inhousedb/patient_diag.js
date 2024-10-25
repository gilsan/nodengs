const fs = require('fs');
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
    
  //console.log('st=', st);
  if(st === undefined || st == null || st == "" || st == "NULL") {
      st = defaultStr ;
  }
      
  return st ;
}

function parse_tsv(s, f) {
  s = s.replace(/,/g, ";");
  var ix_end = 0;
  for (var ix = 0; ix < s.length; ix = ix_end + 1) {
    ix_end = s.indexOf('\n', ix);
    if (ix_end == -1) {
      ix_end = s.length;
    }
  
    var row = s.substring(ix, ix_end).split('\t');

    f(row);
  }
}

function loadData(filePath) {
   if (fs.existsSync(filePath)) {
     var tsvData = fs.readFileSync(filePath, 'utf-8');
     var rowCount = 0;
     var scenarios = [];
     parse_tsv(tsvData, (row) => {
       rowCount++;
       if (rowCount >= 0) {
         scenarios.push(row);
       }
     });
     return scenarios;
   } else {
     return [];
   }
}

async function delData() {

  await poolConnect;
  
  const sql2 =`
    delete from patientinfo_diag 
  `; 

  logger.info('[77][patient_diag]sql=' + sql2);

  try {      
  const request2 = pool.request();

  //let result =  '';
  const result2 = request2.query(sql2); /*, (err, recordset) => {
    if (err)
    {
         console.log("err=", err.message);  
    }
    console.log("recordset=", recordset);

    result = recordset;
  });*/
  result2.then(data => {
    console.dir(data);
  }).catch( err => console.log(err));

  }   catch(err) {
    logger.error('[97][patient_diag]del err=' + err.message);
  } 
}

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

var tsvData = '../inhouseupload/patient_diag.txt';
var rowCount = 0;

delData();

var rowData = loadData(tsvData);

rowData.forEach ( async (row, index) =>  {

  await sleep(5000);
  
  rowCount++;
  console.log(rowCount);
  if (rowCount >= 0) {

    await poolConnect;

    // id,name,patientID,age,gender,
    //specimenNo,IKZK1Deletion,chromosomalanalysis,
    //argetDisease,method,specimen,request,appoint_doc,worker,
    //prescription_no,prescription_date,FLT3ITD,prescription_code,
    //testednum,leukemiaassociatedfusion,tsvFilteredFilename,
    //createDate,tsvFilteredStatus,tsvFilteredDate,bamFilename,
    //sendEMR,sendEMRDate,accept_date,test_code,report_date,
    //screenstatus,path,detected,examin,recheck,bonemarrow,
    //diagnosis,genetictest,vusmsg,ver_file,genetic1,genetic2,
    //genetic3,genetic4,report_title,req_pathologist,
    //req_department,req_instnm,path_comment,gbn,saveyn

    logger.info('length =' + row.length);
    logger.info('[84][patient_diag]name=' + row[1]);

      var name = nvl(row[1].replace( /"/gi, ''), "");
      logger.info('[84][patient_diag]name=' + name);

      var patientID = nvl(row[2].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]patientID=' + patientID);

      var age = nvl(row[3].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]age=' + age);

      var gender = nvl(row[4].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]gender=' + gender);

      var specimenNo = nvl(row[5].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]specimenNo=' + specimenNo);

      var IKZK1Deletion = nvl(row[6].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]IKZK1Deletion=' + IKZK1Deletion);

      var chromosomalanalysis = nvl(row[7].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]chromosomalanalysis=' + chromosomalanalysis);

      var method = nvl(row[8].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]method=' + method);

      var specimen = nvl(row[9].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]specimen=' + specimen);

      var request2 = nvl(row[10].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]request2=' + request2);

      var appoint_doc = nvl(row[11].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]appoint_doc=' + appoint_doc);

      var worker = nvl(row[12].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]worker=' + worker);

      var prescription_no = nvl(row[13].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]prescription_no=' + prescription_no);

      var prescription_date = nvl(row[14].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]prescription_date=' + prescription_date);

      var FLT3ITD = nvl(row[15].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]FLT3ITD=' + FLT3ITD);

      var prescription_code = nvl(row[16].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]prescription_code=' + prescription_code);

      var testednum = nvl(row[17].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]testednum=' + testednum);

      var leukemiaassociatedfusion = nvl(row[18].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]leukemiaassociatedfusion=' + leukemiaassociatedfusion);

      var tsvFilteredFilename = nvl(row[19].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]tsvFilteredFilename=' + tsvFilteredFilename);

      var tsvFilteredStatus = nvl(row[21].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]tsvFilteredStatus=' + tsvFilteredStatus);

      var bamFilename = nvl(row[23].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]bamFilename=' + bamFilename);

      var sendEMR = nvl(row[24].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]sendEMR=' + sendEMR);

      var sendEMRDate = nvl(row[25].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]sendEMR=' + sendEMRDate);

      var accept_date = nvl(row[26].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]accept_date=' + accept_date);

      var test_code = nvl(row[27].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]test_code=' + test_code);

      var report_date = nvl(row[28].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]report_date=' + report_date);

      var screenstatus = nvl(row[29].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]screenstatus=' + screenstatus);

      var path = nvl(row[30].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]path=' + path);

      var detected = nvl(row[31].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]detected=' + detected);

      var bonemarrow = nvl(row[34].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]bonemarrow=' + bonemarrow);

      var diagnosis = nvl(row[35].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]diagnosis=' + diagnosis);

      var genetictest = nvl(row[36].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]genetictest=' + genetictest);

      var ver_file = nvl(row[38].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]ver_file=' + ver_file);

      var genetic1 = nvl(row[39].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]genetic1=' + genetic1);

      var genetic2 = nvl(row[40].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]genetic2=' + genetic2);

      var genetic3 = nvl(row[41].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]genetic3=' + genetic3);

      var genetic4 = nvl(row[42].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]genetic4=' + genetic4);

      var report_title = nvl(row[43].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]report_title=' + report_title);

      var req_pathologist = nvl(row[44].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]req_pathologist=' + req_pathologist);

      var req_department = nvl(row[45].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]req_department=' + req_department);

      var req_instnm = nvl(row[46].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]req_instnm=' + req_instnm);

      var path_comment = nvl(row[47].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]path_comment=' + path_comment);

      var gbn = nvl(row[48].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]gbn=' + gbn);

      var saveyn = nvl(row[49].replace( /"/gi, ''), "");
      logger.info('[87][patient_diag]saveyn=' + saveyn);
            
      const sql =`
        insert into patientinfo_diag (            
            name,
            patientID,
            age,
            gender,
            specimenNo,
            IKZK1Deletion,
            chromosomalanalysis,
            method,
            specimen,
            request,
            appoint_doc,
            worker,
            prescription_no,
            prescription_date,
            FLT3ITD,
            prescription_code,
            testednum,
            leukemiaassociatedfusion,
            tsvFilteredFilename,
            tsvFilteredStatus,
            bamFilename,
            sendEMR,
            sendEMRDate,
            accept_date,
            test_code,
            report_date,
            screenstatus,
            path,
            detected,
            bonemarrow,
            diagnosis,
            genetictest,
            ver_file,
            genetic1,
            genetic2,
            genetic3,
            genetic4,
            report_title,
            req_pathologist,
            req_instnm,
            path_comment,
            gbn,
            saveyn
          ) 
          values (        
            @name,
            @patientID,
            @age,
            @gender,
            @specimenNo,
            @IKZK1Deletion,
            @chromosomalanalysis,
            @method,
            @specimen,
            @request2,
            @appoint_doc,
            @worker,
            @prescription_no,
            @prescription_date,
            @FLT3ITD,
            @prescription_code,
            @testednum,
            @leukemiaassociatedfusion,
            @tsvFilteredFilename,
            @tsvFilteredStatus,
            @bamFilename,
            @sendEMR,
            @sendEMRDate,
            @accept_date,
            @test_code,
            @report_date,
            @screenstatus,
            @path,
            @detected,
            @bonemarrow,
            @diagnosis,
            @genetictest,
            @ver_file,
            @genetic1,
            @genetic2,
            @genetic3,
            @genetic4,
            @report_title,
            @req_pathologist,
            @req_instnm,
            @path_comment,
            @gbn,
            @saveyn
          )
        ` 
    try {
        
        const request = pool.request()
        .input('name', mssql.NVarChar, name)  
        .input('patientID', mssql.VarChar, patientID)  
        .input('age', mssql.NVarChar, age) 
        .input('gender', mssql.VarChar, gender) 
        .input('specimenNo', mssql.VarChar, specimenNo) 
        .input('IKZK1Deletion', mssql.VarChar, IKZK1Deletion)
        .input('chromosomalanalysis', mssql.VarChar, chromosomalanalysis)
        .input('method', mssql.VarChar, method)
        .input('specimen', mssql.VarChar, specimen)
        .input('request2', mssql.VarChar, request2) 
        .input('appoint_doc', mssql.VarChar, appoint_doc)
        .input('worker', mssql.VarChar, worker)
        .input('prescription_no', mssql.VarChar, prescription_no)
        .input('prescription_date', mssql.VarChar, prescription_date)
        .input('FLT3ITD', mssql.VarChar, FLT3ITD)
        .input('prescription_code', mssql.VarChar, prescription_code)
        .input('testednum', mssql.VarChar, testednum)
        .input('leukemiaassociatedfusion', mssql.VarChar, leukemiaassociatedfusion)
        .input('tsvFilteredFilename', mssql.VarChar, tsvFilteredFilename)
        .input('tsvFilteredStatus', mssql.VarChar, tsvFilteredStatus)
        .input('bamFilename', mssql.VarChar, bamFilename)
        .input('sendEMR', mssql.VarChar, sendEMR)
        .input('sendEMRDate', mssql.VarChar, sendEMRDate)
        .input('accept_date', mssql.VarChar, accept_date)
        .input('test_code', mssql.VarChar, test_code)
        .input('report_date', mssql.VarChar, report_date)
        .input('screenstatus', mssql.VarChar, screenstatus)
        .input('path', mssql.VarChar, path)
        .input('detected', mssql.VarChar, detected)
        .input('bonemarrow', mssql.VarChar, bonemarrow)
        .input('diagnosis', mssql.VarChar, diagnosis)
        .input('genetictest', mssql.VarChar, genetictest)
        .input('ver_file', mssql.VarChar, ver_file)
        .input('genetic1', mssql.VarChar, genetic1)
        .input('genetic2', mssql.VarChar, genetic2)
        .input('genetic3', mssql.VarChar, genetic3)
        .input('genetic4', mssql.VarChar, genetic4)
        .input('report_title', mssql.VarChar, report_title)
        .input('req_pathologist', mssql.VarChar, req_pathologist)
        .input('req_instnm', mssql.VarChar, req_instnm)
        .input('path_comment', mssql.VarChar, path_comment)
        .input('gbn', mssql.VarChar, gbn)
        .input('saveyn', mssql.VarChar, saveyn) ;
        
      //let result =  '';
      const result = await request.query(sql); 
        result.then(data => {
            console.dir(data);
        })//.catch( err => console.log(err))
      
        console.log("result=", result);

    }   catch(err) {
        console.error('SQL error', err);
    }  

    await sleep(5000);

  } 
});// end of if loop