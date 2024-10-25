const app = require('express');
const querystring = require('querystring');
const router = app.Router();
const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('../common/winston');
//const he = require('he');

const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const configEnv = require('../common/config.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// 교육
//const sendUrl = 'http://emr012edu.cmcnu.or.kr/cmcnu/.live';

// patientid/gender/age/name no update 
const  patientinfo_nu = async (bcnno, patnm, tclsscmnm, pid, spcacptdt, spccd, spcnm, ikzk1,
	                                chormosomal, orddeptcd, orddrid, orddrnm, orddeptnm, 
									execprcpuniqno, prcpdd, testcd, sex, birth, ftl3,
									diagnm, genetic1, genetic2, genetic3, genetic4) => {
	await poolConnect; // ensures that the pool has been created
 
	 logger.info('[41][patient_nu]bcnno=' +  bcnno + ', patnm=' + patnm + ', tclsscmnm=' + tclsscmnm 
				+ ', pid=' + pid + ', spcacptdt=' + spcacptdt + ', spccd=' + spccd + ', spcnm=' + spcnm
				+ ', ikzk1=' + ikzk1 + ', chormosomal=' + chormosomal + ', orddeptcd= ' + orddeptcd + ',orddrid=' + orddrid
				+ ', orddrnm= ' + orddrnm + ', orddeptnm=' + orddeptnm + ', execprcpuniqno=' + execprcpuniqno + ', prcpdd= ' + prcpdd
				+ ', testcd=' + testcd + ', sex=' + sex + ', birth=' + birth + ', ftl3=' + ftl3
				+ ', diagnm= ' + diagnm + ', genetic1=' + genetic1 + ', genetic2=' + genetic2 + ', genetic3= ' + genetic3 + ', genetic4= ' + genetic4 ); 

	let qry= `update patientinfo_diag 
				set method= @tclsscmnm,
				accept_date = @spcacptdt,
				specimen=@spccd,
				chromosomalanalysis=@chormosomal,
				request=@orddeptnm,
				prescription_no=@execprcpuniqno,
				prescription_date=@prcpdd `;

	if (testcd == 'LPE471' || testcd == 'LPE472') //  AML/ALL   
	{
		qry = qry + `, IKZK1Deletion=@ikzk1, 
					FLT3ITD=@ftl3`;
	}
	else if(testcd == 'LPE474' || testcd == 'LPE475') // 악성림프종/형질세포종
	{
		qry = qry + ', bonenmarrow=@diagnm ';
	}
	else if (testcd == "LPE473") //  MDS/MPN
	{
		qry = qry +	`,  diagnosis=@diagnm, 
			genetic1=@genetic1, 
		  	genetic2=@genetic2, 
		  	genetic3=@genetic3,
		  	genetic4=@genetic4 `;
	}

	qry = qry +	' where specimenNo = @bcnno';
	logger.info('[63][patient_nu][update patientinfo_diag]sql=' +  qry) ;
  
	try {
		const request = pool.request() // or: new sql.Request(pool1)
		.input('tclsscmnm', mssql.NVarChar, tclsscmnm)
		.input('spcacptdt', mssql.VarChar, spcacptdt)
		.input('spccd', mssql.VarChar, spccd)
		.input('ikzk1', mssql.VarChar, ikzk1)
		.input('chormosomal', mssql.NVarChar, chormosomal)
		.input('orddeptnm', mssql.NVarChar, orddrnm + '/' + orddeptnm)
		.input('execprcpuniqno', mssql.VarChar, execprcpuniqno)
		.input('prcpdd', mssql.VarChar, prcpdd)
		.input('testcd', mssql.VarChar, testcd)
		.input('ftl3', mssql.VarChar, ftl3)
		.input('diagnm', mssql.VarChar, diagnm)
		.input('genetic1', mssql.VarChar, genetic1)
		.input('genetic2', mssql.VarChar, genetic2)
		.input('genetic3', mssql.VarChar, genetic3)
		.input('genetic4', mssql.VarChar, genetic4)
		.input('bcnno', mssql.VarChar, bcnno);
		const result = await request.query(qry)
		console.dir( result);
	    //console.log('[158][update patientinfo_diag] ', result)
		return result;
	} catch (error) {
	  logger.error('[86][patient_nu]update patient diag err=' + error);
	}
  }

exports.patient_nu = (testedID, test_code) => {
	let sendUrl = configEnv.emr_path; //'http://emr012.cmcnu.or.kr/cmcnu/.live

	// 24.09.03 specimenno_? start
	//sendUrl = sendUrl + '?submit_id=TRLII00144&business_id=li&instcd=012&testcd=' + test_code + '&bcno=' + testedID;
	
	logger.info('[96][patient_nu]testedID=' +  testedID); 
	
	let indexOfFirst = testedID.indexOf('_');

	if (indexOfFirst > 0)
	{
		const words = testedID.split('_');
		logger.info('[96][patient_nu]testedID=' +  words[0]); 
	
		sendUrl = sendUrl + '?submit_id=TRLII00144&business_id=li&instcd=012&testcd=' + test_code + '&bcno=' + words[0];
	}
	else {
		
		logger.info('[96][patient_nu]testedID=' +  testedID); 
		sendUrl = sendUrl + '?submit_id=TRLII00144&business_id=li&instcd=012&testcd=' + test_code + '&bcno=' + testedID;
	}
	// 24.09.03 specimenno_? end
	//sendUrl += data;
	logger.info('[96][patient_nu]sendUrl=' +  sendUrl); 

   	axios({
        method: 'get',
		timeout: 3000,
        url: sendUrl ,
		headers: {"Authorization": "BASIC SGVsbG8="}
    })
    .then(function(response) {
       
		logger.info('[106][patient_nu]data=' + response.data); 

		let res_data =  response.data;

		const parser = new xml2js.Parser(/* options */); 
		parser.parseStringPromise(res_data).then(function (result) {

			logger.info('[114][path_patient_nu]json=' + JSON.stringify( result.root.worklist[0]));
				
			let res_json = result.root.worklist[0];

			res_json.worklist.forEach(item => {
				let bcnno = item.bcno;
				let patnm = item.patnm;
				let tclsscmnm = item.tclsscrnnm[0];
				let pid = item.pid;
				let spcacptdt = item.spcacptdt;
				let spccd = item.spccd;
				let spcnm = item.spcnm;
				let ikzk1 = item.ikzk1;
				let chormosomal = item.chormosomal;
				let orddeptcd = item.orddeptcd;
				let orddrid = item.orddrid;
				let orddrnm = item.orddrnm;
				let diagnm = item.diagnm;

				let genetic1 = item.genetic1;
				let genetic2 = item.genetic2;
				let genetic3 = item.genetic3;
				let genetic4 = item.genetic4;

				let execprcpuniqno = item.execprcpuniqno;
				let prcpdd = item.prcpdd;
				let testcd = item.testcd;
				let sex = item.sex;
				let birth = item.brthdd;
				let ftl3 = item.ftl3;

				logger.info('[143][patient_nu]bcnno=' +  bcnno + ', patnm=' + patnm + ', tclsscmnm=' + tclsscmnm 
						+ ', pid=' + pid + ', spcacptdt=' + spcacptdt + ', spccd=' + spccd + ', spcnm=' + spcnm
						+ ', ikzk1=' + ikzk1 + ', chormosomal=' + chormosomal + ', orddeptcd= ' + orddeptcd + ',orddrid=' + orddrid
						+ ', orddrnm= ' + orddrnm + ', orddeptnm=' + orddeptnm + ', execprcpuniqno=' + execprcpuniqno + ', prcpdd= ' + prcpdd
						+ ', diagnm= ' + diagnm + ', genetic1=' + genetic1 + ', genetic2=' + genetic2 + ', genetic3= ' + genetic3 + ', genetic4= ' + genetic4
						+ ', testcd=' + testcd + ', sex=' + sex + ', birth=' + birth + ', ftl3=' + ftl3 ); 

           		// 2021.02.15  patientinfo_nu
		   		const result6 =  patientinfo_nu(bcnno, patnm, tclsscmnm, pid, spcacptdt, spccd, spcnm, ikzk1, 
			                            chormosomal, orddeptcd, orddrid, orddrnm,  orddeptnm,										
										execprcpuniqno, prcpdd, testcd, sex, birth, ftl3,
										diagnm, genetic1, genetic2, genetic3, genetic4);
		   		result6.then(data => {
 
					 console.log(data);
			 		//res.json(data);
		   		})
		   		.catch( error => {
			 	logger.error('[161][[patient_nu] update patientinfo err=' + error.message)
		   		});	  
		
			});
       
    	});
	});	
}