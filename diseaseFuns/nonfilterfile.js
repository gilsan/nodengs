const fs   = require('fs'); 

function parse_tsv(s, f) {
  s = s.replace(/,/g, ";");
  var ix_end = 0;
  for (var ix = 0; ix < s.length; ix = ix_end + 1) {
    ix_end = s.indexOf('\n', ix);
    if (ix_end == -1) {
      ix_end = s.length;
    }
  
    var row = s.substring(ix, ix_end).split('\t');
    f(row);
  }
}

function loadData(filePath) {
  if (fs.existsSync(filePath)) {
    var tsvData = fs.readFileSync(filePath, 'utf-8');
    var rowCount = 0;
    var scenarios = [];
    parse_tsv(tsvData, (row) => {
      rowCount++;
      if (rowCount >= 0) {
        scenarios.push(row);
      }
    });
    return scenarios;
  } else {
    return [];
  }
}

//  ##sampleDiseaseType=Non-Small Cell Lung Cancer     //암종 비소세포폐암
//  ##CellularityAsAFractionBetween0-1=0.600000           //cellularity x100% 로 표시. 60%
// 보고서/결과지에 Tumor type
// Tumor cell perentage 를 헤더에서 읽어서 표시한다

 exports.loadData = ( filepath ) => {
   const data = loadData(filepath);
   const lists = [];
   let type = '';
   let percentage = '';

   data.forEach(item => {
	   const checkshap = item.toString().indexOf('#');
	   if ( checkshap != -1) {		  
		   lists.push(item[0]);
	   }
	});	 

    lists.forEach(list => {
      const msi_list = list.split('##')[1].split('=');
	 
	  if (msi_list[0] === 'sampleDiseaseType') {        
		  type = msi_list[1].replace(/(\r\n|\r)/gm, "");		 
	  }	 else if (msi_list[0] === 'CellularityAsAFractionBetween0-1') {		  
          percentage = parseFloat(msi_list[1]) * 100;		  
	  }  
   });     
   return { type, percentage };
 } 