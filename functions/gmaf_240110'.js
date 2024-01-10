
const logger = require('../common/winston');

// 7.0E-4 => 0.0001 * 7.0 => 0.0007 로 변환
// 소수정만 있는 경우와 지수를 포함한 경우 체크
function convert(sample) {
	const result_gmaf = sample.indexOf('E');

	let newValue = sample;

	// 소수정만 있는 경우
	if (result_gmaf !== -1) {

		const result =sample.split('E');
		const firstVal = Number(result[0]);
		const secondVal = result[1];
		
		logger.info('[10][secondVal]' + secondVal);
		

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
		newValue = tempValue + firstVal;
	}

 	return newValue;
}

// gmaf: 0.01 미만 남김 미만인경우: true, 이상인 경우: false
// val 값은 현재 0.01
// gmaf 값이 val 값과 비교하여 val 값이하면 TRUE, 이상이면 FALSE 반환
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

/***
 * 2023-10-23 추가분
 * 6.0E-7,7.0E-8 인 경우 val 값과 비교
 * 반환값: { gmaf값, true/false}
 */

function singleGmaf(gmaf, val) {

    const result_gmaf = gmaf.indexOf('E');

	logger.info('[56][result_gmaf=' + result_gmaf);

    //if (result_gmaf != -1 && gmaf.length ) {
	if (result_gmaf !== -1 ) {
			gmaf = convert(gmaf); // 7.0E-4 같은 경우처리 
        const result = gmafprocess(gmaf, val);
        return { gmaf, result };
    } else {
        if (gmaf.toString().length === 0) { // 길이가 0 이면 false
            return true;
        } else {
            const result = gmafprocess(gmaf, val);
            return { gmaf, result };
        }
    }
}


/**
 *  여러개의 gmaf 값을 받아 ,val 값과 비교하여   
 * 그 결과를 boolean 배열로 저장하여 전체가 true, false 인지 판별
 * 조건: 7.0E-4,3.0E-1,3.1E-4 개수와 상관없이
 * val 값보다 모두 미만이면 OK
 * 한개라도 val 값보다 크면 NOK
 * 현재 val 값은 0.01 이다
 *   
 */
function multiGmaf(multiGmaf, val) {
    const gmafList = multiGmaf.split(';');
    const gmafTestResult = [];
    for (const gmafExponent of gmafList) {
		// 지수 값을 소수로 변환 
		// 7.0E-4 => 0.0001 * 7.0 => 0.0007 로 변환		
        gmaf = convert(gmafExponent); // 7.0E-4 같은 경우처리  
		// gmaf 값과 val 값을 비교
		// gmaf 값이 val 값 보다 작으면 true, 크면 false
        const result = gmafprocess(gmaf, val); // return 값은 true,false
        gmafTestResult.push(result);
    }
    // gmaf 값과 val 값을 비교한 결과를 저장한곳
	// 전체가 true 이면 true 반환, 
	// 한개라도 false 면 false 반환
    //let testResult = gmafTestResult.includes(true);

	// result : true (es6)
	let testResult = gmafTestResult.every((elem, index, gmafTestResult) => elem == true);

    if (testResult) {
        return { multiGmaf, result: true };
    } else {
        return { multiGmaf, result: false };
    }

}




exports.gmafProcess = (gmaf, val) => {
    const gmafVal = gmaf.split(';');
    // console.log('[376][gmaf][gmaf][tracing)] =======> ',gmaf,  gmafVal.length);

	logger.info('[99][gmafVal=' + gmafVal);

	if (gmafVal.length >= 2) {
        return multiGmaf(gmaf, val);
    } else {
        return singleGmaf(gmaf, val);
    }

}




 exports.gmafProcess2 = (gmaf, val) => {
     
	   const result_gmaf = gmaf.indexOf('E');
	   
	    if (result_gmaf !== -1 && gmaf.length) {
		    gmaf = convert(gmaf); // 7.0E-4 같은 경우처리 

			//gmaf = Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(gmaf);
			
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