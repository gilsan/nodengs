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

// Varian effect: Synonymous 제거 존재하면:false, 존재하지않으면: true
exports.exacEffect = (exac_effect) => {
    //let semicheck;
    //
    console.log('exac_effetc: ',  exac_effect);
    if (exac_effect.length) {
        const colonCheck = exac_effect.indexOf(':');
  
        if (colonCheck === -1) {
            return true;
        } else {
            
            let exac_text;
            let af_Adj, af_AdjValue, af_AdjValue2 ;
            let af_Eas, af_EasValue, af_EasValue2 ;
            
            exac_text = exac_effect.split(":");

            // AF_Adj가 0.01이상인 경우 제거 (AF_Adj=XX;YY 표시된 경우, XX(;앞의 숫자)가 0.01이상인 경우 제거)
            af_Adj = exac_text.toLowerCase().find(v => v.includes('af_adj'));
            let semiCheck = af_Adj.indexOf(';');

            if (semiCheck === -1) {

                af_AdjValue = convert(af_Adj);
                if (af_AdjValue > 0.01) {
                    return false;
                }

            } else {
                console.log(af_Adj);

                af_AdjValue2 = af_Adj
                                ? af_Adj.split('=')[1][0] || 0
                                : 0;
                
                console.log(af_AdjValue2);

                af_AdjValue = convert(af_AdjValue2);
                if (af_AdjValue > 0.01) {
                    return false;
                }

            }

            // AF_EAS가 0.01이상인 경우 제거 (AF_EAS=XX;YY 표시된 경우, YY(;뒤의 숫자)가 0.01이상인 경우 제거)
            af_Eas = exac_text.toLowerCase().find(v => v.includes('af_eas'));
            semiCheck = af_Eas.indexOf(';');

            if (semiCheck === -1) {

                af_EasValue = convert(af_Eas);
                if (af_EasValue > 0.01) {
                    return false;
                }

            } else {
                console.log(af_Eas);

                af_EasValue2 = af_Eas
                                ? af_Eas.split('=')[1][0] || 0
                                : 0;
                
                console.log(af_EasValue2);

                af_EasValue = convert(af_EasValue2);
                if (af_EasValue > 0.01) {
                    return false;
                }

            }

            return true;
        }
    } else {  // 공백인 경우
      return true;
    }
  
}