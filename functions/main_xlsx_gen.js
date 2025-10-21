
const inputdb_xlsx_gen  = require('./inputdb_xlsx_gen');
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
     
    logger.info ('[main.xlsx.gen][40] ==>' +  filename  + " " +  testedID + " " + data.length + ' ' + patientID);

	inputdb_xlsx_gen.inputdb_del(testedID);

	let genes             = '';
	let functional_impact = '';
	let exon              = '';
	let transcript        = '';
	let coding            = '';
	let amino_acid_change = '';
  let GnomAD_AF         = '';
	let zygosity        = '';  // 25.09.28 Pathogenicity가 없는 경우 처리
  
	for (let i=0; i < data.length ; i++ ) { 
		
      // 25.09.28 Pathogenicity가 없는 경우 처리
      //const len = data[i].length;
      //logger.info ('[main][57]' +  JSON.stringify(data[i]) + " " + data[i].A);
      //let field   = data[i].toString().split(',');
      /*
      // 액셀의 Detected variants  항목 읽어드림
      */  
      // const functionalImpact =   String(data[i]["B"]).trim() ;  
      logger.info ('[main][65][main data]====>' + data[i]['T']);
      
      if ( data[i]['T'] === 'Pathogenic'
        || data[i]['T'] === 'VUS' 
        || data[i]['T'] === 'Likely Pathogenic' 
        || data[i]['T'] === 'Likely Benign' 
        || data[i]['T'] === 'Likey Benign')
        {
       
          logger.info ('[main][70][main data]====>' + data[i]['T']);
            
          genes             = data[i].H;
            functional_impact = data[i].T;

            let d_transcript =  data[i].I.split(',');
            let a_transcript =  d_transcript[1].split(':');
            
            transcript        = a_transcript[0];
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
            inputdb_xlsx_gen.inputdb_xlsx(
                genes,   functional_impact, transcript,  exon,
                coding,  amino_acid_change , zygosity,
                GnomAD_AF, testedID, i			   
            );
            	
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 25.09.28 Pathogenicity가 없는 경우 처리
        } else if (data[i]['T'] !== 'Pathogenicity') {
          logger.info ('[main][70][main data]====>' + data[i]['T']);
            
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
          inputdb_xlsx_gen.inputdb_xlsx(
              genes,   functional_impact, transcript,  exon,
              coding,  amino_acid_change , zygosity,
              GnomAD_AF, testedID, i			   
          );
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