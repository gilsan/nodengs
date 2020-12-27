const fs = require('fs');

/*
const mssql = require('mssql');

var pool = mssql.createPool({
  host     : '127.0.0.1', //db접속 주소
  user     : 'ngs', //db접속id
  password : 'ngs12#$', //db접속pw
  database : 'ngs_data', //db명
   connectionLimit: 90000
});

function parse_tsv(s, f) {
  s = s.replace(/,/g, ";");
  var ix_end = 0;
  for (var ix = 0; ix < s.length; ix = ix_end + 1) {
    ix_end = s.indexOf('\n', ix);
    if (ix_end == -1) {
      ix_end = s.length;
    }
    var row = s.substring(ix, ix_end).split('\t');
    f(row);
  }
}


function loadData(filePath) {
  if (fs.existsSync(filePath)) {
    var tsvData = fs.readFileSync(filePath, 'utf-8');
    var rowCount = 0;
    var scenarios = [];
    parse_tsv(tsvData, (row) => {
      rowCount++;
      if (rowCount >= 0) {
        scenarios.push(row);
      }
    });
    return scenarios;
  } else {
    return [];
  }
}

///////// START ///////////////////////////
const data = loadData('../diseaseDeptUploadfiles/M20-11575_v1_M20-11575_RNA_v1_Non-Filtered_2020-10-11_19_11_18-oncomine.tsv');
console.log(data.length);

for (let i=0; i < data.length ; i++ ) { 
	const first_char = data[i][0].substring(0,1);	 
    if (first_char !== '#') { 
		const title_char = data[i][0].substring(0,3);

     if (title_char !== 'vcf') {
     
      field   = data[i].toString().split(',');
 
  vcf_rownum                    = field[0];
  rowtype                       = field[1];
  calls                         = field[2];
  id_count                      = field[3];
  alt_count                     = field[4]; 
  oid_count                     = field[5];
  func_count                    = field[6]; 
  alt_idx                       = field[7];
  oid_idx                       = field[8];
  chrom                         = field[9];
  pos                           = field[10];
  ids                           = field[11];
  ref                           = field[12];
  alt                           = field[13];
  qual                          = field[14];
  filter                        = field[15];
  info_cdf_mapd                 = field[16];
  info_ci                       = field[17];
  info_len                      = field[18];
  info_misa                     = field[19]; 
  info_misc                     = field[20];
  info_oalt                     = field[21]; 
  info_oid                      = field[22]; 
  info_omapalt                  = field[23]; 
  info_opos                     = field[24];
  info_oref                     = field[25];
  info_precise                  = field[26]; 
  info_read_count               = field[27]; 
  info_rpm                      = field[28]; 
  info_subset                   = field[29]; 
  info_0_hs                     = field[30];
  info_1_annotation             = field[31]; 
  info_1_dp                     = field[32]; 
  info_1_end                    = field[33];
  info_1_exon_num               = field[34]; 
  info_1_fail_reason            = field[35];  
  info_1_fd                     = field[36]; 
  info_1_fdp                    = field[37]; 
  info_1_fro                    = field[38]; 
  info_1_fsrf                   = field[39];  
  info_1_fsrr                   = field[40]; 
  info_1_fusion_driver_gene     = field[41]; 
  info_1_fxx                    = field[42];
  info_1_gene_name              = field[43];  
  info_1_hs_only                = field[44]; 
  info_1_myv                    = field[45]; 
  info_1_norm_count             = field[46]; 
  info_1_norm_count_to_hk       = field[47]; 
  info_1_norm_count_within_gene = field[48]; 
  info_1_numtiles               = field[49]; 
  info_1_pval                   = field[50]; 
  info_1_qd                     = field[51];
  info_1_ratio_to_wild_type     = field[52]; 
  info_1_raw_cn                 = field[53]; 
  info_1_ref_cn                 = field[54]; 
  info_1_ro                     = field[55];
  info_1_sd                     = field[56];
  info_1_srf                    = field[57]; 
  info_1_srr                    = field[58];
  info_1_suspect                = field[59]; 
  info_1_svtype                 = field[60]; 
  info_1_vcfalt                 = field[61]; 
  info_1_vcfpos                 = field[62]; 
  info_1_vcfref                 = field[63]; 
  info_1_wild_type_assay        = field[64]; 
  info_a_af                     = field[65];
  info_a_ao                     = field[66]; 
  info_a_fao                    = field[67]; 
  info_a_fdvr                   = field[68]; 
  info_a_fr                     = field[69];
  info_a_fsaf                   = field[70]; 
  info_a_fsar                   = field[71]; 
  info_a_fwdb                   = field[72]; 
  info_a_hrun                   = field[73]; 
  info_a_mlld                   = field[74]; 
  info_a_pb                     = field[75];
  info_a_pbp                    = field[76];
  info_a_ppd                    = field[77]; 
  info_a_rbi                    = field[78]; 
  info_a_refb                   = field[79];  
  info_a_revb                   = field[80]; 
  info_a_saf                    = field[81];
  info_a_sar                    = field[82]; 
  info_a_spd                    = field[83]; 
  info_a_ssen                   = field[84]; 
  info_a_ssep                   = field[85]; 
  info_a_sssb                   = field[86]; 
  info_a_stb                    = field[87];
  info_a_stbp                   = field[88]; 
  info_a_type                   = field[89]; 
  info_a_varb                   = field[90];
  format_1_cn                   = field[91]; 
  format_1_dp                   = field[92]; 
  format_1_fd                   = field[93]
  format_1_fdp                  = field[94]; 
  format_1_fro                  = field[95]; 
  format_1_fsrf                 = field[96]; 
  format_1_fsrr                 = field[97]; 
  format_1_gq                   = field[98];
  format_1_gt                   = field[99]; 
  format_1_ro                   = field[100]; 
  format_1_srf                  = field[101];  
  format_1_srr                  = field[102]; 
  format_a_af                   = field[103];
  format_a_ao                   = field[104];
  format_a_fao                  = field[105]; 
  format_a_fsaf                 = field[106]; 
  format_a_fsar                 = field[107];  
  format_a_saf                  = field[108]; 
  format_a_sar                  = field[109]; 
  func1_clnacc1                 = field[110]
  func1_clnid1                  = field[111];
  func1_clnrevstat1             = field[112]; 
  func1_clnsig1                 = field[113];
  func1_coding                  = field[114];
  func1_codon                   = field[115];
  func1_exon                    = field[116];
  func1_function                = field[117]; 
  func1_gene                    = field[118];
  func1_grantham                = field[119]; 
  func1_gt                      = field[120];
  func1_location                = field[121];
  func1_normalizedalt           = field[122];
  func1_normalizedpos           = field[123];
  func1_normalizedref           = field[124];
  func1_oncominegeneclass       = field[125]; 
  func1_oncominevariantclass    = field[126]; 
  fucn1_origalt                 = field[127];
  func1_origpos                 = field[128];
  func1_origref                 = field[129];
  func1_polyphen                = field[130]; 
  func1_protein                 = field[131];
  func1_sift                    = field[132];
  func1_transcript              = field[133]; 
  func1_clnacc1                 = field[134];
  func2_clnid1                   = field[135];
  func2_clnrevstat1              = field[136];  
  func2_clnsig1                  = field[137];
  func2_coding                   = field[138];
  func2_codon                    = field[139];
  func2_exon                     = field[140];
  func2_function                 = field[141]; 
  func2_gene                     = field[142];
  func2_grantham                 = field[143];
  func2_gt                       = field[144];
  func2_location                 = field[145];
  func2_normalizedalt            = field[146]; 
  func2_normalizedpos            = field[147]; 
  func2_normalizedref            = field[148];  
  func2_origalt                  = field[149];
  func2_origpos                  = field[150];
  func2_origref                  = field[151];
  func2_polyphen                 = field[152]; 
  func2_protein                  = field[153];
  func2_sift                     = field[154];
  func2_transcript               = field[155]; 
  func3_coding                  = field[156];
  func3_codon                   = field[157];
  func3_exon                    = field[158];
  func3_function                = field[159];  
  func3_gene                    = field[160];
  func3_grantham                = field[161];
  func3_gt                      = field[162];
  func3_location                = field[163];
  func3_normalizedalt           = field[164]; 
  func3_normalizedpos           = field[165]; 
  func3_normalizedref           = field[166]; 
  func3_origalt                 = field[167];
  func3_origpos                 = field[168];
  func3_origref                 = field[169];
  func3_protein                 = field[170];
  func3_transcript              = field[171]; 
  func4_coding                  = field[172];
  func4_function                = field[173];
  func4_gene                    = field[174];
  func4_gt                      = field[175];
  func4_location                = field[176];
  func4_normalizedalt           = field[177];
  func4_normalizedpos           = field[178];  
  func4_normalizedref           = field[179];  
  func4_origalt                 = field[180]; 
  func4_origpos                 = field[181]; 
  func4_origref                 = field[182]; 
  func4_protein                 = field[183]; 
  func4_transcript              = field[184]; 
  func5_exon                    = field[185];
  func5_gene                    = field[186];
  func5_location                = field[187]; 
  func5_transcript              = field[188]; 
  func6_gene                    = field[189];
  func6_location                = field[190]; 
  func6_transcript              = field[191]; 
  func7_gene                    = field[192];
  func7_location                = field[193]; 
  func7_transcript              = field[194];
  func8_gene                    = field[195];
  func8_location                = field[196];
  func8__transcript             = field[197];
  func9_gene                    = field[198];
  func9_location                = field[199];
  func9_transcript              = field[200];


  const sql=`insert into rna_non_filtered_oncomine (
  vcf_rownum,                  
  rowtype,                     
  calls,                       
  id_count,                    
  alt_count,                    
  oid_count,                   
  func_count,                   
  alt_idx,                     
  oid_idx,                     
  chrom,                       
  pos,                          
  ids,                          
  ref,                          
  alt,                          
  qual,                         
  filter,                       
  info_cdf_mapd,          
  info_ci,                      
  info_len,                     
  info_misa,                     
  info_misc,                    
  info_oalt,                     
  info_oid,                      
  info_omapalt,                  
  info_opos,                    
  info_oref,                    
  info_precise,                  
  info_read_count,               
  info_rpm,                      
  info_subset,                   
  info_0_hs,                    
  info_1_annotation,             
  info_1_dp,                     
  info_1_end,                   
  info_1_exon_num,              
  info_1_fail_reason,             
  info_1_fd,                     
  info_1_fdp,                    
  info_1_fro,                    
  info_1_fsrf,                    
  info_1_fsrr,                   
  info_1_fusion_driver_gene,     
  info_1_fxx,                   
  info_1_gene_name,               
  info_1_hs_only,                
  info_1_myv,                    
  info_1_norm_count,             
  info_1_norm_count_to_hk,       
  info_1_norm_count_within_gene, 
  info_1_numtiles,               
  info_1_pval,                   
  info_1_qd,                    
  info_1_ratio_to_wild_type,     
  info_1_raw_cn,                 
  info_1_ref_cn,                 
  info_1_ro,                    
  info_1_sd,                    
  info_1_srf,                    
  info_1_srr,                   
  info_1_suspect,                
  info_1_svtype,                 
  info_1_vcfalt,                 
  info_1_vcfpos,                 
  info_1_vcfref,                 
  info_1_wild_type_assay,        
  info_a_af,                    
  info_a_ao,                     
  info_a_fao,                    
  info_a_fdvr,                   
  info_a_fr,                    
  info_a_fsaf,                   
  info_a_fsar,                   
  info_a_fwdb,                  
  info_a_hrun,                   
  info_a_mlld,                   
  info_a_pb,                    
  info_a_pbp,                  
  info_a_ppd,                    
  info_a_rbi,                    
  info_a_refb,                    
  info_a_revb,                   
  info_a_saf,                   
  info_a_sar,                    
  info_a_spd,                    
  info_a_ssen,                   
  info_a_ssep,                   
  info_a_sssb,                   
  info_a_stb,                   
  info_a_stbp,                   
  info_a_type,                   
  info_a_varb,                  
  format_1_cn,                   
  format_1_dp,                   
  format_1_fd,                 
  format_1_fdp,                  
  format_1_fro,                  
  format_1_fsrf,                 
  format_1_fsrr,                 
  format_1_gq,                  
  format_1_gt,                   
  format_1_ro,                    
  format_1_srf,                    
  format_1_srr,                   
  format_a_af,                   
  format_a_ao,                   
  format_a_fao,                   
  format_a_fsaf,                  
  format_a_fsar,                   
  format_a_saf,                   
  format_a_sar,                   
  func1_clnacc1,                
  func1_clnid1,                  
  func1_clnrevstat1,              
  func1_clnsig1,                 
  func1_coding,                  
  func1_codon,                   
  func1_exon,                    
  func1_function,                 
  func1_gene,                    
  func1_grantham,                 
  func1_gt,                      
  func1_location,                
  func1_normalizedalt,           
  func1_normalizedpos,           
  func1_normalizedref,           
  func1_oncominegeneclass,        
  func1_oncominevariantclass,     
  fucn1_origalt,                 
  func1_origpos,                 
  func1_origref,                 
  func1_polyphen,                 
  func1_protein,                 
  func1_sift,                    
  func1_transcript,               
  func2_clnacc1,                 
  func2_clnid1,                   
  func2_clnrevstat1,                
  func2_clnsig1,                  
  func2_coding,                   
  func2_codon,                    
  func2_exon ,                    
  func2_function,                  
  func2_gene,                     
  func2_grantham,                 
  func2_gt,                       
  func2_location,                 
  func2_normalizedalt,             
  func2_normalizedpos,             
  func2_normalizedref,              
  func2_origalt,                  
  func2_origpos,                  
  func2_origref,                  
  func2_polyphen,                  
  func2_protein,                  
  func2_sift,                     
  func2_transcript,                
  func3_coding,                  
  func3_codon,                   
  func3_exon,                    
  func3_function,                  
  func3_gene,                    
  func3_grantham,                
  func3_gt,                      
  func3_location,                
  func3_normalizedalt,            
  func3_normalizedpos,            
  func3_normalizedref,            
  func3_origalt,                 
  func3_origpos,                 
  func3_origref,                 
  func3_protein,                 
  func3_transcript,               
  func4_coding,                  
  func4_function,                
  func4_gene,                    
  func4_gt,                      
  func4_location,                
  func4_normalizedalt,           
  func4_normalizedpos,             
  func4_normalizedref,             
  func4_origalt,                  
  func4_origpos,                  
  func4_origref,                  
  func4_protein,                  
  func4_transcript,               
  func5_exon,                    
  func5_gene,                    
  func5_location,                 
  func5_transcript,               
  func6_gene,                    
  func6_location,                 
  func6_transcript,               
  func7_gene,                    
  func7_location,                 
  func7_transcript,              
  func8_gene,                    
  func8_location,                
  func8__transcript,             
  func9_gene,                    
  func9_location,                
  func9_transcript              
	  ) values (
      @vcf_rownum,                  
      @rowtype,                     
      @calls,                       
      @id_count,                    
      @alt_count,                    
      @oid_count,                   
      @func_count,                   
      @alt_idx,                     
      @oid_idx,                     
      @chrom,                       
      @pos,                          
      @ids,                          
      @ref,                          
      @alt,                          
      @qual,                         
      @filter,                       
      @info_cdf_mapd,           
      @info_ci,                      
      @info_len,                     
      @info_misa,                     
      @info_misc,                    
      @info_oalt,                     
      @info_oid,                      
      @info_omapalt,                  
      @info_opos,                    
      @info_oref,                    
      @info_precise,                 
      @info_read_count,              
      @info_rpm,                      
      @info_subset,                   
      @info_0_hs,                    
      @info_1_annotation,             
      @info_1_dp,                     
      @info_1_end,                   
      @info_1_exon_num,               
      @info_1_fail_reason,             
      @info_1_fd,                     
      @info_1_fdp,                    
      @info_1_fro,                    
      @info_1_fsrf,                    
      @info_1_fsrr,                   
      @info_1_fusion_driver_gene,     
      @info_1_fxx,                   
      @info_1_gene_name,               
      @info_1_hs_only,                
      @info_1_myv,                    
      @info_1_norm_count,             
      @info_1_norm_count_to_hk,       
      @info_1_norm_count_within_gene, 
      @info_1_numtiles,               
      @info_1_pval,                   
      @info_1_qd,                    
      @info_1_ratio_to_wild_type,     
      @info_1_raw_cn,                 
      @info_1_ref_cn,                 
      @info_1_ro,                    
      @info_1_sd,                    
      @info_1_srf,                    
      @info_1_srr,                   
      @info_1_suspect,                
      @info_1_svtype,                 
      @info_1_vcfalt,                 
      @info_1_vcfpos,                 
      @info_1_vcfref,                 
      @info_1_wild_type_assay,        
      @info_a_af,                    
      @info_a_ao,                     
      @info_a_fao,                    
      @info_a_fdvr,                   
      @info_a_fr,                    
      @info_a_fsaf,                   
      @info_a_fsar,                   
      @info_a_fwdb,                   
      @info_a_hrun,                   
      @info_a_mlld,                   
      @info_a_pb,                    
      @info_a_pbp,                   
      @info_a_ppd,                    
      @info_a_rbi,                    
      @info_a_refb,                    
      @info_a_revb,                   
      @info_a_saf,                   
      @info_a_sar,                    
      @info_a_spd,                    
      @info_a_ssen,                   
      @info_a_ssep,                   
      @info_a_sssb,                   
      @info_a_stb,                   
      @info_a_stbp,                   
      @info_a_type,                   
      @info_a_varb,                  
      @format_1_cn,                   
      @format_1_dp,                   
      @format_1_fd,                 
      @format_1_fdp,                  
      @format_1_fro,                  
      @format_1_fsrf,                 
      @format_1_fsrr,                 
      @format_1_gq,                  
      @format_1_gt,                   
      @format_1_ro,                   
      @format_1_srf,                    
      @format_1_srr,                   
      @format_a_af,                   
      @format_a_ao,                   
      @format_a_fao,                   
      @format_a_fsaf,                  
      @format_a_fsar,                   
      @format_a_saf,                   
      @format_a_sar,                   
      @func1_clnacc1,                
      @func1_clnid1,                  
      @func1_clnrevstat1,              
      @func1_clnsig1,                 
      @func1_coding,                  
      @func1_codon,                   
      @func1_exon,                    
      @func1_function ,                
      @func1_gene,                    
      @func1_grantham,                 
      @func1_gt,                      
      @func1_location,                
      @func1_normalizedalt,           
      @func1_normalizedpos,           
      @func1_normalizedref,           
      @func1_oncominegeneclass,        
      @func1_oncominevariantclass,     
      @fucn1_origalt,                 
      @func1_origpos,                 
      @func1_origref,                 
      @func1_polyphen,                 
      @func1_protein,                 
      @func1_sift,                    
      @func1_transcript,               
      @func1_clnacc1,                 
      @func2_clnid1,                   
      @func2_clnrevstat1,                
      @func2_clnsig1,                  
      @func2_coding,                   
      @func2_codon,                    
      @func2_exon,                     
      @func2_function,                  
      @func2_gene,                     
      @func2_grantham,                 
      @func2_gt,                       
      @func2_location,                 
      @func2_normalizedalt,             
      @func2_normalizedpos,             
      @func2_normalizedref,              
      @func2_origalt,                  
      @func2_origpos,                  
      @func2_origref,                  
      @func2_polyphen,                  
      @func2_protein,                  
      @func2_sift,                     
      @func2_transcript,                
      @func3_coding,                  
      @func3_codon,                   
      @func3_exon,                    
      @func3_function,                  
      @func3_gene,                    
      @func3_grantham,                
      @func3_gt,                      
      @func3_location,                
      @func3_normalizedalt,            
      @func3_normalizedpos,            
      @func3_normalizedref,            
      @func3_origalt,                 
      @func3_origpos,                
      @func3_origref,                 
      @func3_protein,                 
      @func3_transcript,               
      @func4_coding,                  
      @func4_function,                
      @func4_gene,                    
      @func4_gt,                      
      @func4_location,                
      @func4_normalizedalt,           
      @func4_normalizedpos,             
      @func4_normalizedref,             
      @func4_origalt,                  
      @func4_origpos,                  
      @func4_origref,                  
      @func4_protein,                  
      @func4_transcript,               
      @func5_exon,                    
      @func5_gene,                    
      @func5_location,                 
      @func5_transcript,               
      @func6_gene,                    
      @func6_location,                 
      @func6_transcript,               
      @func7_gene,                    
      @func7_location,                 
      @func7_transcript,              
      @func8_gene,                    
      @func8_location,                
      @func8__transcript,             
      @func9_gene,                    
      @func9_location,                
      @func9_transcript )`;

        pool.getConnection()
         .then(conn => {    
             conn.query(sql, params)
              .then((rows) => {
                  console.log('결과', rows);  
				  conn.end();
              }) 
        }).catch(err => {
            console.log('not connect');	        
        });
   
	 } // vcf End of title if
	} // [49] End of first_char if
} // [47] End of For Loop 

*/