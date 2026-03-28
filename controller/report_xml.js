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
<clamacptno>4100747</clamacptno>
<docuseqno>33249</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>33322475</pid>
<hngnm>서동수</hngnm>
<brthdd>19691022</brthdd>
<sex>1</sex>
<age>56</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K16910</bcno>
<orddd>20250929</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929435479</prcpno>
<execprcpuntqno>2065293011</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37559</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41302664</pid>
<hngnm>변금옥</hngnm>
<brthdd>19611125</brthdd>
<sex>2</sex>
<age>64</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K16N00</bcno>
<orddd>20250924</orddd>
<prcpdd>20250924</prcpdd>
<prcpno>1927778243</prcpno>
<execprcpuntqno>2063527155</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>33012</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>32244694</pid>
<hngnm>윤준심</hngnm>
<brthdd>19631023</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K16NZ0</bcno>
<orddd>20250929</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929394332</prcpno>
<execprcpuntqno>2065249772</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>30889</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>14317178</pid>
<hngnm>박한수</hngnm>
<brthdd>19630409</brthdd>
<sex>1</sex>
<age>62</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K16RQ0</bcno>
<orddd>20250925</orddd>
<prcpdd>20250925</prcpdd>
<prcpno>1928461643</prcpno>
<execprcpuntqno>2064249463</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37882</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41419943</pid>
<hngnm>조영우</hngnm>
<brthdd>19421016</brthdd>
<sex>1</sex>
<age>83</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K16SM0</bcno>
<orddd>20250926</orddd>
<prcpdd>20250926</prcpdd>
<prcpno>1928935749</prcpno>
<execprcpuntqno>2064758286</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4094109</clamacptno>
<docuseqno>01148</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41356843</pid>
<hngnm>김지한</hngnm>
<brthdd>19850114</brthdd>
<sex>1</sex>
<age>41</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28KC2550</bcno>
<orddd>20251008</orddd>
<prcpdd>20251013</prcpdd>
<prcpno>1933494108</prcpno>
<execprcpuntqno>2069643040</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251013</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37538</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41293565</pid>
<hngnm>권종식</hngnm>
<brthdd>19600522</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K96EB0</bcno>
<orddd>20250926</orddd>
<prcpdd>20250926</prcpdd>
<prcpno>1928976707</prcpno>
<execprcpuntqno>2064802084</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251013</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100344</clamacptno>
<docuseqno>01338</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>38808373</pid>
<hngnm>유정숙</hngnm>
<brthdd>19641020</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28K96HW0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1929934813</prcpno>
<execprcpuntqno>2065818901</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251013</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37879</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41418964</pid>
<hngnm>하연옥</hngnm>
<brthdd>19580418</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KC8KY0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930054578</prcpno>
<execprcpuntqno>2065944231</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251014</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>35783</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>39641376</pid>
<hngnm>최희환</hngnm>
<brthdd>19470905</brthdd>
<sex>1</sex>
<age>78</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KC8TX0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930040375</prcpno>
<execprcpuntqno>2065929563</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251014</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>00781</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>39578693</pid>
<hngnm>김미숙</hngnm>
<brthdd>19611221</brthdd>
<sex>2</sex>
<age>64</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28KE06B0</bcno>
<orddd>20251014</orddd>
<prcpdd>20251015</prcpdd>
<prcpno>1934613854</prcpno>
<execprcpuntqno>2070817364</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251015</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>01025</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D728</preicd10cd>
<preicd10hngnm>기타 명시된 백혈구의 장애</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41468124</pid>
<hngnm>이병도</hngnm>
<brthdd>19440115</brthdd>
<sex>1</sex>
<age>81</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28KG0BM0</bcno>
<orddd>20251014</orddd>
<prcpdd>20251015</prcpdd>
<prcpno>1934987067</prcpno>
<execprcpuntqno>2071209634</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251017</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4094109</clamacptno>
<docuseqno>00611</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>17664857</pid>
<hngnm>권영관</hngnm>
<brthdd>19470109</brthdd>
<sex>1</sex>
<age>79</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28KG1M00</bcno>
<orddd>20251016</orddd>
<prcpdd>20251017</prcpdd>
<prcpno>1935576543</prcpno>
<execprcpuntqno>2071835926</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251017</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>33425</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>33985825</pid>
<hngnm>양은주</hngnm>
<brthdd>19630411</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KF6WY0</bcno>
<orddd>20250929</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929511311</prcpno>
<execprcpuntqno>2065372279</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251017</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>25426</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E118</preicd10cd>
<preicd10hngnm>2형 당뇨병, 상세불명의 합병증을 동반한</preicd10hngnm>
<posticd10cd>E118</posticd10cd>
<posticd10hngnm>2형 당뇨병, 상세불명의 합병증을 동반한</posticd10hngnm>
<pid>41470843</pid>
<hngnm>송민</hngnm>
<brthdd>20000401</brthdd>
<sex>2</sex>
<age>25</age>
<testcd>LPE540</testcd>
<testnm>유전성 당뇨 [NGS]</testnm>
<bcno>O28KL2HE0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937369790</prcpno>
<execprcpuntqno>2073741841</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251022</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100747</clamacptno>
<docuseqno>12108</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I4228</preicd10cd>
<preicd10hngnm>기타 비대성 심근병증</preicd10hngnm>
<posticd10cd>I4228</posticd10cd>
<posticd10hngnm>기타 비대성 심근병증</posticd10hngnm>
<pid>37269545</pid>
<hngnm>박병목</hngnm>
<brthdd>19670905</brthdd>
<sex>1</sex>
<age>58</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28KL6D70</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937649902</prcpno>
<execprcpuntqno>2074037782</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251022</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>01728</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G1221</preicd10cd>
<preicd10hngnm>산발형 근위축측삭경화증</preicd10hngnm>
<posticd10cd>G1221</posticd10cd>
<posticd10hngnm>산발형 근위축측삭경화증</posticd10hngnm>
<pid>39964272</pid>
<hngnm>조경림</hngnm>
<brthdd>19520715</brthdd>
<sex>2</sex>
<age>73</age>
<testcd>LPE520</testcd>
<testnm>유전성 근신경계 질환 [NGS]</testnm>
<bcno>I28KL3RX0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937730901</prcpno>
<execprcpuntqno>2074122913</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100747</clamacptno>
<docuseqno>54943</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G20</preicd10cd>
<preicd10hngnm>파킨슨병</preicd10hngnm>
<posticd10cd>G20</posticd10cd>
<posticd10hngnm>파킨슨병</posticd10hngnm>
<pid>41444264</pid>
<hngnm>김윤주</hngnm>
<brthdd>19880818</brthdd>
<sex>2</sex>
<age>37</age>
<testcd>LPE538</testcd>
<testnm>파킨슨병 [NGS]</testnm>
<bcno>O28KM4MF0</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1937893145</prcpno>
<execprcpuntqno>2074293900</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100691</clamacptno>
<docuseqno>01602</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H400</preicd10cd>
<preicd10hngnm>녹내장 의심</preicd10hngnm>
<posticd10cd>H400</posticd10cd>
<posticd10hngnm>녹내장 의심</posticd10hngnm>
<pid>18498213</pid>
<hngnm>강미선</hngnm>
<brthdd>19900329</brthdd>
<sex>2</sex>
<age>35</age>
<testcd>LPE636</testcd>
<testnm>유전성 안질환 [NGS]</testnm>
<bcno>O28KM6T00</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938178758</prcpno>
<execprcpuntqno>2074596108</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>01737</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G1221</preicd10cd>
<preicd10hngnm>산발형 근위축측삭경화증</preicd10hngnm>
<posticd10cd>G1221</posticd10cd>
<posticd10hngnm>산발형 근위축측삭경화증</posticd10hngnm>
<pid>41411913</pid>
<hngnm>강지형</hngnm>
<brthdd>19420404</brthdd>
<sex>1</sex>
<age>83</age>
<testcd>LPE520</testcd>
<testnm>유전성 근신경계 질환 [NGS]</testnm>
<bcno>I28KL3RZ0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937729310</prcpno>
<execprcpuntqno>2074121259</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100691</clamacptno>
<docuseqno>13261</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H905</preicd10cd>
<preicd10hngnm>상세불명의 감각신경성 난청</preicd10hngnm>
<posticd10cd>H905</posticd10cd>
<posticd10hngnm>상세불명의 감각신경성 난청</posticd10hngnm>
<pid>36188234</pid>
<hngnm>안형준</hngnm>
<brthdd>19711104</brthdd>
<sex>1</sex>
<age>54</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>O28KS3SV0</bcno>
<orddd>20251028</orddd>
<prcpdd>20251028</prcpdd>
<prcpno>1939630301</prcpno>
<execprcpuntqno>2076144156</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41523656</pid>
<hngnm>이광근</hngnm>
<brthdd>19630817</brthdd>
<sex>1</sex>
<age>62</age>
<testcd>LPE530</testcd>
<testnm>유전성 강직하반신마비 [NGS]</testnm>
<bcno>O28KU6190</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940889183</prcpno>
<execprcpuntqno>2077475452</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>68793</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Q131</preicd10cd>
<preicd10hngnm>홍채의 결여</preicd10hngnm>
<posticd10cd>Q131</posticd10cd>
<posticd10hngnm>홍채의 결여</posticd10hngnm>
<pid>7025244</pid>
<hngnm>송지수</hngnm>
<brthdd>19910417</brthdd>
<sex>2</sex>
<age>34</age>
<testcd>LPE636</testcd>
<testnm>유전성 안질환 [NGS]</testnm>
<bcno>O28KZ6P50</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942650448</prcpno>
<execprcpuntqno>2079353676</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>59026</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G821</preicd10cd>
<preicd10hngnm>강직성 하반신마비</preicd10hngnm>
<posticd10cd>G821</posticd10cd>
<posticd10hngnm>강직성 하반신마비</posticd10hngnm>
<pid>38458442</pid>
<hngnm>곽명옥</hngnm>
<brthdd>19770825</brthdd>
<sex>2</sex>
<age>48</age>
<testcd>LPE520</testcd>
<testnm>유전성 근신경계 질환 [NGS]</testnm>
<bcno>O28L14FX0</bcno>
<orddd>20251106</orddd>
<prcpdd>20251106</prcpdd>
<prcpno>1943272273</prcpno>
<execprcpuntqno>2080012378</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251106</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109850</clamacptno>
<docuseqno>15462</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H905</preicd10cd>
<preicd10hngnm>상세불명의 감각신경성 난청</preicd10hngnm>
<posticd10cd>H905</posticd10cd>
<posticd10hngnm>상세불명의 감각신경성 난청</posticd10hngnm>
<pid>40826593</pid>
<hngnm>김예름</hngnm>
<brthdd>19950416</brthdd>
<sex>2</sex>
<age>30</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>O28L15WX0</bcno>
<orddd>20251106</orddd>
<prcpdd>20251106</prcpdd>
<prcpno>1943470955</prcpno>
<execprcpuntqno>2080224252</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251106</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>42310</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>41415416</pid>
<hngnm>최정희</hngnm>
<brthdd>19590528</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LC7K80</bcno>
<orddd>20251117</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947361116</prcpno>
<execprcpuntqno>2084373652</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage>C911 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41581254</pid>
<hngnm>김지산</hngnm>
<brthdd>20200616</brthdd>
<sex>1</sex>
<age>5</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LF53J0</bcno>
<orddd>20251120</orddd>
<prcpdd>20251120</prcpdd>
<prcpno>1948722120</prcpno>
<execprcpuntqno>2085811712</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251201</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42632</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41536191</pid>
<hngnm>변진희</hngnm>
<brthdd>19950120</brthdd>
<sex>2</sex>
<age>30</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>O28L04UH0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251105</prcpdd>
<prcpno>1942962480</prcpno>
<execprcpuntqno>2079683684</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251202</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109853</clamacptno>
<docuseqno>09647</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>41539683</pid>
<hngnm>유성종</hngnm>
<brthdd>19600622</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LC6470</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945482241</prcpno>
<execprcpuntqno>2082368397</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251202</lstreptdt>
<stage>C61 /2C</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41577712</pid>
<hngnm>이계석</hngnm>
<brthdd>19581016</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LD5E50</bcno>
<orddd>20251118</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947816801</prcpno>
<execprcpuntqno>2084854042</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251202</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd>C240</preicd10cd>
<preicd10hngnm>간외담관암</preicd10hngnm>
<posticd10cd/>
<posticd10hngnm/>
<pid>41297013</pid>
<hngnm>Zavidov Viktor</hngnm>
<brthdd>19780606</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>I28LE4S30</bcno>
<orddd>20251014</orddd>
<prcpdd>20251120</prcpdd>
<prcpno>1948359078</prcpno>
<execprcpuntqno>2085427071</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251202</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>백인</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109853</clamacptno>
<docuseqno>08229</docuseqno>
<pay100ownbrate>90</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>39898804</pid>
<hngnm>이석봉</hngnm>
<brthdd>19720812</brthdd>
<sex>1</sex>
<age>53</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LF3PX0</bcno>
<orddd>20251120</orddd>
<prcpdd>20251120</prcpdd>
<prcpno>1948589124</prcpno>
<execprcpuntqno>2085670253</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251202</lstreptdt>
<stage>C61 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100691</clamacptno>
<docuseqno>08790</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H368</preicd10cd>
<preicd10hngnm>달리 분류된 질환에서의 기타 망막 장애</preicd10hngnm>
<posticd10cd>H368</posticd10cd>
<posticd10hngnm>달리 분류된 질환에서의 기타 망막 장애</posticd10hngnm>
<pid>40749523</pid>
<hngnm>박재현</hngnm>
<brthdd>19951002</brthdd>
<sex>1</sex>
<age>30</age>
<testcd>LPE543</testcd>
<testnm>유전성 망막색소병증 [NGS]</testnm>
<bcno>O28KV4P70</bcno>
<orddd>20250818</orddd>
<prcpdd>20250818</prcpdd>
<prcpno>1914165237</prcpno>
<execprcpuntqno>2049081099</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251203</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109362</clamacptno>
<docuseqno>02614</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H368</preicd10cd>
<preicd10hngnm>달리 분류된 질환에서의 기타 망막 장애</preicd10hngnm>
<posticd10cd>H368</posticd10cd>
<posticd10hngnm>달리 분류된 질환에서의 기타 망막 장애</posticd10hngnm>
<pid>15775946</pid>
<hngnm>이옥자</hngnm>
<brthdd>19441203</brthdd>
<sex>2</sex>
<age>81</age>
<testcd>LPE539</testcd>
<testnm>유전성 망막병증 [NGS]</testnm>
<bcno>O28KY6Q70</bcno>
<orddd>20251103</orddd>
<prcpdd>20251103</prcpdd>
<prcpno>1942133614</prcpno>
<execprcpuntqno>2078807531</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251203</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41459873</pid>
<hngnm>최혜진</hngnm>
<brthdd>19710924</brthdd>
<sex>2</sex>
<age>54</age>
<testcd>LPE530</testcd>
<testnm>유전성 강직하반신마비 [NGS]</testnm>
<bcno>O28KZ4TN0</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942476935</prcpno>
<execprcpuntqno>2079170261</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251203</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>58125</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>R529</preicd10cd>
<preicd10hngnm>상세불명의 통증</preicd10hngnm>
<posticd10cd>R529</posticd10cd>
<posticd10hngnm>상세불명의 통증</posticd10hngnm>
<pid>32237724</pid>
<hngnm>한상우</hngnm>
<brthdd>19840108</brthdd>
<sex>1</sex>
<age>42</age>
<testcd>LPE520</testcd>
<testnm>유전성 근신경계 질환 [NGS]</testnm>
<bcno>O28L02WX0</bcno>
<orddd>20250903</orddd>
<prcpdd>20250903</prcpdd>
<prcpno>1920007302</prcpno>
<execprcpuntqno>2055273520</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251203</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4007126</clamacptno>
<docuseqno>26482</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>P220</preicd10cd>
<preicd10hngnm>신생아의 호흡곤란증후군</preicd10hngnm>
<posticd10cd>P220</posticd10cd>
<posticd10hngnm>신생아의 호흡곤란증후군</posticd10hngnm>
<pid>37332212</pid>
<hngnm>이준</hngnm>
<brthdd>20220515</brthdd>
<sex>1</sex>
<age>3</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O28BC5ND0</bcno>
<orddd>20241125</orddd>
<prcpdd>20241125</prcpdd>
<prcpno>1831034628</prcpno>
<execprcpuntqno>1961044761</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20241202</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>01663</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41410053</pid>
<hngnm>김진이</hngnm>
<brthdd>19730219</brthdd>
<sex>2</sex>
<age>52</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>I28KZ0W80</bcno>
<orddd>20251024</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942177636</prcpno>
<execprcpuntqno>2078853567</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>00746</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>37746501</pid>
<hngnm>김진옥</hngnm>
<brthdd>19620208</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E28L20880</bcno>
<orddd>20251105</orddd>
<prcpdd>20251107</prcpdd>
<prcpno>1943663300</prcpno>
<execprcpuntqno>2080429516</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage>C3499 /3B</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42571</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>41522022</pid>
<hngnm>김순자</hngnm>
<brthdd>19450128</brthdd>
<sex>2</sex>
<age>80</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28L15VN0</bcno>
<orddd>20251103</orddd>
<prcpdd>20251103</prcpdd>
<prcpno>1942012415</prcpno>
<execprcpuntqno>2078680663</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>00823</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>40714443</pid>
<hngnm>임진혁</hngnm>
<brthdd>19811206</brthdd>
<sex>1</sex>
<age>44</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28L31N70</bcno>
<orddd>20250916</orddd>
<prcpdd>20251108</prcpdd>
<prcpno>1944174544</prcpno>
<execprcpuntqno>2080986174</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>00750</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>37154832</pid>
<hngnm>김양준</hngnm>
<brthdd>19530618</brthdd>
<sex>1</sex>
<age>72</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>I28LK08X0</bcno>
<orddd>20250808</orddd>
<prcpdd>20251125</prcpdd>
<prcpno>1950045087</prcpno>
<execprcpuntqno>2087229498</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251125</spcacptdt>
<lstreptdt>20251204</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4082541</clamacptno>
<docuseqno>40320</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>40878600</pid>
<hngnm>이부순</hngnm>
<brthdd>19490527</brthdd>
<sex>2</sex>
<age>76</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O28IE6QU0</bcno>
<orddd>20250731</orddd>
<prcpdd>20250731</prcpdd>
<prcpno>1907990932</prcpno>
<execprcpuntqno>2042504509</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250807</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C911 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4082541</clamacptno>
<docuseqno>41260</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>41235672</pid>
<hngnm>전미숙</hngnm>
<brthdd>19710828</brthdd>
<sex>2</sex>
<age>54</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O28IF4DW0</bcno>
<orddd>20250806</orddd>
<prcpdd>20250806</prcpdd>
<prcpno>1910177989</prcpno>
<execprcpuntqno>2044829456</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250807</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C911 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41236981</pid>
<hngnm>장정자</hngnm>
<brthdd>19560407</brthdd>
<sex>2</sex>
<age>69</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O28JS7HH0</bcno>
<orddd>20250923</orddd>
<prcpdd>20250923</prcpdd>
<prcpno>1927531225</prcpno>
<execprcpuntqno>2063266838</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250923</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4089911</clamacptno>
<docuseqno>42622</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C916</preicd10cd>
<preicd10hngnm>T-세포형의 전림프구성 백혈병</preicd10hngnm>
<posticd10cd>C916</posticd10cd>
<posticd10hngnm>T-세포형의 전림프구성 백혈병</posticd10hngnm>
<pid>40833304</pid>
<hngnm>김월미</hngnm>
<brthdd>19661105</brthdd>
<sex>2</sex>
<age>59</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O28JU6TW0</bcno>
<orddd>20250925</orddd>
<prcpdd>20250925</prcpdd>
<prcpno>1928511601</prcpno>
<execprcpuntqno>2064302243</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250926</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C916 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4087495</clamacptno>
<docuseqno>00635</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>39779102</pid>
<hngnm>박찬</hngnm>
<brthdd>19571028</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I28JY22B0</bcno>
<orddd>20250926</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929305012</prcpno>
<execprcpuntqno>2065156005</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250929</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C911 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4087476</clamacptno>
<docuseqno>00381</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C859</preicd10cd>
<preicd10hngnm>상세불명의 비호지킨림프종</preicd10hngnm>
<posticd10cd>C846</posticd10cd>
<posticd10hngnm>역형성 대세포림프종, ALK(+)</posticd10hngnm>
<pid>41401443</pid>
<hngnm>노하윤</hngnm>
<brthdd>20200918</brthdd>
<sex>2</sex>
<age>5</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I28JZ1S20</bcno>
<orddd>20250916</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1929962047</prcpno>
<execprcpuntqno>2065847266</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250930</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C859 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37610</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41320603</pid>
<hngnm>전일민</hngnm>
<brthdd>19770214</brthdd>
<sex>1</sex>
<age>48</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28K96PL0</bcno>
<orddd>20251010</orddd>
<prcpdd>20251010</prcpdd>
<prcpno>1933026542</prcpno>
<execprcpuntqno>2069142459</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251010</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4094109</clamacptno>
<docuseqno>01176</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41433245</pid>
<hngnm>김대곤</hngnm>
<brthdd>19500225</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>I28KD1XF0</bcno>
<orddd>20251010</orddd>
<prcpdd>20251014</prcpdd>
<prcpno>1934216316</prcpno>
<execprcpuntqno>2070399888</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251014</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37483</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D45</preicd10cd>
<preicd10hngnm>진성 적혈구 증가증</preicd10hngnm>
<posticd10cd>D45</posticd10cd>
<posticd10hngnm>진성 적혈구 증가증</posticd10hngnm>
<pid>41274550</pid>
<hngnm>윤상규</hngnm>
<brthdd>19760128</brthdd>
<sex>1</sex>
<age>49</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KC9930</bcno>
<orddd>20251013</orddd>
<prcpdd>20251013</prcpdd>
<prcpno>1933759255</prcpno>
<execprcpuntqno>2069919975</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251014</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>31055</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>16927185</pid>
<hngnm>최광호</hngnm>
<brthdd>19550119</brthdd>
<sex>1</sex>
<age>70</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KC9940</bcno>
<orddd>20251013</orddd>
<prcpdd>20251013</prcpdd>
<prcpno>1933917426</prcpno>
<execprcpuntqno>2070084478</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251014</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4094109</clamacptno>
<docuseqno>01057</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C830</preicd10cd>
<preicd10hngnm>소세포B-세포림프종</preicd10hngnm>
<posticd10cd>C830</posticd10cd>
<posticd10hngnm>소세포B-세포림프종</posticd10hngnm>
<pid>41229475</pid>
<hngnm>김은정</hngnm>
<brthdd>19770523</brthdd>
<sex>2</sex>
<age>48</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>I28KD3I70</bcno>
<orddd>20251014</orddd>
<prcpdd>20251015</prcpdd>
<prcpno>1934385173</prcpno>
<execprcpuntqno>2070576003</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251015</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C830 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>35572</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C931</preicd10cd>
<preicd10hngnm>만성 골수단핵구성 백혈병</preicd10hngnm>
<posticd10cd>C931</posticd10cd>
<posticd10hngnm>만성 골수단핵구성 백혈병</posticd10hngnm>
<pid>39292323</pid>
<hngnm>조성철</hngnm>
<brthdd>19681225</brthdd>
<sex>1</sex>
<age>57</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KD8FT0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930167902</prcpno>
<execprcpuntqno>2066063796</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251015</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C931 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100747</clamacptno>
<docuseqno>33318</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>33601874</pid>
<hngnm>김은영</hngnm>
<brthdd>19820407</brthdd>
<sex>2</sex>
<age>43</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KE76V0</bcno>
<orddd>20251015</orddd>
<prcpdd>20251015</prcpdd>
<prcpno>1934755379</prcpno>
<execprcpuntqno>2070967322</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251015</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37189</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>41177634</pid>
<hngnm>이준상</hngnm>
<brthdd>19720924</brthdd>
<sex>1</sex>
<age>53</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KE7B80</bcno>
<orddd>20251010</orddd>
<prcpdd>20251010</prcpdd>
<prcpno>1932911763</prcpno>
<execprcpuntqno>2069019602</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251016</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36219</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>40300134</pid>
<hngnm>조가영</hngnm>
<brthdd>19880420</brthdd>
<sex>2</sex>
<age>37</age>
<testcd>LPE474</testcd>
<testnm>악성림프종 [NGS]</testnm>
<bcno>O28KF6VQ0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930128644</prcpno>
<execprcpuntqno>2066021434</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251017</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C911 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37655</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41329846</pid>
<hngnm>박만철</hngnm>
<brthdd>19580503</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KG5X00</bcno>
<orddd>20251017</orddd>
<prcpdd>20251017</prcpdd>
<prcpno>1935998713</prcpno>
<execprcpuntqno>2072292313</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251018</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>62970</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z315</preicd10cd>
<preicd10hngnm>유전상담</preicd10hngnm>
<posticd10cd>Z315</posticd10cd>
<posticd10hngnm>유전상담</posticd10hngnm>
<pid>41504982</pid>
<hngnm>유소연</hngnm>
<brthdd>19980905</brthdd>
<sex>2</sex>
<age>27</age>
<testcd>LPE539</testcd>
<testnm>유전성 망막병증 [NGS]</testnm>
<bcno>O28KR6KM0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939420022</prcpno>
<execprcpuntqno>2075923559</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251027</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>41248</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>40942882</pid>
<hngnm>이점순</hngnm>
<brthdd>19500615</brthdd>
<sex>2</sex>
<age>75</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28L24RA0</bcno>
<orddd>20251103</orddd>
<prcpdd>20251103</prcpdd>
<prcpno>1941872006</prcpno>
<execprcpuntqno>2078533274</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>01029</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C950</preicd10cd>
<preicd10hngnm>상세불명 세포형의 급성 백혈병</preicd10hngnm>
<posticd10cd>C950</posticd10cd>
<posticd10hngnm>상세불명 세포형의 급성 백혈병</posticd10hngnm>
<pid>41535773</pid>
<hngnm>정승만</hngnm>
<brthdd>19900727</brthdd>
<sex>1</sex>
<age>35</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E28L606R0</bcno>
<orddd>20251106</orddd>
<prcpdd>20251111</prcpdd>
<prcpno>1944961058</prcpno>
<execprcpuntqno>2081818502</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>01030</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41544333</pid>
<hngnm>박서영</hngnm>
<brthdd>20060226</brthdd>
<sex>2</sex>
<age>19</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>E28L70AN0</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945598952</prcpno>
<execprcpuntqno>2082492204</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251112</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01164</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41560844</pid>
<hngnm>오진곤</hngnm>
<brthdd>19600420</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LC2810</bcno>
<orddd>20251113</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947091845</prcpno>
<execprcpuntqno>2084089362</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251205</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4093990</clamacptno>
<docuseqno>00536</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Q279</preicd10cd>
<preicd10hngnm>상세불명의 말초혈관계통의 선천기형</preicd10hngnm>
<posticd10cd>Q279</posticd10cd>
<posticd10hngnm>상세불명의 말초혈관계통의 선천기형</posticd10hngnm>
<pid>41492154</pid>
<hngnm>김조우</hngnm>
<brthdd>20251021</brthdd>
<sex>2</sex>
<age>0</age>
<testcd>LPE639</testcd>
<testnm>선천기형 [NGS]</testnm>
<bcno>I28KQ47M0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1938906802</prcpno>
<execprcpuntqno>2075379569</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251027</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4094109</clamacptno>
<docuseqno>00574</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41465033</pid>
<hngnm>심정희</hngnm>
<brthdd>19661115</brthdd>
<sex>2</sex>
<age>59</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KR3JP0</bcno>
<orddd>20251026</orddd>
<prcpdd>20251026</prcpdd>
<prcpno>1938991499</prcpno>
<execprcpuntqno>2075470200</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4094109</clamacptno>
<docuseqno>00551</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>32553861</pid>
<hngnm>최덕수</hngnm>
<brthdd>19790224</brthdd>
<sex>1</sex>
<age>46</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KR4K60</bcno>
<orddd>20251026</orddd>
<prcpdd>20251026</prcpdd>
<prcpno>1938987805</prcpno>
<execprcpuntqno>2075466255</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097548</clamacptno>
<docuseqno>00355</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E343</preicd10cd>
<preicd10hngnm>달리 분류되지 않은 단신</preicd10hngnm>
<posticd10cd>E343</posticd10cd>
<posticd10hngnm>달리 분류되지 않은 단신</posticd10hngnm>
<pid>40102014</pid>
<hngnm>백채린</hngnm>
<brthdd>20210625</brthdd>
<sex>2</sex>
<age>4</age>
<testcd>LPE524</testcd>
<testnm>유전성 저신장증 [NGS]</testnm>
<bcno>I28KS4MT0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251028</prcpdd>
<prcpno>1939747043</prcpno>
<execprcpuntqno>2076266943</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251029</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00189</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I420</preicd10cd>
<preicd10hngnm>확장성 심근병증</preicd10hngnm>
<posticd10cd>I420</posticd10cd>
<posticd10hngnm>확장성 심근병증</posticd10hngnm>
<pid>12387638</pid>
<hngnm>최숙경</hngnm>
<brthdd>19580920</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>I28KT3SG0</bcno>
<orddd>20251028</orddd>
<prcpdd>20251029</prcpdd>
<prcpno>1940468409</prcpno>
<execprcpuntqno>2077028023</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103264</clamacptno>
<docuseqno>00184</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C760</preicd10cd>
<preicd10hngnm>머리, 얼굴 및 목의 악성신생물</preicd10hngnm>
<posticd10cd>C770</posticd10cd>
<posticd10hngnm>머리, 얼굴 및 목의 림프절의 이차성 및 상세불명의 악성신생물</posticd10hngnm>
<pid>21281611</pid>
<hngnm>문동윤</hngnm>
<brthdd>20001013</brthdd>
<sex>1</sex>
<age>25</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>I28KU1QL0</bcno>
<orddd>20251019</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940446453</prcpno>
<execprcpuntqno>2077005144</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage>C770 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100693</clamacptno>
<docuseqno>07306</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E301</preicd10cd>
<preicd10hngnm>조발 사춘기 </preicd10hngnm>
<posticd10cd>E301</posticd10cd>
<posticd10hngnm>조발 사춘기 </posticd10hngnm>
<pid>36600226</pid>
<hngnm>김호진</hngnm>
<brthdd>20190410</brthdd>
<sex>1</sex>
<age>6</age>
<testcd>LPE533</testcd>
<testnm>유전성 내분비질환 [NGS]</testnm>
<bcno>O28KU5U60</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940835880</prcpno>
<execprcpuntqno>2077419220</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>00545</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>40880034</pid>
<hngnm>오덕운</hngnm>
<brthdd>19621128</brthdd>
<sex>1</sex>
<age>63</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KV1GW0</bcno>
<orddd>20251026</orddd>
<prcpdd>20251026</prcpdd>
<prcpno>1939006569</prcpno>
<execprcpuntqno>2075485954</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41250521</pid>
<hngnm>이덕수</hngnm>
<brthdd>19600417</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LG45B0</bcno>
<orddd>20251121</orddd>
<prcpdd>20251121</prcpdd>
<prcpno>1949227506</prcpno>
<execprcpuntqno>2086355600</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251121</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41610751</pid>
<hngnm>구춘자</hngnm>
<brthdd>19630508</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LR5K80</bcno>
<orddd>20251201</orddd>
<prcpdd>20251201</prcpdd>
<prcpno>1952733077</prcpno>
<execprcpuntqno>2090084186</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251201</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>39324305</pid>
<hngnm>노경륭</hngnm>
<brthdd>19921111</brthdd>
<sex>1</sex>
<age>33</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LT3IP0</bcno>
<orddd>20251203</orddd>
<prcpdd>20251203</prcpdd>
<prcpno>1953634272</prcpno>
<execprcpuntqno>2091034352</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251203</spcacptdt>
<lstreptdt>20251208</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>47514</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>M1239</preicd10cd>
<preicd10hngnm>재발성 류마티스, 상세불명 부분</preicd10hngnm>
<posticd10cd>M1239</posticd10cd>
<posticd10hngnm>재발성 류마티스, 상세불명 부분</posticd10hngnm>
<pid>26393083</pid>
<hngnm>송윤수</hngnm>
<brthdd>19901020</brthdd>
<sex>2</sex>
<age>35</age>
<testcd>LPE489</testcd>
<testnm>선천성 면역결핍증 [NGS]</testnm>
<bcno>O28KV3WB0</bcno>
<orddd>20251031</orddd>
<prcpdd>20251031</prcpdd>
<prcpno>1941156149</prcpno>
<execprcpuntqno>2077763730</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41526264</pid>
<hngnm>유선화</hngnm>
<brthdd>19760310</brthdd>
<sex>2</sex>
<age>49</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28KV4NN0</bcno>
<orddd>20251031</orddd>
<prcpdd>20251031</prcpdd>
<prcpno>1941310042</prcpno>
<execprcpuntqno>2077929820</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097548</clamacptno>
<docuseqno>00478</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D761</preicd10cd>
<preicd10hngnm>혈구탐식 림프조직구증</preicd10hngnm>
<posticd10cd>D761</posticd10cd>
<posticd10hngnm>혈구탐식 림프조직구증</posticd10hngnm>
<pid>41481260</pid>
<hngnm>송은하</hngnm>
<brthdd>20220422</brthdd>
<sex>2</sex>
<age>3</age>
<testcd>LPE489</testcd>
<testnm>선천성 면역결핍증 [NGS]</testnm>
<bcno>I28KY2G40</bcno>
<orddd>20251027</orddd>
<prcpdd>20251031</prcpdd>
<prcpno>1940966539</prcpno>
<execprcpuntqno>2077558718</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>00560</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>9568800</pid>
<hngnm>김재유</hngnm>
<brthdd>19591009</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KY4R50</bcno>
<orddd>20251102</orddd>
<prcpdd>20251102</prcpdd>
<prcpno>1941611865</prcpno>
<execprcpuntqno>2078257633</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>00561</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>M321</preicd10cd>
<preicd10hngnm>기관 또는 계통 침습을 동반한 전신 홍반성 루푸스</preicd10hngnm>
<posticd10cd>M321</posticd10cd>
<posticd10hngnm>기관 또는 계통 침습을 동반한 전신 홍반성 루푸스</posticd10hngnm>
<pid>9851882</pid>
<hngnm>최혜원</hngnm>
<brthdd>19770523</brthdd>
<sex>2</sex>
<age>48</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KY4SA0</bcno>
<orddd>20251102</orddd>
<prcpdd>20251102</prcpdd>
<prcpno>1941629461</prcpno>
<execprcpuntqno>2078276465</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>68789</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z315</preicd10cd>
<preicd10hngnm>유전상담</preicd10hngnm>
<posticd10cd>Z315</posticd10cd>
<posticd10hngnm>유전상담</posticd10hngnm>
<pid>41525490</pid>
<hngnm>염현승</hngnm>
<brthdd>19980305</brthdd>
<sex>1</sex>
<age>27</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O28KZ46S0</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942410728</prcpno>
<execprcpuntqno>2079100171</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109855</clamacptno>
<docuseqno>09746</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E343</preicd10cd>
<preicd10hngnm>달리 분류되지 않은 단신</preicd10hngnm>
<posticd10cd>E343</posticd10cd>
<posticd10hngnm>달리 분류되지 않은 단신</posticd10hngnm>
<pid>40796040</pid>
<hngnm>백서현</hngnm>
<brthdd>20180119</brthdd>
<sex>2</sex>
<age>7</age>
<testcd>LPE524</testcd>
<testnm>유전성 저신장증 [NGS]</testnm>
<bcno>O28KZ4930</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942422222</prcpno>
<execprcpuntqno>2079112368</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>00553</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41462743</pid>
<hngnm>김진희</hngnm>
<brthdd>19971015</brthdd>
<sex>1</sex>
<age>28</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28KZ3Y70</bcno>
<orddd>20251102</orddd>
<prcpdd>20251102</prcpdd>
<prcpno>1941613699</prcpno>
<execprcpuntqno>2078259619</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>01143</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C5091</preicd10cd>
<preicd10hngnm>상세불명의 유방암, 왼쪽</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>26471582</pid>
<hngnm>김소민</hngnm>
<brthdd>19740513</brthdd>
<sex>2</sex>
<age>51</age>
<testcd>LPE497</testcd>
<testnm>유전성 암 [NGS]</testnm>
<bcno>I28L14LI0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251106</prcpdd>
<prcpno>1943198372</prcpno>
<execprcpuntqno>2079933487</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage>C5099 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41547596</pid>
<hngnm>한진숙</hngnm>
<brthdd>19760526</brthdd>
<sex>2</sex>
<age>49</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28L252H0</bcno>
<orddd>20251107</orddd>
<prcpdd>20251107</prcpdd>
<prcpno>1944064254</prcpno>
<execprcpuntqno>2080866213</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>00522</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z940</preicd10cd>
<preicd10hngnm>신장 이식 상태</preicd10hngnm>
<posticd10cd>B338</posticd10cd>
<posticd10hngnm>기타 명시된 바이러스 질환</posticd10hngnm>
<pid>28469464</pid>
<hngnm>유경선</hngnm>
<brthdd>19670913</brthdd>
<sex>2</sex>
<age>58</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28L422U0</bcno>
<orddd>20251109</orddd>
<prcpdd>20251109</prcpdd>
<prcpno>1944252112</prcpno>
<execprcpuntqno>2081069356</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097532</clamacptno>
<docuseqno>00507</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>16399225</pid>
<hngnm>권선영</hngnm>
<brthdd>19820816</brthdd>
<sex>2</sex>
<age>43</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28L52J80</bcno>
<orddd>20251109</orddd>
<prcpdd>20251109</prcpdd>
<prcpno>1944242876</prcpno>
<execprcpuntqno>2081059511</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00522</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41509361</pid>
<hngnm>이상섭</hngnm>
<brthdd>19610319</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28L542G0</bcno>
<orddd>20251109</orddd>
<prcpdd>20251109</prcpdd>
<prcpno>1944257520</prcpno>
<execprcpuntqno>2081074983</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00333</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D3919</preicd10cd>
<preicd10hngnm>난소의 행동양식 불명 또는 미상의 신생물, 상세불명 부위</preicd10hngnm>
<posticd10cd>I429</posticd10cd>
<posticd10hngnm>상세불명의 심근병증</posticd10hngnm>
<pid>41379264</pid>
<hngnm>임영자</hngnm>
<brthdd>19630825</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>I28L543L0</bcno>
<orddd>20251110</orddd>
<prcpdd>20251110</prcpdd>
<prcpno>1944637255</prcpno>
<execprcpuntqno>2081476048</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251209</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37710</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41352361</pid>
<hngnm>정순희</hngnm>
<brthdd>19470907</brthdd>
<sex>2</sex>
<age>78</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KG5GX0</bcno>
<orddd>20250929</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929609739</prcpno>
<execprcpuntqno>2065475303</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37946</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41440434</pid>
<hngnm>김건순</hngnm>
<brthdd>19470928</brthdd>
<sex>2</sex>
<age>78</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KG5IS0</bcno>
<orddd>20251001</orddd>
<prcpdd>20251001</prcpdd>
<prcpno>1930735128</prcpno>
<execprcpuntqno>2066661043</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37989</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41459653</pid>
<hngnm>김일분</hngnm>
<brthdd>19590730</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KJ76N0</bcno>
<orddd>20251015</orddd>
<prcpdd>20251015</prcpdd>
<prcpno>1934905730</prcpno>
<execprcpuntqno>2071123900</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251021</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>32855</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>31376011</pid>
<hngnm>황보묵</hngnm>
<brthdd>19520720</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KK6010</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930012402</prcpno>
<execprcpuntqno>2065900355</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251022</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>01032</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D477</posticd10cd>
<posticd10hngnm>기타 명시된 림프, 조혈 및 관련 조직의 행동양식 불명 또는 미상의 상세불명의 신생물</posticd10hngnm>
<pid>41481135</pid>
<hngnm>김수학</hngnm>
<brthdd>19520303</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28KM09V0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937724887</prcpno>
<execprcpuntqno>2074116391</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36843</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41031082</pid>
<hngnm>권오준</hngnm>
<brthdd>19470210</brthdd>
<sex>1</sex>
<age>78</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KL6C40</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937497146</prcpno>
<execprcpuntqno>2073876706</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37891</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41420040</pid>
<hngnm>진성현</hngnm>
<brthdd>19780131</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KM6400</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935220412</prcpno>
<execprcpuntqno>2071458022</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>32733</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>30654662</pid>
<hngnm>김도원</hngnm>
<brthdd>19770621</brthdd>
<sex>1</sex>
<age>48</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KM65G0</bcno>
<orddd>20250926</orddd>
<prcpdd>20250926</prcpdd>
<prcpno>1928647622</prcpno>
<execprcpuntqno>2064447133</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251210</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>35739</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>13517352</pid>
<hngnm>신수현</hngnm>
<brthdd>19830221</brthdd>
<sex>2</sex>
<age>42</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28LE6C60</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948371098</prcpno>
<execprcpuntqno>2085439533</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251211</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>44011</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C5099</preicd10cd>
<preicd10hngnm>상세불명의 유방암</preicd10hngnm>
<posticd10cd>C5099</posticd10cd>
<posticd10hngnm>상세불명의 유방암</posticd10hngnm>
<pid>26754031</pid>
<hngnm>노은혜</hngnm>
<brthdd>19830421</brthdd>
<sex>2</sex>
<age>42</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LJ6HL0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939377089</prcpno>
<execprcpuntqno>2075878670</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251124</spcacptdt>
<lstreptdt>20251212</lstreptdt>
<stage>C5099 /2B</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109853</clamacptno>
<docuseqno>06036</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>29133355</pid>
<hngnm>최종원</hngnm>
<brthdd>19550320</brthdd>
<sex>1</sex>
<age>70</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LM3TN0</bcno>
<orddd>20251127</orddd>
<prcpdd>20251127</prcpdd>
<prcpno>1951322630</prcpno>
<execprcpuntqno>2088572911</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251127</spcacptdt>
<lstreptdt>20251212</lstreptdt>
<stage>C61 /4B</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>00431</docuseqno>
<pay100ownbrate>50</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>38307403</pid>
<hngnm>송희곤</hngnm>
<brthdd>19630425</brthdd>
<sex>1</sex>
<age>62</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>I28LN24T0</bcno>
<orddd>20251127</orddd>
<prcpdd>20251128</prcpdd>
<prcpno>1951850103</prcpno>
<execprcpuntqno>2089134502</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251128</spcacptdt>
<lstreptdt>20251212</lstreptdt>
<stage>C3499 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100747</clamacptno>
<docuseqno>30853</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>13517352</pid>
<hngnm>신수현</hngnm>
<brthdd>19830221</brthdd>
<sex>2</sex>
<age>42</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KG59U0</bcno>
<orddd>20251002</orddd>
<prcpdd>20251002</prcpdd>
<prcpno>1931567554</prcpno>
<execprcpuntqno>2067556427</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37758</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41370871</pid>
<hngnm>장덕순</hngnm>
<brthdd>19650520</brthdd>
<sex>1</sex>
<age>60</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KG5BP0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930255273</prcpno>
<execprcpuntqno>2066154252</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37779</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41380464</pid>
<hngnm>조미숙</hngnm>
<brthdd>19640307</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KG5G50</bcno>
<orddd>20250929</orddd>
<prcpdd>20250929</prcpdd>
<prcpno>1929519079</prcpno>
<execprcpuntqno>2065380566</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37801</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41392901</pid>
<hngnm>홍종옥</hngnm>
<brthdd>19521208</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KG5JJ0</bcno>
<orddd>20251002</orddd>
<prcpdd>20251002</prcpdd>
<prcpno>1931495184</prcpno>
<execprcpuntqno>2067477010</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37495</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>41277285</pid>
<hngnm>김동진</hngnm>
<brthdd>19830905</brthdd>
<sex>1</sex>
<age>42</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ3WG0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936395161</prcpno>
<execprcpuntqno>2072717654</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41478031</pid>
<hngnm>안요셉</hngnm>
<brthdd>19890523</brthdd>
<sex>1</sex>
<age>36</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ5NI0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936555274</prcpno>
<execprcpuntqno>2072886520</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37494</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>41277051</pid>
<hngnm>김홍근</hngnm>
<brthdd>19550109</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ6EK0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936616377</prcpno>
<execprcpuntqno>2072950588</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>34195</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>36174342</pid>
<hngnm>이재상</hngnm>
<brthdd>19980103</brthdd>
<sex>1</sex>
<age>28</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ78N0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936691562</prcpno>
<execprcpuntqno>2073028871</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36198</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>40286243</pid>
<hngnm>전대봉</hngnm>
<brthdd>19541127</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ7DI0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936753205</prcpno>
<execprcpuntqno>2073093827</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251020</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37827</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41399715</pid>
<hngnm>송전석</hngnm>
<brthdd>19590401</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KK6BI0</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935429237</prcpno>
<execprcpuntqno>2071678376</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251021</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41502440</pid>
<hngnm>박순자</hngnm>
<brthdd>19471011</brthdd>
<sex>2</sex>
<age>78</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KM6MC0</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938181247</prcpno>
<execprcpuntqno>2074598646</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36795</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41010220</pid>
<hngnm>천영명</hngnm>
<brthdd>19911228</brthdd>
<sex>1</sex>
<age>34</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KM6RN0</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938180603</prcpno>
<execprcpuntqno>2074597996</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251023</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>31660</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>22302364</pid>
<hngnm>신유상</hngnm>
<brthdd>19601021</brthdd>
<sex>1</sex>
<age>65</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KM6DD0</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935363756</prcpno>
<execprcpuntqno>2071609968</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4100747</clamacptno>
<docuseqno>37666</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41335134</pid>
<hngnm>이진희</hngnm>
<brthdd>19600130</brthdd>
<sex>2</sex>
<age>65</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KM6EJ0</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935424967</prcpno>
<execprcpuntqno>2071673891</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37282</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41211434</pid>
<hngnm>정홍주</hngnm>
<brthdd>19780612</brthdd>
<sex>2</sex>
<age>47</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KN5EN0</bcno>
<orddd>20251024</orddd>
<prcpdd>20251024</prcpdd>
<prcpno>1938670916</prcpno>
<execprcpuntqno>2075123595</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37193</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41178142</pid>
<hngnm>석경자</hngnm>
<brthdd>19581207</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KN5JI0</bcno>
<orddd>20251010</orddd>
<prcpdd>20251010</prcpdd>
<prcpno>1933162057</prcpno>
<execprcpuntqno>2069287856</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36699</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>40949662</pid>
<hngnm>이화춘</hngnm>
<brthdd>19630525</brthdd>
<sex>1</sex>
<age>62</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KN5E80</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935296186</prcpno>
<execprcpuntqno>2071538454</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251027</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37382</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D45</preicd10cd>
<preicd10hngnm>진성 적혈구 증가증</preicd10hngnm>
<posticd10cd>D45</posticd10cd>
<posticd10hngnm>진성 적혈구 증가증</posticd10hngnm>
<pid>41237421</pid>
<hngnm>김종영</hngnm>
<brthdd>19550820</brthdd>
<sex>1</sex>
<age>70</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KR52J0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939250945</prcpno>
<execprcpuntqno>2075745822</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251027</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37851</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D467</preicd10cd>
<preicd10hngnm>기타 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D467</posticd10cd>
<posticd10hngnm>기타 골수형성이상 증후군</posticd10hngnm>
<pid>41409571</pid>
<hngnm>최미란</hngnm>
<brthdd>19701127</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KR6DG0</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936497957</prcpno>
<execprcpuntqno>2072826395</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>36350</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>40544885</pid>
<hngnm>김용상</hngnm>
<brthdd>19740515</brthdd>
<sex>1</sex>
<age>51</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KR6XC0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939462239</prcpno>
<execprcpuntqno>2075967599</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>34331</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>36567990</pid>
<hngnm>임지원</hngnm>
<brthdd>19920810</brthdd>
<sex>2</sex>
<age>33</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KS21H0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939469553</prcpno>
<execprcpuntqno>2075975189</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251028</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37743</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41362851</pid>
<hngnm>김미자</hngnm>
<brthdd>19560523</brthdd>
<sex>2</sex>
<age>69</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KS6B70</bcno>
<orddd>20251002</orddd>
<prcpdd>20251002</prcpdd>
<prcpno>1931528809</prcpno>
<execprcpuntqno>2067512826</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251029</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>33895</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>35317071</pid>
<hngnm>조영숙</hngnm>
<brthdd>19620830</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KT6KB0</bcno>
<orddd>20251029</orddd>
<prcpdd>20251029</prcpdd>
<prcpno>1940282635</prcpno>
<execprcpuntqno>2076832968</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251029</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>01039</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41510101</pid>
<hngnm>김성용</hngnm>
<brthdd>19700627</brthdd>
<sex>1</sex>
<age>55</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28KU0C70</bcno>
<orddd>20251029</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940693742</prcpno>
<execprcpuntqno>2077267882</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37347</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41235294</pid>
<hngnm>서영수</hngnm>
<brthdd>19670713</brthdd>
<sex>1</sex>
<age>58</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KT6660</bcno>
<orddd>20251016</orddd>
<prcpdd>20251016</prcpdd>
<prcpno>1935316208</prcpno>
<execprcpuntqno>2071560101</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>33722</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>34949206</pid>
<hngnm>김형철</hngnm>
<brthdd>19591220</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KT6C90</bcno>
<orddd>20251021</orddd>
<prcpdd>20251021</prcpdd>
<prcpno>1937012329</prcpno>
<execprcpuntqno>2073366971</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>32193</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>27390653</pid>
<hngnm>이진숙</hngnm>
<brthdd>19640618</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KT6HA0</bcno>
<orddd>20251029</orddd>
<prcpdd>20251029</prcpdd>
<prcpno>1940414838</prcpno>
<execprcpuntqno>2076972914</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>38018</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41472083</pid>
<hngnm>이수정</hngnm>
<brthdd>19630420</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KU59V0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251021</prcpdd>
<prcpno>1937017276</prcpno>
<execprcpuntqno>2073372095</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>31681</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>22523573</pid>
<hngnm>이영진</hngnm>
<brthdd>19800101</brthdd>
<sex>1</sex>
<age>46</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KU5FM0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937594599</prcpno>
<execprcpuntqno>2073980122</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>38055</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41490760</pid>
<hngnm>기영경</hngnm>
<brthdd>19830723</brthdd>
<sex>1</sex>
<age>42</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KU5GT0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937712218</prcpno>
<execprcpuntqno>2074102972</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37983</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41455743</pid>
<hngnm>변옥순</hngnm>
<brthdd>19610207</brthdd>
<sex>2</sex>
<age>64</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KV4CX0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251021</prcpdd>
<prcpno>1937079184</prcpno>
<execprcpuntqno>2073436800</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107175</clamacptno>
<docuseqno>00208</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C950</preicd10cd>
<preicd10hngnm>상세불명 세포형의 급성 백혈병</preicd10hngnm>
<posticd10cd>C950</posticd10cd>
<posticd10hngnm>상세불명 세포형의 급성 백혈병</posticd10hngnm>
<pid>27861250</pid>
<hngnm>송지원</hngnm>
<brthdd>20130212</brthdd>
<sex>2</sex>
<age>12</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LD1Z40</bcno>
<orddd>20251114</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947788210</prcpno>
<execprcpuntqno>2084823751</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C950 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>39695</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>38399682</pid>
<hngnm>황성림</hngnm>
<brthdd>19640629</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28LE4QY0</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948222020</prcpno>
<execprcpuntqno>2085281949</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>35637</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>11428692</pid>
<hngnm>윤혜화</hngnm>
<brthdd>19711225</brthdd>
<sex>2</sex>
<age>54</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28LE5Q90</bcno>
<orddd>20251113</orddd>
<prcpdd>20251113</prcpdd>
<prcpno>1945953146</prcpno>
<execprcpuntqno>2082866275</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42719</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>41562544</pid>
<hngnm>김선영</hngnm>
<brthdd>19760410</brthdd>
<sex>2</sex>
<age>49</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28LF1HA0</bcno>
<orddd>20251118</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947770104</prcpno>
<execprcpuntqno>2084804479</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251216</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>62969</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z315</preicd10cd>
<preicd10hngnm>유전상담</preicd10hngnm>
<posticd10cd>Z315</posticd10cd>
<posticd10hngnm>유전상담</posticd10hngnm>
<pid>41497180</pid>
<hngnm>지아율</hngnm>
<brthdd>20241223</brthdd>
<sex>2</sex>
<age>1</age>
<testcd>LPE532</testcd>
<testnm>Ras질병(Rasopahy) [NGS]</testnm>
<bcno>O28KT4820</bcno>
<orddd>20251029</orddd>
<prcpdd>20251029</prcpdd>
<prcpno>1940221656</prcpno>
<execprcpuntqno>2076768189</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251029</spcacptdt>
<lstreptdt>20251217</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4001359</clamacptno>
<docuseqno>01172</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C924</preicd10cd>
<preicd10hngnm>급성 전골수구성 백혈병 [PML]</preicd10hngnm>
<posticd10cd>C924</posticd10cd>
<posticd10hngnm>급성 전골수구성 백혈병 [PML]</posticd10hngnm>
<pid>41569815</pid>
<hngnm>장형순</hngnm>
<brthdd>19640909</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E28LF0850</bcno>
<orddd>20251117</orddd>
<prcpdd>20251120</prcpdd>
<prcpno>1948626352</prcpno>
<execprcpuntqno>2085709584</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251120</spcacptdt>
<lstreptdt>20251217</lstreptdt>
<stage>C924 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01176</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41571873</pid>
<hngnm>서원준</hngnm>
<brthdd>19720820</brthdd>
<sex>1</sex>
<age>53</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LG3570</bcno>
<orddd>20251119</orddd>
<prcpdd>20251121</prcpdd>
<prcpno>1949380354</prcpno>
<execprcpuntqno>2086520428</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251122</spcacptdt>
<lstreptdt>20251217</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001222</clamacptno>
<docuseqno>00184</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>22706386</pid>
<hngnm>백시원</hngnm>
<brthdd>20080411</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LK2510</bcno>
<orddd>20251119</orddd>
<prcpdd>20251125</prcpdd>
<prcpno>1950401787</prcpno>
<execprcpuntqno>2087603319</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251125</spcacptdt>
<lstreptdt>20251217</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37812</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41394494</pid>
<hngnm>김효빈</hngnm>
<brthdd>19921202</brthdd>
<sex>2</sex>
<age>33</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KJ72T0</bcno>
<orddd>20251013</orddd>
<prcpdd>20251013</prcpdd>
<prcpno>1933932073</prcpno>
<execprcpuntqno>2070099743</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251021</spcacptdt>
<lstreptdt>20251218</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4089911</clamacptno>
<docuseqno>38184</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>29449146</pid>
<hngnm>박정선</hngnm>
<brthdd>19961007</brthdd>
<sex>2</sex>
<age>29</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28JV1DC0</bcno>
<orddd>20250925</orddd>
<prcpdd>20250925</prcpdd>
<prcpno>1928472133</prcpno>
<execprcpuntqno>2064260924</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20250926</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37349</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41235365</pid>
<hngnm>곽경지</hngnm>
<brthdd>19450608</brthdd>
<sex>2</sex>
<age>80</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KM70H0</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938040367</prcpno>
<execprcpuntqno>2074449922</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251024</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>38012</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41470543</pid>
<hngnm>김상만</hngnm>
<brthdd>19590810</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KU4MP0</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940726632</prcpno>
<execprcpuntqno>2077302420</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>35541</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>39240813</pid>
<hngnm>김경애</hngnm>
<brthdd>19630825</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KU57S0</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940741083</prcpno>
<execprcpuntqno>2077317629</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251030</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>37968</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41447604</pid>
<hngnm>박희경</hngnm>
<brthdd>20000830</brthdd>
<sex>2</sex>
<age>25</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KU63N0</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940891954</prcpno>
<execprcpuntqno>2077478389</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>31036</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>16578923</pid>
<hngnm>김시원</hngnm>
<brthdd>19850804</brthdd>
<sex>2</sex>
<age>40</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KV4VF0</bcno>
<orddd>20251031</orddd>
<prcpdd>20251031</prcpdd>
<prcpno>1941213157</prcpno>
<execprcpuntqno>2077825041</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4100747</clamacptno>
<docuseqno>38069</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>41501313</pid>
<hngnm>소재동</hngnm>
<brthdd>19610822</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KV4YY0</bcno>
<orddd>20251031</orddd>
<prcpdd>20251031</prcpdd>
<prcpno>1941338249</prcpno>
<execprcpuntqno>2077960829</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251031</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>01026</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D728</preicd10cd>
<preicd10hngnm>기타 명시된 백혈구의 장애</preicd10hngnm>
<posticd10cd>C800</posticd10cd>
<posticd10hngnm>원발부위 미상으로 언급된 악성 신생물</posticd10hngnm>
<pid>41523702</pid>
<hngnm>황동수</hngnm>
<brthdd>19670505</brthdd>
<sex>1</sex>
<age>58</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>E28KY0CY0</bcno>
<orddd>20251031</orddd>
<prcpdd>20251103</prcpdd>
<prcpno>1941893139</prcpno>
<execprcpuntqno>2078555747</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C800 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>36122</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>19978436</pid>
<hngnm>이영범</hngnm>
<brthdd>19670214</brthdd>
<sex>2</sex>
<age>58</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KV4KV0</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938179706</prcpno>
<execprcpuntqno>2074597059</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>37031</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>27888712</pid>
<hngnm>박형기</hngnm>
<brthdd>19460821</brthdd>
<sex>1</sex>
<age>79</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KV4QG0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937752444</prcpno>
<execprcpuntqno>2074145557</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109362</clamacptno>
<docuseqno>01462</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>37757040</pid>
<hngnm>조영숙</hngnm>
<brthdd>19570915</brthdd>
<sex>2</sex>
<age>68</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KY1PX0</bcno>
<orddd>20251021</orddd>
<prcpdd>20251021</prcpdd>
<prcpno>1937058476</prcpno>
<execprcpuntqno>2073415136</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251103</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>01663</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41410053</pid>
<hngnm>김진이</hngnm>
<brthdd>19730219</brthdd>
<sex>2</sex>
<age>52</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>I28KZ0W90</bcno>
<orddd>20251024</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942177628</prcpno>
<execprcpuntqno>2078853559</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>40394</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>39735683</pid>
<hngnm>이현제</hngnm>
<brthdd>19570610</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KY6IV0</bcno>
<orddd>20251022</orddd>
<prcpdd>20251022</prcpdd>
<prcpno>1937621450</prcpno>
<execprcpuntqno>2074008600</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42440</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>41480982</pid>
<hngnm>박경일</hngnm>
<brthdd>19540323</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KY6JI0</bcno>
<orddd>20251024</orddd>
<prcpdd>20251024</prcpdd>
<prcpno>1938413329</prcpno>
<execprcpuntqno>2074845635</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>36491</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>22206576</pid>
<hngnm>김종철</hngnm>
<brthdd>19520208</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28KY6KP0</bcno>
<orddd>20251029</orddd>
<prcpdd>20251029</prcpdd>
<prcpno>1940453602</prcpno>
<execprcpuntqno>2077012545</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C900 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41536716</pid>
<hngnm>장석규</hngnm>
<brthdd>19470413</brthdd>
<sex>1</sex>
<age>78</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KZ6KH0</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942647595</prcpno>
<execprcpuntqno>2079350658</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251104</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>00348</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I420</preicd10cd>
<preicd10hngnm>확장성 심근병증</preicd10hngnm>
<posticd10cd>I420</posticd10cd>
<posticd10hngnm>확장성 심근병증</posticd10hngnm>
<pid>41460500</pid>
<hngnm>김충래</hngnm>
<brthdd>19520520</brthdd>
<sex>1</sex>
<age>73</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28KZ1ZN0</bcno>
<orddd>20251103</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942306159</prcpno>
<execprcpuntqno>2078990117</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42364</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41443484</pid>
<hngnm>최상덕</hngnm>
<brthdd>19590910</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28KZ6B50</bcno>
<orddd>20251023</orddd>
<prcpdd>20251023</prcpdd>
<prcpno>1938216458</prcpno>
<execprcpuntqno>2074635902</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41110484</pid>
<hngnm>이상수</hngnm>
<brthdd>19710224</brthdd>
<sex>1</sex>
<age>54</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L064Z0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251105</prcpdd>
<prcpno>1943091386</prcpno>
<execprcpuntqno>2079820519</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>40733</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D473</preicd10cd>
<preicd10hngnm>본태성(출혈성) 혈소판 증가증</preicd10hngnm>
<posticd10cd>D473</posticd10cd>
<posticd10hngnm>본태성(출혈성) 혈소판 증가증</posticd10hngnm>
<pid>40171764</pid>
<hngnm>진정숙</hngnm>
<brthdd>19701009</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L066V0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251105</prcpdd>
<prcpno>1943094418</prcpno>
<execprcpuntqno>2079823846</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>38575</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>35385524</pid>
<hngnm>이화혁</hngnm>
<brthdd>19540114</brthdd>
<sex>2</sex>
<age>72</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L06DD0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251105</prcpdd>
<prcpno>1943030122</prcpno>
<execprcpuntqno>2079755421</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251105</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01141</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41519054</pid>
<hngnm>고석건</hngnm>
<brthdd>19690415</brthdd>
<sex>1</sex>
<age>56</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28L100M0</bcno>
<orddd>20251105</orddd>
<prcpdd>20251105</prcpdd>
<prcpno>1943136378</prcpno>
<execprcpuntqno>2079868003</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251106</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>37020</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>27810442</pid>
<hngnm>전현태</hngnm>
<brthdd>19731123</brthdd>
<sex>1</sex>
<age>52</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L05HB0</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939460091</prcpno>
<execprcpuntqno>2075965403</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251106</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42131</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>41339543</pid>
<hngnm>송용우</hngnm>
<brthdd>19570408</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L05K30</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942527314</prcpno>
<execprcpuntqno>2079223304</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251106</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4097532</clamacptno>
<docuseqno>00701</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>34785753</pid>
<hngnm>이준기</hngnm>
<brthdd>19810325</brthdd>
<sex>1</sex>
<age>44</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28L21V40</bcno>
<orddd>20251029</orddd>
<prcpdd>20251107</prcpdd>
<prcpno>1943796456</prcpno>
<execprcpuntqno>2080573999</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>41017</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D477</preicd10cd>
<preicd10hngnm>기타 명시된 림프, 조혈 및 관련 조직의 행동양식 불명 또는 미상의 상세불명의 신생물</preicd10hngnm>
<posticd10cd>D477</posticd10cd>
<posticd10hngnm>기타 명시된 림프, 조혈 및 관련 조직의 행동양식 불명 또는 미상의 상세불명의 신생물</posticd10hngnm>
<pid>40750403</pid>
<hngnm>오상도</hngnm>
<brthdd>19630104</brthdd>
<sex>1</sex>
<age>63</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28L15UK0</bcno>
<orddd>20250930</orddd>
<prcpdd>20250930</prcpdd>
<prcpno>1930113895</prcpno>
<execprcpuntqno>2066006179</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251107</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42425</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41474163</pid>
<hngnm>전나영</hngnm>
<brthdd>19680730</brthdd>
<sex>2</sex>
<age>57</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L24S40</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940910510</prcpno>
<execprcpuntqno>2077497998</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>38149</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>34032030</pid>
<hngnm>이용주</hngnm>
<brthdd>19551217</brthdd>
<sex>1</sex>
<age>70</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L24X90</bcno>
<orddd>20251027</orddd>
<prcpdd>20251027</prcpdd>
<prcpno>1939243319</prcpno>
<execprcpuntqno>2075737880</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>40549</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>39961446</pid>
<hngnm>김세라</hngnm>
<brthdd>19830104</brthdd>
<sex>2</sex>
<age>43</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L24XL0</bcno>
<orddd>20251030</orddd>
<prcpdd>20251030</prcpdd>
<prcpno>1940886755</prcpno>
<execprcpuntqno>2077472904</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42358</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41437692</pid>
<hngnm>유지인</hngnm>
<brthdd>19950111</brthdd>
<sex>2</sex>
<age>31</age>
<testcd>LPE473</testcd>
<testnm>골수형성이상, 골수증식종양 [NGS]</testnm>
<bcno>O28L57FQ0</bcno>
<orddd>20251110</orddd>
<prcpdd>20251110</prcpdd>
<prcpno>1944740064</prcpno>
<execprcpuntqno>2081585350</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251110</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103264</clamacptno>
<docuseqno>00163</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>O6001</preicd10cd>
<preicd10hngnm>분만이 없는 조기진통, 임신 22주 이상, 34주 미만</preicd10hngnm>
<posticd10cd>O362</posticd10cd>
<posticd10hngnm>태아 수종의 산모관리</posticd10hngnm>
<pid>41559561</pid>
<hngnm>부이티후옌</hngnm>
<brthdd>19940909</brthdd>
<sex>2</sex>
<age>31</age>
<testcd>LPE639</testcd>
<testnm>선천기형 [NGS]</testnm>
<bcno>I28L72K00</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945679186</prcpno>
<execprcpuntqno>2082577203</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251112</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4001222</clamacptno>
<docuseqno>00474</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Q871</preicd10cd>
<preicd10hngnm>주로 단신과 관련된 선천기형증후군</preicd10hngnm>
<posticd10cd>P832</posticd10cd>
<posticd10hngnm>용혈질환으로 인하지 않은 태아수종</posticd10hngnm>
<pid>41559754</pid>
<hngnm>김민진</hngnm>
<brthdd>20251118</brthdd>
<sex>2</sex>
<age>0</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>I28LE12S0</bcno>
<orddd>20251118</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948025704</prcpno>
<execprcpuntqno>2085074284</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41582693</pid>
<hngnm>이수현</hngnm>
<brthdd>20081002</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE636</testcd>
<testnm>유전성 안질환 [NGS]</testnm>
<bcno>O28LE6L20</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948419921</prcpno>
<execprcpuntqno>2085491282</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>7909320</pid>
<hngnm>박예림</hngnm>
<brthdd>19891010</brthdd>
<sex>2</sex>
<age>36</age>
<testcd>LPE522</testcd>
<testnm>유전성 골형성이상 질환 [NGS]</testnm>
<bcno>O28LJ83F0</bcno>
<orddd>20251124</orddd>
<prcpdd>20251124</prcpdd>
<prcpno>1950158671</prcpno>
<execprcpuntqno>2087347286</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251124</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4001359</clamacptno>
<docuseqno>00861</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>39444751</pid>
<hngnm>정영순</hngnm>
<brthdd>19670420</brthdd>
<sex>2</sex>
<age>58</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>I28M12PL0</bcno>
<orddd>20251209</orddd>
<prcpdd>20251211</prcpdd>
<prcpno>1956833358</prcpno>
<execprcpuntqno>2094434234</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251211</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>41277</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>20222646</pid>
<hngnm>김진성</hngnm>
<brthdd>19610811</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28M065B0</bcno>
<orddd>20251204</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954305659</prcpno>
<execprcpuntqno>2091746936</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251211</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>00529</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C911</preicd10cd>
<preicd10hngnm>B-세포형 만성 림프구성 백혈병</preicd10hngnm>
<posticd10cd>C911</posticd10cd>
<posticd10hngnm>B-세포형 만성 림프구성 백혈병</posticd10hngnm>
<pid>37471393</pid>
<hngnm>임영욱</hngnm>
<brthdd>19681021</brthdd>
<sex>1</sex>
<age>57</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>E28M207N0</bcno>
<orddd>20251211</orddd>
<prcpdd>20251212</prcpdd>
<prcpno>1957282894</prcpno>
<execprcpuntqno>2094909335</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251212</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage>C911 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>45134</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>D462</preicd10cd>
<preicd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</preicd10hngnm>
<posticd10cd>D462</posticd10cd>
<posticd10hngnm>모세포과잉의 불응성 빈혈 [RAEB]</posticd10hngnm>
<pid>38246151</pid>
<hngnm>전찬동</hngnm>
<brthdd>19790708</brthdd>
<sex>1</sex>
<age>46</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28M50Q60</bcno>
<orddd>20251020</orddd>
<prcpdd>20251020</prcpdd>
<prcpno>1936397991</prcpno>
<execprcpuntqno>2072720614</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251215</spcacptdt>
<lstreptdt>20251219</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4089818</clamacptno>
<docuseqno>26182</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>P0739</preicd10cd>
<preicd10hngnm>상세불명 주수의 기타 조산아</preicd10hngnm>
<posticd10cd>P0739</posticd10cd>
<posticd10hngnm>상세불명 주수의 기타 조산아</posticd10hngnm>
<pid>38443043</pid>
<hngnm>이지안</hngnm>
<brthdd>20230317</brthdd>
<sex>2</sex>
<age>2</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O28JL56S0</bcno>
<orddd>20250917</orddd>
<prcpdd>20250917</prcpdd>
<prcpno>1925103583</prcpno>
<execprcpuntqno>2060692875</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20250917</spcacptdt>
<lstreptdt>20251222</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>25322345</pid>
<hngnm>정대일</hngnm>
<brthdd>19820604</brthdd>
<sex>1</sex>
<age>43</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28L75I50</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945592447</prcpno>
<execprcpuntqno>2082485238</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251112</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109362</clamacptno>
<docuseqno>01274</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>R311</preicd10cd>
<preicd10hngnm>현미경적 혈뇨</preicd10hngnm>
<posticd10cd>R311</posticd10cd>
<posticd10hngnm>현미경적 혈뇨</posticd10hngnm>
<pid>41329775</pid>
<hngnm>전부덕</hngnm>
<brthdd>19590220</brthdd>
<sex>2</sex>
<age>66</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28L75PA0</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945551269</prcpno>
<execprcpuntqno>2082441700</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251112</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41563503</pid>
<hngnm>양승만</hngnm>
<brthdd>19640503</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28L85810</bcno>
<orddd>20251113</orddd>
<prcpdd>20251113</prcpdd>
<prcpno>1946038269</prcpno>
<execprcpuntqno>2082956468</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251113</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>42253</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>41394494</pid>
<hngnm>김효빈</hngnm>
<brthdd>19921202</brthdd>
<sex>2</sex>
<age>33</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>O28L85GI0</bcno>
<orddd>20251106</orddd>
<prcpdd>20251106</prcpdd>
<prcpno>1943522867</prcpno>
<execprcpuntqno>2080279540</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251113</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4097548</clamacptno>
<docuseqno>00233</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E343</preicd10cd>
<preicd10hngnm>달리 분류되지 않은 단신</preicd10hngnm>
<posticd10cd>E343</posticd10cd>
<posticd10hngnm>달리 분류되지 않은 단신</posticd10hngnm>
<pid>35746123</pid>
<hngnm>조하솔</hngnm>
<brthdd>20210226</brthdd>
<sex>2</sex>
<age>4</age>
<testcd>LPE524</testcd>
<testnm>유전성 저신장증 [NGS]</testnm>
<bcno>I28L85440</bcno>
<orddd>20251112</orddd>
<prcpdd>20251114</prcpdd>
<prcpno>1945846621</prcpno>
<execprcpuntqno>2082753852</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251114</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109855</clamacptno>
<docuseqno>09894</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E1410</preicd10cd>
<preicd10hngnm>상세불명의 당뇨병, 케토산증을 동반한 </preicd10hngnm>
<posticd10cd>E1410</posticd10cd>
<posticd10hngnm>상세불명의 당뇨병, 케토산증을 동반한 </posticd10hngnm>
<pid>41024914</pid>
<hngnm>김도연</hngnm>
<brthdd>20150326</brthdd>
<sex>2</sex>
<age>10</age>
<testcd>LPE540</testcd>
<testnm>유전성 당뇨 [NGS]</testnm>
<bcno>O28LA06X0</bcno>
<orddd>20251113</orddd>
<prcpdd>20251113</prcpdd>
<prcpno>1946097448</prcpno>
<execprcpuntqno>2083019886</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251115</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>68774</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H359</preicd10cd>
<preicd10hngnm>상세불명의 망막 장애</preicd10hngnm>
<posticd10cd>H359</posticd10cd>
<posticd10hngnm>상세불명의 망막 장애</posticd10hngnm>
<pid>40860740</pid>
<hngnm>이기한</hngnm>
<brthdd>19560318</brthdd>
<sex>1</sex>
<age>69</age>
<testcd>LPE539</testcd>
<testnm>유전성 망막병증 [NGS]</testnm>
<bcno>O28LC7990</bcno>
<orddd>20251117</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947432093</prcpno>
<execprcpuntqno>2084447667</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109850</clamacptno>
<docuseqno>08422</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H538</preicd10cd>
<preicd10hngnm>기타 시각 장애</preicd10hngnm>
<posticd10cd>H538</posticd10cd>
<posticd10hngnm>기타 시각 장애</posticd10hngnm>
<pid>40416366</pid>
<hngnm>신민철</hngnm>
<brthdd>19780714</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE636</testcd>
<testnm>유전성 안질환 [NGS]</testnm>
<bcno>O28LC7H00</bcno>
<orddd>20251117</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947468588</prcpno>
<execprcpuntqno>2084485817</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00512</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>39540892</pid>
<hngnm>정래철</hngnm>
<brthdd>19730109</brthdd>
<sex>1</sex>
<age>53</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LC3LA0</bcno>
<orddd>20251116</orddd>
<prcpdd>20251116</prcpdd>
<prcpno>1946956351</prcpno>
<execprcpuntqno>2083945963</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00518</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41102883</pid>
<hngnm>우원제</hngnm>
<brthdd>19970310</brthdd>
<sex>1</sex>
<age>28</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LC4AK0</bcno>
<orddd>20251116</orddd>
<prcpdd>20251116</prcpdd>
<prcpno>1946960875</prcpno>
<execprcpuntqno>2083950844</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109850</clamacptno>
<docuseqno>16231</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H931</preicd10cd>
<preicd10hngnm>이명</preicd10hngnm>
<posticd10cd>H931</posticd10cd>
<posticd10hngnm>이명</posticd10hngnm>
<pid>41277721</pid>
<hngnm>이혜숙</hngnm>
<brthdd>19701005</brthdd>
<sex>2</sex>
<age>55</age>
<testcd>LPE488</testcd>
<testnm>유전성 난청 [NGS]</testnm>
<bcno>O28LD6T70</bcno>
<orddd>20251118</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947906330</prcpno>
<execprcpuntqno>2084949223</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>68767</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>H185</preicd10cd>
<preicd10hngnm>유전성 각막 디스트로피</preicd10hngnm>
<posticd10cd>H185</posticd10cd>
<posticd10hngnm>유전성 각막 디스트로피</posticd10hngnm>
<pid>38310973</pid>
<hngnm>장경숙</hngnm>
<brthdd>19730920</brthdd>
<sex>2</sex>
<age>52</age>
<testcd>LPE636</testcd>
<testnm>유전성 안질환 [NGS]</testnm>
<bcno>O28LD6UF0</bcno>
<orddd>20251118</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947943500</prcpno>
<execprcpuntqno>2084987727</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251118</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103264</clamacptno>
<docuseqno>00363</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G723</preicd10cd>
<preicd10hngnm>주기마비</preicd10hngnm>
<posticd10cd>G723</posticd10cd>
<posticd10hngnm>주기마비</posticd10hngnm>
<pid>40122385</pid>
<hngnm>오채은</hngnm>
<brthdd>20080630</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE520</testcd>
<testnm>유전성 근신경계 질환 [NGS]</testnm>
<bcno>I28LD37F0</bcno>
<orddd>20251118</orddd>
<prcpdd>20251118</prcpdd>
<prcpno>1947921521</prcpno>
<execprcpuntqno>2084965230</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>38547182</pid>
<hngnm>노유나</hngnm>
<brthdd>19891229</brthdd>
<sex>2</sex>
<age>36</age>
<testcd>LPE526</testcd>
<testnm>유전성 근육퇴행위축 질환 [NGS]</testnm>
<bcno>O28LE4H30</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948223583</prcpno>
<execprcpuntqno>2085283627</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>38180</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D474</preicd10cd>
<preicd10hngnm>골수섬유증</preicd10hngnm>
<posticd10cd>D474</posticd10cd>
<posticd10hngnm>골수섬유증</posticd10hngnm>
<pid>34110576</pid>
<hngnm>이승세</hngnm>
<brthdd>19541006</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28LJ87Q0</bcno>
<orddd>20251124</orddd>
<prcpdd>20251124</prcpdd>
<prcpno>1950156864</prcpno>
<execprcpuntqno>2087345449</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251125</spcacptdt>
<lstreptdt>20251223</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01179</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>41581551</pid>
<hngnm>김선희</hngnm>
<brthdd>19860228</brthdd>
<sex>2</sex>
<age>39</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E28LL0BM0</bcno>
<orddd>20251124</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1950982821</prcpno>
<execprcpuntqno>2088215514</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01169</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C923</preicd10cd>
<preicd10hngnm>골수성 육종</preicd10hngnm>
<posticd10cd>C923</posticd10cd>
<posticd10hngnm>골수성 육종</posticd10hngnm>
<pid>41566125</pid>
<hngnm>이강호</hngnm>
<brthdd>19570505</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I28LK2KH0</bcno>
<orddd>20251124</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1950570817</prcpno>
<execprcpuntqno>2087781957</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C923 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>00653</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>21456001</pid>
<hngnm>김광율</hngnm>
<brthdd>19770713</brthdd>
<sex>1</sex>
<age>48</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I28LL2C70</bcno>
<orddd>20251120</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1950913801</prcpno>
<execprcpuntqno>2088142345</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C950 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>01048</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>41593042</pid>
<hngnm>신영자</hngnm>
<brthdd>19421016</brthdd>
<sex>2</sex>
<age>83</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I28LL2IM0</bcno>
<orddd>20251123</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1951096155</prcpno>
<execprcpuntqno>2088335308</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>40407</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>39746073</pid>
<hngnm>박금숙</hngnm>
<brthdd>19580710</brthdd>
<sex>2</sex>
<age>67</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>O28LM6XH0</bcno>
<orddd>20251127</orddd>
<prcpdd>20251127</prcpdd>
<prcpno>1951632748</prcpno>
<execprcpuntqno>2088902738</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251127</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>01050</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>41604644</pid>
<hngnm>김석민</hngnm>
<brthdd>19890905</brthdd>
<sex>1</sex>
<age>36</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>E28LP05E0</bcno>
<orddd>20251126</orddd>
<prcpdd>20251128</prcpdd>
<prcpno>1952188696</prcpno>
<execprcpuntqno>2089503800</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251129</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>00699</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41588741</pid>
<hngnm>최호혁</hngnm>
<brthdd>19980928</brthdd>
<sex>1</sex>
<age>27</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>E28LR07V0</bcno>
<orddd>20251126</orddd>
<prcpdd>20251201</prcpdd>
<prcpno>1952532346</prcpno>
<execprcpuntqno>2089872244</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251201</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001222</clamacptno>
<docuseqno>00350</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>40126853</pid>
<hngnm>윤이삭</hngnm>
<brthdd>20240720</brthdd>
<sex>1</sex>
<age>1</age>
<testcd>LPE471</testcd>
<testnm>급성골수성백혈병 [NGS]</testnm>
<bcno>I28LR41D0</bcno>
<orddd>20251201</orddd>
<prcpdd>20251201</prcpdd>
<prcpno>1952980626</prcpno>
<execprcpuntqno>2090343054</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251202</spcacptdt>
<lstreptdt>20251224</lstreptdt>
<stage>C920 /</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>00302</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I420</preicd10cd>
<preicd10hngnm>확장성 심근병증</preicd10hngnm>
<posticd10cd>I420</posticd10cd>
<posticd10hngnm>확장성 심근병증</posticd10hngnm>
<pid>38851780</pid>
<hngnm>강종언</hngnm>
<brthdd>19591008</brthdd>
<sex>1</sex>
<age>66</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>I28LB47M0</bcno>
<orddd>20251115</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1946969244</prcpno>
<execprcpuntqno>2083959741</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41573030</pid>
<hngnm>이수아</hngnm>
<brthdd>20251027</brthdd>
<sex>2</sex>
<age>0</age>
<testcd>LPE531</testcd>
<testnm>유전성 성분화이상 [NGS]</testnm>
<bcno>O28LC5ND0</bcno>
<orddd>20251117</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947266498</prcpno>
<execprcpuntqno>2084273502</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41573041</pid>
<hngnm>김재헌</hngnm>
<brthdd>19790217</brthdd>
<sex>1</sex>
<age>46</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LC5NE0</bcno>
<orddd>20251117</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947266532</prcpno>
<execprcpuntqno>2084273533</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>57452</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>G934</preicd10cd>
<preicd10hngnm>상세불명의 뇌병증</preicd10hngnm>
<posticd10cd>G934</posticd10cd>
<posticd10hngnm>상세불명의 뇌병증</posticd10hngnm>
<pid>26864042</pid>
<hngnm>문종현</hngnm>
<brthdd>19910928</brthdd>
<sex>1</sex>
<age>34</age>
<testcd>LPE537</testcd>
<testnm>치매 [NGS]</testnm>
<bcno>O28LE4C70</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948190330</prcpno>
<execprcpuntqno>2085248297</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109855</clamacptno>
<docuseqno>10020</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>M0826</preicd10cd>
<preicd10hngnm>전신적으로 발병된 연소성 관절염, 아래다리</preicd10hngnm>
<posticd10cd>M0826</posticd10cd>
<posticd10hngnm>전신적으로 발병된 연소성 관절염, 아래다리</posticd10hngnm>
<pid>41175024</pid>
<hngnm>장세아</hngnm>
<brthdd>20150403</brthdd>
<sex>2</sex>
<age>10</age>
<testcd>LPE489</testcd>
<testnm>선천성 면역결핍증 [NGS]</testnm>
<bcno>O28LG2Q60</bcno>
<orddd>20251121</orddd>
<prcpdd>20251121</prcpdd>
<prcpno>1949052561</prcpno>
<execprcpuntqno>2086165782</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251121</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103264</clamacptno>
<docuseqno>00249</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>E1410</preicd10cd>
<preicd10hngnm>상세불명의 당뇨병, 케토산증을 동반한 </preicd10hngnm>
<posticd10cd>E1010</posticd10cd>
<posticd10hngnm>1형 당뇨병, 케토산증을 동반한 </posticd10hngnm>
<pid>34697092</pid>
<hngnm>이재준</hngnm>
<brthdd>20191130</brthdd>
<sex>1</sex>
<age>6</age>
<testcd>LPE540</testcd>
<testnm>유전성 당뇨 [NGS]</testnm>
<bcno>I28LG3XY0</bcno>
<orddd>20251119</orddd>
<prcpdd>20251120</prcpdd>
<prcpno>1948903859</prcpno>
<execprcpuntqno>2086004837</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251122</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>00543</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41488430</pid>
<hngnm>김란이</hngnm>
<brthdd>19630722</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LJ1Q80</bcno>
<orddd>20251123</orddd>
<prcpdd>20251123</prcpdd>
<prcpno>1949646184</prcpno>
<execprcpuntqno>2086808724</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251124</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41597072</pid>
<hngnm>강다정</hngnm>
<brthdd>20090331</brthdd>
<sex>2</sex>
<age>16</age>
<testcd>LPE540</testcd>
<testnm>유전성 당뇨 [NGS]</testnm>
<bcno>O28LJ81S0</bcno>
<orddd>20251124</orddd>
<prcpdd>20251124</prcpdd>
<prcpno>1950147067</prcpno>
<execprcpuntqno>2087335260</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251124</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107231</clamacptno>
<docuseqno>00535</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z940</preicd10cd>
<preicd10hngnm>신장 이식 상태</preicd10hngnm>
<posticd10cd>Z940</posticd10cd>
<posticd10hngnm>신장 이식 상태</posticd10hngnm>
<pid>39686690</pid>
<hngnm>이원범</hngnm>
<brthdd>19801210</brthdd>
<sex>1</sex>
<age>45</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LJ4910</bcno>
<orddd>20251123</orddd>
<prcpdd>20251123</prcpdd>
<prcpno>1949646820</prcpno>
<execprcpuntqno>2086809364</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251125</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00516</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>40640934</pid>
<hngnm>마봉우</hngnm>
<brthdd>19780921</brthdd>
<sex>1</sex>
<age>47</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LI2D20</bcno>
<orddd>20251123</orddd>
<prcpdd>20251123</prcpdd>
<prcpno>1949647167</prcpno>
<execprcpuntqno>2086809717</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41603801</pid>
<hngnm>남수현</hngnm>
<brthdd>19900421</brthdd>
<sex>1</sex>
<age>35</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28LL5J10</bcno>
<orddd>20251126</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1951019969</prcpno>
<execprcpuntqno>2088254505</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4107175</clamacptno>
<docuseqno>00369</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>J101</preicd10cd>
<preicd10hngnm>계절성 인플루엔자바이러스가 확인된, 기타 호흡기 증상을 동반한 인플루엔자</preicd10hngnm>
<posticd10cd>J101</posticd10cd>
<posticd10hngnm>계절성 인플루엔자바이러스가 확인된, 기타 호흡기 증상을 동반한 인플루엔자</posticd10hngnm>
<pid>41104176</pid>
<hngnm>김선우</hngnm>
<brthdd>20240910</brthdd>
<sex>1</sex>
<age>1</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>I28LU2H90</bcno>
<orddd>20251202</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954046674</prcpno>
<execprcpuntqno>2091471257</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251204</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4001222</clamacptno>
<docuseqno>00245</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I730</preicd10cd>
<preicd10hngnm>레이노증후군</preicd10hngnm>
<posticd10cd>I730</posticd10cd>
<posticd10hngnm>레이노증후군</posticd10hngnm>
<pid>36217944</pid>
<hngnm>유가은</hngnm>
<brthdd>20080614</brthdd>
<sex>2</sex>
<age>17</age>
<testcd>LPE489</testcd>
<testnm>선천성 면역결핍증 [NGS]</testnm>
<bcno>I28LV0NS0</bcno>
<orddd>20251203</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954042264</prcpno>
<execprcpuntqno>2091466670</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251205</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>46459</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>40367833</pid>
<hngnm>홍미정</hngnm>
<brthdd>19640123</brthdd>
<sex>2</sex>
<age>61</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28M730R0</bcno>
<orddd>20251119</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948210524</prcpno>
<execprcpuntqno>2085269694</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251217</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>45143</docuseqno>
<pay100ownbrate>5</pay100ownbrate>
<preicd10cd>C920</preicd10cd>
<preicd10hngnm>급성 골수모구성 백혈병</preicd10hngnm>
<posticd10cd>C920</posticd10cd>
<posticd10hngnm>급성 골수모구성 백혈병</posticd10hngnm>
<pid>38256793</pid>
<hngnm>홍석조</hngnm>
<brthdd>19710122</brthdd>
<sex>2</sex>
<age>54</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28M95DL0</bcno>
<orddd>20251216</orddd>
<prcpdd>20251216</prcpdd>
<prcpno>1958946050</prcpno>
<execprcpuntqno>2096675273</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251222</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage>C920 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41005534</pid>
<hngnm>정하연</hngnm>
<brthdd>20120920</brthdd>
<sex>2</sex>
<age>13</age>
<testcd>LPE426</testcd>
<testnm>(비유전성) TP53 Gene, Mutation [sequencing]</testnm>
<bcno>O28MC4IJ0</bcno>
<orddd>20251222</orddd>
<prcpdd>20251222</prcpdd>
<prcpno>1960900001</prcpno>
<execprcpuntqno>2098758676</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251222</spcacptdt>
<lstreptdt>20251229</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial/>
<bmtyn/>
<testexec/>
<familyhist/>
<reqfrmcd/>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>10528</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>41371634</pid>
<hngnm>이강실</hngnm>
<brthdd>19641120</brthdd>
<sex>1</sex>
<age>61</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LU6VI0</bcno>
<orddd>20251204</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954364698</prcpno>
<execprcpuntqno>2091808352</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251205</spcacptdt>
<lstreptdt>20251230</lstreptdt>
<stage>C61 /4B</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41638206</pid>
<hngnm>이은순</hngnm>
<brthdd>19620722</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LY5RF0</bcno>
<orddd>20251208</orddd>
<prcpdd>20251208</prcpdd>
<prcpno>1955429288</prcpno>
<execprcpuntqno>2092952307</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251208</spcacptdt>
<lstreptdt>20251230</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>09448</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C61</preicd10cd>
<preicd10hngnm>전립선암</preicd10hngnm>
<posticd10cd>C61</posticd10cd>
<posticd10hngnm>전립선암</posticd10hngnm>
<pid>39886744</pid>
<hngnm>이숙우</hngnm>
<brthdd>19530918</brthdd>
<sex>1</sex>
<age>72</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28LZ7ER0</bcno>
<orddd>20251209</orddd>
<prcpdd>20251209</prcpdd>
<prcpno>1956141913</prcpno>
<execprcpuntqno>2093701162</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251210</spcacptdt>
<lstreptdt>20251230</lstreptdt>
<stage>C61 /4B</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41646834</pid>
<hngnm>조은화</hngnm>
<brthdd>19690825</brthdd>
<sex>2</sex>
<age>56</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28M052Q0</bcno>
<orddd>20251210</orddd>
<prcpdd>20251210</prcpdd>
<prcpno>1956453859</prcpno>
<execprcpuntqno>2094031200</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251210</spcacptdt>
<lstreptdt>20251230</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4109949</clamacptno>
<docuseqno>42200</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41360481</pid>
<hngnm>최부칠</hngnm>
<brthdd>19500202</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28L61BW0</bcno>
<orddd>20251001</orddd>
<prcpdd>20251001</prcpdd>
<prcpno>1930563923</prcpno>
<execprcpuntqno>2066479865</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251111</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>01029</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41479342</pid>
<hngnm>차면</hngnm>
<brthdd>19580818</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>E28L803Z0</bcno>
<orddd>20251112</orddd>
<prcpdd>20251112</prcpdd>
<prcpno>1945755058</prcpno>
<execprcpuntqno>2082656247</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251113</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42579</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41522812</pid>
<hngnm>서미현</hngnm>
<brthdd>19711014</brthdd>
<sex>2</sex>
<age>54</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28L76HT0</bcno>
<orddd>20251106</orddd>
<prcpdd>20251106</prcpdd>
<prcpno>1943364543</prcpno>
<execprcpuntqno>2080110357</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251113</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>-</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C900</preicd10cd>
<preicd10hngnm>다발성 골수종</preicd10hngnm>
<posticd10cd>C900</posticd10cd>
<posticd10hngnm>다발성 골수종</posticd10hngnm>
<pid>41549705</pid>
<hngnm>박성길</hngnm>
<brthdd>19510601</brthdd>
<sex>1</sex>
<age>74</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28L840C0</bcno>
<orddd>20251112</orddd>
<prcpdd>20251114</prcpdd>
<prcpno>1945990924</prcpno>
<execprcpuntqno>2082906234</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251114</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C900 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4103429</clamacptno>
<docuseqno>01048</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D477</preicd10cd>
<preicd10hngnm>기타 명시된 림프, 조혈 및 관련 조직의 행동양식 불명 또는 미상의 상세불명의 신생물</preicd10hngnm>
<posticd10cd>D477</posticd10cd>
<posticd10hngnm>기타 명시된 림프, 조혈 및 관련 조직의 행동양식 불명 또는 미상의 상세불명의 신생물</posticd10hngnm>
<pid>41543096</pid>
<hngnm>위강휘</hngnm>
<brthdd>19760429</brthdd>
<sex>1</sex>
<age>49</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28L92NC0</bcno>
<orddd>20251111</orddd>
<prcpdd>20251114</prcpdd>
<prcpno>1946640407</prcpno>
<execprcpuntqno>2083604208</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251114</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>42495</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D472</preicd10cd>
<preicd10hngnm>미결정의 단클론감마병증</preicd10hngnm>
<posticd10cd>D472</posticd10cd>
<posticd10hngnm>미결정의 단클론감마병증</posticd10hngnm>
<pid>41494124</pid>
<hngnm>강채오</hngnm>
<brthdd>19501118</brthdd>
<sex>1</sex>
<age>75</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>O28L86C00</bcno>
<orddd>20251104</orddd>
<prcpdd>20251104</prcpdd>
<prcpno>1942533479</prcpno>
<execprcpuntqno>2079229825</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251114</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01157</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3430</posticd10cd>
<posticd10hngnm>하엽, 기관지 또는 폐 , 오른쪽</posticd10hngnm>
<pid>41550715</pid>
<hngnm>신하영</hngnm>
<brthdd>20000420</brthdd>
<sex>2</sex>
<age>25</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28LC2AV0</bcno>
<orddd>20251111</orddd>
<prcpdd>20251117</prcpdd>
<prcpno>1947058848</prcpno>
<execprcpuntqno>2084054508</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251117</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C3430 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01178</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C833</preicd10cd>
<preicd10hngnm>미만성 B대세포 림프종</preicd10hngnm>
<posticd10cd>C833</posticd10cd>
<posticd10hngnm>미만성 B대세포 림프종</posticd10hngnm>
<pid>41578556</pid>
<hngnm>이순성</hngnm>
<brthdd>19610728</brthdd>
<sex>1</sex>
<age>64</age>
<testcd>LPE475</testcd>
<testnm>형질세포종 [NGS]</testnm>
<bcno>I28LE1RW0</bcno>
<orddd>20251118</orddd>
<prcpdd>20251119</prcpdd>
<prcpno>1948063334</prcpno>
<execprcpuntqno>2085113961</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251119</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C833 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41590452</pid>
<hngnm>김경아</hngnm>
<brthdd>19750128</brthdd>
<sex>2</sex>
<age>50</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LG4SI0</bcno>
<orddd>20251121</orddd>
<prcpdd>20251121</prcpdd>
<prcpno>1949311182</prcpno>
<execprcpuntqno>2086445865</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251121</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>31796083</pid>
<hngnm>주인환</hngnm>
<brthdd>19580318</brthdd>
<sex>1</sex>
<age>67</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LJ5Z60</bcno>
<orddd>20251124</orddd>
<prcpdd>20251124</prcpdd>
<prcpno>1949936228</prcpno>
<execprcpuntqno>2087114073</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251124</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41603784</pid>
<hngnm>윤경임</hngnm>
<brthdd>19630520</brthdd>
<sex>2</sex>
<age>62</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LL5IZ0</bcno>
<orddd>20251126</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1951019767</prcpno>
<execprcpuntqno>2088254303</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41603793</pid>
<hngnm>Krish Subedi</hngnm>
<brthdd>20020726</brthdd>
<sex>1</sex>
<age>23</age>
<testcd>LPE533</testcd>
<testnm>유전성 내분비질환 [NGS]</testnm>
<bcno>O28LL5J00</bcno>
<orddd>20251126</orddd>
<prcpdd>20251126</prcpdd>
<prcpno>1951019939</prcpno>
<execprcpuntqno>2088254475</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251126</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4109949</clamacptno>
<docuseqno>15987</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>I420</preicd10cd>
<preicd10hngnm>확장성 심근병증</preicd10hngnm>
<posticd10cd>I420</posticd10cd>
<posticd10hngnm>확장성 심근병증</posticd10hngnm>
<pid>41506664</pid>
<hngnm>박준범</hngnm>
<brthdd>19730625</brthdd>
<sex>1</sex>
<age>52</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LM4NW0</bcno>
<orddd>20251127</orddd>
<prcpdd>20251127</prcpdd>
<prcpno>1951413865</prcpno>
<execprcpuntqno>2088669804</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251127</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4103429</clamacptno>
<docuseqno>00525</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N183</preicd10cd>
<preicd10hngnm>만성 신장질환(3기)</preicd10hngnm>
<posticd10cd>N183</posticd10cd>
<posticd10hngnm>만성 신장질환(3기)</posticd10hngnm>
<pid>5192190</pid>
<hngnm>서용만</hngnm>
<brthdd>19711126</brthdd>
<sex>1</sex>
<age>54</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LN2400</bcno>
<orddd>20251128</orddd>
<prcpdd>20251128</prcpdd>
<prcpno>1951851196</prcpno>
<execprcpuntqno>2089135741</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251128</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4107231</clamacptno>
<docuseqno>00516</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>23526130</pid>
<hngnm>이은우</hngnm>
<brthdd>19910729</brthdd>
<sex>1</sex>
<age>34</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LQ2L30</bcno>
<orddd>20251130</orddd>
<prcpdd>20251130</prcpdd>
<prcpno>1952424862</prcpno>
<execprcpuntqno>2089758662</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251201</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4107169</clamacptno>
<docuseqno>00035</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>41446421</pid>
<hngnm>강진향</hngnm>
<brthdd>19770308</brthdd>
<sex>2</sex>
<age>48</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LQ30P0</bcno>
<orddd>20251130</orddd>
<prcpdd>20251130</prcpdd>
<prcpno>1952423858</prcpno>
<execprcpuntqno>2089757611</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251201</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4107231</clamacptno>
<docuseqno>00542</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D469</preicd10cd>
<preicd10hngnm>상세불명의 골수형성이상 증후군</preicd10hngnm>
<posticd10cd>D469</posticd10cd>
<posticd10hngnm>상세불명의 골수형성이상 증후군</posticd10hngnm>
<pid>41474163</pid>
<hngnm>전나영</hngnm>
<brthdd>19680730</brthdd>
<sex>2</sex>
<age>57</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LQ34M0</bcno>
<orddd>20251130</orddd>
<prcpdd>20251130</prcpdd>
<prcpno>1952457964</prcpno>
<execprcpuntqno>2089794380</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251201</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41621245</pid>
<hngnm>양주리</hngnm>
<brthdd>20160603</brthdd>
<sex>2</sex>
<age>9</age>
<testcd>LPE523</testcd>
<testnm>유전성 발달지연(DD/ASD) [NGS]</testnm>
<bcno>O28LS5S20</bcno>
<orddd>20251202</orddd>
<prcpdd>20251202</prcpdd>
<prcpno>1953275170</prcpno>
<execprcpuntqno>2090656204</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251202</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno/>
<docuseqno/>
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41622974</pid>
<hngnm>이혜원</hngnm>
<brthdd>19901028</brthdd>
<sex>2</sex>
<age>35</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LS73X0</bcno>
<orddd>20251202</orddd>
<prcpdd>20251202</prcpdd>
<prcpno>1953430274</prcpno>
<execprcpuntqno>2090819915</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251202</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>4107231</clamacptno>
<docuseqno>00582</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>J47</preicd10cd>
<preicd10hngnm>기관지확장증</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>17056825</pid>
<hngnm>이재헌</hngnm>
<brthdd>19541121</brthdd>
<sex>1</sex>
<age>71</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>E28LT0600</bcno>
<orddd>20251129</orddd>
<prcpdd>20251203</prcpdd>
<prcpno>1953519860</prcpno>
<execprcpuntqno>2090914056</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251203</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>01150</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41525810</pid>
<hngnm>박진완</hngnm>
<brthdd>19860607</brthdd>
<sex>1</sex>
<age>39</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LT1LL0</bcno>
<orddd>20251127</orddd>
<prcpdd>20251203</prcpdd>
<prcpno>1953542434</prcpno>
<execprcpuntqno>2090937632</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251203</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>45987</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>39742673</pid>
<hngnm>정순희</hngnm>
<brthdd>19560221</brthdd>
<sex>2</sex>
<age>69</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>O28LT4100</bcno>
<orddd>20251203</orddd>
<prcpdd>20251203</prcpdd>
<prcpno>1953641903</prcpno>
<execprcpuntqno>2091042330</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251203</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41626691</pid>
<hngnm>강명애</hngnm>
<brthdd>19621113</brthdd>
<sex>2</sex>
<age>63</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28LT5ZY0</bcno>
<orddd>20251203</orddd>
<prcpdd>20251203</prcpdd>
<prcpno>1953845002</prcpno>
<execprcpuntqno>2091257842</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251203</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>78726</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>Z315</preicd10cd>
<preicd10hngnm>유전상담</preicd10hngnm>
<posticd10cd>Z315</posticd10cd>
<posticd10hngnm>유전상담</posticd10hngnm>
<pid>39187224</pid>
<hngnm>정보라</hngnm>
<brthdd>19800527</brthdd>
<sex>2</sex>
<age>45</age>
<testcd>LPE525</testcd>
<testnm>유전성 결합조직 질환 [NGS]</testnm>
<bcno>O28LU4T50</bcno>
<orddd>20251204</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954131763</prcpno>
<execprcpuntqno>2091561931</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251204</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>유</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>00456</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C910</preicd10cd>
<preicd10hngnm>급성 림프모구성 백혈병 [ALL]</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41622832</pid>
<hngnm>MAHMOUD MOHAMED ASHRAF ABDELHAFIZ AHMED</hngnm>
<brthdd>20220209</brthdd>
<sex>1</sex>
<age>3</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>I28LU49P0</bcno>
<orddd>20251202</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954378936</prcpno>
<execprcpuntqno>2091823333</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251205</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>26959553</pid>
<hngnm>구기승</hngnm>
<brthdd>19570909</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE527</testcd>
<testnm>유전성 근육병증 [NGS]</testnm>
<bcno>O28LV3SA0</bcno>
<orddd>20251205</orddd>
<prcpdd>20251205</prcpdd>
<prcpno>1954691554</prcpno>
<execprcpuntqno>2092159883</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251205</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>00711</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>C950</preicd10cd>
<preicd10hngnm>상세불명 세포형의 급성 백혈병</preicd10hngnm>
<posticd10cd>C910</posticd10cd>
<posticd10hngnm>급성 림프모구성 백혈병 [ALL]</posticd10hngnm>
<pid>41625683</pid>
<hngnm>김몽순</hngnm>
<brthdd>19511006</brthdd>
<sex>2</sex>
<age>74</age>
<testcd>LPE472</testcd>
<testnm>급성림프구성백혈병 [NGS]</testnm>
<bcno>E28LY0FW0</bcno>
<orddd>20251203</orddd>
<prcpdd>20251205</prcpdd>
<prcpno>1954963287</prcpno>
<execprcpuntqno>2092457928</execprcpuntqno>
<spcnm>Bone marrow</spcnm>
<spccd>3</spccd>
<spcacptdt>20251208</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C910 / </stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn/>
<testexec>진단시</testexec>
<familyhist/>
<reqfrmcd>15</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>4001359</clamacptno>
<docuseqno>00555</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N185</preicd10cd>
<preicd10hngnm>만성 신장질환(5기)</preicd10hngnm>
<posticd10cd>N185</posticd10cd>
<posticd10hngnm>만성 신장질환(5기)</posticd10hngnm>
<pid>18773248</pid>
<hngnm>김용완</hngnm>
<brthdd>19571010</brthdd>
<sex>1</sex>
<age>68</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>I28LX23R0</bcno>
<orddd>20251207</orddd>
<prcpdd>20251207</prcpdd>
<prcpno>1955097277</prcpno>
<execprcpuntqno>2092601852</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251208</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>39504</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>N041</preicd10cd>
<preicd10hngnm>초점성 및 분절성 사구체 병변을 동반한 신 증후군</preicd10hngnm>
<posticd10cd>N041</posticd10cd>
<posticd10hngnm>초점성 및 분절성 사구체 병변을 동반한 신 증후군</posticd10hngnm>
<pid>39517784</pid>
<hngnm>김효진</hngnm>
<brthdd>20030605</brthdd>
<sex>1</sex>
<age>22</age>
<testcd>LPE517</testcd>
<testnm>유전성 신장질환 [NGS]</testnm>
<bcno>O28LY3FQ0</bcno>
<orddd>20250602</orddd>
<prcpdd>20250602</prcpdd>
<prcpno>1888313171</prcpno>
<execprcpuntqno>2021670148</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251208</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41640124</pid>
<hngnm>김묘환</hngnm>
<brthdd>19490320</brthdd>
<sex>1</sex>
<age>76</age>
<testcd>LPE518</testcd>
<testnm>유전성 심근병증 [NGS]</testnm>
<bcno>O28LY7EN0</bcno>
<orddd>20251208</orddd>
<prcpdd>20251208</prcpdd>
<prcpno>1955640180</prcpno>
<execprcpuntqno>2093174014</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251208</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>10292</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>39992551</pid>
<hngnm>박민준</hngnm>
<brthdd>20120317</brthdd>
<sex>1</sex>
<age>13</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>O28M16DN0</bcno>
<orddd>20250909</orddd>
<prcpdd>20250909</prcpdd>
<prcpno>1922184968</prcpno>
<execprcpuntqno>2057595387</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251211</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>48382</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D691</preicd10cd>
<preicd10hngnm>정성적 혈소판 결함</preicd10hngnm>
<posticd10cd>D691</posticd10cd>
<posticd10hngnm>정성적 혈소판 결함</posticd10hngnm>
<pid>41554910</pid>
<hngnm>정혜선</hngnm>
<brthdd>19891001</brthdd>
<sex>2</sex>
<age>36</age>
<testcd>LPE455</testcd>
<testnm>선천성 혈소판 감소증 [NGS]</testnm>
<bcno>O28M17IN0</bcno>
<orddd>20251204</orddd>
<prcpdd>20251204</prcpdd>
<prcpno>1954356222</prcpno>
<execprcpuntqno>2091799468</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251211</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>모름</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<worklist>
<gbn>L</gbn>
<hospnm>가톨릭대학교 서울성모병원</hospnm>
<proccorpcd>11100338</proccorpcd>
<clamacptno>-</clamacptno>
<docuseqno>52468</docuseqno>
<pay100ownbrate>50</pay100ownbrate>
<preicd10cd>C3499</preicd10cd>
<preicd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</preicd10hngnm>
<posticd10cd>C3499</posticd10cd>
<posticd10hngnm>상세불명의 기관지 또는 폐 , 상세불명 부위</posticd10hngnm>
<pid>4037448</pid>
<hngnm>김영단</hngnm>
<brthdd>19461121</brthdd>
<sex>2</sex>
<age>79</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28M225I0</bcno>
<orddd>20251210</orddd>
<prcpdd>20251210</prcpdd>
<prcpno>1956623923</prcpno>
<execprcpuntqno>2094210782</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251212</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage>C3499 /4A</stage>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
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
<pay100ownbrate>100</pay100ownbrate>
<preicd10cd/>
<preicd10hngnm/>
<posticd10cd/>
<posticd10hngnm/>
<pid>41654012</pid>
<hngnm>강자영</hngnm>
<brthdd>19830107</brthdd>
<sex>2</sex>
<age>43</age>
<testcd>LPE579</testcd>
<testnm>(혈액) 고형암 cfDNA [NGS]</testnm>
<bcno>O28M24QB0</bcno>
<orddd>20251212</orddd>
<prcpdd>20251212</prcpdd>
<prcpno>1957449557</prcpno>
<execprcpuntqno>2095088377</execprcpuntqno>
<spcnm>Plasma</spcnm>
<spccd>1</spccd>
<spcacptdt>20251212</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
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
<clamacptno>-</clamacptno>
<docuseqno>09155</docuseqno>
<pay100ownbrate>80</pay100ownbrate>
<preicd10cd>D619</preicd10cd>
<preicd10hngnm>상세불명의 무형성 빈혈</preicd10hngnm>
<posticd10cd>D619</posticd10cd>
<posticd10hngnm>상세불명의 무형성 빈혈</posticd10hngnm>
<pid>35983901</pid>
<hngnm>이도훈</hngnm>
<brthdd>20061217</brthdd>
<sex>1</sex>
<age>19</age>
<testcd>LPE454</testcd>
<testnm>골수부전증후군 [NGS]</testnm>
<bcno>O28M54M00</bcno>
<orddd>20251212</orddd>
<prcpdd>20251212</prcpdd>
<prcpno>1957328458</prcpno>
<execprcpuntqno>2094958148</execprcpuntqno>
<spcnm>EDTA blood</spcnm>
<spccd>1</spccd>
<spcacptdt>20251215</spcacptdt>
<lstreptdt>20251231</lstreptdt>
<stage/>
<monogenicyn/>
<monogenicdd/>
<monogenicacptdd/>
<monogenicnm/>
<racial>아시안</racial>
<bmtyn>무</bmtyn>
<testexec>진단시</testexec>
<familyhist>무</familyhist>
<reqfrmcd>14</reqfrmcd>
</worklist>
<resultKM error="no" type="status" clear="true" description="info||정상 처리되었습니다." updateinstance="true" source="1768365063206"/>
</worklist>
</root>
`;

// 24.09.03 specimenno_? start
const  messageHandler2 = async (specimenNo, testcd) => {
    await poolConnect; // ensures that the pool has been created
  
    logger.info("[patientinfo_diag]select specimenNo=" + specimenNo + ", testcd=" + testcd);
  

    //의정부성모병원
    const sql =`SELECT specimenNo, req_instnm FROM patientinfo_diag 
                        WHERE specimenNo in (@specimenNo, 
                                            @specimenNo_1, 
                                            @specimenNo_2,  
                                            @specimenNo_3, 
                                            @specimenNo_4, 
                                            @specimenNo_5 )                                             
                                    AND test_code = @testcd  `;

    logger.info("[patientinfo_diag]select sql=" + sql);
  
    try {
        const request = pool.request()
          .input('testcd', mssql.VarChar, testcd)
          .input('specimenNo', mssql.VarChar, specimenNo)
          .input('specimenNo_1', mssql.VarChar, specimenNo + "_1") 
          .input('specimenNo_2', mssql.VarChar, specimenNo + "_2") 
          .input('specimenNo_3', mssql.VarChar, specimenNo + "_3") 
          .input('specimenNo_4', mssql.VarChar, specimenNo + "_4")
          .input('specimenNo_5', mssql.VarChar, specimenNo + "_5"); 
        const result = await request.query(sql)
      //  console.dir( result);
        
        return result.recordset;
    } catch (err) {
        logger.error('[patientinfo_diag]SQL error=' + err.message);
    }
}
// 24.09.03 specimenno_? end

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
        // 24.09.03 specimenno_? start
        let testcd2 = patients[i].testcd;
        // 24.09.03 specimenno_? end

        if (arr_testcd.indexOf(testcd) > 0) {
            testcd = '01';
        }
        else {
            testcd = '03';
        }

        patients[i].testcd = testcd;

        // 24.09.03 specimenno_? start
        //patients[i].pv = 'Y';
        patients[i].pv = 'N';
        // 24.09.03 specimenno_? end

        // 23.11.30 ----------
        let reqfrmcd = "";

        if (patients[i].reqfrmcd == "14") {
            reqfrmcd = "유전성 NGS 검사의뢰서";
        } else if (patients[i].reqfrmcd == "15") {
            reqfrmcd = "비유전성 NGS 검사의뢰서";
        }

        patients[i].reqfrmcd = reqfrmcd;
        // --------------------------

        let specimenNo = patients[i].bcno;

        // 24.09.03 specimenno_? start
        let rs_specimenNo = await messageHandler2(specimenNo, testcd2);

        logger.info("[2499][report_xml]rs_data=" + JSON.stringify (rs_specimenNo));

        var specimenNoJson = JSON.stringify(rs_specimenNo);  

        let patient_specimenNo = JSON.parse(specimenNoJson);

        if (patient_specimenNo.length !== 0 )
        {        
            patients[i].hospnm2 = patient_specimenNo[0].req_instnm;
            logger.info("[2499][report_xml]hospnm2=" + patients[i].hospnm2);
                    
            for (var i = 0; i < patient_specimenNo.length; i ++) {

                let specimenNo2 = patient_specimenNo[i].specimenNo;

                if (specimenNo2.length !== 0 )
                {
                    logger.info("[2499][report_xml]specimenNo2=" + specimenNo2);
                    let rs_data = await messageHandler(specimenNo2);
                    
                    logger.info("[2499][report_xml]rs_data=" + JSON.stringify (rs_data));
                    
                    var patientJson = JSON.stringify(rs_data); 

                    let patient_gene = JSON.parse(patientJson);

                    patients[i].pv = 'N';
                    patients[i].pv_gene = '';
                    patients[i].vus = 'N';
                    patients[i].vus_gene = '';
                    
                    if (patient_gene.length !== 0 )
                    {
                        for (var j = 0;  j < patient_gene.length; j ++)
                        {
                            logger.info("[961][report_xml]patient_gene[j].functional_impact=" + patient_gene[j].functional_impact);
                    
                            //24.08.29 VUS가 포함되면 예) VUS(carrier) 형태도 VUS로 간주
                            //if (patient_gene[j].functional_impact === 'VUS') 
                            if (patient_gene[j].functional_impact.includes('VUS')) 
                            {            
                                patients[i].vus = 'Y';
                                patients[i].vus_gene = patients[i].vus_gene + " " +  patient_gene[j].gene ;
                            }
                            //24.09.05 Pathogenic 포함되면 예) Pathogenic(carrier) 형태도 VUS로 간주
                            //else if ((patient_gene[j].functional_impact === 'Pathogenic') ||
                            //        (patient_gene[j].functional_impact === 'Likely Pathogenic')) {            
                            else if (patient_gene[j].functional_impact.includes('Pathogenic'))  {            
                                    patients[i].pv = 'Y';
                                patients[i].pv_gene = patients[i].pv_gene + " " +  patient_gene[j].gene;
                            }
                            //24.09.05 Oncogenic 포함되면 예) Oncogenic(carrier) 형태도 VUS로 간주
                            //else if ((patient_gene[j].functional_impact === 'Oncogenic') ||
                            //        (patient_gene[j].functional_impact === 'Likely Oncogenic')) {            
                            else if (patient_gene[j].functional_impact.includes('Oncogenic') ) {

                                logger.info("[961][report_xml]Oncogenic=" + patient_gene[j].functional_impact);
                                logger.info("[961][report_xml]gene=" + patient_gene[j].gene);

                                patients[i].pv = 'Y';
                                patients[i].pv_gene = patients[i].pv_gene + " " +  patient_gene[j].gene;
                            }
                        }
                    }
                }
            }
        }
        // 24.09.03 specimenno_? end
    }

    //console.log(patients);
    res.json(patients);

    //const patients_hosp = patients.filter(patient => patient.hospnm2 === '의정부성모병원');

    //res.json(patients_hosp);
}

exports.getList= (req, res, next) => {

    let jsonObj = parser.parse(jsondata, options)  ;
    var patientJson = JSON.stringify(jsonObj); 
    console.log('[114][report_xml]json=' ,  patientJson);

    let patientObj = JSON.parse(patientJson);

    console.log(patientObj.root.worklist.worklist);

    let worklist = patientObj.root.worklist.worklist;

    if (worklist != undefined) {

        let patients = patientObj.root.worklist.worklist;

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

    //res.json(patient);
}
