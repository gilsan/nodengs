
const parser = require('fast-xml-parser');

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
<bcno>I276S0HU0</bcno>
<patnm>이정호</patnm>
<tclsscrnnm>급성골수성백혈병 [NGS]</tclsscrnnm>
<pid>23248774</pid>
<sex>M</sex>
<spcacptdt>20210216122735</spcacptdt>
<spccd>015</spccd>
<spcnm>Bone marrow</spcnm>
<ikzk1/>
<chormosomal>46,XY,-7,+21[19]/46,XY[1]</chormosomal>
<orddeptcd>000002010800000aaaa</orddeptcd>
<orddrid>10500407</orddrid>
<orddrnm>이성은</orddrnm>
<orddeptnm>혈액내과</orddeptnm>
<brthdd>19521015</brthdd>
<execprcpuniqno>1479100499</execprcpuniqno>
<prcpdd>20210216</prcpdd>
<testcd>LPE471</testcd>
<tclsscrnnm>급성골수성백혈병 [NGS]</tclsscrnnm>
<ftl3>Negative</ftl3>
</worklist>
<resultKM error="no" type="status" clear="true" description="info||정상 처리되었습니다." updateinstance="true" source="1615509311882"/>
</worklist>
</root>   
`;

let jsonObj = parser.parse(jsondata, options)  ;
var patientJson = JSON.stringify(jsonObj); 
console.log('[114][patient_nu]json=' ,  patientJson);



let patientObj = JSON.parse(patientJson);

console.log(patientObj.root.worklist.worklist);


                