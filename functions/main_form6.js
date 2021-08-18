const fs = require('fs');

const inputdb_mod        = require('./inputdb');
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

const  messageHandler_ver = async (ver_file, testedID) => {
	await poolConnect; // ensures that the pool has been created
	 
	logger.info('[45][main update][messageHandler3]ver_file=' + ver_file + ", testedID" + testedID);
	const qry=`update patientinfo_diag 
		  set ver_file = @ver_file  
		  where specimenNo = @testedID`;
	logger.info('[48][main][update patientinfo_diag]sql=' +  qry) ;
  
	try {
		const request = pool.request() // or: new sql.Request(pool1)
		.input('ver_file', mssql.VarChar, ver_file)
		.input('testedID', mssql.VarChar, testedID);
		const result = await request.query(qry)
		console.dir( result);
	  //  console.log('[158][update patientinfo_diag] ', result)
		return result;
	} catch (error) {
	  logger.error('[56][main]update patient diag err=' + error.message);
	}
}

exports.main = (data, filename, testedID) => {
    console.log('[main]', filename, testedID, data.length);

	inputdb_mod.inputdb_del(testedID);

	let locus             = '';
	let genotype          = '';
	let filter            = '';
	let ref               = '';
	let observed_allele   = '';
	let type              = '';       
	let no_call_reason    = '';
	let genes             = '';
	let locations         = '';
	let length2           = '';
	let info              = '';
	let variant_id        = '';
	let variant_name      = '';
	let frequency         = '';
	let strand            = '';
	let exon              = '';
	let transcript        = '';
	let coding            = '';
	let amino_acid_change = '';
	let variant_effect    = '';
	let phylop            = '';
	let sift              = '';
	let grantham          = '';
	let polyphen          = '';
	let fathmm            = '';
	let pfam              = '';
	let dbsnp             = '';
	let dgv               = '';
	let maf               = '';
	let emaf              = '';
	let amaf              = '';
	let gmaf              = '';
	let ucsc_common_snps  = '';
	let exac_laf          = '';
	let exac_eaaf         = '';
	let exac_oaf          = '';
	let exac_efaf         = '';
	let exac_saaf         = '';
	let exac_enfaf        = '';
	let exac_aaf          = '';
	let exac_gaf          = '';
	let cosmic            = '';
	let omim              = '';
	let gene_ontology     = '';
	let drugbank          = '';
	let clinvar           = '';
	let allele_coverage   = '';
	let allele_ratio      = '';
	let p_value           = '';
	let phred_qual_score  = '';
	let coverage          = '';
	let ref_ref_var_var   = '';
	let homopolymer_length= '';
	let subset_of         = '';
	let krgdb_622_lukemia = '';
	let krgdb_1100_leukemia = '';
	let ver_path 			= '';

	for (let i=0; i < data.length ; i++ ) { 
		
			const len= data[i].length;
			let field   = data[i].toString().split(',');
			/*
			*/
			genes             = removeQuote(field[5]);
			transcript        = removeQuote(field[6]);
			exon              = field[7];
			coding            = removeQuote(field[8]);
			amino_acid_change = removeQuote(field[9]);
			zygosity 		  = removeQuote(field[11]);
			cosmic            = removeQuote(field[16]);
			clinvar           = removeQuote(field[17]);
			// patient tsv 상태 update
			const result5 = messageHandler_ver(ver_path, testedID);
			result5.then(data => {

				console.log('[374][main] ', data);
				//res.json(data);
			})
			.catch( error => {
				logger.error('[378][main]update patient diag err=' + error.message);
			});
			
			///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
			//  console.log('locus: ', locus);
			inputdb_mod.inputdb(
				locus,genotype,filter,ref,observed_allele,
				type,no_call_reason,genes,locations,length2,
				info, variant_id,variant_name,frequency,strand,exon,
				transcript,coding,amino_acid_change,variant_effect, phylop,
				sift,grantham,polyphen,fathmm, pfam,
				dbsnp,dgv,maf,emaf,amaf,
				gmaf,ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
				exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
				cosmic,omim,gene_ontology,drugbank,clinvar,
				allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
				ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,
				loc1, loc2,loc3,loc4,loc5,loc6,loc7, zygosity, testedID			   
			);	
			///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                   
							
		//  console.log('i 값: ', i);
	} // end for loop
}