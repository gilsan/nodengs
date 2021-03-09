
const xml2js = require('xml2js');

var jsondata = `<?xml version='1.0' encoding='utf-8'?>
<root><morphmetricworklist><worklist><instcd></instcd><relaptno><![CDATA[S20047294]]></relaptno><ptno><![CDATA[M20016807]]></ptno><pid><![CDATA[35476641]]></pid><hngnm><![CDATA[박윤희]]></hngnm><sex><![CDATA[F]]></sex><age><![CDATA[F/68]]></age><sa></sa><acptdd><![CDATA[20201219]]></acptdd><testcd><![CDATA[PMO12096]]></testcd><testhngnm><![CDATA[TB/NTM real-time PCR]]></testhngnm><acptstatcd><![CDATA[3]]></acptstatcd><orddeptcd></orddeptcd><orddeptnm><![CDATA[혈액내과]]></orddeptnm><orddrid><![CDATA[98620389]]></orddrid><orddrnm><![CDATA[조병식]]></orddrnm><appeorddrid><![CDATA[-]]></appeorddrid><appeorddrnm></appeorddrnm><grosdrid><![CDATA[21903910]]></grosdrid><grosrnm><![CDATA[홍석호]]></grosrnm><readdd><![CDATA[20201229]]></readdd><readtm><![CDATA[161942]]></readtm><csteno><![CDATA[4]]></csteno><readdrid><![CDATA[21800989]]></readdrid><readdrnm><![CDATA[송인혜]]></readdrnm><brthdd><![CDATA[19530106]]></brthdd><bcolldd><![CDATA[20201219]]></bcolldd><prcpdd><![CDATA[20201219]]></prcpdd><spcnm><![CDATA[조직검체 small intestine]]></spcnm><wardnm><![CDATA[내과중환자실 MICU5]]></wardnm><opcnfmdd><![CDATA[20201219]]></opcnfmdd><accessionno><![CDATA[M2016807]]></accessionno><execprcpuniqno><![CDATA[1462695827]]></execprcpuniqno><spccd><![CDATA[TM1260]]></spccd><prcpgenrflag><![CDATA[I]]></prcpgenrflag><fstreaddrid></fstreaddrid><fstreaddrnm></fstreaddrnm><diagcnts><![CDATA[Small intestine, segmental resection;
   Segmental mucosal and transmural necrosis (see comment).]]></diagcnts></worklist>
   <worklist><instcd></instcd><relaptno><![CDATA[S200472941]]></relaptno><ptno><![CDATA[M200168071]]></ptno><pid><![CDATA[35476642]]></pid><hngnm><![CDATA[박윤희]]></hngnm><sex><![CDATA[F]]></sex><age><![CDATA[F/68]]></age><sa></sa><acptdd><![CDATA[20201219]]></acptdd><testcd><![CDATA[PMO12096]]></testcd><testhngnm><![CDATA[TB/NTM real-time PCR]]></testhngnm><acptstatcd><![CDATA[3]]></acptstatcd><orddeptcd></orddeptcd><orddeptnm><![CDATA[혈액내과]]></orddeptnm><orddrid><![CDATA[98620389]]></orddrid><orddrnm><![CDATA[조병식]]></orddrnm><appeorddrid><![CDATA[-]]></appeorddrid><appeorddrnm></appeorddrnm><grosdrid><![CDATA[21903910]]></grosdrid><grosrnm><![CDATA[홍석호]]></grosrnm><readdd><![CDATA[20201229]]></readdd><readtm><![CDATA[161942]]></readtm><csteno><![CDATA[4]]></csteno><readdrid><![CDATA[21800989]]></readdrid><readdrnm><![CDATA[송인혜]]></readdrnm><brthdd><![CDATA[19530106]]></brthdd><bcolldd><![CDATA[20201219]]></bcolldd><prcpdd><![CDATA[20201219]]></prcpdd><spcnm><![CDATA[조직검체 small intestine]]></spcnm><wardnm><![CDATA[내과중환자실 MICU5]]></wardnm><opcnfmdd><![CDATA[20201219]]></opcnfmdd><accessionno><![CDATA[M2016807]]></accessionno><execprcpuniqno><![CDATA[1462695827]]></execprcpuniqno><spccd><![CDATA[TM1260]]></spccd><prcpgenrflag><![CDATA[I]]></prcpgenrflag><fstreaddrid></fstreaddrid><fstreaddrnm></fstreaddrnm><diagcnts><![CDATA[Small intestine, segmental resection;
    Segmental mucosal and transmural necrosis (see comment).]]></diagcnts></worklist>
    <resultKM error="no" type="status" clear="true" description="info||정상 처리되었습니다." updateinstance="true" source="1615201435842"/>
</morphmetricworklist></root>`;

const parser = new xml2js.Parser(/* options */); 
parser.parseStringPromise(jsondata).then(function (result) { 
    console.log("resultCode:", result.root.morphmetricworklist[0]); 

    let workCnt = result.root.morphmetricworklist[0].worklist.length;

    console.log(workCnt);

    result.root.morphmetricworklist[0].worklist.forEach(item => {

        if (item.pid = "35476642") {
            console.log(item.pid);
            return true;
        }

    });
 
})
.catch(function (err) {  
    console.log(err);  });


                