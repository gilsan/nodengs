
const logger = require('../common/winston');

// Variant effect: Sysmonymouse 존재하면 false, 존재하지 않으면 true
function varianEffect(variant_effect) {
    let semicheck;
   
    if (variant_effect.length) {
        const semicheck = variant_effect.indexOf(';');
 
        if (semicheck === -1) {
           if (variant_effect === 'synonymous') 
           {
                return false;
           }             
                return true;
        } else {
            const filterResult =  variant_effect.split(';');
      
            if (filterResult.includes('synonymous')) {
                return false
            }
            return true;
        }
    } else {  // 공백인 경우
        return true;
    }
 }