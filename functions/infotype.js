

 exports.infotype = (info, type)=> {
	// const type_split = type.replace(/"/g, "").split(";");
	 const type_check = type.indexOf(";");
	 // 없는 경우
	 if ( type_check === -1) {
        if (info === 'HS' && type === 'REF')  {	  
	       return false;
     }
       return true;
     } else {  // 있는 경우
       if ( info === 'HS' && type_check.includes('REF')) {
		   return false;
       }
           return true;
	 }

}
