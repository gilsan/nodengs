
const inputdb_xlsx_AMLL  = require('./inputdb_xlsx_AMLL');
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

exports.main_AMLL = async (data, filename, testedID,patientID) => {
     
  logger.info ('[main.xlsx.AMLL][40] ==>' +  filename  + " " +  testedID + " " + data.length + ' ' + patientID);

	await inputdb_xlsx_AMLL.inputdb_del_AMLL(testedID);
	await inputdb_xlsx_AMLL.inputTsv_db_del_AMLL(testedID);

	let genes             = '';
	let functional_impact = '';
	let exon              = '';
	let transcript        = '';
	let coding            = '';
	let amino_acid_change = '';
  let GnomAD_AF         = '';
	let zygosity        = '';  // 25.09.28 Pathogenicity가 없는 경우 처리
  
  // 25.10.24 vaf references cosmic_id 추가
  let vaf               = '';
  let references        = '';
  let cosmic            = '';
  
	for (let i=0; i < data.length ; i++ ) { 
		
      // 25.09.28 Pathogenicity가 없는 경우 처리
      //const len = data[i].length;
      //logger.info ('[main][57]' +  JSON.stringify(data[i]) + " " + data[i].A);
      //let field   = data[i].toString().split(',');
      /*
      // 액셀의 Detected variants  항목 읽어드림
      */  
      // const functionalImpact =   String(data[i]["B"]).trim() ;  
      logger.info ('[main][65][main data B]====>' + data[i]['B']);
      logger.info ('[main][65][main data T]====>' + data[i]['T']);

      if ( data[i]['B'] === 'Pathogenic'  
              || data[i]['B']  === 'VUS' 
              || data[i]['B']  === 'Likely Pathogenic' 
              || data[i]['B']  === 'Likely Benign' 
              || data[i]['B']  === 'Likey Benign'
              || data[i]['B']  === 'Oncogenic'
              || data[i]['B']  === 'Likely Oncogenic')
      {
      
        logger.info ('[main][130][main data]====>' + data[i]['B']);
   
        genes             = data[i].A;
        functional_impact = data[i].B;
        transcript        = data[i].C;
        exon              = data[i].D;
        coding            = data[i].E;
        amino_acid_change = data[i].F;
        zygosity 		      = data[i].G;
        GnomAD_AF         = '';
        
        // 25.10.24 vaf references cosmic_id 추가
        vaf               = data[i].H;
        references 		    = data[i].I;
        cosmic            = data[i].J;
        
  
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  console.log('locus: ', locus);
        // 액셀의 유전자 읽어 디비에 저장
        
        await inputdb_xlsx_AMLL.inputdb_xlsx_AMLL(
          genes,   functional_impact, transcript,  exon,
          coding,  amino_acid_change , zygosity,
          vaf,  references, cosmic,   testedID, i			   
        );
            
        await inputdb_xlsx_AMLL.inputdb_tsv_AMLL(
            genes,   functional_impact, transcript,  exon,
            coding,  amino_acid_change , 
            vaf, references, cosmic,  zygosity, testedID		   
        );
          
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
            	
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 25.09.28 Pathogenicity가 없는 경우 처리
        } else if (data[i]['T'] !== 'Pathogenicity') {
          logger.info ('[main][170][main data]====>' + data[i]['T']);

          // 25.10.10 
          let t = data[i]['T'];
          if (t !== undefined && t !== null && t !== 'undefined' && t !== '') {
            
            genes             = data[i].H;
            functional_impact = ''

            transcript        = ''; 
            exon              = data[i].B + ':' + data[i].C;
            coding            = data[i].U;
            amino_acid_change = data[i].V;

            if (data[i].N === 'HET')
            {
              zygosity = 'Heterozygous'  
            } else if (data[i].N === 'HOM')
            {
              zygosity = 'Homozygous'  
            } else if (data[i].N === 'HEMI')
            {
              zygosity = 'Hemizygous'  
            }

            logger.info ('[main][70][main data]===zygosity=>' + zygosity);

            let gen_str = data[i].O; 
            const roundedString = parseFloat(gen_str).toFixed(4);
            GnomAD_AF         = roundedString;

            logger.info ('[main][70][main data]===gen_str=>' + gen_str);
            logger.info ('[main][70][main data]===roundedString=>' + roundedString);


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //  console.log('locus: ', locus);
            // 액셀의 유전자 읽어 디비에 저장
            await inputdb_xlsx_AMLL.inputdb_xlsx_AMLL(
                genes,   functional_impact, transcript,  exon,
                coding,  amino_acid_change , zygosity,
                GnomAD_AF, testedID, i			   
            );
            
            // 25.11.14 feiltered_raw_tsv에도 저장한다
            await inputdb_xlsx_AMLL.inputdb_tsv_AMLL(
              genes,   functional_impact, transcript,  exon,
              coding,  amino_acid_change , 
              vaf, references, cosmic,  zygosity, testedID		   
            );
          }
        }

            ////////////////////////////////////////////////////////////////////
            // vus 문구읽어 디비에 저장
            // 
            /*
            vus_msg = data[i].A.slice(0,3);
             
            if (vus_msg === 'VUS') {
              console.log("[main_xlsx][95][VUS 내용]", data[i].A);
              inputdb_xlsx.input_vusmsg_xlsx(patientID, data[i].A);
            }
            */
                        
		//  console.log('i 값: ', i);
	} // end for loop
}