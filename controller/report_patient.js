const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const { error } = require('winston');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


const  insertPatientHandler = async (specimenNo, chromosomalanalysis, FLT3ITD, IKZK1Deletion,
                                        leukemiaassociatedfusion, bonemarrow, genetictest, diagnosis, reportType ) => {
    await poolConnect; // ensures that the pool has been created
     const now = today();
     logger.info('[210][report_patient][insertPatientHandler]chromosomalanalysis=' + chromosomalanalysis  
                                    + " ,FLT3ITD=" +  FLT3ITD
                                    + ", IKZK1Deletion=" + IKZK1Deletion 
                                    + ", leukemiaassociatedfusion=" + leukemiaassociatedfusion 
                                    + ", bonemarrow=" + bonemarrow
                                    + ", genetictest=" + genetictest
                                    + ", diagnosis=" + diagnosis
                                    + ", report_type=" + reportType
                                    + ", specimenNo=" + specimenNo);
    const qry=`insert report_patientsInfo (
            specimenNo, 
            report_type,
            chromosomalanalysis, 
            FLT3ITD,
            IKZK1Deletion,
            leukemiaassociatedfusion,
            bonemarrow,
            genetictest,
            diagnosis
          ) values ( @specimenNo,
            @reportType,
            @chromosomalanalysis,
            @FLT3ITD,
            @IKZK1Deletion,
            @leukemiaassociatedfusion,
            @bonemarrow,
            @genetictest,
            @diagnosis
          )`;

    logger.info('[220][report_patient][insert report_patientsInfo]sql=' +  qry) ;
  
    try {
        const request = pool.request() // or: new sql.Request(pool1)
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('reportType',mssql.VarChar, reportType)
        .input('chromosomalanalysis', mssql.VarChar, chromosomalanalysis)
        .input('FLT3ITD',mssql.VarChar, FLT3ITD)
        .input('IKZK1Deletion',mssql.VarChar, IKZK1Deletion)
        .input('leukemiaassociatedfusion',mssql.VarChar, leukemiaassociatedfusion)
        .input('bonemarrow',mssql.VarChar, bonemarrow)
        .input('genetictest',mssql.VarChar, genetictest)
        .input('diagnosis',mssql.VarChar, diagnosis);
        const result = await request.query(qry)
        console.dir( result);
      //  console.log('[158][insert patientinfo_diag] ', result)
        return result;
    } catch (error) {
      logger.error('[232][report_patient]insert report_patientsInfo  err=' + error.message);
    }
  }

const  patientSaveHandler = async (specimenNo, chromosomalanalysis, FLT3ITD, IKZK1Deletion,
                                leukemiaassociatedfusion, bonemarrow, genetictest, diagnosis, reportType) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    
    logger.info('[50][report_patient] specimenNo=' +  specimenNo);
    let sql = "delete from report_patientsInfo where  specimenNo = @specimenNo ";
    logger.info('[52][report_patient] sql='+ sql);

    try {
        const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo); 
            
        result = request.query(sql)  ;
        
        result.then(data => {

            console.log(data);

            const result_ins = insertPatientHandler(specimenNo, chromosomalanalysis, FLT3ITD, IKZK1Deletion,
                                            leukemiaassociatedfusion, bonemarrow, genetictest, diagnosis, reportType );

            result_ins.then(data_ins => {
                console.log(data_ins);
            })
            .catch(error)
            {
                logger.error('[71][report_patientsInfo ins]err=' + error.message);
            }
        });

        //return result;
    } catch (error) {
        logger.error('[75][report_patientsInfo del]err=' + error.message);
    } 

    return result;
}

// 유전자가 있는지 확인
const searchPatientHandler =  async (specimenNo) => {
  await poolConnect;
    
  logger.info('[50][report_patient] specimenNo=' +  specimenNo);

  const sql = "select  count(*) as count  from report_patientsInfo where specimenNo=@specimenNo";

  logger.info('[105][report_patient] patientSelectHandler sql=' + sql);
  try {
       const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo);
          const result = await request.query(sql);
          return result.recordset[0].count;
  } catch(error) {
    logger.error('[139][report_patientsInfo controller]err=' + error.message);
  }

}

const  patientSelectHandler = async (specimenNo, type) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[105][report_patient] patientSelectHandler specimenNo=' + specimenNo + ", type=" + type);
    //insert Query 생성
    const sql = "select specimenNo, report_type as reportType, chromosomalanalysis, FLT3ITD, IKZK1Deletion,  \
                      leukemiaassociatedfusion, bonemarrow, genetictest,  diagnosis \
                from report_patientsInfo \
                where specimenNo = @specimenNo \
                and report_type = @type ";

    logger.info('[105][report_patient] patientSelectHandler sql=' + sql);
    
    try {

        const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('type', mssql.VarChar, type);

        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[117][report_patient]patientSelectHandler err=' + error.message);
    }
}

exports.getList= (req, res, next) => {
     
    logger.info('[84][report_patient][getList]req=' + JSON.stringify(req.body));

    const specimenNo = req.body.specimenNo;
    const type = req.body.type;
     
    const result = patientSelectHandler(specimenNo, type);
    result.then(data => {  
      //  console.log('[92][clinicaldata]', data);
          res.json(data);
     })
     .catch( error  => {
        logger.error('[95][report_patient select]err= ' + error.message);
        res.sendStatus(500);
     });

};


exports.getCount= (req, res, next) => {
   
  logger.info('[84][report_patient count]req=' + JSON.stringify(req.body));

  const specimenNo = req.body.specimenNo;

  const result = searchPatientHandler(specimenNo);
  result.then(data => {  
    //  console.log('[92][clinicaldata]', data);
        res.json({message: 'SUCCESS'});
   })
   .catch( error  => {
      logger.error('[95][report_patient count]err= ' + error.message);
      res.sendStatus(500);
   });

};

exports.insetList= (req, res, next) => {
   
  logger.info('[84][report_patient]req=' + JSON.stringify(req.body));

  const specimenNo = req.body.specimenNo;
  const chromosomalanalysis = req.body.chromosomalanalysis;
  const FLT3ITD = req.body.FLT3ITD;
  const IKZK1Deletion = req.body.IKZK1Deletion;
  const leukemiaassociatedfusion = req.body.leukemiaassociatedfusion;
  const bonemarrow = req.body.bonemarrow;
  const genetictest = req.body.genetictest;
  const reportType = req.body.reportType;
   
  const result = patientSaveHandler(specimenNo, chromosomalanalysis, chromosomalanalysis, FLT3ITD, IKZK1Deletion,
                                                  leukemiaassociatedfusion, bonemarrow, genetictest, reportType  );
  result.then(data => {  
    //  console.log('[92][clinicaldata]', data);
        res.json({message: 'SUCCESS'});
   })
   .catch( error  => {
      logger.error('[95][report_patient]err= ' + error.message);
      res.sendStatus(500);
   });

};