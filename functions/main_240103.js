const fs = require('fs');

const location_mod       = require('./location');
const variantEffect_mod  = require('./varientEffect');
const phredQualScroe_mod = require('./phredQualScore');
const gmaf_mod           = require('./gmaf');
const infotype_mod       = require('./infotype');
const krgdb_mod          = require('./krgdb');
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

const  messageHandler_ver2 = async (ver_file, testedID) => {
	await poolConnect; // ensures that the pool has been created
	 
	logger.info('[45][main update][messageHandler3]ver_file=' + ver_file + ", testedID=" + testedID);
	const qry=`update patientinfo_diag 
		  set ver_file = @ver_file,
		  saveyn = 'T'   
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


// 2023.03.24 버전 업데이트는 파일 다운로드시만 변경한다.
const  messageHandler_ver = async (ver_file, testedID) => {
	await poolConnect; // ensures that the pool has been created
	 
	logger.info('[45][main update][messageHandler3]ver_file=' + ver_file + ", testedID=" + testedID);
	const qry=`update patientinfo_diag 
		  set saveyn = 'T'   
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
	logger.info('[72][main ][messageHandler3]testedID=' + testedID);
	
	inputdb_mod.inputdb_del(testedID);

	let locus             = '';
	let genotype          = '';
	let filter            = '';
	let ref               = '';
	let observed_allele   = '';
	let type              = '';
	let subtype           = '';          
	let no_call_reason    = '';
	let cvnpvalue         = '';
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
	
	for (let i=0; i < data.length ; i++ ) { 
 
	  const first_char = data[i][0].substring(0,1);	   
   	  if (first_char !== '#') {  
	   	const title_char = data[i][0].substring(0,5);
	  	if (title_char !== 'Locus') {
	  	  //  console.log('data: ',i + '  ' + data[i] + '\n');
		  const len= data[i].length;
	   	  let field   = data[i].toString().split(',');
	      /*
       	  */
	   
		  if (len === 63) {
   
			locus             = removeQuote(field[0]);
			genotype          = removeQuote(field[1]);
			filter            = removeQuote(field[2]);
			ref               = removeQuote(field[3]);
			observed_allele   = removeQuote(field[4]);
			type              = removeQuote(field[5]);
			subtype           = field[6];          
			no_call_reason    = field[7];
			cvnpvalue         = field[8];
			genes             = removeQuote(field[9]);
			locations         = removeQuote(field[10]);
			length2            = field[11];
			// oncominevariantclass = field[12];
			// oncomingeneclass  = field[13];
			info              = field[14];
			variant_id        = field[15];
			variant_name      = field[16];
			frequency         = removeQuote(field[17]);
			amino_acid_change = removeQuote(field[18]);
			//readCount  = '';
			coverage          = removeQuote(field[20]);
			allele_ratio      = removeQuote(field[21]);
			strand            = removeQuote(field[22]);
			exon              = field[23];
			transcript        = removeQuote(field[24]);
			coding            = removeQuote(field[25]);			
			variant_effect    = removeQuote(field[26]);
			phylop            = removeQuote(field[27]);
			sift              = field[28];
			grantham          = field[29];
			polyphen          = field[30];
			fathmm            = removeQuote(field[31]);
			pfam              = removeQuote(field[32]);
			dbsnp             = removeQuote(field[33]);
			dgv               = field[34];
			maf               = removeQuote(field[35]);
			emaf              = removeQuote(field[36]);
			amaf              = removeQuote(field[37]);
			gmaf              = removeQuote(field[38]);
			ucsc_common_snps  = removeQuote(field[39]);
			exac_laf          = removeQuote(field[40]);
			exac_eaaf         = removeQuote(field[41]);
			exac_oaf          = removeQuote(field[42]);
			exac_efaf         = removeQuote(field[43]);
			exac_saaf         = removeQuote(field[44]);
			exac_enfaf        = removeQuote(field[45]);
			exac_aaf          = removeQuote(field[46]);
			exac_gaf          = removeQuote(field[47]);
			cosmic            = removeQuote(field[48]);
			omim              = removeQuote(field[49]);
			gene_ontology     = removeQuote(field[50]);
			// dra               = field[51];
			drugbank          = removeQuote(field[52]);
			clinvar           = removeQuote(field[53]);
			allele_coverage   = field[54];
			p_value           = field[55];
			phred_qual_score  = field[56];
			raw_coverage      = field[57];
			ref_ref_var_var   = removeQuote(field[58]);
			homopolymer_length= removeQuote(field[59]);
			subset_of         = removeQuote(field[60]);
			krgdb_622_lukemia = field[61];
			krgdb_1100_leukemia = field[62];
			
		  } else if (len === 59) {
   
			locus             = removeQuote(field[0]);
			genotype          = removeQuote(field[1]);
			filter            = removeQuote(field[2]);
			ref               = removeQuote(field[3]);
			observed_allele   = removeQuote(field[4]);
			type              = removeQuote(field[5]);
			subtype           = field[6];          
			no_call_reason    = field[7];
			cvnpvalue         = field[8];
			genes             = removeQuote(field[9]);
			locations         = removeQuote(field[10]);
			length2            = field[11];
			info              = field[12];
			// oncominevariantclass = field[];
			// oncomingeneclass  = field[];
			variant_id        = field[13];
			variant_name      = field[14];
			frequency         = removeQuote(field[15]);
			strand            = removeQuote(field[16]);
			exon              = field[17];
			transcript        = removeQuote(field[18]);
			coding            = removeQuote(field[19]);
			amino_acid_change = removeQuote(field[20]);
			variant_effect    = removeQuote(field[21]);
			phylop            = removeQuote(field[22]);
			sift              = field[23];
			grantham          = field[24];
			polyphen          = field[25];
			fathmm            = removeQuote(field[26]);
			pfam              = removeQuote(field[27]);
			dbsnp             = removeQuote(field[28]);
			dgv               = field[29];
			maf               = removeQuote(field[30]);
			emaf              = removeQuote(field[31]);
			amaf              = removeQuote(field[32]);
			gmaf              = removeQuote(field[33]);
			ucsc_common_snps  = removeQuote(field[34]);
			exac_laf          = removeQuote(field[35]);
			exac_eaaf         = removeQuote(field[36]);
			exac_oaf          = removeQuote(field[37]);
			exac_efaf         = removeQuote(field[38]);
			exac_saaf         = removeQuote(field[39]);
			exac_enfaf        = removeQuote(field[40]);
			exac_aaf          = removeQuote(field[41]);
			exac_gaf          = removeQuote(field[42]);
			cosmic            = removeQuote(field[43]);
			omim              = removeQuote(field[44]);
			gene_ontology     = removeQuote(field[45]);
			// dra               = field[];
			drugbank          = removeQuote(field[46]);
			clinvar           = removeQuote(field[47]);
			allele_coverage   = field[48];
			allele_ratio      = removeQuote(field[49]);
			p_value           = field[50];
			phred_qual_score  = field[51];
			raw_coverage      = field[52];
			coverage          = removeQuote(field[53]);
			ref_ref_var_var   = removeQuote(field[54]);
			homopolymer_length= removeQuote(field[55]);
			subset_of         = removeQuote(field[56]);
			krgdb_622_lukemia = field[57];
			krgdb_1100_leukemia = field[58];
			
		  } else {
		   
			locus             = removeQuote(field[0]);
			genotype          = removeQuote(field[1]);
			filter            = removeQuote(field[2]);
			ref               = removeQuote(field[3]);
			observed_allele   = removeQuote(field[4]);
			type              = removeQuote(field[5]);        
			no_call_reason    = field[6];
			genes             = removeQuote(field[7]);
			locations         = removeQuote(field[8]);
			length2            = field[9];
			info              = field[10];
			variant_id        = field[11];
			variant_name      = field[12];
			frequency         = removeQuote(field[13]);      
			strand            = removeQuote(field[14]);
			exon              = field[15];
			transcript        = removeQuote(field[16]);
			coding            = removeQuote(field[17]);
			amino_acid_change = removeQuote(field[18]);
			variant_effect    = removeQuote(field[19]);
			phylop            = removeQuote(field[20]);
			sift              = field[21];
			grantham          = field[22];
			polyphen          = field[23];
			fathmm            = removeQuote(field[24]);
			pfam              = removeQuote(field[25]);
			dbsnp             = removeQuote(field[26]);
			dgv               = field[27];
			maf               = removeQuote(field[28]);
			emaf              = removeQuote(field[29]);
			amaf              = removeQuote(field[30]);
			gmaf              = removeQuote(field[31]);
			ucsc_common_snps  = removeQuote(field[32]);
			exac_laf          = removeQuote(field[33]);
			exac_eaaf         = removeQuote(field[34]);
			exac_oaf          = removeQuote(field[35]);
			exac_efaf         = removeQuote(field[36]);
			exac_saaf         = removeQuote(field[37]);
			exac_enfaf        = removeQuote(field[38]);
			exac_aaf          = removeQuote(field[39]);
			exac_gaf          = removeQuote(field[40]);
			cosmic            = removeQuote(field[41]);
			omim              = removeQuote(field[42]);
			gene_ontology     = removeQuote(field[43]);
			drugbank          = removeQuote(field[44]);
			clinvar           = removeQuote(field[45]);
			allele_coverage   = removeQuote(field[46]);
			allele_ratio      = removeQuote(field[47]);
			p_value           = field[48];
			phred_qual_score  = field[49];
			coverage          = field[50];
			ref_ref_var_var   = removeQuote(field[51]);
			homopolymer_length= removeQuote(field[52]);
			subset_of         = removeQuote(field[53]);
			krgdb_622_lukemia = field[54];
			krgdb_1100_leukemia = field[55];

		  }
        
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
          //let  phredQualScore_result = phredQualScroe_mod.phredQualScore(phred_qual_score, 10);
		  //2023.08.22 10->9 로 변경
          let  phredQualScore_result = phredQualScroe_mod.phredQualScore(phred_qual_score, 9);
	   
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
          let gmaf_result, gmafValue
		  logger.info('[368][main]' + genes + ',' + gmaf)

		  if (gmaf.length === 0) { // 길이가 0 이면 true
            gmaf_result = true;
		  } else {
			 
            const temp_gmaf_result = gmaf_mod.gmafProcess(gmaf, 0.01);
			gmafValue = temp_gmaf_result.gmaf;
			gmaf_result = temp_gmaf_result.result;
			 
		  }
		  // console.log('[379][main][gmaf]   =======> ', i, gmaf,gmafValue,  gmaf_result);       		  
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
			logger.info('[388][main ][messageHandler3]testedID=' + testedID);
			 
			// 2023.10.24 무조건 5.18로 바꾼다			
			//let ver_path = '5.10';
			let ver_path = '5.18';

			if (len == 63 )
			{
				ver_path = '5.16';
			}
			
            // 2023.10.24 버전 정보는 환자 정보 upload시만 적용한다.
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

			logger.info('[411][main ][messageHandler3]testedID=' + testedID);
			 
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
				ref_ref_var_var,homopolymer_length,subset_of,krgdb_622_lukemia,krgdb_1100_leukemia,filename, testedID,
				loc1, loc2,loc3,loc4,loc5,loc6,loc7			   
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