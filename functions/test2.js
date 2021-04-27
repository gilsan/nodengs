
const xml2js = require('xml2js');

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
<orddeptcd>2010800000</orddeptcd>
<orddrid>10500407간다 11 ' ㅡㅡ m</orddrid>
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
</root>   `;

const parser = new xml2js.Parser(/* options */); 
parser.parseStringPromise(jsondata).then(function (result) { 
    console.log("resultCode:", result.root.worklist[0]); 

    let workCnt = result.root.worklist[0].worklist.length;

    console.log(workCnt);

    result.root.worklist[0].worklist.forEach(item => {

        console.log ("spccd=" + item.spccd);
        console.log ("orddrid=" + item.orddrid);
        console.log ("chormosomal=" +  item.chormosomal);

    });
 
})
.catch(function (err) {  
    console.log(err);  });


                