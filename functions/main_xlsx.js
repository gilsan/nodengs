
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

exports.main = (data, filename, testedID) => {
    logger.info ('[main]' +  filename  + " " +  testedID + " " + data.length);

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

	for (let i=0; i < data.length ; i++ ) { 
		
        const len = data[i].length;
        logger.info ('[main]' +  JSON.stringify(data[i]) + " " + data[i].A);
        let field   = data[i].toString().split(',');
        /*
        */
       
        if (data[i]["B"] )
        {
            logger.info ('[main]A=' + data[i].A);
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
            
            inputdb_xlsx.inputdb_xlsx(
                genes,   functional_impact, transcript,  exon,
                coding,  amino_acid_change , zygosity,
                vaf,  references, cosmic,   testedID, i			   
            );
            	
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
                        
		//  console.log('i 값: ', i);
	} // end for loop
}