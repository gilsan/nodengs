const app = require('express');
const router = app.Router();
const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('../common/winston');

const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
const configEnv = require('../common/config.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// patientid/gender/age/name no update 
const path_patientinfo_nu = async (bcnno, key_block) => {
 /*
	   //2024.06.13 
	   //병리과 김태은 선생 확인
	   //원래 업무 순서가 이러함
	   - 환자정보 다운로드
	   - LIMS 데이터 입력 
	   - TSV 파일 변환
	   (TSV 파일 변환시 환자정보 'key_block' update 하면 안됨)
	await poolConnect; // ensures that the pool has been created
	
	 logger.info('[41][path_patient_nu]bcnno=' +  bcnno + ', key_block=' + key_block  ); 

	
	const qry=`update patientinfo_path 
		  set key_block= @key_block
		  where pathology_num = @bcnno`;
	logger.info('[46][path_patient_nu][update patientinfo_path]sql=' +  qry) ;
  
	try {
		const request = pool.request() // or: new sql.Request(pool1)
		.input('key_block', mssql.NVarChar, key_block)
		.input('bcnno', mssql.VarChar, bcnno);
		const result = await request.query(qry)
		console.dir( result);
	    //console.log('[158][update patientinfo_diag] ', result)
		return result;
	} catch (error) {
	  logger.error('[57][path_patient_nu]update patient path err=' + error);
	}
	*/
}

// 병리 환자 검색
const messageHandler2 = async (pathology_num) => {
    await poolConnect; // ensures that the pool has been created
   
    let sql = "select isnull(prescription_date, '') prescription_date, \
    				isnull(patientID, '') patientID  \
    		from [dbo].[patientinfo_path] \
            where pathology_num = '" +  pathology_num + "'";
    
    logger.info("[69][patientinfo_path select]sql=" + sql);
        
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query(sql)
       // console.dir( result);
        
        return result.recordset[0];
    } catch (error) {
        logger.error("[78][patientinfo_path select]err=" + error.message);
    }
}

exports.path_patient_nu = (pathologyNum) => {

	const result = messageHandler2(pathologyNum);
	result.then(data => {
  
		console.log("data:", data); 

		let	prescription_date = data.prescription_date;
		let	patientID = data.patientID;
		let sendUrl = configEnv.emr_path; //'http://emr012.cmcnu.or.kr/cmcnu/.live
		sendUrl = sendUrl + '?submit_id=TRLPI01001&business_id=li&instcd=' + configEnv.instcd 
							 + '&startdd=' + prescription_date 
							 + '&enddd='+ prescription_date + '&workflagcd=1007';

		logger.info('[96][path_patient_nu]sendUrl=' +  sendUrl); 

		axios({
			method: 'get',
			timeout: 3000,
			url: sendUrl ,
			headers: {"Authorization": "BASIC SGVsbG8="}
		})
		.then(function(response) {
		
			logger.info('[106][path_patient_nu]data=' + response.data); 

			let res_data =  response.data;

			const parser = new xml2js.Parser(/* options */); 
			parser.parseStringPromise(res_data).then(function (result) { 
    			
				logger.info('[114][path_patient_nu]json=' + JSON.stringify( result.root.morphmetricworklist[0]));
				
				let res_json = result.root.morphmetricworklist[0];

    			res_json.worklist.forEach(item => {

					if (item.pid == patientID) {
						console.log(item.pid);
						console.log(item.csteno);

						let key_block = item.csteno;

						logger.info('[143][path_patient_nu]pathologyNum=' +  pathologyNum + ', key_block=' + key_block ); 

						const result6 =  path_patientinfo_nu(pathologyNum, key_block);
						result6.then(data => {
			
							console.log(data);
							//res.json(data);
						})
						.catch( error => {
							logger.error('[161][[path_patient_nu] update patientinfo err=' + error.message)
						});	
						
						return true;
					}
				})

    		})
			.catch(function (err) {  
				logger.info('[114][path_patient_nu]err=' +err.message);  
			});
		})

	})
	.catch( error  => {
		logger.error("[112][patientinfo_path select]err=" + error.message);
		res.sendStatus(500);
	}); 
}