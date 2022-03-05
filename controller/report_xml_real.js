const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const axios = require('axios');
const xml2js = require('xml2js');
const parser = require('fast-xml-parser');
const dbConfigMssql = require('../common/dbconfig.js');

const configEnv = require('../common/config.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const options = {
    attributeNamePrefix : "@_", 
    attrNodeName: "attr", //default is 'false' 
    textNodeName : "#text", 
    ignoreAttributes : true, 
    ignoreNameSpace : false, 
    allowBooleanAttributes : false, 
    parseNodeValue : true, 
    parseAttributeValue : false, 
    trimValues: true, 
    cdataTagName: "__cdata", //default is 'false' 
    cdataPositionChar: "\\c", 
    parseTrueNumberOnly: true, 
    arrayMode: false , //"strict" 
    //attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}), //default is a=>a 
    //tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a 
    stopNodes: ["parse-me-as-string"] 
};

const  messageHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
  
    const sql =`select gene, functional_impact  from [dbo].[report_detected_variants] 
                    where specimenNo=@specimenNo 
                    order by functional_impact desc `;
  
    logger.info("[36][report_xml]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[46][report_xml]SQL error=' + err.message);
    }
}

const patientHandler = async(patients, res) => {

    const arr_testcd = ['LPE548', 'LPE439', 'LPE452', 'LPE453', 'LPE454', 'LPE455', 
    'LPE456', 'LPE488', 'LPE489', 'LPE490', 'LPE497', 'LPE498', 'LPE499',
    'LPE517', 'LPE518', 'LPE519', 'LPE520', 'LPE521', 'LPE522', 'LPE523',
    'LPE524', 'LPE525', 'LPE526', 'LPE527', 'LPE528', 'LPE529', 'LPE530',
    'LPE531', 'LPE532', 'LPE533', 'LPE534', 'LPE535', 'LPE536', 'LPE537',
    'LPE538', 'LPE539', 'LPE540', 'LPE541', 'LPE542', 'LPE543'];

    console.log (patients.length);
    logger.info("[62][report_xml]patients.length=" + patients.length);

    for (var i = 0;  i < patients.length; i ++)
    {
        let hospnm = patients[i].hospnm;

        if (hospnm === '가톨릭대학교 서울성모병원') {
            hospnm = '01';
        } else {
            hospnm = '02';
        }

        patients[i].hospnm = hospnm;

        let testcd = patients[i].testcd;

        if (arr_testcd.indexOf(testcd) > 0) {
            testcd = '01';
        }
        else {
            testcd = '03';
        }

        patients[i].testcd = testcd;

        patients[i].pv = 'Y';

        let specimenNo = patients[i].bcno;

        let rs_data = await messageHandler(specimenNo);
        
        logger.info("[88][report_xml]rs_data=" + JSON.stringify (rs_data));
        
        var patientJson = JSON.stringify(rs_data); 

        let patient_gene = JSON.parse(patientJson);

        patients[i].pv = 'N';
        patients[i].pv_gene = '';
        patients[i].vus = 'N';
        patients[i].vus_gene = '';
        
        if (patient_gene.lenght !== 0 )
        {
            for (var j = 0;  j < patient_gene.length; j ++)
            {
                if (patient_gene[j].functional_impact === 'VUS') {            
                    patients[i].vus = 'Y';
                    patients[i].vus_gene = patients[i].vus_gene + " " +  patient_gene[j].gene ;
                }
                else if ((patient_gene[j].functional_impact === 'Pathogenic') ||
                         (patient_gene[j].functional_impact === 'Likely Pathogenic')) {            
                    patients[i].pv = 'Y';
                    patients[i].pv_gene = patients[i].pv_gene + " " +  patient_gene[j].gene;
                }
            }
        }

    }

    res.json(patients);
}

exports.getList= (req, res, next) => {

    // , ,  
    let infmdd = req.body.start; // 시작일자
    let intodd = req.body.end; // 종료일자
    let intype = 'L'; // 구분 (P - 병리, L - 진검, A - 전체)

    let sendUrl = configEnv.emr_path;
    sendUrl = sendUrl +'?submit_id=TRLII00147&business_id=li&instcd=012';
    sendUrl = sendUrl + '&infmdd=' + infmdd
    sendUrl = sendUrl + '&intodd=' + intodd
    sendUrl = sendUrl + '&intype=' + intype;

	//sendUrl += data;

	logger.info('[136][report_xml]sendUrl=' +  sendUrl); 

   	axios({
        method: 'get',
		timeout: 3000,
        url: sendUrl ,
		headers: {"Authorization": "BASIC SGVsbG8="}
    })
    .then(function(response) {
       
		logger.info('[146][report_xml]data=' + response.data); 

		let res_data =  response.data;

		const parser = new xml2js.Parser( {explicitArray : false} /*options*/ ); 
		parser.parseStringPromise(res_data).then(function (result) {

			logger.info('[153][report_xml]json=' + JSON.stringify( result.root.worklist.worklist));
            var patientJson = JSON.stringify(result.root.worklist.worklist); 
            console.log('[158][report_xml]json=' ,  patientJson);

            let patients = JSON.parse(patientJson);
        
            console.log(patients);
            logger.info('[163][report_xml]json=' +   JSON.stringify(patients));

            let patient = patientHandler(patients, res);

        })
    })
}
