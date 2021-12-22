const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');

const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param st           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
function nvl(st, defaultStr){
    
    //console.log('st=', st);
    if(st === undefined || st == null || st == "") {
        st = defaultStr ;
    }
        
    return st ;
}

const limsinsertHandler = async (lims, examin, recheck) => {
    // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
    logger.info('[27][limsinsertHandler]lims=' + JSON.stringify(lims));
    logger.info('[27][limsinsertHandler]examin=' + examin);
    logger.info('[27][limsinsertHandler]recheck=' + recheck);
   
     let result;
      
    for (i = 0; i < lims.length; i++)
    {
   
       let pathology_num     = lims[i].pathology_num;
       let path_type         = lims[i].path_type;
       let prescription_code = lims[i].prescription_code;
       let test_code         = lims[i].test_code;
       let block_cnt         = lims[i].block_cnt;
       let key_block         = lims[i].key_block;
       
       let tumorburden       = lims[i].tumorburden;
       let nano_ng           = lims[i].nano_ng;
       let nano_280          = lims[i].nano_280;
       let nano_230          = lims[i].nano_230;
       let nano_dil          = lims[i].nano_dil;
       let ng_ui             = lims[i].ng_ui;
       let dw                = lims[i].dw;
       let tot_ct            = lims[i].tot_ct;
       let ct                = lims[i].ct;
       let quantity          = lims[i].quantity;
       let quantity_2        = lims[i].quantity_2;
       let quan_tot_vol      = lims[i].quan_tot_vol;
       let quan_dna          = lims[i].quan_dna;
       let dan_rna           = lims[i].dan_rna;
       let te                = lims[i].te;
       let lib_hifi          = lims[i].lib_hifi;
       let pm                = lims[i].pm;
       let x100              = lims[i].x100;
       let lib               = lims[i].lib;
       let lib_dw            = lims[i].lib_dw;
       let lib2              = lims[i].lib2;
       let lib2_dw           = lims[i].lib2_dw;
   
       logger.info('[60][limsinsertHandler]pathology_num=' + pathology_num );
       logger.info('[60][limsinsertHandler]path_type=' + path_type + ', prescription_code=' + prescription_code + ', test_code= ' + test_code);
       logger.info('[60][limsinsertHandler]key_block=' + key_block + ',block_cnt=' + block_cnt +  ', tumorburden=' + tumorburden + ', quan_dna=' + quan_dna ); 
       logger.info('[52][limsinsertHandler]nano_ng=' + nano_ng + ', nano_280=' + nano_280 + ', nano_230=' + nano_230 + ', nano_dil=' + nano_dil);
       logger.info('[52][limsinsertHandler]dan_rna=' + dan_rna + ', dw=' + dw + ', tot_ct=' + tot_ct + ', ct=' + ct + ', ng_ui=' + ng_ui );
       logger.info('[52][limsinsertHandler]quantity=' + quantity + ', quantity_2=' + quantity_2 + ', tot_ct=' + tot_ct);
       logger.info('[52][limsinsertHandler]quan_tot_vol=' + quan_tot_vol + ', lib_hifi=' + lib_hifi + ', te=' + te);
       logger.info('[52][limsinsertHandler]pm=' + pm + ', x100=' + x100 );
       logger.info('[52][limsinsertHandler]lib=' + lib + ', lib_dw=' + lib_dw + ', lib2=' + lib2 + ', lib2_dw=' + lib2_dw );
    
       //insert Query 생성;
       const qry = `insert into lims (pathology_num, report_date, path_type, 
                    prescription_code, test_code, key_block, block_cnt, tumorburden,
                    nano_ng, nano_280, nano_230, nano_dil, 
                    dan_rna, dw, tot_ct, ct, te, quan_dna,
                    quantity, quantity_2, quan_tot_vol, ng_ui, lib_hifi, 
                    pm, x100, lib, lib_dw, lib2, lib2_dw, examin, recheck) 
                values(@pathology_num, getdate(),  @path_type,
                    @prescription_code, @test_code, @key_block, @block_cnt, @tumorburden, 
                    @nano_ng, @nano_280, @nano_230, @nano_dil,
                    @dan_rna, @dw, @tot_ct, @ct, @te, @quan_dna,
                    @quantity, @quantity_2, @quan_tot_vol, @ng_ui, @lib_hifi,
                    @pm, @x100, @lib, @lib_dw, @lib2, @lib2_dw, @examin, @recheck)`;
               
         logger.info('[84][limsinsertHandler]sql=' + qry);
         
   
         try {
             const request = pool.request()
               .input('pathology_num', mssql.VarChar, pathology_num)
               .input('path_type', mssql.VarChar, path_type)
               .input('prescription_code', mssql.VarChar, prescription_code)
               .input('test_code', mssql.VarChar, test_code)
               .input('block_cnt', mssql.VarChar, block_cnt)
               .input('key_block', mssql.VarChar, key_block)
               .input('tumorburden', mssql.VarChar, tumorburden)
               .input('nano_ng', mssql.VarChar, nano_ng)
               .input('nano_280', mssql.VarChar, nano_280)
               .input('nano_230', mssql.NVarChar, nano_230)
               .input('nano_dil', mssql.NVarChar, nano_dil)
               .input('ng_ui', mssql.NVarChar, ng_ui)
               .input('dan_rna', mssql.VarChar, dan_rna)
               .input('dw', mssql.VarChar, dw)
               .input('tot_ct', mssql.VarChar, tot_ct)
               .input('ct', mssql.VarChar, ct)
               .input('quantity', mssql.VarChar, quantity)
               .input('quantity_2', mssql.VarChar, quantity_2)
               .input('te', mssql.VarChar, te)
               .input('quan_dna', mssql.VarChar, quan_dna)
               .input('quan_tot_vol', mssql.VarChar, quan_tot_vol)
               .input('lib_hifi', mssql.VarChar, lib_hifi)
               .input('pm', mssql.VarChar, pm)
               .input('x100', mssql.VarChar, x100)
               .input('lib', mssql.VarChar, lib)
               .input('lib_dw', mssql.VarChar, lib_dw)
               .input('lib2', mssql.VarChar, lib2)
               .input('lib2_dw', mssql.VarChar, lib2_dw)
               .input('examin', mssql.VarChar, examin)
               .input('recheck', mssql.VarChar, recheck);
               
               result = await request.query(qry);         
       
        } catch (error) {
        logger.error('[119] *** [limsinsertHandler] *** err=  ****  ' + error.message);
        }
         
    } // End of For Loop
       return result;
}

// set lims 
exports.limsSave = (req, res, next) => {
    
    let lims   =  req.body.lims; 
    let examin = req.body.examin;
    let recheck = req.body.recheck;
    logger.info('[130][limsinsertHandler] ===> ' + lims + ", examin=" + examin +  ", recheck=" + recheck);
    const result = limsinsertHandler(lims, examin, recheck);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[136][limsinsertHandler]err=' + error.message);
    });
}

const  limsSelectHandler = async (start, end) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[142] limsSelectHandler =' + start + ', ' + end);
    //select Query 생성
        let qry = `SELECT
            isnull(a.pathology_num, '') pathology_num 
            , isnull(rel_pathology_num, '') rel_pathology_num 
            , isnull( a.prescription_date, '') prescription_date
            , isnull( a.patientID, '') patientID
            , isnull(gender, '') gender 
            , isnull(age, '') age 
            , isnull(name, '') name
            , isnull(b.id, '') id  
            , isnull( b.prescription_code, '') prescription_code
            , isnull( b.test_code, '') test_code
            , isnull( path_type, '') path_type
            , isnull(b.key_block, '') key_block 
            , isnull(b.block_cnt, '') block_cnt 
            , isnull(b.tumorburden, '') tumorburden
            , isnull(b.report_date, '') report_date
            , isnull(nano_ng, '') nano_ng
            , isnull(nano_280, '') nano_280 
            , isnull(nano_230, '') nano_230
            , isnull(nano_dil, '') nano_dil
            , isnull(ng_ui, '') ng_ui
            , isnull(dw, '') dw
            , isnull(tot_ct, '') tot_ct
            , isnull(ct, '') ct
            , isnull(quantity, '') quantity
            , isnull(quantity_2, '') quantity_2
            , isnull(quan_dna, '') quan_dna
            , isnull(dan_rna, '') dan_rna
            , isnull(te, '') te
            , isnull(quan_tot_vol, '') quan_tot_vol
            , isnull(lib_hifi, '') lib_hifi
            , isnull(pm, '') pm
            , isnull(x100,  '') x100
            , isnull(lib,  '') lib
            , isnull(lib_dw,  '') lib_dw
            , isnull(lib2,  '') lib2
            , isnull(lib2_dw,  '') lib2_dw
        FROM  [dbo].[patientinfo_path] a 
        left outer join [dbo].[lims] b 
        on a.pathology_num  = b.pathology_num
        where isnull(Research_yn, 'N') = 'N' 
        and left(prescription_date, 8) >= '` + start + `'`;

        logger.info('[182]limsSelectHandler sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[191]limsSelectHandler err=' + error.message);
    }
}


// get lims List
exports.limsList = (req, res, next) => {
    logger.info('[198]limsList req=' + JSON.stringify(req.body));

    const start = req.body.start;
    const result = limsSelectHandler(start);
    result.then(data => {  
        //  console.log('[108][excelDvList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[208]excelDvList err=' + error.message);
        res.sendStatus(500)
    }); 
 };