const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const parser = require('fast-xml-parser');
const dbConfigMssql = require('../common/dbconfig.js');
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

var jsondata = `
<root>
<worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00772</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>30663233</pid>
<hngnm>패트릭 머피</hngnm>
<brthdd>19390101</brthdd>
<sex>2</sex>
<age>82</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006592</bcno>
<orddd>20210502</orddd>
<prcpdd>20210504</prcpdd>
<prcpno>1403450381</prcpno>
<execprcpuntqno>1502987266</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210506</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048060</clamacptno>
<docuseqno>05384</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C569</preicd10cd>
<preicd10hngnm>난소암, 상세불명 부위</preicd10hngnm>
<posticd10cd>C569</posticd10cd>
<posticd10hngnm>난소암, 상세불명 부위</posticd10hngnm>
<pid>35299714</pid>
<hngnm>YOO IL SIM</hngnm>
<brthdd>19700101</brthdd>
<sex>2</sex>
<age>51</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006627</bcno>
<orddd>20210506</orddd>
<prcpdd>20210506</prcpdd>
<prcpno>1403789351</prcpno>
<execprcpuntqno>1503353687</execprcpuntqno>
<spcnm>조직검체 uterus</spcnm>
<spccd>2</spccd>
<spcacptdt>20210506</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00706</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C719</preicd10cd>
<preicd10hngnm>상세불명의 뇌암</preicd10hngnm>
<posticd10cd>C719</posticd10cd>
<posticd10hngnm>상세불명의 뇌암</posticd10hngnm>
<pid>35855445</pid>
<hngnm>이금수</hngnm>
<brthdd>19900101</brthdd>
<sex>2</sex>
<age>31</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006676</bcno>
<orddd>20210428</orddd>
<prcpdd>20210428</prcpdd>
<prcpno>1404019183</prcpno>
<execprcpuntqno>1503601313</execprcpuntqno>
<spcnm>brain</spcnm>
<spccd>2</spccd>
<spcacptdt>20210507</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00390</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C186</preicd10cd>
<preicd10hngnm>하행결장암</preicd10hngnm>
<posticd10cd>C186</posticd10cd>
<posticd10hngnm>하행결장암</posticd10hngnm>
<pid>35946224</pid>
<hngnm>이남숙</hngnm>
<brthdd>19730101</brthdd>
<sex>2</sex>
<age>48</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006715</bcno>
<orddd>20210504</orddd>
<prcpdd>20210507</prcpdd>
<prcpno>1404048790</prcpno>
<execprcpuntqno>1503632749</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210507</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01459</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C1691</preicd10cd>
<preicd10hngnm>상세불명의 위암, 진행형</preicd10hngnm>
<posticd10cd>C1691</posticd10cd>
<posticd10hngnm>상세불명의 위암, 진행형</posticd10hngnm>
<pid>35960531</pid>
<hngnm>김명순</hngnm>
<brthdd>19810101</brthdd>
<sex>1</sex>
<age>40</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006781</bcno>
<orddd>20210501</orddd>
<prcpdd>20210510</prcpdd>
<prcpno>1404823714</prcpno>
<execprcpuntqno>1504469733</execprcpuntqno>
<spcnm>조직검체 stomach</spcnm>
<spccd>2</spccd>
<spcacptdt>20210510</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00046</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C182</preicd10cd>
<preicd10hngnm>상행결장암</preicd10hngnm>
<posticd10cd>C182</posticd10cd>
<posticd10hngnm>상행결장암</posticd10hngnm>
<pid>17350102</pid>
<hngnm>김재순</hngnm>
<brthdd>19430101</brthdd>
<sex>2</sex>
<age>78</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006839</bcno>
<orddd>20210510</orddd>
<prcpdd>20210510</prcpdd>
<prcpno>1404791541</prcpno>
<execprcpuntqno>1504435619</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00338</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C19</preicd10cd>
<preicd10hngnm>직장구불결장 이행부 암</preicd10hngnm>
<posticd10cd>C19</posticd10cd>
<posticd10hngnm>직장구불결장 이행부 암</posticd10hngnm>
<pid>35838232</pid>
<hngnm>박신자</hngnm>
<brthdd>19640101</brthdd>
<sex>2</sex>
<age>57</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006874</bcno>
<orddd>20210510</orddd>
<prcpdd>20210510</prcpdd>
<prcpno>1404907540</prcpno>
<execprcpuntqno>1504558720</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210511</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>47102</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>34957191</pid>
<hngnm>RUDIGER</hngnm>
<brthdd>19480101</brthdd>
<sex>2</sex>
<age>73</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006980</bcno>
<orddd>20210512</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405511886</prcpno>
<execprcpuntqno>1505203443</execprcpuntqno>
<spcnm>조직검체 liver</spcnm>
<spccd>2</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00107</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>27481861</pid>
<hngnm>장문선</hngnm>
<brthdd>19570101</brthdd>
<sex>2</sex>
<age>64</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007012</bcno>
<orddd>20210512</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405587424</prcpno>
<execprcpuntqno>1505288597</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210602</lstreptdt>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00880</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>7076243</pid>
<hngnm>고태욱</hngnm>
<brthdd>19390101</brthdd>
<sex>1</sex>
<age>82</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007013</bcno>
<orddd>20210509</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405678408</prcpno>
<execprcpuntqno>1505386019</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00808</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>17386007</pid>
<hngnm>허기만</hngnm>
<brthdd>19770101</brthdd>
<sex>1</sex>
<age>44</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007014</bcno>
<orddd>20210509</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405677812</prcpno>
<execprcpuntqno>1505385408</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00359</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C180</preicd10cd>
<preicd10hngnm>맹장암</preicd10hngnm>
<posticd10cd>C180</posticd10cd>
<posticd10hngnm>맹장암</posticd10hngnm>
<pid>35888740</pid>
<hngnm>김성용</hngnm>
<brthdd>19700101</brthdd>
<sex>1</sex>
<age>51</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007015</bcno>
<orddd>20210512</orddd>
<prcpdd>20210512</prcpdd>
<prcpno>1405519164</prcpno>
<execprcpuntqno>1505211242</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210602</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039687</clamacptno>
<docuseqno>00001</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C795</preicd10cd>
<preicd10hngnm>골 및 골수의 이차성 악성 신생물</preicd10hngnm>
<posticd10cd>C795</posticd10cd>
<posticd10hngnm>골 및 골수의 이차성 악성 신생물</posticd10hngnm>
<pid>33938112</pid>
<hngnm>안연갑</hngnm>
<brthdd>19620101</brthdd>
<sex>1</sex>
<age>59</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006166</bcno>
<orddd>20210414</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400848985</prcpno>
<execprcpuntqno>1500193683</execprcpuntqno>
<spcnm>Other</spcnm>
<spccd>2</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4034598</clamacptno>
<docuseqno>00328</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35803340</pid>
<hngnm>서승호</hngnm>
<brthdd>19640101</brthdd>
<sex>1</sex>
<age>57</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006206</bcno>
<orddd>20210425</orddd>
<prcpdd>20210426</prcpdd>
<prcpno>1400830026</prcpno>
<execprcpuntqno>1500173536</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>51585</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C679</preicd10cd>
<preicd10hngnm>상세불명의 방광암</preicd10hngnm>
<posticd10cd>C679</posticd10cd>
<posticd10hngnm>상세불명의 방광암</posticd10hngnm>
<pid>29061244</pid>
<hngnm>강윤숙</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006211</bcno>
<orddd>20210427</orddd>
<prcpdd>20210427</prcpdd>
<prcpno>1401168168</prcpno>
<execprcpuntqno>1500534839</execprcpuntqno>
<spcnm>조직검체 urinary bladder</spcnm>
<spccd>2</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>53998</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>5548882</pid>
<hngnm>김현우</hngnm>
<brthdd>19570101</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006212</bcno>
<orddd>20210427</orddd>
<prcpdd>20210427</prcpdd>
<prcpno>1401162555</prcpno>
<execprcpuntqno>1500529011</execprcpuntqno>
<spcnm>조직검체 prostate</spcnm>
<spccd>2</spccd>
<spcacptdt>20210427</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01368</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>35905781</pid>
<hngnm>신기문</hngnm>
<brthdd>19870101</brthdd>
<sex>1</sex>
<age>34</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006251</bcno>
<orddd>20210422</orddd>
<prcpdd>20210427</prcpdd>
<prcpno>1401347505</prcpno>
<execprcpuntqno>1500724507</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210428</spcacptdt>
<lstreptdt>20210607</lstreptdt>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate/>
<preicd10cd>C719</preicd10cd>
<preicd10hngnm>상세불명의 뇌암</preicd10hngnm>
<posticd10cd>C719</posticd10cd>
<posticd10hngnm>상세불명의 뇌암</posticd10hngnm>
<pid>18501293</pid>
<hngnm>신승림</hngnm>
<brthdd>19680101</brthdd>
<sex>1</sex>
<age>53</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006267</bcno>
<orddd>20210421</orddd>
<prcpdd>20210427</prcpdd>
<prcpno>1401208844</prcpno>
<execprcpuntqno>1500577937</execprcpuntqno>
<spcnm>Other</spcnm>
<spccd>2</spccd>
<spcacptdt>20210428</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4039336</clamacptno>
<docuseqno>53873</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C649</preicd10cd>
<preicd10hngnm>신장암, 상세불명 부위</preicd10hngnm>
<posticd10cd>C649</posticd10cd>
<posticd10hngnm>신장암, 상세불명 부위</posticd10hngnm>
<pid>35859094</pid>
<hngnm>송은영</hngnm>
<brthdd>19760101</brthdd>
<sex>1</sex>
<age>45</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006320</bcno>
<orddd>20210428</orddd>
<prcpdd>20210428</prcpdd>
<prcpno>1401665004</prcpno>
<execprcpuntqno>1501061784</execprcpuntqno>
<spcnm>조직검체 kidney</spcnm>
<spccd>2</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00291</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35706923</pid>
<hngnm>한은숙</hngnm>
<brthdd>19580101</brthdd>
<sex>1</sex>
<age>63</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006343</bcno>
<orddd>20210428</orddd>
<prcpdd>20210429</prcpdd>
<prcpno>1401782612</prcpno>
<execprcpuntqno>1501189917</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00794</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>35762373</pid>
<hngnm>김현경</hngnm>
<brthdd>19490101</brthdd>
<sex>2</sex>
<age>72</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006349</bcno>
<orddd>20210418</orddd>
<prcpdd>20210429</prcpdd>
<prcpno>1401963275</prcpno>
<execprcpuntqno>1501381841</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00800</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>35919622</pid>
<hngnm>문용기</hngnm>
<brthdd>19660101</brthdd>
<sex>1</sex>
<age>55</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006351</bcno>
<orddd>20210427</orddd>
<prcpdd>20210429</prcpdd>
<prcpno>1401965026</prcpno>
<execprcpuntqno>1501382816</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210429</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01077</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C187</preicd10cd>
<preicd10hngnm>구불결장암</preicd10hngnm>
<posticd10cd>C187</posticd10cd>
<posticd10hngnm>구불결장암</posticd10hngnm>
<pid>27695413</pid>
<hngnm>김훈</hngnm>
<brthdd>19430101</brthdd>
<sex>1</sex>
<age>78</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006390</bcno>
<orddd>20210421</orddd>
<prcpdd>20210430</prcpdd>
<prcpno>1402300085</prcpno>
<execprcpuntqno>1501744967</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210430</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01253</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C259</preicd10cd>
<preicd10hngnm>상세불명의 췌장암</preicd10hngnm>
<posticd10cd>C259</posticd10cd>
<posticd10hngnm>상세불명의 췌장암</posticd10hngnm>
<pid>35159375</pid>
<hngnm>오관호</hngnm>
<brthdd>19580101</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006427</bcno>
<orddd>20210429</orddd>
<prcpdd>20210501</prcpdd>
<prcpno>1402555227</prcpno>
<execprcpuntqno>1502027100</execprcpuntqno>
<spcnm>조직검체 pancreas</spcnm>
<spccd>2</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042557</clamacptno>
<docuseqno>00070</docuseqno>
<pay100ownbrate>0</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35907891</pid>
<hngnm>정재원</hngnm>
<brthdd>19700101</brthdd>
<sex>1</sex>
<age>51</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006431</bcno>
<orddd>20210430</orddd>
<prcpdd>20210501</prcpdd>
<prcpno>1402546471</prcpno>
<execprcpuntqno>1502017588</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037802</clamacptno>
<docuseqno>00568</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C795</preicd10cd>
<preicd10hngnm>골 및 골수의 이차성 악성 신생물</preicd10hngnm>
<posticd10cd>C795</posticd10cd>
<posticd10hngnm>골 및 골수의 이차성 악성 신생물</posticd10hngnm>
<pid>35881093</pid>
<hngnm>이현정</hngnm>
<brthdd>19450101</brthdd>
<sex>1</sex>
<age>76</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006434</bcno>
<orddd>20210418</orddd>
<prcpdd>20210503</prcpdd>
<prcpno>1402814655</prcpno>
<execprcpuntqno>1502305190</execprcpuntqno>
<spcnm>조직검체 bone</spcnm>
<spccd>2</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01263</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C499</preicd10cd>
<preicd10hngnm>상세불명의 결합 및 연조직의 악성신생물</preicd10hngnm>
<posticd10cd>C499</posticd10cd>
<posticd10hngnm>상세불명의 결합 및 연조직의 악성신생물</posticd10hngnm>
<pid>35299863</pid>
<hngnm>김현수</hngnm>
<brthdd>19660101</brthdd>
<sex>1</sex>
<age>55</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006456</bcno>
<orddd>20210430</orddd>
<prcpdd>20210503</prcpdd>
<prcpno>1402905150</prcpno>
<execprcpuntqno>1502401183</execprcpuntqno>
<spcnm>조직검체 muscle</spcnm>
<spccd>2</spccd>
<spcacptdt>20210503</spcacptdt>
<lstreptdt>20210607</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>44491</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C7809</preicd10cd>
<preicd10hngnm>폐전이, 상세불명 부위</preicd10hngnm>
<posticd10cd>C7809</posticd10cd>
<posticd10hngnm>폐전이, 상세불명 부위</posticd10hngnm>
<pid>10058238</pid>
<hngnm>이재준</hngnm>
<brthdd>19410101</brthdd>
<sex>2</sex>
<age>80</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21006932</bcno>
<orddd>20210511</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405265852</prcpno>
<execprcpuntqno>1504941918</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210512</spcacptdt>
<lstreptdt>20210608</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4037754</clamacptno>
<docuseqno>01123</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C492</preicd10cd>
<preicd10hngnm>엉덩이를 포함한 하지의 결합 및 연조직의 악성신생물</preicd10hngnm>
<posticd10cd>C492</posticd10cd>
<posticd10hngnm>엉덩이를 포함한 하지의 결합 및 연조직의 악성신생물</posticd10hngnm>
<pid>30958441</pid>
<hngnm>신지선</hngnm>
<brthdd>19920101</brthdd>
<sex>1</sex>
<age>29</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007017</bcno>
<orddd>20210508</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405760205</prcpno>
<execprcpuntqno>1505474620</execprcpuntqno>
<spcnm>조직검체 muscle</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210608</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>48026</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>5803161</pid>
<hngnm>홍성녀</hngnm>
<brthdd>19410101</brthdd>
<sex>2</sex>
<age>80</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007076</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405905620</prcpno>
<execprcpuntqno>1505629686</execprcpuntqno>
<spcnm>조직검체 bronchus</spcnm>
<spccd>2</spccd>
<spcacptdt>20210513</spcacptdt>
<lstreptdt>20210608</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048060</clamacptno>
<docuseqno>04558</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C569</preicd10cd>
<preicd10hngnm>난소암, 상세불명 부위</preicd10hngnm>
<posticd10cd>C569</posticd10cd>
<posticd10hngnm>난소암, 상세불명 부위</posticd10hngnm>
<pid>33843151</pid>
<hngnm>조규성</hngnm>
<brthdd>19620101</brthdd>
<sex>2</sex>
<age>59</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007113</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405986109</prcpno>
<execprcpuntqno>1505717299</execprcpuntqno>
<spcnm>조직검체 ovary</spcnm>
<spccd>2</spccd>
<spcacptdt>20210514</spcacptdt>
<lstreptdt>20210608</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048060</clamacptno>
<docuseqno>10604</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C491</preicd10cd>
<preicd10hngnm>어깨를 포함한 팔의 결합 및 연조직의 악성신생물</preicd10hngnm>
<posticd10cd>C491</posticd10cd>
<posticd10hngnm>어깨를 포함한 팔의 결합 및 연조직의 악성신생물</posticd10hngnm>
<pid>35625113</pid>
<hngnm>김인숙</hngnm>
<brthdd>20210101</brthdd>
<sex>2</sex>
<age>0</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007116</bcno>
<orddd>20210514</orddd>
<prcpdd>20210514</prcpdd>
<prcpno>1406228290</prcpno>
<execprcpuntqno>1505979976</execprcpuntqno>
<spcnm>조직검체 muscle</spcnm>
<spccd>2</spccd>
<spcacptdt>20210514</spcacptdt>
<lstreptdt>20210616</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00821</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>26405193</pid>
<hngnm>정도순</hngnm>
<brthdd>19490101</brthdd>
<sex>2</sex>
<age>72</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007149</bcno>
<orddd>20210425</orddd>
<prcpdd>20210514</prcpdd>
<prcpno>1406433601</prcpno>
<execprcpuntqno>1506210406</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210616</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00857</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>35894233</pid>
<hngnm>김성현</hngnm>
<brthdd>19490101</brthdd>
<sex>2</sex>
<age>72</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007150</bcno>
<orddd>20210504</orddd>
<prcpdd>20210515</prcpdd>
<prcpno>1406504601</prcpno>
<execprcpuntqno>1506287583</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210616</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00384</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35975022</pid>
<hngnm>정승운</hngnm>
<brthdd>19530101</brthdd>
<sex>2</sex>
<age>68</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007275</bcno>
<orddd>20210514</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407133705</prcpno>
<execprcpuntqno>1506961564</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210616</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>45097</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>197630</pid>
<hngnm>이수곤</hngnm>
<brthdd>19440101</brthdd>
<sex>2</sex>
<age>77</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007162</bcno>
<orddd>20210514</orddd>
<prcpdd>20210514</prcpdd>
<prcpno>1406180281</prcpno>
<execprcpuntqno>1505928560</execprcpuntqno>
<spcnm>조직검체 lymph node</spcnm>
<spccd>2</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210617</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00674</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C719</preicd10cd>
<preicd10hngnm>상세불명의 뇌암</preicd10hngnm>
<posticd10cd>C719</posticd10cd>
<posticd10hngnm>상세불명의 뇌암</posticd10hngnm>
<pid>27059503</pid>
<hngnm>김봉곤</hngnm>
<brthdd>19410101</brthdd>
<sex>2</sex>
<age>80</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007227</bcno>
<orddd>20210510</orddd>
<prcpdd>20210510</prcpdd>
<prcpno>1407003150</prcpno>
<execprcpuntqno>1506822476</execprcpuntqno>
<spcnm>brain</spcnm>
<spccd>2</spccd>
<spcacptdt>20210517</spcacptdt>
<lstreptdt>20210617</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00084</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C182</preicd10cd>
<preicd10hngnm>상행결장암</preicd10hngnm>
<posticd10cd>C182</posticd10cd>
<posticd10hngnm>상행결장암</posticd10hngnm>
<pid>23431690</pid>
<hngnm>오세희</hngnm>
<brthdd>19550101</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007234</bcno>
<orddd>20210517</orddd>
<prcpdd>20210517</prcpdd>
<prcpno>1406875607</prcpno>
<execprcpuntqno>1506685469</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210618</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00818</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>25596205</pid>
<hngnm>현성호</hngnm>
<brthdd>19530101</brthdd>
<sex>2</sex>
<age>68</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007235</bcno>
<orddd>20210509</orddd>
<prcpdd>20210517</prcpdd>
<prcpno>1406773873</prcpno>
<execprcpuntqno>1506575612</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210618</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>47725</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C1691</preicd10cd>
<preicd10hngnm>상세불명의 위암, 진행형</preicd10hngnm>
<posticd10cd>C1691</posticd10cd>
<posticd10hngnm>상세불명의 위암, 진행형</posticd10hngnm>
<pid>35750211</pid>
<hngnm>이상은</hngnm>
<brthdd>19620101</brthdd>
<sex>1</sex>
<age>59</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007257</bcno>
<orddd>20210511</orddd>
<prcpdd>20210511</prcpdd>
<prcpno>1405160605</prcpno>
<execprcpuntqno>1504830207</execprcpuntqno>
<spcnm>조직검체 stomach</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210618</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>46871</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>34514281</pid>
<hngnm>이종철</hngnm>
<brthdd>19650101</brthdd>
<sex>2</sex>
<age>56</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007273</bcno>
<orddd>20210513</orddd>
<prcpdd>20210513</prcpdd>
<prcpno>1405882703</prcpno>
<execprcpuntqno>1505604467</execprcpuntqno>
<spcnm>조직검체 skin</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210618</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00805</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>13795743</pid>
<hngnm>이미경</hngnm>
<brthdd>19560101</brthdd>
<sex>2</sex>
<age>65</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007285</bcno>
<orddd>20210516</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407364720</prcpno>
<execprcpuntqno>1507211453</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210618</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00321</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35842670</pid>
<hngnm>김효원</hngnm>
<brthdd>19450101</brthdd>
<sex>1</sex>
<age>76</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007336</bcno>
<orddd>20210519</orddd>
<prcpdd>20210520</prcpdd>
<prcpno>1407582754</prcpno>
<execprcpuntqno>1507446942</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210520</spcacptdt>
<lstreptdt>20210619</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00349</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C773</preicd10cd>
<preicd10hngnm>겨드랑 및 팔 림프절의 이차성 및 상세불명의 악성신생물</preicd10hngnm>
<posticd10cd>C773</posticd10cd>
<posticd10hngnm>겨드랑 및 팔 림프절의 이차성 및 상세불명의 악성신생물</posticd10hngnm>
<pid>35916756</pid>
<hngnm>김영춘</hngnm>
<brthdd>19640101</brthdd>
<sex>2</sex>
<age>57</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007372</bcno>
<orddd>20210515</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407377530</prcpno>
<execprcpuntqno>1507225448</execprcpuntqno>
<spcnm>조직검체 breast</spcnm>
<spccd>2</spccd>
<spcacptdt>20210520</spcacptdt>
<lstreptdt>20210619</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01072</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C221</preicd10cd>
<preicd10hngnm>간내 담관암종</preicd10hngnm>
<posticd10cd>C221</posticd10cd>
<posticd10hngnm>간내 담관암종</posticd10hngnm>
<pid>15882211</pid>
<hngnm>나세형</hngnm>
<brthdd>19500101</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007402</bcno>
<orddd>20210519</orddd>
<prcpdd>20210520</prcpdd>
<prcpno>1407598582</prcpno>
<execprcpuntqno>1507463524</execprcpuntqno>
<spcnm>조직검체 liver</spcnm>
<spccd>2</spccd>
<spcacptdt>20210521</spcacptdt>
<lstreptdt>20210619</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00290</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35640405</pid>
<hngnm>위승우</hngnm>
<brthdd>19810101</brthdd>
<sex>1</sex>
<age>40</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007446</bcno>
<orddd>20210518</orddd>
<prcpdd>20210520</prcpdd>
<prcpno>1407768098</prcpno>
<execprcpuntqno>1507644941</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210521</spcacptdt>
<lstreptdt>20210619</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>48049</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>6358926</pid>
<hngnm>이정아</hngnm>
<brthdd>19650101</brthdd>
<sex>2</sex>
<age>56</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007274</bcno>
<orddd>20210518</orddd>
<prcpdd>20210518</prcpdd>
<prcpno>1407184424</prcpno>
<execprcpuntqno>1507015382</execprcpuntqno>
<spcnm>조직검체 liver</spcnm>
<spccd>2</spccd>
<spcacptdt>20210518</spcacptdt>
<lstreptdt>20210622</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01215</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C089</preicd10cd>
<preicd10hngnm>주침샘암</preicd10hngnm>
<posticd10cd>C089</posticd10cd>
<posticd10hngnm>주침샘암</posticd10hngnm>
<pid>31923023</pid>
<hngnm>박옥순</hngnm>
<brthdd>19590101</brthdd>
<sex>1</sex>
<age>62</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007772</bcno>
<orddd>20210525</orddd>
<prcpdd>20210528</prcpdd>
<prcpno>1409902073</prcpno>
<execprcpuntqno>1509941310</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210528</spcacptdt>
<lstreptdt>20210625</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4051016</clamacptno>
<docuseqno>00867</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C459</preicd10cd>
<preicd10hngnm>상세불명의 중피종</preicd10hngnm>
<posticd10cd>C459</posticd10cd>
<posticd10hngnm>상세불명의 중피종</posticd10hngnm>
<pid>35793502</pid>
<hngnm>이규민</hngnm>
<brthdd>19550101</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007473</bcno>
<orddd>20210519</orddd>
<prcpdd>20210521</prcpdd>
<prcpno>1408243115</prcpno>
<execprcpuntqno>1508161874</execprcpuntqno>
<spcnm>조직검체 pleura</spcnm>
<spccd>2</spccd>
<spcacptdt>20210524</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00804</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>12702777</pid>
<hngnm>변지현</hngnm>
<brthdd>19620101</brthdd>
<sex>1</sex>
<age>59</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007514</bcno>
<orddd>20210516</orddd>
<prcpdd>20210524</prcpdd>
<prcpno>1408709595</prcpno>
<execprcpuntqno>1508665146</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210524</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00319</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C20</preicd10cd>
<preicd10hngnm>직장암</preicd10hngnm>
<posticd10cd>C20</posticd10cd>
<posticd10hngnm>직장암</posticd10hngnm>
<pid>35831013</pid>
<hngnm>강명선</hngnm>
<brthdd>19490101</brthdd>
<sex>1</sex>
<age>72</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007540</bcno>
<orddd>20210523</orddd>
<prcpdd>20210524</prcpdd>
<prcpno>1408518099</prcpno>
<execprcpuntqno>1508462762</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210525</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046109</clamacptno>
<docuseqno>00750</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>33026983</pid>
<hngnm>정광수</hngnm>
<brthdd>19370101</brthdd>
<sex>2</sex>
<age>84</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007617</bcno>
<orddd>20210517</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409183976</prcpno>
<execprcpuntqno>1509172806</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042663</clamacptno>
<docuseqno>01446</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C779</preicd10cd>
<preicd10hngnm>상세불명의 림프절의 이차성 및 상세불명의 악성신생물</preicd10hngnm>
<posticd10cd>C779</posticd10cd>
<posticd10hngnm>상세불명의 림프절의 이차성 및 상세불명의 악성신생물</posticd10hngnm>
<pid>35909466</pid>
<hngnm>이진섭</hngnm>
<brthdd>19580101</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007618</bcno>
<orddd>20210519</orddd>
<prcpdd>20210526</prcpdd>
<prcpno>1409265214</prcpno>
<execprcpuntqno>1509258454</execprcpuntqno>
<spcnm>조직검체 lymph node</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>47412</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C659</preicd10cd>
<preicd10hngnm>신우의 악성 신생물, 상세불명 쪽</preicd10hngnm>
<posticd10cd>C659</posticd10cd>
<posticd10hngnm>신우의 악성 신생물, 상세불명 쪽</posticd10hngnm>
<pid>35379791</pid>
<hngnm>송정은</hngnm>
<brthdd>19520101</brthdd>
<sex>1</sex>
<age>69</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007619</bcno>
<orddd>20210525</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1408974734</prcpno>
<execprcpuntqno>1508948282</execprcpuntqno>
<spcnm>조직검체 kidney</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>47634</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C669</preicd10cd>
<preicd10hngnm>요관의 악성 신생물, 상세불명 쪽</preicd10hngnm>
<posticd10cd>C669</posticd10cd>
<posticd10hngnm>요관의 악성 신생물, 상세불명 쪽</posticd10hngnm>
<pid>35642864</pid>
<hngnm>한신</hngnm>
<brthdd>19480101</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007620</bcno>
<orddd>20210525</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409145828</prcpno>
<execprcpuntqno>1509129739</execprcpuntqno>
<spcnm>조직검체 kidney</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00861</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>35929892</pid>
<hngnm>박종익</hngnm>
<brthdd>19470101</brthdd>
<sex>2</sex>
<age>74</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>ZM20008257</bcno>
<orddd>20210522</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409183890</prcpno>
<execprcpuntqno>1509172717</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00328</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C187</preicd10cd>
<preicd10hngnm>구불결장암</preicd10hngnm>
<posticd10cd>C187</posticd10cd>
<posticd10hngnm>구불결장암</posticd10hngnm>
<pid>35857851</pid>
<hngnm>박은한</hngnm>
<brthdd>19480101</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007656</bcno>
<orddd>20210523</orddd>
<prcpdd>20210524</prcpdd>
<prcpno>1408549374</prcpno>
<execprcpuntqno>1508495144</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4042640</clamacptno>
<docuseqno>00854</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C459</preicd10cd>
<preicd10hngnm>상세불명의 중피종</preicd10hngnm>
<posticd10cd>C459</posticd10cd>
<posticd10hngnm>상세불명의 중피종</posticd10hngnm>
<pid>35786751</pid>
<hngnm>이희진</hngnm>
<brthdd>19580101</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007657</bcno>
<orddd>20210518</orddd>
<prcpdd>20210520</prcpdd>
<prcpno>1407768716</prcpno>
<execprcpuntqno>1507645571</execprcpuntqno>
<spcnm>조직검체 pleura</spcnm>
<spccd>2</spccd>
<spcacptdt>20210526</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046109</clamacptno>
<docuseqno>00717</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>11695490</pid>
<hngnm>류효성아기</hngnm>
<brthdd>19570101</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M20008516</bcno>
<orddd>20210523</orddd>
<prcpdd>20210525</prcpdd>
<prcpno>1409183754</prcpno>
<execprcpuntqno>1509172568</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4046106</clamacptno>
<docuseqno>01424</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C189</preicd10cd>
<preicd10hngnm>상세불명의 결장암</preicd10hngnm>
<posticd10cd>C189</posticd10cd>
<posticd10hngnm>상세불명의 결장암</posticd10hngnm>
<pid>35995034</pid>
<hngnm>김인자</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007708</bcno>
<orddd>20210520</orddd>
<prcpdd>20210527</prcpdd>
<prcpno>1409615289</prcpno>
<execprcpuntqno>1509632795</execprcpuntqno>
<spcnm>조직검체 colon</spcnm>
<spccd>2</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
<monogenicyn>y</monogenicyn>
<monogenicdd>20231110</monogenicdd>
<monogenicnm>test</monogenicnm>
</worklist>
<worklist>
<gbn>P</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4048135</clamacptno>
<docuseqno>44829</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>15670238</pid>
<hngnm>정해영</hngnm>
<brthdd>19600101</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>PMO12072</testcd>
<testnm>NGS 고형암 검사</testnm>
<bcno>M21007738</bcno>
<orddd>20210527</orddd>
<prcpdd>20210527</prcpdd>
<prcpno>1409681638</prcpno>
<execprcpuntqno>1509703179</execprcpuntqno>
<spcnm>조직검체 lung</spcnm>
<spccd>2</spccd>
<spcacptdt>20210527</spcacptdt>
<lstreptdt>20210630</lstreptdt>
<stage>340</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicnm/>
</worklist>
<resultKM error="no" type="status" clear="true" description="info||정상 처리되었습니다." updateinstance="true" source="1635582105857"/>
</worklist>
</root>  
`;

const  messageHandler_path = async (pathology_num, orddd, prcpdd) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[patientinfo_path]select pathology_num=" + pathology_num + "," + orddd +  ", " + prcpdd);

    const sql =`select  '` +  prcpdd +  `' prcpdd
                    , '` + orddd + `' orddd 
                    , isnull(pathology_num, '') pathology_num
                    , isnull(rel_pathology_num, '') rel_pathology_num
                    , isnull(organ, '') organ
                    , isnull(pathological_dx, '') pathological_dx
                    , isnull(tumor_type, '') tumor_type
                from [dbo].[patientinfo_path] 
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

const patientHandler = async(patients, res) => {

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

        logger.info("[1944][report_xml_path]patients[i].testcd2=" + patients[i].testcd2);

        patients[i].pv = 'Y';
        
        let orddd = patients[i].orddd;
        
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
                    patients[i].vus = 'Y';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene[j].gene ;
                }
                else if (patient_gene[j].report_gb === 'C') {            
                    patients[i].pv = 'Y';
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene[j].gene;
                }

                // 23.11.30
                if (patient_gene[j].tier === 'I') {
                    duptier.push ('I');
                } else if (patient_gene[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene[j].tier === 'III') {
                    duptier.push ( 'III');
                } 
            }
        }

        if (patient_gene_amp.length !== 0 )
        {
            for (var j = 0;  j < patient_gene_amp.length; j ++)
            {
                if (patient_gene_amp[j].report_gb === 'P') {  
                    patients[i].vus = 'Y';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene_amp[j].gene ;
                }
                else if (patient_gene_amp[j].report_gb === 'C') {    
                    patients[i].pv = 'Y';                                
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene_amp[j].gene;
                }
                
                // 23.11.30
                if (patient_gene_amp[j].tier === 'I') {
                    duptier.push ('I');
                } else if (patient_gene_amp[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene_amp[j].tier === 'III') {
                    duptier.push ( 'III');
                } 
            }
        }

        if (patient_gene_fus.length !== 0 )
        {
            for (var j = 0;  j < patient_gene_fus.length; j ++)
            {
                if (patient_gene_fus[j].report_gb === 'P') {  
                    patients[i].vus = 'Y';
                    patients[i].vus_gene = patients[i].vus_gene + " " + patient_gene_fus[j].gene ;
                }
                else if (patient_gene_fus[j].report_gb === 'C') {  
                    patients[i].pv = 'Y';                                  
                    patients[i].pv_gene = patients[i].pv_gene + " " + patient_gene_fus[j].gene;
                }

                // 23.11.30
                if (patient_gene_fus[j].tier === 'I') {
                    duptier.push ('I');
                } else if (patient_gene_fus[j].tier === 'II') {
                    duptier.push ('II');
                } else if (patient_gene_fus[j].tier === 'III') {
                    duptier.push ( 'III');
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

    let jsonObj = parser.parse(jsondata, options)  ;
    var patientJson = JSON.stringify(jsonObj); 
    console.log('[114][patient_nu]json=' ,  patientJson);

    let patientObj = JSON.parse(patientJson);

    console.log(patientObj.root.worklist.worklist);

    let patients = patientObj.root.worklist.worklist;

    let patient = patientHandler(patients, res);

    //res.json(patient);
}
