
 exports.phredQualScore = (score, value) => {
	 const val =  parseInt(value,10);
	 if (isNaN(val)) {
		 return false;
	 } else {
       if (parseFloat(score) > parseInt(value,10)) {	 
	   return true;
   }
   return false;
	 }


 }