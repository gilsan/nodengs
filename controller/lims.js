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

// lims exist
const  limsCountHandler = async (pathology_num, report_date, dna_rna_gbn) => {
   await poolConnect; // ensures that the pool has been created

  logger.info('[30][lims]limsCountHandler data=' +  pathology_num + ", " + report_date + ", dna_rna_gbn=" + dna_rna_gbn ) ;
 
  let sql =`select  count(*) as count 
            from lims
            where pathology_num=@pathology_num
            and report_date =@report_date
            and dna_rna_gbn = @dna_rna_gbn `;

  logger.info('[36][geneinfo]limsCountHandler sql=' + sql);
 
  try {
       const request = pool.request()
         .input('pathology_num', mssql.VarChar, pathology_num) 
         .input('report_date', mssql.VarChar, report_date)
         .input('dna_rna_gbn', mssql.VarChar, dna_rna_gbn); 
       const result = await request.query(sql)
     //  console.dir( result);
       
       return result.recordset;
  } catch (error) {
    logger.error('[47][lims]limsCountHandler err=' + error.message);
  }
}


const limsinsertHandler = async (lims, examin, recheck) => {
    // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
    logger.info('[54][limsinsertHandler]lims=' + JSON.stringify(lims));
    logger.info('[54][limsinsertHandler]examin=' + examin);
    logger.info('[54][limsinsertHandler]recheck=' + recheck);
   
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
        let report_date       = lims[i].report_date;
        
        let dna_rna_gbn       = lims[i].dna_rna_gbn

        const result6 = limsCountHandler (pathology_num, report_date, dna_rna_gbn);
        result6.then(data => {

            let cnt = data[0].count;

            logger.info('[101][screenList][saveScreen 7]cnt='+ cnt);
            if (cnt === 0)
            {
   
                logger.info('[104][limsinsertHandler]pathology_num=' + pathology_num );
                logger.info('[104][limsinsertHandler]path_type=' + path_type + ', prescription_code=' + prescription_code + ', test_code= ' + test_code);
                logger.info('[104][limsinsertHandler]key_block=' + key_block + ',block_cnt=' + block_cnt +  ', tumorburden=' + tumorburden + ', quan_dna=' + quan_dna ); 
                logger.info('[104][limsinsertHandler]nano_ng=' + nano_ng + ', nano_280=' + nano_280 + ', nano_230=' + nano_230 + ', nano_dil=' + nano_dil);
                logger.info('[104][limsinsertHandler]dan_rna=' + dan_rna + ', dw=' + dw + ', tot_ct=' + tot_ct + ', ct=' + ct + ', ng_ui=' + ng_ui );
                logger.info('[104][limsinsertHandler]quantity=' + quantity + ', quantity_2=' + quantity_2 + ', tot_ct=' + tot_ct);
                logger.info('[104][limsinsertHandler]quan_tot_vol=' + quan_tot_vol + ', lib_hifi=' + lib_hifi + ', te=' + te);
                logger.info('[104][limsinsertHandler]pm=' + pm + ', x100=' + x100 + ', report_date=' + report_date );
                logger.info('[104][limsinsertHandler]lib=' + lib + ', lib_dw=' + lib_dw + ', lib2=' + lib2 + ', lib2_dw=' + lib2_dw + ', dna_rna_gbn=' + dna_rna_gbn );
                
                //insert Query 생성;
                const qry = `insert into lims (pathology_num, report_date, path_type, 
                                prescription_code, test_code, key_block, block_cnt, tumorburden,
                                nano_ng, nano_280, nano_230, nano_dil, 
                                dan_rna, dw, tot_ct, ct, te, quan_dna,
                                quantity, quantity_2, quan_tot_vol, ng_ui, lib_hifi, 
                                pm, x100, lib, lib_dw, lib2, lib2_dw, examin, recheck, dna_rna_gbn) 
                            values(@pathology_num, @report_date,  @path_type,
                                @prescription_code, @test_code, @key_block, @block_cnt, @tumorburden, 
                                @nano_ng, @nano_280, @nano_230, @nano_dil,
                                @dan_rna, @dw, @tot_ct, @ct, @te, @quan_dna,
                                @quantity, @quantity_2, @quan_tot_vol, @ng_ui, @lib_hifi,
                                @pm, @x100, @lib, @lib_dw, @lib2, @lib2_dw, @examin, @recheck, @dna_rna_gbn)`;
                        
                logger.info('[129][limsinsertHandler]sql=' + qry);
                
        
                try {
                    const request = pool.request()
                    .input('pathology_num', mssql.VarChar, pathology_num)
                    .input('report_date', mssql.VarChar, report_date)
                    .input('path_type', mssql.VarChar, path_type)
                    .input('prescription_code', mssql.NVarChar, prescription_code)
                    .input('test_code', mssql.NVarChar, test_code)
                    .input('block_cnt', mssql.NVarChar, block_cnt)
                    .input('key_block', mssql.NVarChar, key_block)
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
                    .input('recheck', mssql.VarChar, recheck)
                    .input('dna_rna_gbn', mssql.VarChar, dna_rna_gbn);

                    result = request.query(qry);         
            
                } catch (error) {
                    logger.error('[170] *** [limsinsertHandler] *** err=  ****  ' + error.message);
                }
            }
            else{

                logger.info('[175][limsinsertHandler]pathology_num=' + pathology_num );
                logger.info('[175][limsinsertHandler]path_type=' + path_type + ', prescription_code=' + prescription_code + ', test_code= ' + test_code);
                logger.info('[175][limsinsertHandler]key_block=' + key_block + ',block_cnt=' + block_cnt +  ', tumorburden=' + tumorburden + ', quan_dna=' + quan_dna ); 
                logger.info('[175][limsinsertHandler]nano_ng=' + nano_ng + ', nano_280=' + nano_280 + ', nano_230=' + nano_230 + ', nano_dil=' + nano_dil);
                logger.info('[175][limsinsertHandler]dan_rna=' + dan_rna + ', dw=' + dw + ', tot_ct=' + tot_ct + ', ct=' + ct + ', ng_ui=' + ng_ui );
                logger.info('[175][limsinsertHandler]quantity=' + quantity + ', quantity_2=' + quantity_2 + ', tot_ct=' + tot_ct);
                logger.info('[175][limsinsertHandler]quan_tot_vol=' + quan_tot_vol + ', lib_hifi=' + lib_hifi + ', te=' + te);
                logger.info('[175][limsinsertHandler]pm=' + pm + ', x100=' + x100 + ', report_date=' + report_date );
                logger.info('[175][limsinsertHandler]lib=' + lib + ', lib_dw=' + lib_dw + ', lib2=' + lib2 + ', lib2_dw=' + lib2_dw + ', dna_rna_gbn=' + dna_rna_gbn );
                
                //insert Query 생성;
                const qry = `update lims 
                                set  path_type = @path_type,
                                prescription_code = @prescription_code,
                                test_code = @test_code,  
                                key_block = @key_block,
                                block_cnt = @block_cnt, 
                                tumorburden = @tumorburden, 
                                nano_ng = @nano_ng,  
                                nano_280 = @nano_280,  
                                nano_230 = @nano_230, 
                                nano_dil = @nano_dil,
                                dan_rna = @dan_rna,  
                                dw = @dw, 
                                tot_ct = @tot_ct,
                                ct = @ct, 
                                te = @te, 
                                quan_dna = @quan_dna,
                                quantity = @quantity, 
                                quantity_2 = @quantity_2,  
                                quan_tot_vol =  @quan_tot_vol, 
                                ng_ui = @ng_ui,
                                lib_hifi = @lib_hifi, 
                                pm = @pm,
                                x100 = @x100,
                                lib = @lib,
                                lib_dw = @lib_dw, 
                                lib2 = @lib2,
                                lib2_dw = @lib2_dw, 
                                examin =@examin, 
                                recheck = @recheck
                            where pathology_num = @pathology_num
                            and  report_date = @report_date 
                            and dna_rna_gbn = @dna_rna_gbn  `;
                        
                logger.info('[222][limsinsertHandler]sql=' + qry);
                
                try {
                    const request = pool.request()
                    .input('pathology_num', mssql.VarChar, pathology_num)
                    .input('report_date', mssql.VarChar, report_date)
                    .input('path_type', mssql.VarChar, path_type)
                    .input('prescription_code', mssql.NVarChar, prescription_code)
                    .input('test_code', mssql.NVarChar, test_code)
                    .input('block_cnt', mssql.NVarChar, block_cnt)
                    .input('key_block', mssql.NVarChar, key_block)
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
                    .input('recheck', mssql.VarChar, recheck)
                    .input('dna_rna_gbn', mssql.VarChar, dna_rna_gbn);

                    result = request.query(qry);         
            
                } catch (error) {
                    logger.error('[263] *** [limsinsertHandler] *** err=  ****  ' + error.message);
                }
            }

        });
         
    } // End of For Loop
       return result;
}

// set lims 
exports.limsSave = (req, res, next) => {
    
    let lims   =  req.body.lims; 
    let examin = req.body.examin;
    let recheck = req.body.recheck;
    logger.info('[279][limsinsertHandler] ===> ' + lims + ", examin=" + examin +  ", recheck=" + recheck);
    const result = limsinsertHandler(lims, examin, recheck);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[285][limsinsertHandler]err=' + error.message);
    });
}

const limsCellPerSaveHandler = async (test_code, tumor_cell_per) => {
    // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
    logger.info('[291][limsCellPerSaveHandler]test_code=' + test_code);
    logger.info('[291][limsCellPerSaveHandler]tumor_cell_per=' + tumor_cell_per);

    let result;
    
    //insert Query 생성;
    const qry = `update patientinfo_path 
                    set  tumor_cell_per = @tumor_cell_per
                where pathology_num = @test_code  `;
            
    logger.info('[302][limsCellPerSaveHandler]sql=' + qry);
    
    try {
        const request = pool.request()
        .input('test_code', mssql.VarChar, test_code)
        .input('tumor_cell_per', mssql.VarChar, tumor_cell_per);

        result = request.query(qry);         

    } catch (error) {
        logger.error('[313] *** [limsCellPerSaveHandler] *** err=  ****  ' + error.message);
    }
}

// set lims 
//  test_code, tumor_cell_per
exports.limsCellPerSave = (req, res, next) => {
    
    let test_code   =  req.body.test_code; 
    let tumor_cell_per = req.body.tumor_cell_per;
    logger.info('[320][limsCellPerSave] ===> ' + test_code  +  ", tumor_cell_per=" + tumor_cell_per);
    const result = limsCellPerSaveHandler(test_code, tumor_cell_per);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[326][limsCellPerSave]err=' + error.message);
    });
}

const limsTumorSaveHandler = async (test_code, tumor_type) => {
    // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
    logger.info('[332][limsTumorSaveHandler]test_code=' + test_code);
    logger.info('[332][limsTumorSaveHandler]tumor_type=' + tumor_type);

    let result;
    
    //insert Query 생성;
    const qry = `update patientinfo_path 
                    set  tumor_type = @tumor_type
                where pathology_num = @test_code  `;
            
    logger.info('[342][limsTumorSaveHandler]sql=' + qry);
    
    try {
        const request = pool.request()
        .input('test_code', mssql.VarChar, test_code)
        .input('tumor_type', mssql.VarChar, tumor_type);

        result = request.query(qry);         

    } catch (error) {
        logger.error('[352] *** [limsTumorSaveHandler] *** err=  ****  ' + error.message);
    }
}

// set lims 
//  test_code, tumor_type
exports.limsTumorSave = (req, res, next) => {
    
    let test_code   =  req.body.test_code; 
    let tumor_type = req.body.tumor_type;
    logger.info('[362][limsTumorSave] ===> ' + test_code + ", tumor_type=" + tumor_type );
    const result = limsTumorSaveHandler(test_code, tumor_type);
    result.then( data => {
         res.json({message: 'SUCCESS'});
    })
    .catch( error => {
        logger.error('[368][limsTumorSave]err=' + error.message);
    });
}

const  limsSelectHandler = async (start, end) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[374] limsSelectHandler =' + start + ', ' + end);
    //select Query 생성
        let qry = `SELECT
            isnull(pathology_num, '') pathology_num 
            , isnull(rel_pathology_num, '') rel_pathology_num 
            , isnull( prescription_date, '') prescription_date
            , isnull( patientID, '') patientID
            , isnull(gender, '') gender 
            , isnull(age, '') age 
            , isnull(name, '') name
            , RANK() OVER (PARTITION BY dna_rna_gbn ORDER BY prescription_date DESC) id  
            , isnull( prescription_code, '') prescription_code
            , isnull( test_code, '') test_code
            , isnull( path_type, '') path_type
            , isnull(key_block, '') key_block 
            , isnull(block_cnt, '') block_cnt 
            , isnull(tumorburden, '') tumorburden
            , isnull(report_date, '') report_date
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
            , isnull(examin,  '') examin
            , isnull(recheck,  '') recheck
            , isnull(dna_rna_gbn, '0') dna_rna_gbn

            from
            (
            SELECT
                isnull(a.pathology_num, '') pathology_num 
                , isnull(rel_pathology_num, '') rel_pathology_num 
                , isnull( a.prescription_date, '') prescription_date
                , isnull( a.patientID, '') patientID
                , isnull(gender, '') gender 
                , isnull(age, '') age 
                , isnull(name, '') name
                , isnull(b.id, '') id  
                , isnull( organ, '') prescription_code
                , isnull( a.tumor_type, '') test_code
                , isnull( path_type, '') path_type
                , isnull(b.key_block, '') key_block 
                , isnull(b.block_cnt, '') block_cnt 
                , isnull(a.tumor_cell_per, '') tumorburden
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
                , isnull(b.examin,  '') examin
                , isnull(b.recheck,  '') recheck
                , isnull(dna_rna_gbn, '0') dna_rna_gbn
            FROM  [dbo].[patientinfo_path] a 
            left outer join [dbo].[lims] b 
            on a.pathology_num  = b.pathology_num
            and ISNULL(b.dna_rna_gbn, '0') = '0'
            where isnull(Research_yn, 'N') = 'N' 
            and left(prescription_date, 8) >= '` + start + `'
            and left(prescription_date, 8) <= '` + end + `'
            union all
            SELECT
                isnull(a.pathology_num, '') pathology_num 
                , isnull(rel_pathology_num, '') rel_pathology_num 
                , isnull( a.prescription_date, '') prescription_date
                , isnull( a.patientID, '') patientID
                , isnull(gender, '') gender 
                , isnull(age, '') age 
                , isnull(name, '') name
                , isnull(b.id, '') id  
                , isnull(organ, '') prescription_code
                , isnull( a.tumor_type, '') test_code
                , isnull( path_type, '') path_type
                , isnull(b.key_block, '') key_block 
                , isnull(b.block_cnt, '') block_cnt 
                , isnull(a.tumor_cell_per, '') tumorburden
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
                , isnull(b.examin,  '') examin
                , isnull(b.recheck,  '') recheck
                , isnull(dna_rna_gbn, '1') dna_rna_gbn
            FROM  [dbo].[patientinfo_path] a 
            left outer join [dbo].[lims] b 
            on a.pathology_num  = b.pathology_num
            and ISNULL(b.dna_rna_gbn, '1') = '1'
            where isnull(Research_yn, 'N') = 'N' 
            and left(prescription_date, 8) >= '` + start + `'
            and left(prescription_date, 8) <= '` + end + `'
            ) a1 `;

        logger.info('[517]limsSelectHandler sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[526]limsSelectHandler err=' + error.message);
    }
}


// get lims List
exports.limsList = (req, res, next) => {
    logger.info('[533]limsList req=' + JSON.stringify(req.body));

    let start = req.body.start;
    let start1 = start.replace(/-/g, '');
    let end = req.body.end;
    let end1 = end.replace(/-/g, '');
    const result = limsSelectHandler(start1, end1);
    result.then(data => {  
        //  console.log('[108][limsList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[545]limsList err=' + error.message);
        res.sendStatus(500)
    }); 
 };
 

const  limsSelectHandler2 = async (start) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[553] limsSelectHandler =' + start );
    //select Query 생성
        let qry = `SELECT
            isnull(pathology_num, '') pathology_num 
            , isnull(rel_pathology_num, '') rel_pathology_num 
            , isnull( prescription_date, '') prescription_date
            , isnull( patientID, '') patientID
            , isnull(gender, '') gender 
            , isnull(age, '') age 
            , isnull(name, '') name
            , RANK() OVER (PARTITION BY dna_rna_gbn ORDER BY pathology_num) id  
            , isnull( prescription_code, '') prescription_code
            , isnull( test_code, '') test_code
            , isnull( path_type, '') path_type
            , isnull(key_block, '') key_block 
            , isnull(block_cnt, '') block_cnt 
            , isnull(tumorburden, '') tumorburden
            , isnull(report_date, '') report_date
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
            , isnull(examin,  '') examin
            , isnull(recheck,  '') recheck
            , isnull(dna_rna_gbn, '0') dna_rna_gbn

            from
            (
            SELECT
                isnull(a.pathology_num, '') pathology_num 
                , isnull(rel_pathology_num, '') rel_pathology_num 
                , isnull( a.prescription_date, '') prescription_date
                , isnull( a.patientID, '') patientID
                , isnull(gender, '') gender 
                , isnull(age, '') age 
                , isnull(name, '') name
                , isnull(b.id, '') id  
                , isnull( organ, '') prescription_code
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
                , isnull(b.examin,  '') examin
                , isnull(b.recheck,  '') recheck
                , isnull(dna_rna_gbn, '0') dna_rna_gbn
            FROM  [dbo].[lims] b 
            inner join  [dbo].[patientinfo_path] a
            on b.pathology_num  = a.pathology_num
            and ISNULL(b.dna_rna_gbn, '0') = '0'
            where left(b.report_date, 8) = '` + start + `'
            union all
            SELECT
                isnull(a.pathology_num, '') pathology_num 
                , isnull(rel_pathology_num, '') rel_pathology_num 
                , isnull( a.prescription_date, '') prescription_date
                , isnull( a.patientID, '') patientID
                , isnull(gender, '') gender 
                , isnull(age, '') age 
                , isnull(name, '') name
                , isnull(b.id, '') id  
                , isnull( organ, '') prescription_code
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
                , isnull(b.examin,  '') examin
                , isnull(b.recheck,  '') recheck
                , isnull(dna_rna_gbn, '1') dna_rna_gbn
            FROM  [dbo].[lims] b 
            inner join  [dbo].[patientinfo_path] a
            on b.pathology_num  = a.pathology_num
            and ISNULL(b.dna_rna_gbn, '1') = '1'
            where left(b.report_date, 8) = '` + start + `'
            ) a1 `;

        logger.info('[692]limsSelectHandler sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[701]limsSelectHandler err=' + error.message);
    }
}


// get lims List
exports.limsList2 = (req, res, next) => {
    logger.info('[708]limsList2 req=' + JSON.stringify(req.body));

    let start = req.body.start;
    let start1 = start.replace(/-/g, '');
    const result = limsSelectHandler2(start1);
    result.then(data => {  
        //  console.log('[108][limsList2]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[718]limsList2 err=' + error.message);
        res.sendStatus(500)
    }); 
 };