
const statistictxt  = require('../diseaseFuns/statictxt');
const filterfile    = require('../diseaseFuns/filterfile');
const nonfilterfile = require('../diseaseFuns/nonfilterfile');

exports.registerDB = (path, filename) => {
  
  let result_static = '', result_nofilter = '',result_filter = '';

  if (filename === 'Statistic.txt') {
	 // console.log('Statistic.txt: ', filename);
	  mutation = statistictxt.loadData(path);
	  return { mutation };
  } else {
      const disease_filename =  filename.split('_');
      const disease_number = disease_filename[0];
     
	  if (disease_filename.includes('RNA')) {
		 result_nofilter = nonfilterfile.loadData(path); 
		 return result_nofilter;
	  } else {
		 msi = filterfile.loadData(path);  
		 return { msi };
	}
  }
  
}