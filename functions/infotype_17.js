

 exports.infotype = (info, type)=> {
	// const type_split = type.replace(/"/g, "").split(";");
  const type_check = type.indexOf(";");

  const targets = ['NOCALL', 'REF'];
  info = '';

  // 없는 경우
  if ( type_check === -1) {
      if (type === 'NOCALL' || type === 'REF')  {	  
        return false;
    }
      return true;
  } else {  // 있는 경우
    const hasOne = targets.some(v => type.includes(v));
   
    if (hasOne) {
      return false;
    }

    return true;
  }

}
