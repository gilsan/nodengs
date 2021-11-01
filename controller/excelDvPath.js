const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const logger = require('../common/winston');
const dbConfigMssql = require('../common/dbconfig.js');
const pool = new mssql.ConnectionPool(dbConfigMssql);
const poolConnect = pool.connect();

const  excelDvPathSelectHandler = async (start, end ) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[184] excelDvPathSelectHandler =' + start + ', ' + end );
    //select Query 생성
        let qry = `select
         a.pathology_num
        , isnull(rel_pathology_num, '') rel_pathology_num
        , isnull(patientID, '') patientID
        , isnull(organ, '') organ
        , isnull(pathological_dx, '') pathological_dx
        ,  isnull( CONVERT(VARCHAR(10), convert(datetime, prescription_date, 112), 126) , '') prescription_date
        ,  case when IsNULL( CONVERT(VARCHAR(4), report_date, 126 ), '' ) = '1900'  
            then '' 
            else IsNULL( CONVERT(VARCHAR(10), report_date, 126 ), '' ) end report_date
        , isnull(b.report_gb, '') report_gb
        , isnull(b.gene, '') gene
        , isnull(b.amino_acid_change, '') amino_acid_change
        , isnull(b.nucleotide_change, '') nucleotide_change
        , isnull(b.variant_allele_frequency, '') variant_allele_frequency
        FROM [dbo].[patientinfo_path] a
        left outer join
           (select pathology_num,
                    report_gb,
                    gene,
                    isnull(amino_acid_change, '') amino_acid_change,
                    isnull(nucleotide_change, '') nucleotide_change,
                    isnull(variant_allele_frequency, '') variant_allele_frequency
            from  [dbo].[report_mutation] 
            union all
            select pathology_num,
                    report_gb,
                    gene, 
                    '' amino_acid_change,
                    '' nucleotide_change,
                    '' variant_allele_frequenc
            from  [dbo].[report_fusion] 
            union all
            select pathology_num,
                    report_gb,
                    gene, 
                    '' amino_acid_change,
                    '' nucleotide_change,
                    '' variant_allele_frequenc
            from  [dbo].[report_amplification] 
            ) b
        on a.pathology_num = b.pathology_num
        where left(report_date, 10) >= '` + start + "'" 
             + " and left(report_date, 10) <= '" + end + "'";

        logger.info('[214]excelDvPathSelect sql=' + qry);
    
    try {

        const request = pool.request();

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[223]excelDvPathSelectHandler err=' + error.message);
    }
}

// get excelDv 병리 List
exports.excelDvPathList = (req, res, next) => {
    logger.info('[229]excelDvList req=' + JSON.stringify(req.body));

    const start = req.body.start;
    const end   = req.body.end;
    const result = excelDvPathSelectHandler(start, end);

    result.then(data => {  
          console.log('[108][excelDvPathList]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[242]excelDvPathList err=' + error.message);
        res.sendStatus(500)
    }); 
 };