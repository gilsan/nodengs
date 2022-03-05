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
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>35967076</pid>
<hngnm>박정남</hngnm>
<brthdd>20190101</brthdd>
<sex>2</sex>
<age>2</age>
<testcd>LPE522</testcd>
<testnm>유전성 골형성이상 질환 [NGS]</testnm>
<bcno>I27CV0010</bcno>
<orddd>20210429</orddd>
<prcpdd>20210429</prcpdd>
<prcpno>1401889545</prcpno>
<execprcpuntqno>1501301406</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>00964</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35974853</pid>
<hngnm>강수미</hngnm>
<brthdd>19540101</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I278Z1GD0</bcno>
<orddd>20210502</orddd>
<prcpdd>20210504</prcpdd>
<prcpno>1403131338</prcpno>
<execprcpuntqno>1502645130</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210504</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>35983356</pid>
<hngnm>박주혁</hngnm>
<brthdd>20120101</brthdd>
<sex>1</sex>
<age>9</age>
<testcd>LPE535</testcd>
<testnm>유전성 뇌전증 [NGS]</testnm>
<bcno>O278Z52Y0</bcno>
<orddd>20210504</orddd>
<prcpdd>20210504</prcpdd>
<prcpno>1403260264</prcpno>
<execprcpuntqno>1502781867</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210504</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>00665</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>11782871</pid>
<hngnm>이성혁</hngnm>
<brthdd>19420101</brthdd>
<sex>1</sex>
<age>79</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I278Z3GY0</bcno>
<orddd>20210430</orddd>
<prcpdd>20210504</prcpdd>
<prcpno>1403443906</prcpno>
<execprcpuntqno>1502980025</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210506</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>00880</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>35624953</pid>
<hngnm>오영미아기</hngnm>
<brthdd>19720101</brthdd>
<sex>1</sex>
<age>49</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E27950JD0</bcno>
<orddd>20210510</orddd>
<prcpdd>20210510</prcpdd>
<prcpno>1404775261</prcpno>
<execprcpuntqno>1504417972</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210510</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>00739</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>27900484</pid>
<hngnm>곽민영</hngnm>
<brthdd>19540101</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27960KR0</bcno>
<orddd>20210508</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1404675778</prcpno>
<execprcpuntqno>1504313337</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>00972</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>35964452</pid>
<hngnm>이준복</hngnm>
<brthdd>20020101</brthdd>
<sex>1</sex>
<age>19</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I27962HL0</bcno>
<orddd>20210510</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405212056</prcpno>
<execprcpuntqno>1504885013</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>01109</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C187</preicd10cd>
<preicd10hngnm>구불결장암</preicd10hngnm>
<posticd10cd>C187</posticd10cd>
<posticd10hngnm>구불결장암</posticd10hngnm>
<pid>25897915</pid>
<hngnm>육재명</hngnm>
<brthdd>19610101</brthdd>
<sex>1</sex>
<age>60</age>
<testcd>LPE498</testcd>
<testnm>혈전성 미세혈관병증 [NGS]</testnm>
<bcno>I27972XW0</bcno>
<orddd>20210506</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405614218</prcpno>
<execprcpuntqno>1505317060</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>36012500</pid>
<hngnm>정복순</hngnm>
<brthdd>20180101</brthdd>
<sex>2</sex>
<age>3</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O279840W0</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405863458</prcpno>
<execprcpuntqno>1505583358</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>36039154</pid>
<hngnm>문정생</hngnm>
<brthdd>20200101</brthdd>
<sex>1</sex>
<age>1</age>
<testcd>LPE535</testcd>
<testnm>유전성 뇌전증 [NGS]</testnm>
<bcno>O279F40H0</bcno>
<orddd>20210520</orddd>
<prcpdd>20210520</prcpdd>
<prcpno>1407664182</prcpno>
<execprcpuntqno>1507532751</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210520</spcacptdt>
<lstreptdt>20210601</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4034820</clamacptno>
<docuseqno>00483</docuseqno>
<pay100ownbrate>0</pay100ownbrate>
<preicd10cd>P221</preicd10cd>
<preicd10hngnm>신생아의 일과성 빠른호흡</preicd10hngnm>
<posticd10cd>P221</posticd10cd>
<posticd10hngnm>신생아의 일과성 빠른호흡</posticd10hngnm>
<pid>35922664</pid>
<hngnm>오귀열</hngnm>
<brthdd>20210101</brthdd>
<sex>1</sex>
<age>0</age>
<testcd>LPE519</testcd>
<testnm>유전성 피부질환 [NGS]</testnm>
<bcno>I278L2430</bcno>
<orddd>20210418</orddd>
<prcpdd>20210421</prcpdd>
<prcpno>1399438350</prcpno>
<execprcpuntqno>1498678269</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210421</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039634</clamacptno>
<docuseqno>10403</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>Q148</preicd10cd>
<preicd10hngnm>기타 후안부의 선천기형</preicd10hngnm>
<posticd10cd>Q148</posticd10cd>
<posticd10hngnm>기타 후안부의 선천기형</posticd10hngnm>
<pid>35279210</pid>
<hngnm>최성녀</hngnm>
<brthdd>20090101</brthdd>
<sex>1</sex>
<age>12</age>
<testcd>LPE543</testcd>
<testnm>유전성 망막색소병증 [NGS]</testnm>
<bcno>O278K61J0</bcno>
<orddd>20210420</orddd>
<prcpdd>20210420</prcpdd>
<prcpno>1399360158</prcpno>
<execprcpuntqno>1498593686</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210421</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>80079</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>H359</preicd10cd>
<preicd10hngnm>상세불명의 망막 장애</preicd10hngnm>
<posticd10cd>H359</posticd10cd>
<posticd10hngnm>상세불명의 망막 장애</posticd10hngnm>
<pid>17596597</pid>
<hngnm>박춘안</hngnm>
<brthdd>19590101</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE539</testcd>
<testnm>유전성 망막병증 [NGS]</testnm>
<bcno>O278M3LU0</bcno>
<orddd>20210422</orddd>
<prcpdd>20210422</prcpdd>
<prcpno>1399921098</prcpno>
<execprcpuntqno>1499191620</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210422</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>00340</docuseqno>
<pay100ownbrate>10</pay100ownbrate>
<preicd10cd>I420</preicd10cd>
<preicd10hngnm>확장성 심근병증</preicd10hngnm>
<posticd10cd>I420</posticd10cd>
<posticd10hngnm>확장성 심근병증</posticd10hngnm>
<pid>31115583</pid>
<hngnm>박경혜</hngnm>
<brthdd>19740101</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>I278M5610</bcno>
<orddd>20210309</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1399817187</prcpno>
<execprcpuntqno>1499083129</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210423</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>50624</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C449</preicd10cd>
<preicd10hngnm>피부암</preicd10hngnm>
<posticd10cd>C449</posticd10cd>
<posticd10hngnm>피부암</posticd10hngnm>
<pid>17902977</pid>
<hngnm>이효범</hngnm>
<brthdd>19610101</brthdd>
<sex>2</sex>
<age>60</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>O278N39S0</bcno>
<orddd>20210423</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1400242356</prcpno>
<execprcpuntqno>1499536918</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210423</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4034598</clamacptno>
<docuseqno>00503</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>S32090</preicd10cd>
<preicd10hngnm>상세불명 부위의 요추의 골절, 폐쇄성</preicd10hngnm>
<posticd10cd>S32090</posticd10cd>
<posticd10hngnm>상세불명 부위의 요추의 골절, 폐쇄성</posticd10hngnm>
<pid>24421954</pid>
<hngnm>김동선</hngnm>
<brthdd>20090101</brthdd>
<sex>1</sex>
<age>12</age>
<testcd>LPE522</testcd>
<testnm>유전성 골형성이상 질환 [NGS]</testnm>
<bcno>I278R2AF0</bcno>
<orddd>20210423</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400824248</prcpno>
<execprcpuntqno>1500167354</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>80128</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C884</preicd10cd>
<preicd10hngnm>점막관련 림프모양 조직의 림프절외 변연부B-세포림프종[MALT-lymphoma]</preicd10hngnm>
<posticd10cd>C884</posticd10cd>
<posticd10hngnm>점막관련 림프모양 조직의 림프절외 변연부B-세포림프종[MALT-lymphoma]</posticd10hngnm>
<pid>33033786</pid>
<hngnm>최영옥</hngnm>
<brthdd>19830101</brthdd>
<sex>2</sex>
<age>38</age>
<testcd>LPE489</testcd>
<testnm>선천성 면역결핍증 [NGS]</testnm>
<bcno>O278R6I30</bcno>
<orddd>20210426</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1401031042</prcpno>
<execprcpuntqno>1500387994</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042621</clamacptno>
<docuseqno>00463</docuseqno>
<pay100ownbrate>0</pay100ownbrate>
<preicd10cd>P220</preicd10cd>
<preicd10hngnm>신생아의 호흡곤란증후군</preicd10hngnm>
<posticd10cd>P220</posticd10cd>
<posticd10hngnm>신생아의 호흡곤란증후군</posticd10hngnm>
<pid>35816554</pid>
<hngnm>오순희</hngnm>
<brthdd>20210101</brthdd>
<sex>2</sex>
<age>0</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>I278Y2SA0</bcno>
<orddd>20210318</orddd>
<prcpdd>20210503</prcpdd>
<prcpno>1402909265</prcpno>
<execprcpuntqno>1502405490</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048060</clamacptno>
<docuseqno>10871</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35890954</pid>
<hngnm>김순정</hngnm>
<brthdd>20150101</brthdd>
<sex>1</sex>
<age>6</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>O27915IZ0</bcno>
<orddd>20210506</orddd>
<prcpdd>20210506</prcpdd>
<prcpno>1403861948</prcpno>
<execprcpuntqno>1503431448</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210506</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4012318</clamacptno>
<docuseqno>00578</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>11258761</pid>
<hngnm>임은정</hngnm>
<brthdd>19510101</brthdd>
<sex>1</sex>
<age>70</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I276J2FS0</bcno>
<orddd>20210206</orddd>
<prcpdd>20210208</prcpdd>
<prcpno>1379547404</prcpno>
<execprcpuntqno>1477262424</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210208</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4022275</clamacptno>
<docuseqno>41364</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>35662850</pid>
<hngnm>구원섭</hngnm>
<brthdd>19540101</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O276T43K0</bcno>
<orddd>20210217</orddd>
<prcpdd>20210217</prcpdd>
<prcpno>1381713974</prcpno>
<execprcpuntqno>1479605444</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210217</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4025653</clamacptno>
<docuseqno>00958</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>34536162</pid>
<hngnm>김지영</hngnm>
<brthdd>19660101</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I27784B80</bcno>
<orddd>20210303</orddd>
<prcpdd>20210304</prcpdd>
<prcpno>1385726159</prcpno>
<execprcpuntqno>1483939647</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210305</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4032152</clamacptno>
<docuseqno>51402</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>5878850</pid>
<hngnm>원용천</hngnm>
<brthdd>19460101</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O277E5XF0</bcno>
<orddd>20210310</orddd>
<prcpdd>20210310</prcpdd>
<prcpno>1387580344</prcpno>
<execprcpuntqno>1485932087</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210310</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4032152</clamacptno>
<docuseqno>48039</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>34123171</pid>
<hngnm>장순옥</hngnm>
<brthdd>19480101</brthdd>
<sex>2</sex>
<age>73</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O277M4Z70</bcno>
<orddd>20210218</orddd>
<prcpdd>20210218</prcpdd>
<prcpno>1382168929</prcpno>
<execprcpuntqno>1480091144</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210318</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4029759</clamacptno>
<docuseqno>00442</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>S32090</preicd10cd>
<preicd10hngnm>상세불명 부위의 요추의 골절, 폐쇄성</preicd10hngnm>
<posticd10cd>S32090</posticd10cd>
<posticd10hngnm>상세불명 부위의 요추의 골절, 폐쇄성</posticd10hngnm>
<pid>35814003</pid>
<hngnm>이동욱</hngnm>
<brthdd>20160101</brthdd>
<sex>2</sex>
<age>5</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I277T1C30</bcno>
<orddd>20210318</orddd>
<prcpdd>20210324</prcpdd>
<prcpno>1391408978</prcpno>
<execprcpuntqno>1490052298</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210324</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>47058</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>34822913</pid>
<hngnm>이종훈</hngnm>
<brthdd>19560101</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O27873HV0</bcno>
<orddd>20210407</orddd>
<prcpdd>20210407</prcpdd>
<prcpno>1395485062</prcpno>
<execprcpuntqno>1494429602</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210407</spcacptdt>
<lstreptdt>20210603</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039592</clamacptno>
<docuseqno>32098</docuseqno>
<pay100ownbrate>20</pay100ownbrate>
<preicd10cd>R629</preicd10cd>
<preicd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</preicd10hngnm>
<posticd10cd>R629</posticd10cd>
<posticd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</posticd10hngnm>
<pid>35699091</pid>
<hngnm>강원석</hngnm>
<brthdd>20200101</brthdd>
<sex>2</sex>
<age>1</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O278U35D0</bcno>
<orddd>20210426</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1401029183</prcpno>
<execprcpuntqno>1500386059</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01146</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>32332634</pid>
<hngnm>SON YE JI</hngnm>
<brthdd>19910101</brthdd>
<sex>2</sex>
<age>30</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>I27922050</bcno>
<orddd>20210506</orddd>
<prcpdd>20210507</prcpdd>
<prcpno>1404144248</prcpno>
<execprcpuntqno>1503736145</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210507</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>00978</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>35994672</pid>
<hngnm>김명갑</hngnm>
<brthdd>19860101</brthdd>
<sex>2</sex>
<age>35</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I27963540</bcno>
<orddd>20210508</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405213500</prcpno>
<execprcpuntqno>1504886532</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046111</clamacptno>
<docuseqno>00449</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35957786</pid>
<hngnm>신영경</hngnm>
<brthdd>20200101</brthdd>
<sex>2</sex>
<age>1</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27963WD0</bcno>
<orddd>20210509</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405308239</prcpno>
<execprcpuntqno>1504988366</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>00706</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>17112414</pid>
<hngnm>신미소</hngnm>
<brthdd>19460101</brthdd>
<sex>2</sex>
<age>75</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27964380</bcno>
<orddd>20210507</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405310861</prcpno>
<execprcpuntqno>1504991156</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>01001</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35859112</pid>
<hngnm>오대국</hngnm>
<brthdd>19550101</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27971L90</bcno>
<orddd>20210511</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405396639</prcpno>
<execprcpuntqno>1505081685</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01007</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35942513</pid>
<hngnm>김기환</hngnm>
<brthdd>19730101</brthdd>
<sex>1</sex>
<age>48</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27972240</bcno>
<orddd>20210422</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405454032</prcpno>
<execprcpuntqno>1505142181</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>38296</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>25977865</pid>
<hngnm>김기남</hngnm>
<brthdd>19620101</brthdd>
<sex>1</sex>
<age>59</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279846J0</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405855063</prcpno>
<execprcpuntqno>1505573820</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>44069</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>36003163</pid>
<hngnm>박시춘</hngnm>
<brthdd>20010101</brthdd>
<sex>1</sex>
<age>20</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O27984VA0</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405903271</prcpno>
<execprcpuntqno>1505627257</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01015</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35967601</pid>
<hngnm>백미금</hngnm>
<brthdd>19550101</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I27991Z70</bcno>
<orddd>20210513</orddd>
<prcpdd>20210514</prcpdd>
<prcpno>1406211551</prcpno>
<execprcpuntqno>1505961592</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210514</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01348</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C259</preicd10cd>
<preicd10hngnm>상세불명의 췌장암</preicd10hngnm>
<posticd10cd>C259</posticd10cd>
<posticd10hngnm>상세불명의 췌장암</posticd10hngnm>
<pid>35351162</pid>
<hngnm>이순덕</hngnm>
<brthdd>19610101</brthdd>
<sex>2</sex>
<age>60</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>O279D5P70</bcno>
<orddd>20210518</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407243307</prcpno>
<execprcpuntqno>1507079910</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210609</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>35745142</pid>
<hngnm>이준환</hngnm>
<brthdd>19900101</brthdd>
<sex>1</sex>
<age>31</age>
<testcd>LPE521</testcd>
<testnm>유전성 신경병증 [NGS]</testnm>
<bcno>O27723PY0</bcno>
<orddd>20210226</orddd>
<prcpdd>20210226</prcpdd>
<prcpno>1384361074</prcpno>
<execprcpuntqno>1482462902</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210226</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01057</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>25259330</pid>
<hngnm>김순점</hngnm>
<brthdd>19920101</brthdd>
<sex>2</sex>
<age>29</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>O278Y2420</bcno>
<orddd>20210503</orddd>
<prcpdd>20210419</prcpdd>
<prcpno>1398949005</prcpno>
<execprcpuntqno>1498156208</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4047948</clamacptno>
<docuseqno>27124</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>R629</preicd10cd>
<preicd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</preicd10hngnm>
<posticd10cd>R629</posticd10cd>
<posticd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</posticd10hngnm>
<pid>32751502</pid>
<hngnm>김주수</hngnm>
<brthdd>20180101</brthdd>
<sex>1</sex>
<age>3</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O278Z4IF0</bcno>
<orddd>20210329</orddd>
<prcpdd>20210329</prcpdd>
<prcpno>1392982676</prcpno>
<execprcpuntqno>1491747245</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210504</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4047948</clamacptno>
<docuseqno>28359</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>R629</preicd10cd>
<preicd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</preicd10hngnm>
<posticd10cd>R629</posticd10cd>
<posticd10hngnm>상세불명의 기대되는 정상 생리학적 발달의 결여</posticd10hngnm>
<pid>35955422</pid>
<hngnm>양병도</hngnm>
<brthdd>20180101</brthdd>
<sex>2</sex>
<age>3</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O278Z4XN0</bcno>
<orddd>20210503</orddd>
<prcpdd>20210503</prcpdd>
<prcpno>1402931904</prcpno>
<execprcpuntqno>1502429521</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210504</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01504</docuseqno>
<pay100ownbrate>20</pay100ownbrate>
<preicd10cd>G992</preicd10cd>
<preicd10hngnm>달리 분류된 질환에서의 척수병증</preicd10hngnm>
<posticd10cd>G992</posticd10cd>
<posticd10hngnm>달리 분류된 질환에서의 척수병증</posticd10hngnm>
<pid>18816265</pid>
<hngnm>정지안</hngnm>
<brthdd>19660101</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE530</testcd>
<testnm>유전성 강직하반신마비 [NGS]</testnm>
<bcno>I27962S60</bcno>
<orddd>20210509</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405242973</prcpno>
<execprcpuntqno>1504918067</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>15291</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>I209</preicd10cd>
<preicd10hngnm>상세불명의 협심증</preicd10hngnm>
<posticd10cd>I209</posticd10cd>
<posticd10hngnm>상세불명의 협심증</posticd10hngnm>
<pid>32648911</pid>
<hngnm>최명임</hngnm>
<brthdd>19870101</brthdd>
<sex>2</sex>
<age>34</age>
<testcd>LPE439</testcd>
<testnm>Long QT panel [NGS]</testnm>
<bcno>O27964MX0</bcno>
<orddd>20210511</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405113568</prcpno>
<execprcpuntqno>1504780172</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>00499</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>Q257</preicd10cd>
<preicd10hngnm>폐동맥의 기타 선천기형</preicd10hngnm>
<posticd10cd>Q257</posticd10cd>
<posticd10hngnm>폐동맥의 기타 선천기형</posticd10hngnm>
<pid>27760202</pid>
<hngnm>성태숙</hngnm>
<brthdd>19590101</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE525</testcd>
<testnm>유전성 결합조직 질환 [NGS]</testnm>
<bcno>I279705I0</bcno>
<orddd>20210509</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405330366</prcpno>
<execprcpuntqno>1505012185</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>73651</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>N041</preicd10cd>
<preicd10hngnm>초점성 및 분절성 사구체 병변을 동반한 신 증후군</preicd10hngnm>
<posticd10cd>N041</posticd10cd>
<posticd10hngnm>초점성 및 분절성 사구체 병변을 동반한 신 증후군</posticd10hngnm>
<pid>35592291</pid>
<hngnm>김순녀</hngnm>
<brthdd>19700101</brthdd>
<sex>2</sex>
<age>51</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O27976KK0</bcno>
<orddd>20210512</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405664271</prcpno>
<execprcpuntqno>1505370700</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4047947</clamacptno>
<docuseqno>05579</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>H5308</preicd10cd>
<preicd10hngnm>기타 및 상세불명의 약시</preicd10hngnm>
<posticd10cd>H5308</posticd10cd>
<posticd10hngnm>기타 및 상세불명의 약시</posticd10hngnm>
<pid>30035354</pid>
<hngnm>이갑득</hngnm>
<brthdd>20150101</brthdd>
<sex>1</sex>
<age>6</age>
<testcd>LPE543</testcd>
<testnm>유전성 망막색소병증 [NGS]</testnm>
<bcno>O27993670</bcno>
<orddd>20210514</orddd>
<prcpdd>20210514</prcpdd>
<prcpno>1406242535</prcpno>
<execprcpuntqno>1505995552</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210514</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4047948</clamacptno>
<docuseqno>27133</docuseqno>
<pay100ownbrate>10</pay100ownbrate>
<preicd10cd>P220</preicd10cd>
<preicd10hngnm>신생아의 호흡곤란증후군</preicd10hngnm>
<posticd10cd>P220</posticd10cd>
<posticd10hngnm>신생아의 호흡곤란증후군</posticd10hngnm>
<pid>32835073</pid>
<hngnm>한명자</hngnm>
<brthdd>20180101</brthdd>
<sex>2</sex>
<age>3</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O279C3SL0</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405787070</prcpno>
<execprcpuntqno>1505502532</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4047948</clamacptno>
<docuseqno>09593</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>35888401</pid>
<hngnm>서상달</hngnm>
<brthdd>19860101</brthdd>
<sex>2</sex>
<age>35</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>O279C6210</bcno>
<orddd>20210517</orddd>
<prcpdd>20210517</prcpdd>
<prcpno>1406860385</prcpno>
<execprcpuntqno>1506669129</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>33111</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>R808</preicd10cd>
<preicd10hngnm>기타 및 상세불명 고립성 단백뇨</preicd10hngnm>
<posticd10cd>R808</posticd10cd>
<posticd10hngnm>기타 및 상세불명 고립성 단백뇨</posticd10hngnm>
<pid>20858996</pid>
<hngnm>한태섭</hngnm>
<brthdd>20020101</brthdd>
<sex>1</sex>
<age>19</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>O279F0M80</bcno>
<orddd>20210204</orddd>
<prcpdd>20210204</prcpdd>
<prcpno>1378482306</prcpno>
<execprcpuntqno>1476103894</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210520</spcacptdt>
<lstreptdt>20210614</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046111</clamacptno>
<docuseqno>00427</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C837</preicd10cd>
<preicd10hngnm>버킷림프종</preicd10hngnm>
<posticd10cd>C837</posticd10cd>
<posticd10hngnm>버킷림프종</posticd10hngnm>
<pid>35790872</pid>
<hngnm>오현숙</hngnm>
<brthdd>20130101</brthdd>
<sex>2</sex>
<age>8</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I279D1FP0</bcno>
<orddd>20210514</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407062836</prcpno>
<execprcpuntqno>1506887112</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>00815</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>33141371</pid>
<hngnm>황운찬</hngnm>
<brthdd>19510101</brthdd>
<sex>2</sex>
<age>70</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279D1JC0</bcno>
<orddd>20210514</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407063773</prcpno>
<execprcpuntqno>1506888099</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>43697</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35879643</pid>
<hngnm>김용환</hngnm>
<brthdd>19800101</brthdd>
<sex>1</sex>
<age>41</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279D3Y30</bcno>
<orddd>20210518</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407143971</prcpno>
<execprcpuntqno>1506972413</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>34241774</pid>
<hngnm>박태현</hngnm>
<brthdd>19520101</brthdd>
<sex>1</sex>
<age>69</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279J2F50</bcno>
<orddd>20210523</orddd>
<prcpdd>20210524</prcpdd>
<prcpno>1408657970</prcpno>
<execprcpuntqno>1508609616</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210524</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>00845</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>34435434</pid>
<hngnm>이정웅</hngnm>
<brthdd>19660101</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279K1F20</bcno>
<orddd>20210510</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1408910543</prcpno>
<execprcpuntqno>1508880888</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210525</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>42608</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35426951</pid>
<hngnm>김태환</hngnm>
<brthdd>19730101</brthdd>
<sex>1</sex>
<age>48</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279K60F0</bcno>
<orddd>20210525</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409057850</prcpno>
<execprcpuntqno>1509036861</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210525</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>01487</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>10857038</pid>
<hngnm>성우찬</hngnm>
<brthdd>19600101</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279K3PN0</bcno>
<orddd>20210524</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409171571</prcpno>
<execprcpuntqno>1509159223</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>00765</docuseqno>
<pay100ownbrate>20</pay100ownbrate>
<preicd10cd>C924</preicd10cd>
<preicd10hngnm>급성 전골수구성 백혈병 [PML]</preicd10hngnm>
<posticd10cd>C924</posticd10cd>
<posticd10hngnm>급성 전골수구성 백혈병 [PML]</posticd10hngnm>
<pid>31478501</pid>
<hngnm>김의환</hngnm>
<brthdd>19690101</brthdd>
<sex>1</sex>
<age>52</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279L0LH0</bcno>
<orddd>20210525</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409171102</prcpno>
<execprcpuntqno>1509158719</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>01037</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>36022721</pid>
<hngnm>최병래</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I279L1DJ0</bcno>
<orddd>20210521</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409208709</prcpno>
<execprcpuntqno>1509199627</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210615</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>73622</docuseqno>
<pay100ownbrate>40</pay100ownbrate>
<preicd10cd>Z358</preicd10cd>
<preicd10hngnm>기타 고위험 임신의 관리</preicd10hngnm>
<posticd10cd>Z358</posticd10cd>
<posticd10hngnm>기타 고위험 임신의 관리</posticd10hngnm>
<pid>33309203</pid>
<hngnm>위지선</hngnm>
<brthdd>19810101</brthdd>
<sex>2</sex>
<age>40</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O279G4130</bcno>
<orddd>20210521</orddd>
<prcpdd>20210521</prcpdd>
<prcpno>1407960314</prcpno>
<execprcpuntqno>1507852562</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210521</spcacptdt>
<lstreptdt>20210618</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4032152</clamacptno>
<docuseqno>51196</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D471</preicd10cd>
<preicd10hngnm>만성 골수증식 질환</preicd10hngnm>
<posticd10cd>D471</posticd10cd>
<posticd10hngnm>만성 골수증식 질환</posticd10hngnm>
<pid>35801364</pid>
<hngnm>후세인</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O277N3MS0</bcno>
<orddd>20210319</orddd>
<prcpdd>20210319</prcpdd>
<prcpno>1390193266</prcpno>
<execprcpuntqno>1488742106</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210319</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4032152</clamacptno>
<docuseqno>50885</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35714142</pid>
<hngnm>양순철</hngnm>
<brthdd>19580101</brthdd>
<sex>1</sex>
<age>63</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O277P0NB0</bcno>
<orddd>20210308</orddd>
<prcpdd>20210308</prcpdd>
<prcpno>1386769014</prcpno>
<execprcpuntqno>1485066915</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210322</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49345</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35840201</pid>
<hngnm>정세만</hngnm>
<brthdd>19540101</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278F4420</bcno>
<orddd>20210415</orddd>
<prcpdd>20210415</prcpdd>
<prcpno>1397868010</prcpno>
<execprcpuntqno>1496989835</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210415</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>45622</docuseqno>
<pay100ownbrate>0</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>32964105</pid>
<hngnm>이연우애기</hngnm>
<brthdd>19630101</brthdd>
<sex>1</sex>
<age>58</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278F59B0</bcno>
<orddd>20210415</orddd>
<prcpdd>20210415</prcpdd>
<prcpno>1397984827</prcpno>
<execprcpuntqno>1497114712</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210415</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49403</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D45</preicd10cd>
<preicd10hngnm>진성 적혈구 증가증</preicd10hngnm>
<posticd10cd>D45</posticd10cd>
<posticd10hngnm>진성 적혈구 증가증</posticd10hngnm>
<pid>35850986</pid>
<hngnm>김선홍</hngnm>
<brthdd>19610101</brthdd>
<sex>1</sex>
<age>60</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278G3AY0</bcno>
<orddd>20210416</orddd>
<prcpdd>20210416</prcpdd>
<prcpno>1398192873</prcpno>
<execprcpuntqno>1497337843</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210416</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49501</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>35867221</pid>
<hngnm>정순영</hngnm>
<brthdd>19720101</brthdd>
<sex>1</sex>
<age>49</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278G3ZV0</bcno>
<orddd>20210416</orddd>
<prcpdd>20210416</prcpdd>
<prcpno>1398251525</prcpno>
<execprcpuntqno>1497401778</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210416</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>46386</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>34116542</pid>
<hngnm>민혜성</hngnm>
<brthdd>19890101</brthdd>
<sex>1</sex>
<age>32</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278H0KM0</bcno>
<orddd>20210329</orddd>
<prcpdd>20210329</prcpdd>
<prcpno>1392859074</prcpno>
<execprcpuntqno>1491614567</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210419</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49375</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>35843684</pid>
<hngnm>홍순덕</hngnm>
<brthdd>19800101</brthdd>
<sex>2</sex>
<age>41</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278J6NN0</bcno>
<orddd>20210405</orddd>
<prcpdd>20210405</prcpdd>
<prcpno>1394854210</prcpno>
<execprcpuntqno>1493757685</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210420</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>46381</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>34113415</pid>
<hngnm>KIM MI SUN</hngnm>
<brthdd>19540101</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278N4L70</bcno>
<orddd>20210423</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1400306748</prcpno>
<execprcpuntqno>1499606308</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210423</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>41467</docuseqno>
<pay100ownbrate>10</pay100ownbrate>
<preicd10cd>G35</preicd10cd>
<preicd10hngnm>다발성 경화증</preicd10hngnm>
<posticd10cd>G35</posticd10cd>
<posticd10hngnm>다발성 경화증</posticd10hngnm>
<pid>12490263</pid>
<hngnm>김현우</hngnm>
<brthdd>19780101</brthdd>
<sex>2</sex>
<age>43</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278N4TI0</bcno>
<orddd>20210423</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1400362229</prcpno>
<execprcpuntqno>1499666885</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210423</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>-</docuseqno>
<pay100ownbrate>60</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>35814620</pid>
<hngnm>백미순</hngnm>
<brthdd>19650101</brthdd>
<sex>1</sex>
<age>56</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0GG0</bcno>
<orddd>20210423</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1400483509</prcpno>
<execprcpuntqno>1499800229</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210424</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>35814620</pid>
<hngnm>백미순</hngnm>
<brthdd>19650101</brthdd>
<sex>1</sex>
<age>56</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0GG0</bcno>
<orddd>20210423</orddd>
<prcpdd>20210423</prcpdd>
<prcpno>1400483509</prcpno>
<execprcpuntqno>1499800229</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210424</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>00668</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D462</preicd10cd>
<preicd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</preicd10hngnm>
<posticd10cd>D462</posticd10cd>
<posticd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</posticd10hngnm>
<pid>20159106</pid>
<hngnm>김태정</hngnm>
<brthdd>19570101</brthdd>
<sex>2</sex>
<age>64</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>I278Q36C0</bcno>
<orddd>20210422</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400516245</prcpno>
<execprcpuntqno>1499839057</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49170</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35780201</pid>
<hngnm>전순업</hngnm>
<brthdd>19570101</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0KD0</bcno>
<orddd>20210406</orddd>
<prcpdd>20210406</prcpdd>
<prcpno>1395323068</prcpno>
<execprcpuntqno>1494257617</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>42920</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>23362372</pid>
<hngnm>김연근</hngnm>
<brthdd>19560101</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0Q60</bcno>
<orddd>20210408</orddd>
<prcpdd>20210408</prcpdd>
<prcpno>1395979924</prcpno>
<execprcpuntqno>1494958907</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49072</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35756385</pid>
<hngnm>백여송</hngnm>
<brthdd>20010101</brthdd>
<sex>1</sex>
<age>20</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0RJ0</bcno>
<orddd>20210330</orddd>
<prcpdd>20210330</prcpdd>
<prcpno>1393317457</prcpno>
<execprcpuntqno>1492103444</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49218</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>35800772</pid>
<hngnm>김대한</hngnm>
<brthdd>19480101</brthdd>
<sex>2</sex>
<age>73</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0SA0</bcno>
<orddd>20210330</orddd>
<prcpdd>20210330</prcpdd>
<prcpno>1393345162</prcpno>
<execprcpuntqno>1492134073</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49509</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>35868980</pid>
<hngnm>이승호</hngnm>
<brthdd>19850101</brthdd>
<sex>1</sex>
<age>36</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278P0SV0</bcno>
<orddd>20210405</orddd>
<prcpdd>20210405</prcpdd>
<prcpno>1394870327</prcpno>
<execprcpuntqno>1493776232</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49714</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D462</preicd10cd>
<preicd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</preicd10hngnm>
<posticd10cd>D462</posticd10cd>
<posticd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</posticd10hngnm>
<pid>35929203</pid>
<hngnm>왕숙남</hngnm>
<brthdd>19610101</brthdd>
<sex>1</sex>
<age>60</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278R3IS0</bcno>
<orddd>20210426</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400838778</prcpno>
<execprcpuntqno>1500182940</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>46616</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>34366794</pid>
<hngnm>배경례</hngnm>
<brthdd>19820101</brthdd>
<sex>1</sex>
<age>39</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278R4KJ0</bcno>
<orddd>20210419</orddd>
<prcpdd>20210419</prcpdd>
<prcpno>1398988536</prcpno>
<execprcpuntqno>1498198184</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20210426</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>45594</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>32918594</pid>
<hngnm>김영삼</hngnm>
<brthdd>19790101</brthdd>
<sex>2</sex>
<age>42</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278R6IJ0</bcno>
<orddd>20210426</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400840702</prcpno>
<execprcpuntqno>1500184833</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>46727</docuseqno>
<pay100ownbrate>10</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>34519143</pid>
<hngnm>김영배</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278S0M00</bcno>
<orddd>20210421</orddd>
<prcpdd>20210421</prcpdd>
<prcpno>1399744755</prcpno>
<execprcpuntqno>1499003824</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>49315</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C931</preicd10cd>
<preicd10hngnm>만성 골수단핵구성 백혈병</preicd10hngnm>
<posticd10cd>C931</posticd10cd>
<posticd10hngnm>만성 골수단핵구성 백혈병</posticd10hngnm>
<pid>35831096</pid>
<hngnm>박광섭</hngnm>
<brthdd>19460101</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O278S5RR0</bcno>
<orddd>20210427</orddd>
<prcpdd>20210427</prcpdd>
<prcpno>1401359524</prcpno>
<execprcpuntqno>1500737574</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210622</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>01043</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>36057093</pid>
<hngnm>조승범</hngnm>
<brthdd>19980101</brthdd>
<sex>1</sex>
<age>23</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I279L1B30</bcno>
<orddd>20210524</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409208637</prcpno>
<execprcpuntqno>1509199552</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210623</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4050980</clamacptno>
<docuseqno>00790</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>31914601</pid>
<hngnm>홍인성</hngnm>
<brthdd>19860101</brthdd>
<sex>1</sex>
<age>35</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I279L1YP0</bcno>
<orddd>20210523</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409191038</prcpno>
<execprcpuntqno>1509180463</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210623</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>42769</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35489183</pid>
<hngnm>이방수</hngnm>
<brthdd>19800101</brthdd>
<sex>2</sex>
<age>41</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279L6CL0</bcno>
<orddd>20210526</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409503764</prcpno>
<execprcpuntqno>1509513063</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210623</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>43864</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>35935896</pid>
<hngnm>이성익</hngnm>
<brthdd>19850101</brthdd>
<sex>1</sex>
<age>36</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279M2TF0</bcno>
<orddd>20210527</orddd>
<prcpdd>20210527</prcpdd>
<prcpno>1409648038</prcpno>
<execprcpuntqno>1509667766</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210623</lstreptdt>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>39632</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>31321924</pid>
<hngnm>강안순</hngnm>
<brthdd>19650101</brthdd>
<sex>2</sex>
<age>56</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O279M39D0</bcno>
<orddd>20210527</orddd>
<prcpdd>20210527</prcpdd>
<prcpno>1409624548</prcpno>
<execprcpuntqno>1509642529</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210623</lstreptdt>
</worklist>
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
