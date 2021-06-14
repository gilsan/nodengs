
//  // Location: Exon 포함된것과 5-UTR 필드값 없음을 남김(그 외에 것들은 제거) true, false	
exports.locations = (locations_data) =>  {
    
   let loc1, loc2,loc3,loc4,loc5,loc6,loc7 ;
	if (locations_data.toString().length === 0) {
		 return  { result: false };
	}
	          loc1 = '';
			  loc2 = '';
			  loc3 = '';
			  loc4 = '';
			  loc5 = '';
			  loc6 = '';
			  loc7 = '';

			  const locations_items = locations_data.split(':');
			  if ( locations_items.length === 0) {
				  return  { result: false };
			  } else if (locations_items.length === 1) {
                  loc1 = locations_items[0];
				  loc2 = '';
				  loc3 = '';
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 ='';
			  }  else if (locations_items.length === 2) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = '';
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }   else if (locations_items.length === 3) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = locations_items[2];
				  loc4 = '';
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }   else if (locations_items.length === 4) {
                  loc1 = locations_items[0];
				  loc2 = locations_items[1];
				  loc3 = locations_items[2];
				  loc4 = locations_items[3];
				  loc5 = '';
				  loc6 = '';
				  loc7 = '';
			  }  else if (locations_items.length === 5) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = '';
				 loc7 = '';

			  }  else if (locations_items.length === 6) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = locations_items[5];
				 loc7 = '';

			  }  else if (locations_items.length === 7) {
			     loc1 = locations_items[0];
                 loc2 = locations_items[1];
			     loc3 = locations_items[2];
			     loc4 = locations_items[3];
			     loc5 = locations_items[4];	
				 loc6 = locations_items[5];
				 loc7 = locations_items[6];
			  }
			  		
			  const  locations_length = locations_data.length;             
			  const locations_exonic = locations_items.includes('exonic');              
			  const locations_utr    = locations_items.includes('utr_5');               
			  const upstream         = locations_items.includes('upstream');
			  const splicesite_3     = locations_items.includes('splicesite_3');
			  const splicesite_5     = locations_items.includes('splicesite_5');
   
			 			  
			  if (!upstream || (upstream && locations_exonic) || (upstream && splicesite_3) || (upstream && splicesite_5)) {
			     if (locations_exonic || (locations_exonic && locations_utr) || splicesite_5 || splicesite_3) {
				    if (locations_length === 0) {
					    loc1 = '';
					    loc2 = '';
					    loc3 = '';
					    loc4 = '';
					    loc5 = '';
					    loc6 = '';
					    loc7 = '';
				     }
				     return {
				        result: true,
					    loc1,
					    loc2,
					    loc3,
					    loc4,
					    loc5,
					    loc6,
					    loc7
				      };
			      }	  
			  } 
			  
		     return { result: false };

}