const { data } = require("../common/winston");
const fs = require('fs');

const logger = require('../common/winston');

const mssql = require('mssql');
const dbConfigMssql = require('../common/dbconfig.js');
const e = require("express");
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const insertOperation   = async ( data5, data_pre) => {
    await poolConnect;

    if (data5 == data_pre)
    {
        console.log ("111", data5, data_pre);
    
        const sql =`
            UPDATE report_detected_igtcr set report_detected_igtcr.disp_specimenNo = report_detected_igtcr.specimenNo 
            FROM report_detected_igtcr
            WHERE report_detected_igtcr.specimenNo = @data3
            ` 
        try {
            
            const request = pool.request()
                .input('data3', mssql.NVarChar, data5);
            
            //let result =  '';
            const result = await request.query(sql).then(data => {
                console.dir(data);
                logger.info ("11-0," + "," + data5);
                logger.info(" rows affected "+ data.rowsAffected[0]);
            })//.catch( err => console.log(err))
        
            console.log("result=", result);

        }   catch(err) {
            console.error('SQL error', err);
        } 

        return data5;
    }
    else 
    {
        console.log ("11", data5, data_pre);

        let sql =`
            UPDATE report_detected_igtcr set report_detected_igtcr.disp_specimenNo = report_detected_igtcr.specimenNo 
            FROM report_detected_igtcr
            WHERE report_detected_igtcr.specimenNo = @data3
        ` 
        try {
            
            const request = pool.request()
                .input('data3', mssql.NVarChar, data5);
            
            //let result =  '';
            const result = await request.query(sql).then(data => {
                console.dir(data);
                logger.info ("11," + "," + data5);
                logger.info(" rows affected "+ data.rowsAffected[0]);
            })//.catch( err => console.log(err))
        
            console.log("result=", result);

        }   catch(err) {
            console.error('SQL error', err);
        } 

        sql =`
            insert into  report_detected_igtcr
            (disp_specimenNo, specimenNo, report_date, gene, total_read_count, read_of_LQIC, percent_of_LQIC, total_Bcell_Tcell_count, total_IGH_read_depth, total_nucelated_cells, 
                        total_cell_equipment, IGHV_mutation, bigo, comment, density, use_yn, report_seq, del_yn)                    
            SELECT   @data4, specimenNo, report_date, gene, total_read_count, read_of_LQIC, percent_of_LQIC, total_Bcell_Tcell_count, total_IGH_read_depth, total_nucelated_cells, 
                        total_cell_equipment, IGHV_mutation, bigo, comment, density, use_yn, report_seq, del_yn
            FROM     report_detected_igtcr
            WHERE    disp_specimenNo = @data3
            ` 
        try {
            
            const request = pool.request()
            .input('data3', mssql.NVarChar, data_pre)
            .input('data4', mssql.NVarChar, data5);
            
            //let result =  '';
            const result = await request.query(sql).then(data => {
                console.dir(data);
                logger.info ("11," + data5 + "," + data_pre);
                logger.info(" rows affected "+ data.rowsAffected[0]);
            })//.catch( err => console.log(err))
        
            console.log("result=", result);

        }   catch(err) {
            console.error('SQL error', err);
        }  

        return data5;
    }
}


const updateOperation   = async (data5, data_pre ) => {

    await poolConnect;

    if (data5 == data_pre)
    {
        console.log ("211", data5, data_pre );

        return data5;
    }
    else 
    {
        console.log ("21", data5, data_pre);

        const sql =`
            insert into report_detected_variants_igtcr
            (specimenNo, report_date, var_idx, sequence, sequence_length, raw_count, v_gene, j_gene, percent_total_reads, cell_equipment, report_seq, del_yn
            )
            
            SELECT  @data4, report_date, var_idx, sequence, sequence_length, raw_count, v_gene, j_gene, percent_total_reads, cell_equipment, report_seq, del_yn
            FROM     report_detected_variants_igtcr
            WHERE     (specimenNo = @data3)
        ` 
        try {
            
            const request = pool.request()
                .input('data3', mssql.NVarChar, data_pre)
                .input('data4', mssql.NVarChar, data5) ;
            
            //let result =  '';
            const result = await request.query(sql).then(data => {
                console.dir(data);
                logger.info ("21," + data5 + "," + data_pre);
                logger.info(" rows affected "+ data.rowsAffected[0]);
            })//.catch( err => console.log(err))
        
            console.log("result=", result);

        }   catch(err) {
            console.error('SQL error', err);
        }  
    }

    return data5;
}



function parse_tsv(s, f) {
    s = s.replace(/,/g, ";");
    var ix_end = 0;
    for (var ix = 0; ix < s.length; ix = ix_end + 1) {
      ix_end = s.indexOf('\n', ix);
      if (ix_end == -1) {
        ix_end = s.length;
      }
    
      var row = s.substring(ix, ix_end).split(';');
  
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

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

var tsvData = '../inhouseupload/pat_diag.csv';

const executeProcedure = async () => {
    await poolConnect;

    logger.info ("0-----------" );
    let data2 ;
    
    var rowData = loadData(tsvData);

    let data3 = rowData[0][1];

    let data5 = rowData[0][2];

    let data6 = rowData[0][2];
    var j;

    for (var i= 0; i < rowData.length; i++)
    {      
        data5 = rowData[i][2];
        j = i - 1;

        if (rowData[i][1] == data3 ) {
            data2 = rowData[i][1];

            if (j < 0)
            {
                data6 = rowData[0][2];      
            }
            else
            {
                data6 = rowData[i - 1][2]; 
            }
        }
        else
        {
            data2 = rowData[i][1];
            data3 = rowData[i][1];
            data6 = rowData[i][2];      
        }

        console.log ("0", i);

        let res = await insertOperation(data5, data6).then( data => {

            console.log ("1", data);
        });

        let res2 = await updateOperation(data5, data6).then( data => {

            console.log ("2", data);
        });

        await sleep(200);
    }

    return {};
}

executeProcedure();

