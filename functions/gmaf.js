
const logger = require('../common/winston');

// 7.0E-4 => 0.0001 * 7.0 => 0.0007 로 변환
function convert(sample) {
 const result =sample.split('E');
 const firstVal = Number(result[0]);
 const secondVal = result[1];
 
 // const sign = secondVal.substr(0,1);
 const value = Number(secondVal.substr(1));

 let tempValue="0.";
 for(let i=1; i <= value; i++) {
    if (i === value) {
		//tempValue += "1";
    } else {
       tempValue += "0";
	}
    
 }

 logger.info('[23][gmaf]' + tempValue);
 //const newValue = Number(tempValue) * firstVal;
 const newValue = tempValue + firstVal;
 
 return newValue;
}

// gmaf: 0.01 미만 남김 미만인경우: true, 이상인 경우: false
 function gmafprocess(gmafVal, val) {
	     const gmafLength = gmafVal.toString().length;
		  
		if (gmafLength > 0) {			
		        if(parseFloat(gmafVal) > parseFloat(val)) {
                     return false;
		         } 
		             return true;
		} else if (gmafLength === 0) {
			return true;
		} 
}

 exports.gmafProcess = (gmaf, val) => {
     
	   const result_gmaf = gmaf.indexOf('E');
	   
	    if (result_gmaf !== -1 && gmaf.length) {
		    gmaf = convert(gmaf); // 7.0E-4 같은 경우처리 
			
			logger.info('[45][gmaf]' + gmaf);

			 const result = gmafprocess(gmaf, val);
            return  { gmaf, result };
	    } else {
			if (gmaf.toString().length === 0) { // 길이가 0 이면 false
				return true;
			} else {
               const result = gmafprocess(gmaf, val);
               return { gmaf, result };
			}            
		}
 }