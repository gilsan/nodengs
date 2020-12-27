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


// 보고서/결과지에 표시할 "tumor mutation burden" => 9.44
 exports.loadData = ( filepath ) => {
   const lists = [];
   let mutation_score = '';

   const data = loadData(filepath);
    data.forEach(list => {		 
      const mutation_list = list[0].split('=');
	  
	  if (mutation_list[0] === 'Mutation Load (Mutations/Mb)') {        
		  mutation_score = mutation_list[1];
	  }
   });    
   return mutation_score;
 }  