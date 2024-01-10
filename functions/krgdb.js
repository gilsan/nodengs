const fs = require('fs');
const logger = require('../common/winston');

function krgdb622(krgbdata, val) {

   if (krgbdata.toString().length === 0 ) { 
// fs.appendFileSync('./krgdb622.txt', '[' + locus +'] 데이타['+ krgbdata + '] 길이 [' + krgbdata.toString().length + ']'  +'\n');
	   return true;
   }

   const conloncheck =  krgbdata.indexOf(';');
   if ( conloncheck === -1) {
       const idrs = krgbdata.split('=');
	   if (idrs[0] === 'id') {
           return true;
	   }	   
   } else {  // 콜론이 있는경우

   const items = krgbdata.split(';'); 
   const results = items.map(item => { 
         temp_items = item.split('=');
	  
	     if (temp_items[0] === 'Alt_Freq') {             
 			 // Alt_Freq 한개인경우
			 alt_freq_622 = item;
            const commacheck = temp_items[1].indexOf(',');
			if (commacheck == -1)  {
			     krgdb622val =  parseFloat(temp_items[1].split(':')[1]); 			  
		        if ( krgdb622val > parseFloat(val)) {
			        return false;
		        } else {
                   return true;
		        }
			} else {
				// Alt_Freq 한개 이상인 경우
              comma_sepate =  temp_items[1].split(',');
			  const value = comma_sepate.map( data => {
                   return data.split(':')[1];
			  }).map(data => {
				  
                 if (parseFloat(data) > parseFloat(val)) {
					 return false;
                 } else { return true; }
			  });
			  
			  if (value.includes(false)) {
				  return false;
			  }
			  return true;   
			}
	     } 
       }).filter(data => data !== undefined);

       if ( results.includes(true)) {
	        return true
        } 
        return false;   
   }
}

function krgdb1100(krgbdata1, val, genes, coding) {
 
   if (krgbdata1.toString().length === 1 || krgbdata1.toString().length === 0) { 
 // fs.appendFileSync('./krgdb.txt', '[' + locus +'] ['+ krgbdata1 + ']  [' + krgbdata1.toString().length + ']'  +'\n');
	   return true;
   }

   const conloncheck =  krgbdata1.indexOf(';');
   if ( conloncheck === -1) {
       const idrs = krgbdata1.split('=');
	   if (idrs[0] === 'id') {
           return true;
	   }	   
   } else {  // 콜론이 있는경우

	logger.info('[76][krgbdata1]' + krgbdata1 );
	logger.info('[77][krgb][genes]' + genes );
	logger.info('[77][krgb][coding]' + coding );

   const items = krgbdata1.split(';'); 
   const results = items.map(item => { 
         temp_items = item.split('=');
	  
	     if (temp_items[0] === 'Alt_Freq') {             
 			 // Alt_Freq 한개인경우
			 alt_freq_1100 = item;
            const commacheck = temp_items[1].indexOf(',');
			if (commacheck == -1)  {
			     krgdb1100val =  parseFloat(temp_items[1].split(':')[1]); 			  
		        if ( krgdb1100val > parseFloat(val)) {
					//24.01.10
					//진검과 요구로 막음
					/*
					logger.info('[92][krgb][krgdb1100val]' + krgdb1100val );


					if ((genes === 'TPMT') && (coding === 'c.719A>G'))
					{
						return true;
					}
					else {
			        	return false;
					}
					*/
					return false;
		        } else {
                   return true;
		        }
			} else {
				// Alt_Freq 한개 이상인 경우
              comma_sepate =  temp_items[1].split(',');
			  const value = comma_sepate.map( data => {
                   return data.split(':')[1];
			  }).map(data => {
				  
                 if (parseFloat(data) > parseFloat(val)) {
					//24.01.10
					//진검과 요구로 막음
					/*
					if ((genes === 'TPMT') && (coding === 'c.719A>G'))
					{
						return true;
					}
					else {
			        	return false;
					}
					*/
					return false;
					 
                 } else { return true; }
			  });
			  
			  if (value.includes(false)) {
				  return false;
			  }
			  return true;   
			}
	     } 
       }).filter(data => data !== undefined);

       if ( results.includes(true)) {
	        return true
        } 
        return false;   
   }
}
/*
function krgdb1100(krgbdata ,val) {
   if (krgbdata.toString().length === 0 ) { 
	   return true;
   }

   const conloncheck =  krgbdata.indexOf(';');
   if ( conloncheck === -1) {
       const idrs = krgbdata.split('=');
	   if (idrs[0] === 'id') {		   
           return true;
	   }
	   
   } else {  // 콜론이 있는경우

   const items = krgbdata.split(';'); 
   const results = items.map(item => { 
         temp_items = item.split('=');
	  
	     if (temp_items[0] === 'Alt_Freq') {             
 			 // Alt_Freq 한개인경우
			 alt_freq_1100 = item;
            const commacheck = temp_items[1].indexOf(',');
			if (commacheck == -1)  {
			   krgdb1100val =  parseFloat(temp_items[1].split(':')[1]); 			   
		        if ( krgdb1100val > parseFloat(val)) {
			        return false;
		        } else {
                   return true;
		        }
			} else {
				// Alt_Freq 한개 이상인 경우
              comma_sepate =  temp_items[1].split(',');
			  const value = comma_sepate.map( data => {
                   return data.split(':')[1];
			  }).map(data => {
				   
                 if (parseFloat(data) > parseFloat(val)) {
					 return false;
                 } else { return true; }
			  });
			  
			  if (value.includes(false)) {
				  return false;
			  }
			  return true;   
			}
	     } 
		 
       }).filter(data => data !== undefined);

        if ( results.includes(true)) {
	        return true
        } 
        return false;   
   }  
}
*/
 //  Krgdb에서 0.01  이상 제외 0.01 미만인경우: true, 0.01 이상인경우: false
exports.krgdb = (krgdb_622_lukemia, krgdb_1100_leukemia, value, genes, coding) => {
        const krgdb_leukemia_result = krgdb1100(krgdb_1100_leukemia, value, genes, coding);
        const krgdb_lukemia_result  = krgdb622(krgdb_622_lukemia ,value);
      //  const krgdb_leukemia_result = krgdb1100(krgdb_1100_leukemia, value, locus);
   
        if (krgdb_lukemia_result == true && krgdb_leukemia_result === true ) {
			  return true;
		} 

		return false;
}