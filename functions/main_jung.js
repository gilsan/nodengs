const fs = require('fs');

const inputdb_jung_mod   = require('./inputdb_jung');
const location_mod       = require('./location');

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

function removeQuote_jung(value) {
	const quot_check = value.indexOf('"');
	if (quot_check !== -1) {
			return value.replace(/"/g, "");
	}
	return value;
}

exports.main_jung = (data, filename, testedID) => {
   console.log('[main]', filename, testedID, data.length);

   inputdb_jung_mod.inputdb_diag_del(testedID);

  for (let i=0; i < data.length ; i++ ) { 
 
	const first_char = data[i][0].substring(0,1);	   
    if (first_char !== '#') {  
	   const title_char = data[i][0].substring(0,5);
	   if (title_char !== 'Locus') {
	   		//  console.log('data: ',i + '  ' + data[i] + '\n');
	   		field   = data[i].toString().split(',');
	    	/*
       		*/
		
			const locus             = removeQuote_jung(field[0]);
			const genotype          = removeQuote_jung(field[1]);
			const filter            = removeQuote_jung(field[2]);
			const ref               = removeQuote_jung(field[3]);
			const observed_allele   = removeQuote_jung(field[4]);
			let   type              = removeQuote_jung(field[5]);
			const no_call_reason    = field[6];
			const genes             = removeQuote_jung(field[7]);
			let   locations         = removeQuote_jung(field[8]);
			const length            = field[9];
			let   info              = field[10];
			const variant_id        = field[11];
			const variant_name      = field[12];
			const frequency         = removeQuote_jung(field[13]);
			const strand            = removeQuote_jung(field[14]);
			const exon              = field[15];
			const transcript        = removeQuote_jung(field[16]);
			const coding            = removeQuote_jung(field[17]);
			const amino_acid_change = removeQuote_jung(field[18]);
			let   variant_effect    = removeQuote_jung(field[19]);
			const phylop            = removeQuote_jung(field[20]);
			const sift              = field[21];
			const grantham          = field[22];
			const polyphen          = field[23];
			const fathmm            = removeQuote_jung(field[24]);
			const pfam              = removeQuote_jung(field[25]);
			const dbsnp             = removeQuote_jung(field[26]);
			const dgv               = field[27];
			const maf               = removeQuote_jung(field[28]);
			const emaf              = removeQuote_jung(field[29]);
			const amaf              = removeQuote_jung(field[30]);
			let   gmaf              = removeQuote_jung(field[31]);
			const ucsc_common_snps  = removeQuote_jung(field[32]);
			const exac_laf          = removeQuote_jung(field[33]);
			const exac_eaaf         = removeQuote_jung(field[34]);
			const exac_oaf          = removeQuote_jung(field[35]);
			const exac_efaf         = removeQuote_jung(field[36]);
			const exac_saaf         = removeQuote_jung(field[37]);
			const exac_enfaf        = removeQuote_jung(field[38]);
			const exac_aaf          = removeQuote_jung(field[39]);
			const exac_gaf          = removeQuote_jung(field[40]);
			const cosmic            = removeQuote_jung(field[41]);
			const omim              = removeQuote_jung(field[42]);
			const gene_ontology     = removeQuote_jung(field[43]);
			const drugbank          = removeQuote_jung(field[44]);
			const clinvar           = removeQuote_jung(field[45]);
			const allele_coverage   = removeQuote_jung(field[46]);
			const allele_ratio      = removeQuote_jung(field[47]);
			const p_value           = field[48];
			let   phred_qual_score  = field[49];
			const coverage          = field[50];
			const ref_ref_var_var   = removeQuote_jung(field[51]);
			const homopolymer_length= removeQuote_jung(field[52]);
			const subset_of         = removeQuote_jung(field[53]);
			let   krgdb_622_lukemia = field[54];
			let   krgdb_1100_leukemia = field[55];

	     // console.log('[2][main]', i, locus);
         ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
	      //  console.log('locus: ', locus);
        	inputdb_jung_mod.inputdb_jung(
           locus,genotype,filter,ref,observed_allele,
           type,no_call_reason,genes,locations,length,
		   info, variant_id,variant_name,frequency,strand,exon,
           transcript,coding,amino_acid_change,variant_effect, phylop,
		   sift,grantham,polyphen,fathmm, pfam,
		   dbsnp,dgv,maf,emaf,amaf,
		   gmaf,ucsc_common_snps,exac_laf,exac_eaaf,exac_oaf,
		   exac_efaf, exac_saaf,exac_enfaf,exac_aaf,exac_gaf,
		   cosmic,omim,gene_ontology,drugbank,clinvar,
		   allele_coverage, allele_ratio,p_value,phred_qual_score,coverage,
		   ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename,
		   testedID			   
		   );	
           ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                   
		  } // if != loccus
		 					 
           variant_effect = '';
           varian_effect_result = '';
		   phred_qual_score = '';
           phredQualScore_result = '';
           locations = '';
		   gmaf = '';
           gmaf_result = '';
		   krgdb_622_lukemia = '';
		   krgdb_1100_leukemia = '';
		   info= '';
		   type = '';
		   info_result = '';
   		}  // # 
  	//  console.log('i 값: ', i);
  	}  // end for loop

}