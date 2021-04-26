const app = require('express');
const axios = require('axios');
const parser = require('fast-xml-parser');
const logger = require('../common/winston');
//const he = require('he');

const mssql = require('mssql');

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
	 parseTrueNumberOnly: false, 
	 arrayMode: false , //"strict" 
	 //attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}), //default is a=>a 
	 //tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a 
	 stopNodes: ["parse-me-as-string"] 
};

// patientid/gender/age/name no update 
const patientinfo_nu = async (bcnno, patnm, tclsscmnm, pid, spcacptdt, spccd, spcnm, ikzk1,
	                                chormosomal, orddeptcd, orddrid, orddrnm, orddeptnm, 
									execprcpuniqno, prcpdd, testcd, sex, birth, ftl3) => {
	await poolConnect; // ensures that the pool has been created
 
	 logger.info('[41][patient_nu]bcnno=' +  bcnno + ', patnm=' + patnm + ', tclsscmnm=' + tclsscmnm 
					 + ', pid=' + pid + ', spcacptdt=' + spcacptdt + ', spccd=' + spccd + ', spcnm=' + spcnm
					 + ', ikzk1=' + ikzk1 + ', chormosomal=' + chormosomal + ', orddeptcd= ' + orddeptcd + ',orddrid=' + orddrid
					 + ', orddrnm= ' + orddrnm + ', orddeptnm=' + orddeptnm + ', execprcpuniqno=' + execprcpuniqno + ', prcpdd= ' + prcpdd
					 + ', testcd=' + testcd + ', sex=' + sex + ', birth=' + birth + ', ftl3=' + ftl3 ); 

	const qry=`update patientinfo_diag 
		  set method= @tclsscmnm,
		  accept_date = @spcacptdt,
		  specimen=@spccd,
		  IKZK1Deletion=@ikzk1,
		  chromosomalanalysis=@chormosomal,
		  request=@orddeptnm,
		  prescription_no=@execprcpuniqno,
		  prescription_date=@prcpdd,
		  FLT3ITD=@ftl3
		  where specimenNo = @bcnno`;
	logger.info('[63][patient_nu][update patientinfo_diag]sql=' +  qry) ;
  
	try {
		const request = pool.request() // or: new sql.Request(pool1)
		.input('tclsscmnm', mssql.NVarChar, tclsscmnm)
		.input('spcacptdt', mssql.VarChar, spcacptdt)
		.input('spccd', mssql.VarChar, spccd)
		.input('ikzk1', mssql.VarChar, ikzk1)
		.input('chormosomal', mssql.NVarChar, chormosomal)
		.input('orddeptnm', mssql.NVarChar, orddeptcd + '/' + orddeptnm)
		.input('execprcpuniqno', mssql.VarChar, execprcpuniqno)
		.input('prcpdd', mssql.VarChar, prcpdd)
		.input('testcd', mssql.VarChar, testcd)
		.input('ftl3', mssql.VarChar, ftl3)
		.input('bcnno', mssql.VarChar, bcnno);
		const result = await request.query(qry);

		console.dir( result);
	    //console.log('[158][update patientinfo_diag] ', result)
		return 'success';
	} catch (error) {
	  logger.error('[86][patient_nu]update patient diag err=' + error);
	  return 'error';
	}
}

async function get_patient_nu(testedID) {
	let sendUrl = 'http://emr012.cmcnu.or.kr/cmcnu/.live?submit_id=TRLII00144&business_id=li&instcd=012&bcno=' + testedID;

	logger.info('[96][patient_nu]sendUrl=' +  sendUrl); 

	try {
       let res = await axios({
            url: sendUrl,
            method: 'get',
            timeout: 3000,
            headers: {
                "Authorization": "BASIC SGVsbG8="
            }
        })
        if(res.status == 200){
            // test for status you want, etc
            console.log(res.status)
        }    
        // Don't forget to return something   
        return res;
    }
    catch (err) {
		if (error.code === 'ECONNABORTED') {
			logger.error('[161][[patient_nu] update patientinfo timeout err=' + error.message);
			return 'timeout';
		} else {
			logger.error('[166][[patient_nu] update patientinfo err=' + error.message);
			return 'error';
		}
    }
}

exports.patient_nu = async (testedID) => {

	try{
		let res_patient = await get_patient_nu(testedID);
   	
		if ((res_patient === 'error') || (res_patient === 'timeout' ))
		{
			return res_patient;
		}

		logger.info('[106][patient_nu]data=' + res_patient.data); 

		let res_data =  res_patient.data;

		if( parser.validate(res_data) === true) { //optional (it'll return an object in case it's not valid) 
			var jsonObj = parser.parse(res_data,options); 
			//console.log("resultCode:", jsonObj.response.header.resultCode); 
			var patientJson = JSON.stringify(jsonObj); 
			logger.info('[114][patient_nu]json=' +  patientJson); 

			let patientObj = JSON.parse(patientJson);

			//console.log(patientObj.root.worklist.worklist);

			let worklist  = patientObj.root.worklist.worklist;

			let bcnno = worklist.bcno;
			let patnm = worklist.patnm;
			let tclsscmnm = worklist.tclsscrnnm[0];
			let pid = worklist.pid;
			let spcacptdt = worklist.spcacptdt;
			let spccd = worklist.spccd;
			let spcnm = worklist.spcnm;
			let ikzk1 = worklist.ikzk1;
			let chormosomal = worklist.chormosomal;
			let orddeptcd = worklist.orddeptcd;
			let orddrid = worklist.orddrid;
			let orddrnm = worklist.orddrnm;
			let orddeptnm = worklist.orddeptnm;

			let execprcpuniqno = worklist.execprcpuniqno;
			let prcpdd = worklist.prcpdd;
			let testcd = worklist.testcd;
			let sex = worklist.sex;
			let birth = worklist.brthdd;
			let ftl3 = worklist.ftl3;

			logger.info('[143][patient_nu]bcnno=' +  bcnno + ', patnm=' + patnm + ', tclsscmnm=' + tclsscmnm 
							+ ', pid=' + pid + ', spcacptdt=' + spcacptdt + ', spccd=' + spccd + ', spcnm=' + spcnm
							+ ', ikzk1=' + ikzk1 + ', chormosomal=' + chormosomal + ', orddeptcd= ' + orddeptcd + ',orddrid=' + orddrid
							+ ', orddrnm= ' + orddrnm + ', orddeptnm=' + orddeptnm + ', execprcpuniqno=' + execprcpuniqno + ', prcpdd= ' + prcpdd
							+ ', testcd=' + testcd + ', sex=' + sex + ', birth=' + birth + ', ftl3=' + ftl3 ); 

           	// 2021.02.15  patientinfo_nu
		   	const result6 = await patientinfo_nu(bcnno, patnm, tclsscmnm, pid, spcacptdt, spccd, spcnm, ikzk1, 
			                            chormosomal, orddeptcd, orddrid, orddrnm,  orddeptnm,
										execprcpuniqno, prcpdd, testcd, sex, birth, ftl3);
			/*
		   	result6.then(data => {
	
				console.log('data='+ data);
				//res.json(data);
				return data;
		   	})
		   	.catch( error => {
			
				logger.error('[154][[patient_nu] update patientinfo err=' + error.message);
				return 'error';		
		   });	  
		   */
		   console.log('data='+ result6);

		   return result6;
		
		}
    
    }
	catch(error)  {
		if (error.code === 'ECONNABORTED') {
			logger.error('[161][[patient_nu] update patientinfo timeout err=' + error.message);
			return 'timeout';
		} else {
			logger.error('[166][[patient_nu] update patientinfo err=' + error.message);
			return 'error';
		}
	}
	

}
