const app = require('express');
const querystring = require('querystring');
const router = app.Router();
const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('../common/winston');

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
		.input('orddeptnm', mssql.NVarChar, orddrnm + '/' + orddeptnm)
		.input('execprcpuniqno', mssql.VarChar, execprcpuniqno)
		.input('prcpdd', mssql.VarChar, prcpdd)
		.input('testcd', mssql.VarChar, testcd)
		.input('ftl3', mssql.VarChar, ftl3)
		.input('bcnno', mssql.VarChar, bcnno);
		const result = await request.query(qry)
		console.dir( result);
	    //console.log('[158][update patientinfo_diag] ', result)
		return 'success';
	} catch (error) {
	  logger.error('[86][patient_nu]update patient diag err=' + error);
	  return 'error';
	}
}

async function get_patient_nu(testedID) {
	let sendUrl = configEnv.emr_path; //'http://emr012.cmcnu.or.kr/cmcnu/.live
	sendUrl = sendUrl + '?submit_id=TRLII00144&business_id=li&instcd=' + configEnv.instcd +'&bcno=' + testedID;

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
				let orddeptnm = item.orddeptnm;

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
							+ ', testcd=' + testcd + ', sex=' + sex + ', birth=' + birth + ', ftl3=' + ftl3 ); 

           		// 2021.02.15  patientinfo_nu
		   		const result6 = patientinfo_nu(bcnno, patnm, tclsscmnm, pid, spcacptdt, spccd, spcnm, ikzk1, 
			                            chormosomal, orddeptcd, orddrid, orddrnm,  orddeptnm,
										execprcpuniqno, prcpdd, testcd, sex, birth, ftl3);
		   		
				console.log('data='+ result6);

				return result6;
		
			});
       
    	});
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