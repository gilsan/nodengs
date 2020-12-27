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

// ##MSI Score=2.49       //보고서/결과지에 표시할 “MSI Score” 
 exports.loadData = ( filepath ) => {
   const data = loadData(filepath);
   const lists = [];
   let msi_score = '';

   data.forEach(item => {
	   const checkshap = item.toString().indexOf('#');
	   if ( checkshap != -1) {
		   lists.push(item[0]);
	   }
	});	 

    lists.forEach(list => {
      const msi_list = list.split('##')[1].split('=');
	  
	  if (msi_list[0] === 'MSI Score') {        
		  msi_score = msi_list[1];
	  }
   });   
   return msi_score;
 }  