const fs = require('fs');

const loadData_mod       = require('./readData');
const location_mod       = require('./location');
const variantEffect_mod  = require('./varientEffect');
const phredQualScroe_mod = require('./phredQualScore');
const gmaf_mod           = require('./gmaf');
const infotype_mod       = require('./infotype');
const krgdb_mod          = require('./krgdb');
const inputdb_mod        = require('./inputdb');
const logger             = require('../common/winston');

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
    console.log('[main]', filename, testedID, data.length);

	inputdb_mod.inputdb_del(testedID);

	for (let i=0; i < data.length ; i++ ) { 
 
	  const first_char = data[i][0].substring(0,1);	   
   	  if (first_char !== '#') {  
	   	const title_char = data[i][0].substring(0,5);
	  	if (title_char !== 'Locus') {
	  	  //  console.log('data: ',i + '  ' + data[i] + '\n');
	   	  field   = data[i].toString().split(',');
	      /*
       	  */
	   
			const locus             = removeQuote(field[0]);
			const genotype          = removeQuote(field[1]);
			const filter            = removeQuote(field[2]);
			const ref               = removeQuote(field[3]);
			const observed_allele   = removeQuote(field[4]);
			let   type              = removeQuote(field[5]);
			const no_call_reason    = field[6];
			const genes             = removeQuote(field[7]);
			let   locations         = removeQuote(field[8]);
			const length            = field[9];
			let   info              = field[10];
			const variant_id        = field[11];
			const variant_name      = field[12];
			const frequency         = removeQuote(field[13]);
			const strand            = removeQuote(field[14]);
			const exon              = field[15];
			const transcript        = removeQuote(field[16]);
			const coding            = removeQuote(field[17]);
			const amino_acid_change = removeQuote(field[18]);
			let   variant_effect    = removeQuote(field[19]);
			const phylop            = removeQuote(field[20]);
			const sift              = field[21];
			const grantham          = field[22];
			const polyphen          = field[23];
			const fathmm            = removeQuote(field[24]);
			const pfam              = removeQuote(field[25]);
			const dbsnp             = removeQuote(field[26]);
			const dgv               = field[27];
			const maf               = removeQuote(field[28]);
			const emaf              = removeQuote(field[29]);
			const amaf              = removeQuote(field[30]);
			let   gmaf              = removeQuote(field[31]);
			const ucsc_common_snps  = removeQuote(field[32]);
			const exac_laf          = removeQuote(field[33]);
			const exac_eaaf         = removeQuote(field[34]);
			const exac_oaf          = removeQuote(field[35]);
			const exac_efaf         = removeQuote(field[36]);
			const exac_saaf         = removeQuote(field[37]);
			const exac_enfaf        = removeQuote(field[38]);
			const exac_aaf          = removeQuote(field[39]);
			const exac_gaf          = removeQuote(field[40]);
			const cosmic            = removeQuote(field[41]);
			const omim              = removeQuote(field[42]);
			const gene_ontology     = removeQuote(field[43]);
			const drugbank          = removeQuote(field[44]);
			const clinvar           = removeQuote(field[45]);
			const allele_coverage   = removeQuote(field[46]);
			const allele_ratio      = removeQuote(field[47]);
			const p_value           = field[48];
			let   phred_qual_score  = field[49];
			const coverage          = field[50];
			const ref_ref_var_var   = removeQuote(field[51]);
			const homopolymer_length= removeQuote(field[52]);
			const subset_of         = removeQuote(field[53]);
			let   krgdb_622_lukemia = field[54];
			let   krgdb_1100_leukemia = field[55];
			// console.log('[2][main]', i, locus);
        
       		// Varian effect: Synonymous 제거 존재하면:false, 존재하지않으면: true
	        let varian_effect_result;
            const var_comma_check = variant_effect.indexOf(";");
		   	if (var_comma_check === -1) {
			   varian_effect_result = variantEffect_mod.variantEffect(variant_effect);
		   	} else {
              variant_effect = variant_effect.replace(/"/g, "");
              varian_effect_result = variantEffect_mod.variantEffect(variant_effect);
		   	}
           
		
       		// PhredQualScoe: 10 이하 존재여부 있음: true, 없음: false
          	let  phredQualScore_result = phredQualScroe_mod.phredQualScore(phred_qual_score, 10);
	   
       		// Location: Exon 포함된것과 5-UTR 필드값 없음을 남김(그 외에 것들은 제거) 존재하면:true,  없으면: false
  			//  console.log('[3][main]', i, locations);
			const loc_result = location_mod.locations(locations);
			let   locations_result = loc_result.result;
			let loc1 = loc_result.loc1;
			let loc2 = loc_result.loc2;
			let loc3 = loc_result.loc3;
			let loc4 = loc_result.loc4;
			let loc5 = loc_result.loc5;
			let loc6 = loc_result.loc6;
			let loc7 = loc_result.loc7;
			// console.log('[4][main]', i, locations_result);
			// gmaf: 0.01 미만 남김 미만인경우: true, 이상인 경우: false
           	let gmaf_result
			logger.info('[8][main]' + genes + ',' + gmaf)

			if (gmaf.length === 0) { // 길이가 0 이면 true
              gmaf_result = true;
		   	} else {
              const temp_gmaf_result = gmaf_mod.gmafProcess(gmaf, 0.01);
			  gmaf = temp_gmaf_result.gmaf;
			  gmaf_result = temp_gmaf_result.result;
		   	}
			//console.log('[5][main]', i,  gmaf_result);       		  
       		//  Krgdb에서 0.01  이상 제외 0.01 미만인경우: true, 0.01 이상인경우: false
         	let krgdb = krgdb_mod.krgdb(krgdb_622_lukemia,krgdb_1100_leukemia, 0.01); 
			//console.log('[6][main]', krgdb);    
       		// info HS 이고 type 이 REF 인것 제외 2개 존재하면 false, 존재 하지 않으면: true
			 info_result = infotype_mod.infotype(info, type);
       		//  console.log('[7][main]', i,  info_result);
	  		//   console.log('[8][main]', i,  locations_result + ',' + varian_effect_resultt + ',' + phredQualScore_resultt + ',' + gmaf_resultt + ',' + krgdbt + ',' + info_result)		 
	  		logger.info('[8][main]' + i + genes + ',' + coding + ',' + locations + ',' + locations_result + ',' + varian_effect_result + ',' + phredQualScore_result + ',' + gmaf_result + ',' + krgdb + ',' + info_result)
			/////////////////////////////////////////////////////////////////////////////////////////
			if(locations_result && varian_effect_result && phredQualScore_result && gmaf_result  && krgdb && info_result) {	
 				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
				//  console.log('locus: ', locus);
				inputdb_mod.inputdb(
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
				loc1, loc2,loc3,loc4,loc5,loc6,loc7,testedID			   
			);	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                   
		} //
							
		variant_effect = '';
		varian_effect_result = '';
		phred_qual_score = '';
		phredQualScore_result = '';
		locations = '';
		locations_result = '';
		loc1 ='';
		loc2 = '';
		loc3 ='';
		loc4 ='';
		loc5 ='';
		loc6 ='';
		loc7 = '';
		gmaf = '';
		gmaf_result = '';
		krgdb_622_lukemia = '';
		krgdb_1100_leukemia = '';
		info= '';
		type = '';
		info_result = '';
/////////////////////////////////////////////////////////////////////////////////////////
	  } // Locus	   
   }  // # 
 	//  console.log('i 값: ', i);
  } // end for loop
}