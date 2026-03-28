
// Varian effect: Synonymous 제거 존재하면:false, 존재하지않으면: true
exports.functionEffect = (function_effect) => {
  //let semicheck;
  //
  console.log('function_effetc: ',  function_effect.replace(/"/g, ""));
  if (function_effect.length) {
	  const semicheck = function_effect.indexOf(';');

	  if (semicheck === -1) {
      if (function_effect === 'synonymous') 
      {
          return false;
      }           
      return true;
    } else {
      const filterResult =  function_effect.replace(/"/g, "").split(';');
      // synonymous 가 여러개인 경우 true
      if (filterResult.includes('synonymous')) {
      // return false
        return true; 
      }
      return true;
    }
  } else {  // 공백인 경우
    return true;
  }

}