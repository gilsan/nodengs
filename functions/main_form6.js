const fs = require('fs');

const inputdb_form       = require('./inputdb_form6');
const logger             = require('../common/winston');
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

	inputdb_form.inputdb_del(testedID);

	let locus             = '';
	let genes             = '';
	let exon              = '';
	let transcript        = '';
	let coding            = '';
	let amino_acid_change = '';
	let cosmic            = '';

	for (let i=0; i < data.length ; i++ ) { 
		
			const len= data[i].length;
			let field   = data[i].toString().split(',');
			/*
			*/
			locus             = removeQuote(field[0]);
			genes             = removeQuote(field[5]);
			transcript        = removeQuote(field[6]);
			exon              = field[7];
			coding            = removeQuote(field[8]);
			amino_acid_change = removeQuote(field[9]);
			zygosity 		  = removeQuote(field[11]);
			cosmic            = removeQuote(field[16]);

			if (locus !== 'VID')
			{
				locus = '';
			
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				//  console.log('locus: ', locus);
				inputdb_form.inputdb_form6(
					genes,  transcript,  exon,
					coding,  amino_acid_change , zygosity,
					cosmic,   testedID, i			   
				);	
				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			}
							
		//  console.log('i 값: ', i);
	} // end for loop
}