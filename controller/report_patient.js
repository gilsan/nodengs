const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();


const  insertPatientAmlHandler = async (specimenNo, chromosomalanalysis, FLT3ITD, leukemiaassociatedfusion, reportType ) => {
    await poolConnect; // ensures that the pool has been created

     logger.info('[210][report_patient][insertPatientHandler AML]chromosomalanalysis=' + chromosomalanalysis  
                                    + ", FLT3ITD=" + FLT3ITD 
                                    + ", leukemiaassociatedfusion=" + leukemiaassociatedfusion 
                                    + ", report_type=" + reportType
                                    + ", specimenNo=" + specimenNo);

    const qry=`insert report_patientsInfo (
            specimenNo, 
            report_type,
            chromosomalanalysis, 
            FLT3ITD,
            leukemiaassociatedfusion
          ) values ( @specimenNo,
            @reportType,
            @chromosomalanalysis,
            @FLT3ITD,
            @leukemiaassociatedfusion
          )`;

    logger.info('[220][report_patient][insert report_patientsInfo AML]sql=' +  qry) ;
  
    try {
        const request = pool.request() // or: new sql.Request(pool1)
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('reportType',mssql.VarChar, reportType)
        .input('chromosomalanalysis', mssql.NVarChar, chromosomalanalysis)
        .input('FLT3ITD',mssql.VarChar, FLT3ITD)
        .input('leukemiaassociatedfusion',mssql.VarChar, leukemiaassociatedfusion);
        const result = await request.query(qry)
        console.dir( result);
      //  console.log('[158][insert patientinfo_diag] ', result)
        return result;
    } catch (error) {
      logger.error('[232][report_patient]insert report_patientsInfo AML err=' + error.message);
    }
}

const  insertPatientAllHandler = async (specimenNo, chromosomalanalysis, IKZK1Deletion, leukemiaassociatedfusion, reportType ) => {
await poolConnect; // ensures that the pool has been created

    logger.info('[210][report_patient][insertPatientHandler ALL]chromosomalanalysis=' + chromosomalanalysis  
                                + ", IKZK1Deletion=" + IKZK1Deletion 
                                + ", leukemiaassociatedfusion=" + leukemiaassociatedfusion 
                                + ", report_type=" + reportType
                                + ", specimenNo=" + specimenNo);

    const qry=`insert report_patientsInfo (
                    specimenNo, 
                    report_type,
                    chromosomalanalysis, 
                    IKZK1Deletion,
                    leukemiaassociatedfusion
                ) values ( @specimenNo,
                    @reportType,
                    @chromosomalanalysis,
                    @IKZK1Deletion,
                    @leukemiaassociatedfusion
                )`;

    logger.info('[220][report_patient][insert report_patientsInfo ALL]sql=' +  qry) ;

    try {
        const request = pool.request() // or: new sql.Request(pool1)
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('reportType',mssql.VarChar, reportType)
            .input('chromosomalanalysis', mssql.NVarChar, chromosomalanalysis)
            .input('IKZK1Deletion',mssql.VarChar, IKZK1Deletion)
            .input('leukemiaassociatedfusion',mssql.VarChar, leukemiaassociatedfusion);
        const result = await request.query(qry)
        console.dir( result);
        //  console.log('[158][insert patientinfo_diag] ', result)

        return result;
    } catch (error) {
        logger.error('[232][report_patient]insert report_patientsInfo ALL err=' + error.message);
    }
}

const  insertPatientLymHandler = async (specimenNo, chromosomalanalysis, bonemarrow, reportType ) => {
    await poolConnect; // ensures that the pool has been created
     logger.info('[210][report_patient][insertPatientHandler]chromosomalanalysis=' + chromosomalanalysis 
                                    + ", bonemarrow=" + bonemarrow
                                    + ", report_type=" + reportType
                                    + ", specimenNo=" + specimenNo);

    const qry=`insert report_patientsInfo (
            specimenNo, 
            report_type,
            chromosomalanalysis, 
            bonemarrow
          ) values ( @specimenNo,
            @reportType,
            @chromosomalanalysis,
            @bonemarrow
          )`;

    logger.info('[220][report_patient][insert report_patientsInfo Lym]sql=' +  qry) ;
  
    try {
        const request = pool.request() // or: new sql.Request(pool1)
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('reportType',mssql.VarChar, reportType)
        .input('chromosomalanalysis', mssql.NVarChar, chromosomalanalysis)
        .input('bonemarrow',mssql.VarChar, bonemarrow);
        const result = await request.query(qry)
        console.dir( result);
      //  console.log('[158][insert patientinfo_diag] ', result)
        return result;
    } catch (error) {
      logger.error('[232][report_patient]insert report_patientsInfo Lym err=' + error.message);
    }
}

const  insertPatientMdsHandler = async (specimenNo, chromosomalanalysis, diagnosis, genetictest, reportType ) => {
    await poolConnect; // ensures that the pool has been created
     logger.info('[210][report_patient][insertPatientHandler MDS]chromosomalanalysis=' + chromosomalanalysis 
                                    + ", diagnosis=" + diagnosis
                                    + ", genetictest=" + genetictest
                                    + ", report_type=" + reportType
                                    + ", specimenNo=" + specimenNo);

    const qry=`insert report_patientsInfo (
            specimenNo, 
            report_type,
            chromosomalanalysis, 
            diagnosis, 
            genetictest
          ) values ( @specimenNo,
            @reportType,
            @chromosomalanalysis, 
            @diagnosis,
            @genetictest
          )`;

    logger.info('[220][report_patient][insert report_patientsInfo MDS]sql=' +  qry) ;
  
    try {
        const request = pool.request() // or: new sql.Request(pool1)
        .input('specimenNo', mssql.VarChar, specimenNo)
        .input('reportType',mssql.VarChar, reportType)
        .input('chromosomalanalysis', mssql.NVarChar, chromosomalanalysis)
        .input('diagnosis',mssql.VarChar, diagnosis)
        .input('genetictest',mssql.VarChar, genetictest);
        const result = await request.query(qry)
        console.dir( result);
      //  console.log('[158][insert patientinfo_diag] ', result)
        return result;
    } catch (error) {
      logger.error('[232][report_patient]insert report_patientsInfo MDS err=' + error.message);
    }
}

const  patientSaveAmlHandler = async (specimenNo, chromosomalanalysis,  FLT3ITD ,
                                 leukemiaassociatedfusion, reportType) => {
    await poolConnect; // ensures that the pool has been created
    let result;
    
    logger.info('[50][report_patient Aml] specimenNo=' +  specimenNo);
    let sql = "delete from report_patientsInfo where  specimenNo = @specimenNo ";
    logger.info('[52][report_patient Aml] sql='+ sql);

    try {
        const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo); 
            
        result = request.query(sql)  ;
        
        result.then(data => {

            console.log(data);

            const result_ins = insertPatientAmlHandler(specimenNo, chromosomalanalysis, FLT3ITD, 
                                                leukemiaassociatedfusion, reportType );

            result_ins.then(data_ins => {
                console.log(data_ins);
            });
        });

        //return result;
    } catch (error) {
        logger.error('[75][report_patientsInfo del Aml]err=' + error.message);
    } 

    return result;
}

const  patientSaveAllHandler = async (specimenNo, chromosomalanalysis, IKZK1Deletion, 
                                            leukemiaassociatedfusion,  reportType) => {
    await poolConnect; // ensures that the pool has been created
    let result;

    logger.info('[50][report_patient ALL] specimenNo=' +  specimenNo);
    let sql = "delete from report_patientsInfo where  specimenNo = @specimenNo ";
    logger.info('[52][report_patient ALL] sql='+ sql);

    try {
        const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); 

        result = request.query(sql)  ;

        result.then(data => {

        console.log(data);

        const result_ins = insertPatientAllHandler(specimenNo, chromosomalanalysis, IKZK1Deletion,
                                         leukemiaassociatedfusion,  reportType );

            result_ins.then(data_ins => {
            console.log(data_ins);
        });
    });

    //return result;
    } catch (error) {
    logger.error('[75][report_patientsInfo del ALL]err=' + error.message);
    } 

    return result;
}

const  patientSaveLymHandler = async (specimenNo, chromosomalanalysis, bonemarrow, reportType) => {
    await poolConnect; // ensures that the pool has been created
    let result;

    logger.info('[50][report_patient Lym] specimenNo=' +  specimenNo);
    let sql = "delete from report_patientsInfo where  specimenNo = @specimenNo ";
    logger.info('[52][report_patient Lym] sql='+ sql);

    try {
        const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); 

        result = request.query(sql)  ;

        result.then(data => {

        console.log(data);

        const result_ins = insertPatientLymHandler(specimenNo, chromosomalanalysis, bonemarrow, reportType );

        result_ins.then(data_ins => {
            console.log(data_ins);
            });
        });

            //return result;
        } catch (error) {
        logger.error('[75][report_patientsInfo del Lym]err=' + error.message);
        } 

    return result;
}

const  patientSaveMdsHandler = async (specimenNo, chromosomalanalysis, genetictest, diagnosis, reportType) => {
    await poolConnect; // ensures that the pool has been created
    let result;

    logger.info('[50][report_patient MDS] specimenNo=' +  specimenNo);
    let sql = "delete from report_patientsInfo where  specimenNo = @specimenNo ";
    logger.info('[52][report_patient MDS] sql='+ sql);

    try {
        const request = pool.request()
        .input('specimenNo', mssql.VarChar, specimenNo); 

        result = request.query(sql)  ;

        result.then(data => {

        console.log(data);

        const result_ins = insertPatientMdsHandler(specimenNo, chromosomalanalysis, genetictest, diagnosis, reportType );

        result_ins.then(data_ins => {
            console.log(data_ins);
            });
        });

            //return result;
        } catch (error) {
        logger.error('[75][report_patientsInfo del MDS]err=' + error.message);
        } 

    return result;
}

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

// type : Aml 
const  patientSelectAmlHandler = async (specimenNo, type) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[105][report_patient] patientSelectAmlHandler specimenNo=' + specimenNo + ", type=" + type);
    //insert Query 생성
    const sql = "select chromosomalanalysis, FLT3ITD, leukemiaassociatedfusion \
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


// type : ALL
const  patientSelectAllHandler = async (specimenNo, type) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[105][report_patient] patientSelectAmlHandler specimenNo=' + specimenNo + ", type=" + type);
    //insert Query 생성
    const sql = "select chromosomalanalysis, IKZK1Deletion, leukemiaassociatedfusion \
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

// type : LYM
const  patientSelectLymHandler = async (specimenNo, type) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[378][report_patient] patientSelectHandler specimenNo=' + specimenNo + ", type=" + type);
    //insert Query 생성
    const sql = "select chromosomalanalysis, bonemarrow \
                from report_patientsInfo \
                where specimenNo = @specimenNo \
                and report_type = @type ";

    logger.info('[378][report_patient] patientSelectHandler sql=' + sql);
    
    try {

        const request = pool.request()
            .input('specimenNo', mssql.VarChar, specimenNo)
            .input('type', mssql.VarChar, type);

        const result = await request.query(sql);
        return result.recordset; 
    }catch (error) {
        logger.error('[396][report_patient]patientSelectHandler err=' + error.message);
    }
}

// type : MDS
const  patientSelectMdsHandler = async (specimenNo, type) => {
    await poolConnect; // ensures that the pool has been created

    logger.info('[105][report_patient] patientSelectHandler specimenNo=' + specimenNo + ", type=" + type);
    //insert Query 생성
    const sql = "select chromosomalanalysis, genetictest,  diagnosis \
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
    const rtype = req.body.type;

    let result;  
    if (rtype == "AML")
    {
        result = patientSelectAmlHandler(specimenNo, rtype);
    }
    else if (rtype == "ALL")
    {
        result = patientSelectAllHandler(specimenNo, rtype);
    }
    else if (rtype == "LYM")
    {
        result = patientSelectLymHandler(specimenNo, rtype);
    }
    else if (rtype == "MDS")
    {
        result = patientSelectMdsHandler(specimenNo, rtype);
    }
    else 
    {
        result = "";
    }

    if (result !== "")
    {
        result.then(data => {  
        //  console.log('[92][clinicaldata]', data);
          res.json(data);
        })
        .catch( error  => {
            logger.error('[95][report_patient select]err= ' + error.message);
            res.sendStatus(500);
        });
    }

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
  const diagnosis = req.body.diagnosis;
  const type = req.body.type;

  let result;  
  if (type === "AML")
  {
    result = patientSaveAmlHandler(specimenNo, chromosomalanalysis, FLT3ITD , leukemiaassociatedfusion, type  );
  }
  else if (type === "ALL")
  {
    result = patientSaveAllHandler(specimenNo, chromosomalanalysis, IKZK1Deletion, leukemiaassociatedfusion, type  );
  }
  else if (type === "LYM")
  {
    result = patientSaveLymHandler(specimenNo, chromosomalanalysis, bonemarrow, type  );
  }
  else if (type === "MDS")
  {
    result = patientSaveMdsHandler(specimenNo, chromosomalanalysis, diagnosis, genetictest, type  );
  }
  else 
  {
      result = "";
  }

  if (result !== "")
  {
   
    
    result.then(data => {  
        //  console.log('[92][clinicaldata]', data);
            res.json({message: 'SUCCESS'});
    })
    .catch( error  => {
        logger.error('[95][report_patient]err= ' + error.message);
        res.sendStatus(500);
    });
    }

};