
const inputdb_xlsx  = require('./inputdb_xlsx');
const logger        = require('../common/winston');
const mssql = require('mssql');

const dbConfigMssql = require('../common/dbconfig.js');
//const { dir } = require('console');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

// 7.0E-4 => 0.0001 * 7.0 => 0.0007 로 변환
function convert(sample) {
  const result =sample.split('E');
  const firstVal = Number(result[0]);
  const secondVal = result[1];
 
  const value = Number(secondVal.substr(1));

  let tempValue="0.";
  for(let i=1; i <= value; i++) {
    if (i === value) {
		tempValue += "1";
    } else {
       tempValue += "0";
	}   
  }
  const newValue = Number(tempValue) * firstVal;
  return newValue;
}

function removeQuote(value) {
	const quot_check = value.indexOf('"');
	if (quot_check !== -1) {
			return value.replace(/"/g, "");
	}
	return value;
}

exports.main = (data, filename, testedID,patientID) => {
     
    logger.info ('[main.xlsx][40] ==>' +  filename  + " " +  testedID + " " + data.length + ' ' + patientID);

	inputdb_xlsx.inputdb_del(testedID);

	let genes             = '';
	let functional_impact = '';
	let exon              = '';
	let transcript        = '';
	let coding            = '';
	let amino_acid_change = '';
    let vaf               = '';
    let references        = '';
	let cosmic            = '';
  let vus_msg           = '';

	for (let i=0; i < data.length ; i++ ) { 
		
        const len = data[i].length;
        //logger.info ('[main][57]' +  JSON.stringify(data[i]) + " " + data[i].A);
        let field   = data[i].toString().split(',');
        /*
        // 액셀의 Detected variants  항목 읽어드림
        */  
        // const functionalImpact =   String(data[i]["B"]).trim() ;  
        // logger.info ('[main][65][main data]====>' + functionalImpact);
       
      if ( data[i]['B'] === 'Pathogenic'  ||  data[i]['B']  === 'VUS' ||  data[i]['B']  === 'Likely Pathogenic')
        {
       
            genes             = data[i].A;
            functional_impact = data[i].B;
            transcript        = data[i].C;
            exon              = data[i].D;
            coding            = data[i].E;
            amino_acid_change = data[i].F;
            zygosity 		  = data[i].G;
            vaf               = data[i].H;
            references 		  = data[i].I;
            cosmic            = data[i].J;
      
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  console.log('locus: ', locus);
            // 액셀의 유전자 읽어 디비에 저장
            inputdb_xlsx.inputdb_xlsx(
                genes,   functional_impact, transcript,  exon,
                coding,  amino_acid_change , zygosity,
                vaf,  references, cosmic,   testedID, i			   
            );
            	
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }

            ////////////////////////////////////////////////////////////////////
            // vus 문구읽어 디비에 저장
            // 
            vus_msg = data[i].A.slice(0,3);
             
            if (vus_msg === 'VUS') {
              console.log("[main_xlsx][95][VUS 내용]", data[i].A);
              inputdb_xlsx.input_vusmsg_xlsx(patientID, data[i].A);
            }

                        
		//  console.log('i 값: ', i);
	} // end for loop
}