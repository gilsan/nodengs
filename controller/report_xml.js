const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const parser = require('fast-xml-parser');
const dbConfigMssql = require('../common/dbconfig.js');
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

var jsondata = `<root>
<worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C7930</preicd10cd>
<preicd10hngnm>뇌의 이차성 악성 신생물</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>35455416</pid>
<hngnm>전경아</hngnm>
<brthdd>19480101</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>I280700H0</bcno>
<orddd>20230806</orddd>
<prcpdd>20231108</prcpdd>
<prcpno>1667554461</prcpno>
<execprcpuntqno>1787079393</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231108</spcacptdt>
<lstreptdt>20231108</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>히스패닉</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>J00</preicd10cd>
<preicd10hngnm>급성 비인두염[감기]</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>22624315</pid>
<hngnm>김성근</hngnm>
<brthdd>20000101</brthdd>
<sex>2</sex>
<age>23</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>I280C0010</bcno>
<orddd>20231113</orddd>
<prcpdd>20231113</prcpdd>
<prcpno>1667556873</prcpno>
<execprcpuntqno>1787080745</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231113</spcacptdt>
<lstreptdt>20231113</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>재검(재발)</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C7930</preicd10cd>
<preicd10hngnm>뇌의 이차성 악성 신생물</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>35455416</pid>
<hngnm>전경아</hngnm>
<brthdd>19480101</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>I280L0040</bcno>
<orddd>20230806</orddd>
<prcpdd>20231122</prcpdd>
<prcpno>1667565168</prcpno>
<execprcpuntqno>1787084124</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231122</spcacptdt>
<lstreptdt>20231122</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>M4316</preicd10cd>
<preicd10hngnm>척추전방전위증, 요추부 </preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>21432723</pid>
<hngnm>홍희정</hngnm>
<brthdd>19570101</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE452</testcd>
<testnm>유전성 용혈성 빈혈 [NGS]</testnm>
<bcno>I280M0020</bcno>
<orddd>20230810</orddd>
<prcpdd>20231122</prcpdd>
<prcpno>1667565719</prcpno>
<execprcpuntqno>1787084199</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>M4316</preicd10cd>
<preicd10hngnm>척추전방전위증, 요추부 </preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>21432723</pid>
<hngnm>홍희정</hngnm>
<brthdd>19570101</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>I280M0030</bcno>
<orddd>20230810</orddd>
<prcpdd>20231122</prcpdd>
<prcpno>1667565722</prcpno>
<execprcpuntqno>1787084202</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>동종이식</bmtyn>
<testexec>진단시</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>D432</preicd10cd>
<preicd10hngnm>상세불명의 뇌의 행동양식 불명 또는 미상의 신생물</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>12441840</pid>
<hngnm>진경석</hngnm>
<brthdd>19380101</brthdd>
<sex>1</sex>
<age>85</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>I280M0040</bcno>
<orddd>20230713</orddd>
<prcpdd>20231109</prcpdd>
<prcpno>1667565723</prcpno>
<execprcpuntqno>1787084203</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>흑인</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>J00</preicd10cd>
<preicd10hngnm>급성 비인두염[감기]</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>22624315</pid>
<hngnm>김성근</hngnm>
<brthdd>20000101</brthdd>
<sex>2</sex>
<age>23</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>I280M0050</bcno>
<orddd>20231113</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566377</prcpno>
<execprcpuntqno>1787084865</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>재검(치료제 불용)</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>J00</preicd10cd>
<preicd10hngnm>급성 비인두염[감기]</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>22624315</pid>
<hngnm>김성근</hngnm>
<brthdd>20000101</brthdd>
<sex>2</sex>
<age>23</age>
<testcd>LPE456</testcd>
<testnm>선천성 백혈구 감소증 [NGS]</testnm>
<bcno>I280M0060</bcno>
<orddd>20231113</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566378</prcpno>
<execprcpuntqno>1787084866</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>재검(치료제 불용)</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C711</preicd10cd>
<preicd10hngnm>뇌암, 전두엽</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>27224290</pid>
<hngnm>알렉스</hngnm>
<brthdd>19760101</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>I280M0070</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566394</prcpno>
<execprcpuntqno>1787084882</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>동종이식</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C711</preicd10cd>
<preicd10hngnm>뇌암, 전두엽</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>27224290</pid>
<hngnm>알렉스</hngnm>
<brthdd>19760101</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE456</testcd>
<testnm>선천성 백혈구 감소증 [NGS]</testnm>
<bcno>I280M0080</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566393</prcpno>
<execprcpuntqno>1787084881</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>재검(치료제 불용)</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>J00</preicd10cd>
<preicd10hngnm>급성 비인두염[감기]</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>35287343</pid>
<hngnm>류현진</hngnm>
<brthdd>20060101</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>I280M0090</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566387</prcpno>
<execprcpuntqno>1787084875</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>히스패닉/라틴</racial>
<bmtyn>자가이식</bmtyn>
<testexec>재검(치료제 불용)</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>J00</preicd10cd>
<preicd10hngnm>급성 비인두염[감기]</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>35287343</pid>
<hngnm>류현진</hngnm>
<brthdd>20060101</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>I280M00A0</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566386</prcpno>
<execprcpuntqno>1787084874</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>재검(재발)</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C711</preicd10cd>
<preicd10hngnm>뇌암, 전두엽</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>27224290</pid>
<hngnm>알렉스</hngnm>
<brthdd>19760101</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE456</testcd>
<testnm>선천성 백혈구 감소증 [NGS]</testnm>
<bcno>I280M00B0</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566412</prcpno>
<execprcpuntqno>1787084901</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>재검(치료제 불용)</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C711</preicd10cd>
<preicd10hngnm>뇌암, 전두엽</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>27224290</pid>
<hngnm>알렉스</hngnm>
<brthdd>19760101</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I280M00C0</bcno>
<orddd>20231123</orddd>
<prcpdd>20231123</prcpdd>
<prcpno>1667566413</prcpno>
<execprcpuntqno>1787084902</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20231123</spcacptdt>
<lstreptdt>20231123</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
<racial>히스패닉/라틴</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<resultKM error="no" type="status" clear="true" description="info||정상 처리되었습니다." updateinstance="true" source="1701244810749"/>
</worklist>
</root>
`;


const  messageHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
  
    const sql =`select gene, functional_impact  from [dbo].[report_detected_variants] 
                    where specimenNo=@specimenNo 
                    order by functional_impact desc `;
  
    logger.info("[report_detected_variants]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('specimenNo', mssql.VarChar, specimenNo); // or: new sql.Request(pool1)
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[report_detected_variants]SQL error=' + err.message);
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

        // 23.11.30 ----------
        let reqfrmcd = "";

        if (patients[i].reqfrmcd == "14") {
            reqfrmcd = "유전성 NGS 검사의뢰서";
        } else if (patients[i].reqfrmcd == "14") {
            reqfrmcd = "비유전성 NGS 검사의뢰서";
        }

        patients[i].reqfrmcd = reqfrmcd;
        // --------------------------

        let specimenNo = patients[i].bcno;

        let rs_data = await messageHandler(specimenNo);
        
        logger.info("[2499][report_xml]rs_data=" + JSON.stringify (rs_data));
        
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
                else if ((patient_gene[j].functional_impact === 'Oncogenic') ||
                         (patient_gene[j].functional_impact === 'Likely Oncogenic')) {            
                    patients[i].pv = 'Y';
                    patients[i].pv_gene = patients[i].pv_gene + " " +  patient_gene[j].gene;
                }
            }
        }

    }

    res.json(patients);
}

exports.getList= (req, res, next) => {

    let jsonObj = parser.parse(jsondata, options)  ;
    var patientJson = JSON.stringify(jsonObj); 
    console.log('[114][patient_nu]json=' ,  patientJson);

    let patientObj = JSON.parse(patientJson);

    console.log(patientObj.root.worklist.worklist);

    let patients = patientObj.root.worklist.worklist;

    let patient = patientHandler(patients, res);

    //res.json(patient);
}
