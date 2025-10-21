const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const axios = require('axios');
const xml2js = require('xml2js');
const parser = require('fast-xml-parser');
const dbConfigMssql = require('../common/dbconfig.js');
const configEnv = require('../common/config.js');
const e = require('express');
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

const  messageHandler_path = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[patientinfo_path]select pathology_num=" + pathology_num);
    const sql =`select isnull(rel_pathology_num, '') rel_pathology_num
                    , isnull(organ, '') organ
                    , isnull(pathological_dx, '') pathological_dx
                    from [dbo].[patientinfo_path]
                    where pathology_num=@pathology_num `;
  
    logger.info("[patientinfo_path]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('pathology_num', mssql.VarChar, pathology_num); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset[0];
    } catch (err) {
        logger.error('[patientinfo_path]SQL error=' + err.message);
    }
}


const  messageHandler = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[report_mutation]select pathology_num=" + pathology_num);
    
    const sql =`select pathology_num,
                report_gb,
                gene,
                isnull(amino_acid_change, '') amino_acid_change,
                isnull(nucleotide_change, '') nucleotide_change,
                isnull(transcript, '') transcript,
                isnull(variant_allele_frequency, '') variant_allele_frequency
            from  [dbo].[report_mutation]
            where pathology_num=@pathology_num  `;
  
    logger.info("[report_mutation]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('pathology_num', mssql.VarChar, pathology_num); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[report_mutation]SQL error=' + err.message);
    }
}

const patientHandler = async(patients, res) => {

    console.log (patients.length);

    for (var i = 0;  i < patients.length; i ++)
    {
        let orddd = patients[i].orddd;

        patients[i].orddd = orddd;
        
        let prcpdd = patients[i].prcpdd;
    
        patients[i].prcpdd = prcpdd;

        let pathology_num = patients[i].bcno.substr(0, 3) + "-" + patients[i].bcno.substring(3);

        patients[i].pathology_num = pathology_num;

        let rs_data = await messageHandler_path(pathology_num);

        if (rs_data !== undefined) {
        
            logger.info("[1818][report_xml]rs_data=" + JSON.stringify (rs_data));
            
            var patientJson = JSON.stringify(rs_data); 

            let patient_gene = JSON.parse(patientJson);

            if (patient_gene.length !== 0 )
            {
                for (var j = 0;  j < patient_gene.length; j ++)
                {
                    patients[i].rel_pathology_num = patient_gene[j].rel_pathology_num ;
                    patients[i].organ = patient_gene[j].organ ;
                    patients[i].diagnosis = patient_gene[j].pathological_dx ;
                }
            }
        }
        else {
            patients[i].rel_pathology_num = "";
            patients[i].organ = "";
            patients[i].diagnosis = "";
        }

        let rs_data2 = await messageHandler(pathology_num);
            
        if (rs_data2 !== undefined) {
            
            logger.info("[1844][report_xml]rs_data=" + JSON.stringify (rs_data2));
            
            var patientJson = JSON.stringify(rs_data2); 

            var patient_gene = JSON.parse(patientJson);

            if (patient_gene.length !== 0 )
            {
                for (var j = 0;  j < patient_gene.length; j ++)
                {                             
                    patients[i].report_gb = patient_gene[j].report_gb;
                    patients[i].gene = patient_gene[j].gene;
                    patients[i].amino_acid_change = patient_gene[j].amino_acid_change;
                    patients[i].amino_acid_change = patient_gene[j].amino_acid_change;
                    patients[i].allele_frequency = patient_gene[j].variant_allele_frequency;
                }
            }
            else {
            
                patients[i].report_gb = "";
                patients[i].gene = "";
                patients[i].amino_acid_change = "";
                patients[i].nucleotide_change = "";
                patients[i].allele_frequency = "";
            }
        }
        else {
            
            patients[i].report_gb = "";
            patients[i].gene = "";
            patients[i].amino_acid_change = "";
            patients[i].nucleotide_change = "";
            patients[i].allele_frequency = "";
        }

    }

    res.json(patients);
}

exports.getList= (req, res, next) => {

    // , ,  
    let infmdd = req.body.start.replace(/-/gi, ''); // 시작일자
    let intodd = req.body.end.replace(/-/gi, ''); // 종료일자
    let intype = req.body.type; // 구분 (P - 병리, L - 진검, A - 전체)

    let sendUrl = configEnv.emr_path;
    sendUrl = sendUrl + '?submit_id=TRLII00147&business_id=li&instcd=' + configEnv.instcd;
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

            let patient = patientHandler(patients, res);
        })
    });

    //res.json(patient);
}
