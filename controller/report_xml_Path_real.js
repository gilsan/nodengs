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

const  messageHandler_path = async (pathology_num, orddd, prcpdd) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[patientinfo_path]select pathology_num=" + pathology_num + "," + orddd +  ", " + prcpdd);

    const sql =`select  '` +  prcpdd +  `' prcpdd
                    , '` + orddd + `' orddd 
                    , isnull(a.pathology_num, '') pathology_num
                    , isnull(rel_pathology_num, '') rel_pathology_num
                    , isnull(organ, '') organ
                    , isnull(pathological_dx, '') pathological_dx
                    , isnull(b.report_gb, '') report_gb
                    , isnull(b.gene, '')    gene
                    , isnull(amino_acid_change, '') amino_acid_change
                    , isnull(nucleotide_change, '') nucleotide_change
                    , isnull(transcript, '') transcript
                    , isnull(variant_allele_frequency, '') variant_allele_frequency
                from [dbo].[patientinfo_path] a
                left outer join  [dbo].[report_mutation] b
            on a.pathology_num = b.pathology_num
            where a.pathology_num=@pathology_num  `;
  
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
const  messageHandler = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[report_mutation]select pathology_num=" + pathology_num);
    
    const sql =`select report_gb,
                gene, tier
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

const  messageHandler_amplication = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[messageHandler_amplication]select pathology_num=" + pathology_num);
    
    const sql =`select report_gb,
                gene, tier
            from  [dbo].[report_amplification]
            where pathology_num=@pathology_num  `;
  
    logger.info("[messageHandler_amplication]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('pathology_num', mssql.VarChar, pathology_num); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[messageHandler_amplication]SQL error=' + err.message);
    }
}

const  messageHandler_fusion = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[messageHandler_fusion]select pathology_num=" + pathology_num);
    
    const sql =`select report_gb,
                gene, tier
            from  [dbo].[report_fusion]
            where pathology_num=@pathology_num  `;
  
    logger.info("[messageHandler_fusion]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('pathology_num', mssql.VarChar, pathology_num); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[messageHandler_fusion]SQL error=' + err.message);
    }
}

// 25.04.28
function cleanValue(value) {
    return value.replace(/(\d+)[A-Za-z]+/, '$1');
}

// 25.04.28
function hasNumber(str) {
    return /\d/.test(str);
}

const patientHandler = async(patients, res) => {

    console.log (patients.length);

    for (var i = 0;  i < patients.length; i ++)
    {
        // 25.04.28
        let pay100ownbrate = patients[i].pay100ownbrate;
        if (pay100ownbrate == '90') {
            patients[i].pay100rate = '01';
            patients[i].pay100report = 'Y';
        } else if (pay100ownbrate == '80') {
            patients[i].pay100rate = '03';
            patients[i].pay100report = 'N';            
        } else {
            patients[i].pay100rate = '';
            patients[i].pay100report = 'N';
        }

        console.log (patients[i].stage);

        // 25.04.28
        let stage1 = patients[i].stage ? String(patients[i].stage) : '';
        let stage =  stage1.split('/');
        if (stage.length > 1) {
            patients[i].stage = stage[0];
            patients[i].stage1 = cleanValue(stage[1]);
        }
        else {
            patients[i].stage = stage[0];
            patients[i].stage1 = '';
        }

        if (hasNumber(stage[0])) {
            patients[i].stage2 = 'Y';
        } else {
            patients[i].stage2 = 'N';
        }

        let hospnm = patients[i].hospnm;

        if (hospnm === '가톨릭대학교 서울성모병원') {
            hospnm = '01';
        } else {
            hospnm = '02';
        }

        patients[i].hospnm = hospnm;

        let testcd2 = '02';
        let preccd = patients[i].testcd;

        patients[i].testcd = testcd2;

        if (preccd == 'PMO12110') { // 고형암_CancerSCAN(DNA/RNA)
            patients[i].testcd2 = '2023000191';
            patients[i].canceryn = 'Y';
        } else if (preccd == 'PMO12104' ) { // 갑상선암Thychase(DNA/RNA)
            patients[i].testcd2 = '2023000932';
            patients[i].canceryn = 'Y';
        } else if (preccd == 'PMO12113' ) { // 고형암OCA(DNA)
            patients[i].testcd2 = '2023000933';
            patients[i].canceryn = 'Y';
        } else if (preccd == 'PMO12072' ) { // 고형암OCA(DNA/RNA)
            patients[i].testcd2 = '2023000934';
            patients[i].canceryn = 'Y';
        } else if (preccd == 'PMO12105' ) { // 고형암CancerSCAN(DNA)
            patients[i].testcd2 = '2023000935';
            patients[i].canceryn = 'Y';
        } else if (preccd == 'PMO12099' ) { // 림프종CLUG(DNA)
            patients[i].testcd2 = '2023000936';
            patients[i].canceryn = '';
        } else if (preccd == 'PMO12114' ) { // 림프종CLUG(DNA/RNA)	
            patients[i].testcd2 = '2023000937';
            patients[i].canceryn = '';
        } else {
            patients[i].testcd2 = '';
            patients[i].canceryn = '';
        }

        /*
       // 24.10.25 병릭과 요구 사항
       // 아래 조건 무시
        // 24.08.29 병리과 요구사항
        // 아래 코드가 아닌 경우 현재 단일유전자 검사 시행일 = "", 현재 단일유전자 검사 시행여부 = "" 처리한다
        const arr_pmo = ['PMO04007','PMO04008','PMO04010','PMO04024','PMO04025',
                    'PMO04035','PMO04031','PMO04034','PMO04036','PMO04032',
                    'PMO04034','PMO04043','PMO04034S','PMO12031','PMO04049',
                    'PMO04051','PMO10001','PMO11005B','PMO11007','PMO11017',
                    'PMO11019','PMO11020','PMO11042','PMO12002','PMO12004',
                    'PMO12012','PMO12021','PMO12022','PMO12024','PMO12027',
                    'PMO12028','PMO12029','PMO12030','PMO12032','PMO12036',
                    'PMO12037','PMO12038','PMO12042','PMO12043','PMO12044',
                    'PMO12045','PMO12046','PMO12052','PMO12054','PMO12057',
                    'PMO12059','PMO12060','PMO12062','PMO12063','PMO12064',
                    'PMO12065','PMO12066','PMO12069','PMO12070','PMO12071',
                    'PMO12076','PMO12077','PMO12080','PMO12106','PMO12108','PMO12115','PMO12118'];

        logger.info("[211][report_xml_path]preccd=" + preccd);
        let arr_idx = arr_pmo.indexOf(preccd);
        logger.info("[211][report_xml_path]arr_idx=" + arr_idx);
        if ( arr_idx < 0)
        {
                patients[i].monogenicdd = "";
                patients[i].monogenicyn = "";
        }
        else 
        {
            let spcacptdt = patients[i].spcacptdt;
            
            logger.info("[211][report_xml_path]spcacptdt=" + spcacptdt);
            patients[i].monogenicdd = spcacptdt;
            patients[i].monogenicyn = "Y";
        }
        */

        // 24.10.25 병릭과 요구 사항
        // 단일유전자 검사 종목 != '' => 단일유전자 검사 시행 여부 = 'Y'
        if (patients[i].monogenicnm === '')
        {
            patients[i].monogenicdd = "";
            patients[i].monogenicyn = "";
        }
        else 
        {
            patients[i].monogenicyn = "Y";
        }

        logger.info("[1944][report_xml_path]patients[i].testcd2=" + patients[i].testcd2);
        logger.info("[1944][report_xml_path]patients[i].monogenicdd=" + patients[i].monogenicdd);
        //logger.info("[1944][report_xml_path]arr_idx=" + arr_idx);
        
        patients[i].pv = 'Y';
        
        // 24.08.29 병리과 요구사항
        // 현재 단일유전자 검사 시행일(monogenicdd) => '접수일자(spcacptdt)' 
        // 24.08.29 접수일자(spcacptdt)로 변경
        // 진료일(orddd) -> 접수일자(spcacptdt)
        
        let orddd = patients[i].orddd;
        
        // 처방일 : spcacptdt
        let prcpdd = patients[i].prcpdd;
        
        let pathology_num = '';

        // 24.03.12 
        // 수탁인 경우 Z로 시작하면서 10자리인 경우 (추가)
        // 일반인 경우 9자리인 경우
        if (patients[i].bcno.length > 9) 
            pathology_num = patients[i].bcno.substr(0, 4) + "-" + patients[i].bcno.substring(4);
        else
            pathology_num = patients[i].bcno.substr(0, 3) + "-" + patients[i].bcno.substring(3);

        patients[i].bcno = pathology_num;

        let rs_data_path = await messageHandler_path(pathology_num, orddd, prcpdd);

        if (rs_data_path !== undefined) {
            
            logger.info("[1944][report_xml_path]rs_data_path=" + JSON.stringify (rs_data_path));
            
            var patientJson = JSON.stringify(rs_data_path); 

            var patient_gene_path = JSON.parse(patientJson);

            if (patient_gene_path.length > 0 )
            {
                logger.info("[1818][report_xml_path]patient_gene_path.length=" + patient_gene_path.length);
            
                patients[i].tumor_type = patient_gene_path[0].tumor_type ;
                patients[i].organ = patient_gene_path[0].organ ;
                patients[i].diagnosis = patient_gene_path[0].pathological_dx ;     
            }
            else {

                logger.info("[1993][report_xml_path]rs_data_path not found" );

                patients[i].tumor_type = "";
                patients[i].organ = "";
                patients[i].diagnosis = "";
            }
        }
        else {

            logger.info("[1993][report_xml_path]rs_data_path not found" );

            patients[i].tumor_type = "";
            patients[i].organ = "";
            patients[i].diagnosis = "";
        }

        let rs_data = await messageHandler(pathology_num);
        
        logger.info("[1882][report_xml]rs_data=" + JSON.stringify (rs_data));
        
        var patientJson = JSON.stringify(rs_data); 

        let patient_gene = JSON.parse(patientJson);

        let rs_data_amp = await messageHandler_amplication(pathology_num);
        
        logger.info("[1891][report_xml]rs_data=" + JSON.stringify (rs_data_amp));
        
        var patientJson_amp = JSON.stringify(rs_data_amp); 

        let patient_gene_amp = JSON.parse(patientJson_amp);

        let rs_data_fus = await messageHandler_fusion(pathology_num);
        
        logger.info("[1891][report_xml]rs_data=" + JSON.stringify (rs_data_fus));
        
        var patientJson_fus = JSON.stringify(rs_data_fus); 

        let patient_gene_fus = JSON.parse(patientJson_fus);

        patients[i].pv = 'N';
        patients[i].pv_gene = '';
        // 25.03.28 tier I, II 함께 표시
        patients[i].pv_gene2 = '';
        patients[i].vus = 'N';
        patients[i].vus_gene = '';

        // 23.11.30
        patients[i].tier = '';
        let duptier = [];
        
        if (patient_gene.length !== 0 )
        {
            for (var j = 0;  j < patient_gene.length; j ++)
            {
                if (patient_gene[j].report_gb === 'P') {            
                    patients[i].vus = 'N';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene[j].gene ;
                }
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                //else if (patient_gene[j].report_gb === 'C') {            
                else if ((patient_gene[j].report_gb === 'C') && (patient_gene[j].tier === 'I')) {            
                    patients[i].pv = 'Y';
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene[j].gene;
                    // 25.03.28 tier I, II 함께 표시
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene[j].gene;
                }
                // 25.03.28 tier I, II 함께 표시
                else if ((patient_gene[j].report_gb === 'C') && (patient_gene[j].tier === 'II')) {            
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene[j].gene;
                }

                // 23.11.30
                if (patient_gene[j].tier === 'I') {
                    duptier.push ('I');
                /*
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                } else if (patient_gene[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene[j].tier === 'III') {
                    duptier.push ( 'III');
                */
                } 
            }
        }

        if (patient_gene_amp.length !== 0 )
        {
            for (var j = 0;  j < patient_gene_amp.length; j ++)
            {
                if (patient_gene_amp[j].report_gb === 'P') {  
                    patients[i].vus = 'N';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene_amp[j].gene ;
                }
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                //else if (patient_gene_amp[j].report_gb === 'C') {    
                else if ((patient_gene_amp[j].report_gb === 'C') && (patient_gene_amp[j].tier === 'I'))  {    
                    patients[i].pv = 'Y';                                
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene_amp[j].gene;
                    // 25.03.28 tier I, II 함께 표시
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene_amp[j].gene;
                }
                // 25.03.28 tier I, II 함께 표시
                else if ((patient_gene_amp[j].report_gb === 'C') && (patient_gene_amp[j].tier === 'II')) {            
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene_amp[j].gene;
                }
                
                // 23.11.30
                if (patient_gene_amp[j].tier === 'I') {
                    duptier.push ('I');
                /*
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                } else if (patient_gene_amp[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene_amp[j].tier === 'III') {
                    duptier.push ( 'III');
                */
                } 
            }
        }

        if (patient_gene_fus.length !== 0 )
        {
            for (var j = 0;  j < patient_gene_fus.length; j ++)
            {
                if (patient_gene_fus[j].report_gb === 'P') {  
                    patients[i].vus = 'N';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene_fus[j].gene ;
                }
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                //else if (patient_gene_fus[j].report_gb === 'C') {  
                else if ((patient_gene_fus[j].report_gb === 'C')  && (patient_gene_fus[j].tier === 'I')){ 
                    patients[i].pv = 'Y';                                  
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene_fus[j].gene;
                    // 25.03.28 tier I, II 함께 표시
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene_fus[j].gene;
                }
                // 25.03.28 tier I, II 함께 표시
                else if ((patient_gene_fus[j].report_gb === 'C') && (patient_gene_fus[j].tier === 'II')) {            
                    patients[i].pv_gene2 = patients[i].pv_gene2 + " " + patient_gene_fus[j].gene;
                }

                // 23.11.30
                if (patient_gene_fus[j].tier === 'I') {
                    duptier.push ('I');
                /*
                // 24.08.29 병리과 요구사항
                // tier == 'I' 만 암 유전자
                } else if (patient_gene_fus[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene_fus[j].tier === 'III') {
                    duptier.push ( 'III');
                */
               } 
            }
        }

        if (patients[i].vus_gene.length != 0)
        {
            patients[i].vus_gene = patients[i].vus_gene.substr(1);
        }
        
        if (patients[i].pv_gene.length != 0)
        {
            patients[i].pv_gene = patients[i].pv_gene.substr(1);
        }
        
        // 25.03.28 tier I, II 함께 표시
        if (patients[i].pv_gene2.length != 0)
        {
            patients[i].pv_gene2 = patients[i].pv_gene2.substr(1);
        }

        // 23.11.30
        let tierArr = [];
        duptier.forEach((element) => {
            if (!tierArr.includes(element)) {
                tierArr.push(element);
            }
        });

        let tier = tierArr.sort().toString();

        patients[i].tier = tier;
    }

    res.json(patients);
}

exports.getList= (req, res, next) => {

    // , ,  
    let infmdd = req.body.start.replace(/-/gi, ''); // 시작일자
    let intodd = req.body.end.replace(/-/gi, ''); // 종료일자
    let intype = 'P'; // req.body.type; // 구분 (P - 병리, L - 진검, A - 전체)

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

            // 25.09.19 데이타 없는 경우 오류 처리
            let worklist = result.root.worklist.worklist;

            if (worklist != undefined) {
        
                logger.info('[153][report_xml_path]json=' + JSON.stringify( result.root.worklist.worklist));
                var patientJson = JSON.stringify(result.root.worklist.worklist); 
                console.log('[158][report_xml_path]json=' ,  patientJson);
    
                let patients = JSON.parse(patientJson);
                console.log(patients);

                logger.info('[163][report_xml_path]json=' +   JSON.stringify(patients));
            
                if (patients.length > 0) {
                    let patient = patientHandler(patients, res);
                }
                else {
                    res.json("{}");  
                }
            }
            else {
                res.json("{}");  
            }
        })
    })
    .catch((err) => {
      // 여기서 axios 에러, xml 파싱 에러 다 잡음
      logger.error('getList error:', err.message);
      res.status(200).json({});
    });

    //res.json(patient);
}
