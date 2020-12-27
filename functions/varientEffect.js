
 // Varian effect: Synonymous 제거 존재하면:false, 존재하지않으면: true
exports.variantEffect = (variant_effect) => {
   let semicheck;
 //  console.log('variant_effetc: ',  variant_effect.replace(/"/g, ""));
   if (variant_effect.length) {
	   const semicheck = variant_effect.indexOf(';');

	   if (semicheck === -1) {
          if (variant_effect === 'synonymous') 
          {
	           return false;
          }           
               return true;
	   } else {
           const filterResult =  variant_effect.replace(/"/g, "").split(';');
		 
		   if (filterResult.includes('synonymous')) {
			   return false
		   }
		   return true;
	   }
   } else {  // 공백인 경우
       return true;
   }

}