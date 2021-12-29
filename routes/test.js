 s1 = 'test;test';
 s2 = 'test';
 s3 = '23.456';
 s4 = '';
 s1  = s1.replace(/;/g, ",");
 s2  = s2.replace(/;/g, ",");
 s3  = s3.replace(/;/g, ",");
 s4 = s4.replace(/;/g, ",");
 console.log(s1,s2,s3);
/*
const location_mod       = require('../functions/location');

 locations = "CSF3R:exonic:NM_156039.3";

  const loc_result = location_mod.locations(locations);
  console.log('결과: ',loc_result);
  */
 
  const dna = 'RNF43 p.(W416*) c.1248G&gt;A, FAT1 deletion, ERAP2 deletion, HLA-B deletion, DICER1 p.(D1810H) c.5428G&gt;C, CIC p.(W267*) c.800G&gt;A, EIF1AX amplification';
  const newone = dna.replace(/&gt;/g, '>');
/*
const fs = require('fs');

		let dirPath = '';
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();
	  console.log(year, month, day);
      if (month < 10) {
         thisMonth = '0' + month;
      }

      if (day < 10) {
        thisDay = '0' + day;
      }
	  if (month < 10) {
              dirPath = 'uploads/'+ year + '/' + thisMonth + '/' + day;
		if (day < 10) {
			  dirPath = 'uploads/'+ year + '/' + thisMonth + '/' + thisDay;
		}
	  } else {
  		if (day < 10) {
			  dirPath = 'uploads/'+ year + '/' + month + '/' + thisDay;
		} else {
			  dirPath = 'uploads/'+ year + '/' + month + '/' + day;
		}
	  }

           
      let isDirExists = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
     
      if (!isDirExists){
          fs.mkdirSync('../' +  dirPath,  { recursive: true });
      } else { 
	      console.log('directory exist');
	  }
	  */


  const configEnv = require('../common/config.js');
  let sendUrl = configEnv.emr_path;
  console.log(sendUrl);