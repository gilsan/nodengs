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

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const igtcrSelectHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[27] igtcrSelectHandler =' + specimenNo);

    //select Query 생성
    let qry = `select 
                c.specimenNo specimenNo,  
                RANK() OVER(PARTITION BY c.patientID ORDER BY c.accept_date) AS cnt
            from  [patientinfo_diag] b 
            inner join (select patientID, specimenNo, accept_date from dbo.[patientinfo_diag] 
                where  test_code in (select code from codedefaultvalue where type = 'igtcr')) c
                on b.patientID  = c.patientID
				and b.accept_date >= c.accept_date
        where b.specimenNo = @specimenNo2 `;

    logger.info('[38]]igtcrSelectHandler sql=' + qry);
    
    try {

        const request = pool.request()
        .input('specimenNo2', mssql.VarChar, specimenNo);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[48]igtcrSelectHandler err=' + error.message);
    }
}

const igtcrCntHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[54] igtcrCommentHandler =' + specimenNo);

    //select Query 생성
    let qry = `select 
            count(1) as cnt
        from [dbo].[report_comments] a 
        where a.specimenNo = @specimenNo2
    `;

    logger.info('[65]]igtcrCommentHandler sql=' + qry);
    
    try {

        const request = pool.request()
        .input('specimenNo2', mssql.VarChar, specimenNo);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[75]igtcrCommentHandler err=' + error.message);
    }
}

const igtcrReportHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[83] igtcrCommentHandler =' + specimenNo);

    //select Query 생성
    let qry = `select 
                c.specimenNo,  
                RANK() OVER(PARTITION BY c.patientID ORDER BY c.accept_date) AS cnt
            from  [patientinfo_diag] b 
            inner join (select patientID, specimenNo, accept_date from dbo.[patientinfo_diag]
                         where  test_code in (select code from codedefaultvalue where type = 'igtcr') ) c
                on b.patientID  = c.patientID
            inner join	report_comments a         
                on b.specimenNo  = a.specimenNo
            where a.specimenNo = @specimenNo2
    `;

    logger.info('[96]]igtcrReportHandler sql=' + qry);
    
    try {

        const request = pool.request()
        .input('specimenNo2', mssql.VarChar, specimenNo);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[106]igtcrReportHandler err=' + error.message);
    }
}


const igtcrListHandler = async (resultspecimenNo, resultspecimenNo2, specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    
    logger.info('[55] igtcrListHandler =' + resultspecimenNo + ", " + resultspecimenNo2 + ", " + specimenNo );

        //select Query 생성
        let qry = `select a1.specimenNo specimenNo,
            a1.report_date report_date,
            a1.gene gene,
            a1.total_read_count total_read_count,
            a1.percent_of_LQIC percent_of_LQIC ,            
            a1.read_of_LQIC read_of_LQIC ,
            a1.total_Bcell_Tcell_count total_Bcell_Tcell_count,
            a1.total_IGH_read_depth total_IGH_read_depth,
            a1.total_nucelated_cells total_nucelated_cells,
            a1.total_cell_equipment total_cell_equipment,
            a1.IGHV_mutation IGHV_mutation,
            a1.bigo bigo,
            a1.comment comment,
            a1.density density,
            a1.use_yn use_yn1,  

            aa.sequence1         sequence1, aa.sequence_length1  sequence_length1,  aa.raw_count1   raw_count1,
            aa.v_gene1           v_gene1,   aa.j_gene1           j_gene1, 
            aa.percent_total_reads1  percent_total_reads1,       aa.cell_equipment1 cell_equipment1, 

            aa.sequence2        sequence2,  aa.sequence_length2  sequence_length2,  aa.raw_count2   raw_count2,
            aa.v_gene2          v_gene2,    aa.j_gene2           j_gene2,   
            aa.percent_total_reads2  percent_total_reads2,       aa.cell_equipment2 cell_equipment2, 

            aa.sequence3        sequence3,  aa.sequence_length3  sequence_length3,   aa.raw_count3   raw_count3,
            aa.v_gene3          v_gene3,    aa.j_gene3           j_gene3,    
            aa.percent_total_reads3  percent_total_reads3,       aa.cell_equipment3 cell_equipment3, 
        
            aa.sequence4        sequence4,  aa.sequence_length4  sequence_length4,  aa.raw_count4   raw_count4,
            aa.v_gene4          v_gene4,    aa.j_gene4           j_gene4,   
            aa.percent_total_reads4  percent_total_reads4,       aa.cell_equipment4 cell_equipment4, 

            aa.sequence5        sequence5,  aa.sequence_length5  sequence_length5,  aa.raw_count5 raw_count5,
            aa.v_gene5          v_gene5,    aa.j_gene5           j_gene5,
            aa.percent_total_reads5  percent_total_reads5,       aa.cell_equipment5 cell_equipment5, 
    
            aa.sequence6        sequence6,  aa.sequence_length6 sequence_length6,   aa.raw_count6 raw_count6,
            aa.v_gene6          v_gene6,    aa.j_gene6           j_gene6,
            aa.percent_total_reads6  percent_total_reads6,       aa.cell_equipment6 cell_equipment6, 
    
            aa.sequence7         sequence7, aa.sequence_length7 sequence_length7,
            aa.raw_count7 raw_count7,
            aa.v_gene7            v_gene7,        aa.j_gene7            j_gene7,
            aa.percent_total_reads7            percent_total_reads7,
            aa.cell_equipment7    cell_equipment7,
        
            aa.sequence8            sequence8, aa.sequence_length8 sequence_length8,
            aa.raw_count8 raw_count8,
            aa.v_gene8            v_gene8, aa.j_gene8            j_gene8,
            aa.percent_total_reads8            percent_total_reads8,
            aa.cell_equipment8    cell_equipment8,
            
            aa.sequence9         sequence9, aa.sequence_length9 sequence_length9,
            aa.raw_count9 raw_count9,
            aa.v_gene9            v_gene9, aa.j_gene9            j_gene9,
            aa.percent_total_reads9            percent_total_reads9,
            aa.cell_equipment9    cell_equipment9,
            
            aa.sequence10 sequence10, aa.sequence_length10 sequence_length10,
            aa.raw_count10 raw_count10,
            aa.v_gene10            v_gene10, aa.j_gene10            j_gene10,
            aa.percent_total_reads10            percent_total_reads10,
            aa.cell_equipment10    cell_equipment10
        from
            ( select a.specimenNo specimenNo,
                a.report_date report_date,
                a.gene gene,
                a.total_read_count total_read_count,
                a.percent_of_LQIC percent_of_LQIC ,            
                a.read_of_LQIC read_of_LQIC ,
                a.total_Bcell_Tcell_count total_Bcell_Tcell_count,
                a.total_IGH_read_depth total_IGH_read_depth,
                a.total_nucelated_cells total_nucelated_cells,
                a.total_cell_equipment total_cell_equipment,
                a.IGHV_mutation IGHV_mutation,
                a.bigo bigo,
                a.comment comment,
                a.density density,
                isnull(a.use_yn, 'false') use_yn  ,
                a.report_seq report_seq 
                from    dbo.report_detected_igtcr a
                left outer join [dbo].[report_igtcr_visible] b
                    on a.specimenNo = b.disp_specimenNo
                    and a.report_seq = b.report_seq 
                    and isnull(a.del_yn, 'N') = 'N'
                where a.specimenNo = '` + specimenNo  + `'
                and isnull(a.del_yn, 'N') = 'N'
                and b.id is not null
                union all 
                select a.specimenNo specimenNo,
                a.report_date report_date,
                a.gene gene,
                a.total_read_count total_read_count,
                a.percent_of_LQIC percent_of_LQIC ,            
                a.read_of_LQIC read_of_LQIC ,
                a.total_Bcell_Tcell_count total_Bcell_Tcell_count,
                a.total_IGH_read_depth total_IGH_read_depth,
                a.total_nucelated_cells total_nucelated_cells,
                a.total_cell_equipment total_cell_equipment,
                a.IGHV_mutation IGHV_mutation,
                a.bigo bigo,
                a.comment comment,
                a.density density,
                isnull(a.use_yn, 'false') use_yn  ,
                a.report_seq report_seq 
                from    dbo.report_detected_igtcr a
                where a.specimenNo in ` + resultspecimenNo2  + `
                and isnull(a.del_yn, 'N') = 'N'
            ) a1
            left outer  join 
            (
                select specimenNo specimenNo,
                    report_date report_date,
                    isnull(report_seq, 1) report_seq,
                    max(sequence1)         sequence1, max(sequence_length1)  sequence_length1, 
                    max(raw_count1)        raw_count1,
                    max(v_gene1)            v_gene1,  max(j_gene1)            j_gene1,
                    max(percent_total_reads1)            percent_total_reads1,
                    max(cell_equipment1)    cell_equipment1,

                    max(sequence2) sequence2, max(sequence_length2) sequence_length2,
                    max(raw_count2) raw_count2,
                    max(v_gene2)            v_gene2, max(j_gene2)            j_gene2,
                    max(percent_total_reads2)            percent_total_reads2,
                    max(cell_equipment2)    cell_equipment2,

                    max(sequence3) sequence3, max(sequence_length3) sequence_length3,
                    max(raw_count3) raw_count3,
                    max(v_gene3)            v_gene3, max(j_gene3)            j_gene3,
                    max(percent_total_reads3)            percent_total_reads3,
                    max(cell_equipment3)    cell_equipment3,
                    
                    max(sequence4) sequence4, max(sequence_length4) sequence_length4,
                    max(raw_count4) raw_count4,
                    max(v_gene4)            v_gene4, max(j_gene4)            j_gene4,
                    max(percent_total_reads4)            percent_total_reads4,
                    max(cell_equipment4)    cell_equipment4,

                    max(sequence5) sequence5, max(sequence_length5) sequence_length5,
                    max(raw_count5) raw_count5,
                    max(v_gene5)            v_gene5,    max(j_gene5)            j_gene5,
                    max(percent_total_reads5)            percent_total_reads5,
                    max(cell_equipment5)    cell_equipment5,
                
                    max(sequence6) sequence6,    max(sequence_length6) sequence_length6,
                    max(raw_count6) raw_count6,
                    max(v_gene6)            v_gene6,    max(j_gene6)            j_gene6,
                    max(percent_total_reads6)            percent_total_reads6,
                    max(cell_equipment6)    cell_equipment6,
                
                    max(sequence7) sequence7,    max(sequence_length7) sequence_length7,
                    max(raw_count7) raw_count7,
                    max(v_gene7)            v_gene7,    max(j_gene7)            j_gene7,
                    max(percent_total_reads7)            percent_total_reads7,
                    max(cell_equipment7)    cell_equipment7,
                
                    max(sequence8) sequence8,    max(sequence_length8) sequence_length8,
                    max(raw_count8) raw_count8,
                    max(v_gene8)            v_gene8,    max(j_gene8)            j_gene8,
                    max(percent_total_reads8)            percent_total_reads8,
                    max(cell_equipment8)    cell_equipment8,
                    
                    max(sequence9) sequence9,    max(sequence_length9) sequence_length9,
                    max(raw_count9) raw_count9,
                    max(v_gene9)            v_gene9,    max(j_gene9)            j_gene9,
                    max(percent_total_reads9)            percent_total_reads9,
                    max(cell_equipment9)    cell_equipment9,
                    
                    max(sequence10) sequence10,    max(sequence_length10) sequence_length10,
                    max(raw_count10) raw_count10,
                    max(v_gene10)            v_gene10,    max(j_gene10)            j_gene10,
                    max(percent_total_reads10)            percent_total_reads10,
                    max(cell_equipment10)    cell_equipment10
            from
            (
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    , [sequence]         sequence1      , [sequence_length]  sequence_length1
                    , [raw_count]        raw_count1
                    , [v_gene]           v_gene1    , [j_gene]           j_gene1
                    , [percent_total_reads] percent_total_reads1
                    , [cell_equipment]    cell_equipment1
                    
                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''     v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3      , '' sequence_length3
                    , '' raw_count3
                    , ''     v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3
                    
                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''    v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5      , '' sequence_length5
                    , '' raw_count5
                    , ''    v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''    v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''    v_gene7, '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''    v_gene8, ''           j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''    v_gene9, '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''    v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 1
                and isnull(del_yn, 'N') = 'N'
                union all
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      , '' sequence_length1
                    , '' raw_count1
                    , ''    v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , [sequence] sequence2  , [sequence_length]  sequence_length2       
                    , raw_count raw_count2
                    , [v_gene]   v_gene2    , [j_gene]   j_gene2
                    , [percent_total_reads] percent_total_reads2
                    , [cell_equipment]    cell_equipment2
                    
                    , '' sequence3      , '' sequence_length3
                    , '' raw_count3
                    , ''    v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3
                    
                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''    v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''    v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''    v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''    v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''    v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''     v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''    v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 2
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''    v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''     v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , [sequence] sequence3  
                    , [sequence_length] sequence_length3
                    , [raw_count] raw_count3
                    , [v_gene]           v_gene3
                    , [j_gene]           j_gene3
                    , [percent_total_reads] percent_total_reads3
                    , [cell_equipment]    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''           v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''           v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''        v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 3
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''           v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''           v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , ''           v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , [sequence] sequence4      , [sequence_length] sequence_length4
                    , [raw_count] raw_count4
                    , [v_gene]           v_gene4    , [j_gene]           j_gene4
                    , [percent_total_reads] percent_total_reads4
                    , [cell_equipment]    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''           v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''           v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 4
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''           v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''           v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , ''           v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''           v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4
                    
                    , [sequence] sequence5      , [sequence_length] sequence_length5
                    , [raw_count] raw_count5
                    , [v_gene]           v_gene5    , [j_gene]           j_gene5
                    , [percent_total_reads] percent_total_reads5
                    , [cell_equipment]    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''           v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 5
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , [sequence] sequence6      , [sequence_length] sequence_length6
                    , [raw_count] raw_count6
                    , [v_gene]           v_gene6    , [j_gene]           j_gene6
                    , [percent_total_reads] percent_total_reads6
                    , [cell_equipment]    cell_equipment6
                    
                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 6
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4
                    
                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6
                    
                    , [sequence] sequence7     , [sequence_length] sequence_length7
                    , [raw_count] raw_count7
                    , [v_gene]           v_gene7    , [j_gene]           j_gene7
                    , [percent_total_reads] percent_total_reads7
                    , [cell_equipment]    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 7
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7
                    
                    , [sequence] sequence8     , [sequence_length] sequence_length8
                    , [raw_count] raw_count8
                    , [v_gene]           v_gene8    , [j_gene]           j_gene8
                    , [percent_total_reads] percent_total_reads8
                    , [cell_equipment]    cell_equipment8
                    
                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 8
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7
                    
                    , '' sequence8     , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , [sequence] sequence9      , [sequence_length] sequence_length9
                    , [raw_count] raw_count9
                    , [v_gene]           v_gene9    , [j_gene]           j_gene9
                    , [percent_total_reads] percent_total_reads9
                    , [cell_equipment]    cell_equipment9
                    
                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10 
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 9
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1
                    
                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8     , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , [sequence] sequence10      , [sequence_length] sequence_length10
                    , [raw_count] raw_count10
                    , [v_gene]           v_gene10    , [j_gene]           j_gene10
                    , [percent_total_reads] percent_total_reads10
                    , [cell_equipment]    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 10
                and isnull(del_yn, 'N') = 'N'
            ) a 
            group by specimenNo, report_date , report_seq
        ) aa
        on a1.specimenNo = aa.specimenNo
        and a1.report_date = aa.report_date
        and a1.report_seq = aa.report_seq
        where a1.specimenNo in ` + resultspecimenNo  + `
        order by report_date desc, a1.report_seq desc`;

        logger.info('[974]igtcrListHandler sql=' + qry);
        
        try {

            const request = pool.request()
            .input('specimenNo', mssql.VarChar, resultspecimenNo);

            const result = await request.query(qry);
            return result.recordset; 
        }catch (error) {
            logger.error('[984]igtcrListHandler err=' + error.message);
        }
}


const igtcrListHandler_557 = async (resultspecimenNo, resultspecimenNo2, specimenNo, gene) => {
    await poolConnect; // ensures that the pool has been created
    
    logger.info('[992] igtcrListHandler_557 =' + resultspecimenNo + ", " + resultspecimenNo2 + ", " + specimenNo + ", " + gene );

        //select Query 생성
        let qry = `select a1.specimenNo specimenNo,
            a1.report_date report_date,
            a1.gene gene,
            a1.total_read_count total_read_count,
            a1.percent_of_LQIC percent_of_LQIC ,            
            a1.read_of_LQIC read_of_LQIC ,
            a1.total_Bcell_Tcell_count total_Bcell_Tcell_count,
            a1.total_IGH_read_depth total_IGH_read_depth,
            a1.total_nucelated_cells total_nucelated_cells,
            a1.total_cell_equipment total_cell_equipment,
            a1.IGHV_mutation IGHV_mutation,
            a1.bigo bigo,
            a1.comment comment,
            a1.density density,
            a1.use_yn use_yn1,  

            aa.sequence1         sequence1, aa.sequence_length1  sequence_length1,  aa.raw_count1   raw_count1,
            aa.v_gene1           v_gene1,   aa.j_gene1           j_gene1, 
            aa.percent_total_reads1  percent_total_reads1,       aa.cell_equipment1 cell_equipment1, 

            aa.sequence2        sequence2,  aa.sequence_length2  sequence_length2,  aa.raw_count2   raw_count2,
            aa.v_gene2          v_gene2,    aa.j_gene2           j_gene2,   
            aa.percent_total_reads2  percent_total_reads2,       aa.cell_equipment2 cell_equipment2, 

            aa.sequence3        sequence3,  aa.sequence_length3  sequence_length3,   aa.raw_count3   raw_count3,
            aa.v_gene3          v_gene3,    aa.j_gene3           j_gene3,    
            aa.percent_total_reads3  percent_total_reads3,       aa.cell_equipment3 cell_equipment3, 
        
            aa.sequence4        sequence4,  aa.sequence_length4  sequence_length4,  aa.raw_count4   raw_count4,
            aa.v_gene4          v_gene4,    aa.j_gene4           j_gene4,   
            aa.percent_total_reads4  percent_total_reads4,       aa.cell_equipment4 cell_equipment4, 

            aa.sequence5        sequence5,  aa.sequence_length5  sequence_length5,  aa.raw_count5 raw_count5,
            aa.v_gene5          v_gene5,    aa.j_gene5           j_gene5,
            aa.percent_total_reads5  percent_total_reads5,       aa.cell_equipment5 cell_equipment5, 
    
            aa.sequence6        sequence6,  aa.sequence_length6 sequence_length6,   aa.raw_count6 raw_count6,
            aa.v_gene6          v_gene6,    aa.j_gene6           j_gene6,
            aa.percent_total_reads6  percent_total_reads6,       aa.cell_equipment6 cell_equipment6, 
    
            aa.sequence7         sequence7, aa.sequence_length7 sequence_length7,
            aa.raw_count7 raw_count7,
            aa.v_gene7            v_gene7,        aa.j_gene7            j_gene7,
            aa.percent_total_reads7            percent_total_reads7,
            aa.cell_equipment7    cell_equipment7,
        
            aa.sequence8            sequence8, aa.sequence_length8 sequence_length8,
            aa.raw_count8 raw_count8,
            aa.v_gene8            v_gene8, aa.j_gene8            j_gene8,
            aa.percent_total_reads8            percent_total_reads8,
            aa.cell_equipment8    cell_equipment8,
            
            aa.sequence9         sequence9, aa.sequence_length9 sequence_length9,
            aa.raw_count9 raw_count9,
            aa.v_gene9            v_gene9, aa.j_gene9            j_gene9,
            aa.percent_total_reads9            percent_total_reads9,
            aa.cell_equipment9    cell_equipment9,
            
            aa.sequence10 sequence10, aa.sequence_length10 sequence_length10,
            aa.raw_count10 raw_count10,
            aa.v_gene10            v_gene10, aa.j_gene10            j_gene10,
            aa.percent_total_reads10            percent_total_reads10,
            aa.cell_equipment10    cell_equipment10
        from
            ( select a.specimenNo specimenNo,
                a.report_date report_date,
                a.gene gene,
                a.total_read_count total_read_count,
                a.percent_of_LQIC percent_of_LQIC ,            
                a.read_of_LQIC read_of_LQIC ,
                a.total_Bcell_Tcell_count total_Bcell_Tcell_count,
                a.total_IGH_read_depth total_IGH_read_depth,
                a.total_nucelated_cells total_nucelated_cells,
                a.total_cell_equipment total_cell_equipment,
                a.IGHV_mutation IGHV_mutation,
                a.bigo bigo,
                a.comment comment,
                a.density density,
                isnull(a.use_yn, 'false') use_yn  ,
                a.report_seq report_seq 
                from    dbo.report_detected_igtcr a
                left outer join [dbo].[report_igtcr_visible] b
                    on a.specimenNo = b.disp_specimenNo
                    and a.report_seq = b.report_seq 
                    and b.gene = '` + gene  + `'
                    and isnull(b.del_yn, 'N') = 'N'
                where a.specimenNo = '` + specimenNo  + `'
                and a.gene = '` + gene  + `'
                and isnull(a.del_yn, 'N') = 'N'
                and b.id is not null
                union all 
                select a.specimenNo specimenNo,
                a.report_date report_date,
                a.gene gene,
                a.total_read_count total_read_count,
                a.percent_of_LQIC percent_of_LQIC ,            
                a.read_of_LQIC read_of_LQIC ,
                a.total_Bcell_Tcell_count total_Bcell_Tcell_count,
                a.total_IGH_read_depth total_IGH_read_depth,
                a.total_nucelated_cells total_nucelated_cells,
                a.total_cell_equipment total_cell_equipment,
                a.IGHV_mutation IGHV_mutation,
                a.bigo bigo,
                a.comment comment,
                a.density density,
                isnull(a.use_yn, 'false') use_yn  ,
                a.report_seq report_seq 
                from    dbo.report_detected_igtcr a
                where a.specimenNo in ` + resultspecimenNo2  + `
                and a.gene = '` + gene  + `'
                and isnull(a.del_yn, 'N') = 'N'
            ) a1
            left outer  join 
            (
                select specimenNo specimenNo,
                    report_date report_date,
                    isnull(report_seq, 1) report_seq,
                    max(sequence1)         sequence1, max(sequence_length1)  sequence_length1, 
                    max(raw_count1)        raw_count1,
                    max(v_gene1)            v_gene1,  max(j_gene1)            j_gene1,
                    max(percent_total_reads1)            percent_total_reads1,
                    max(cell_equipment1)    cell_equipment1,

                    max(sequence2) sequence2, max(sequence_length2) sequence_length2,
                    max(raw_count2) raw_count2,
                    max(v_gene2)            v_gene2, max(j_gene2)            j_gene2,
                    max(percent_total_reads2)            percent_total_reads2,
                    max(cell_equipment2)    cell_equipment2,

                    max(sequence3) sequence3, max(sequence_length3) sequence_length3,
                    max(raw_count3) raw_count3,
                    max(v_gene3)            v_gene3, max(j_gene3)            j_gene3,
                    max(percent_total_reads3)            percent_total_reads3,
                    max(cell_equipment3)    cell_equipment3,
                    
                    max(sequence4) sequence4, max(sequence_length4) sequence_length4,
                    max(raw_count4) raw_count4,
                    max(v_gene4)            v_gene4, max(j_gene4)            j_gene4,
                    max(percent_total_reads4)            percent_total_reads4,
                    max(cell_equipment4)    cell_equipment4,

                    max(sequence5) sequence5, max(sequence_length5) sequence_length5,
                    max(raw_count5) raw_count5,
                    max(v_gene5)            v_gene5,    max(j_gene5)            j_gene5,
                    max(percent_total_reads5)            percent_total_reads5,
                    max(cell_equipment5)    cell_equipment5,
                
                    max(sequence6) sequence6,    max(sequence_length6) sequence_length6,
                    max(raw_count6) raw_count6,
                    max(v_gene6)            v_gene6,    max(j_gene6)            j_gene6,
                    max(percent_total_reads6)            percent_total_reads6,
                    max(cell_equipment6)    cell_equipment6,
                
                    max(sequence7) sequence7,    max(sequence_length7) sequence_length7,
                    max(raw_count7) raw_count7,
                    max(v_gene7)            v_gene7,    max(j_gene7)            j_gene7,
                    max(percent_total_reads7)            percent_total_reads7,
                    max(cell_equipment7)    cell_equipment7,
                
                    max(sequence8) sequence8,    max(sequence_length8) sequence_length8,
                    max(raw_count8) raw_count8,
                    max(v_gene8)            v_gene8,    max(j_gene8)            j_gene8,
                    max(percent_total_reads8)            percent_total_reads8,
                    max(cell_equipment8)    cell_equipment8,
                    
                    max(sequence9) sequence9,    max(sequence_length9) sequence_length9,
                    max(raw_count9) raw_count9,
                    max(v_gene9)            v_gene9,    max(j_gene9)            j_gene9,
                    max(percent_total_reads9)            percent_total_reads9,
                    max(cell_equipment9)    cell_equipment9,
                    
                    max(sequence10) sequence10,    max(sequence_length10) sequence_length10,
                    max(raw_count10) raw_count10,
                    max(v_gene10)            v_gene10,    max(j_gene10)            j_gene10,
                    max(percent_total_reads10)            percent_total_reads10,
                    max(cell_equipment10)    cell_equipment10
            from
            (
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    , [sequence]         sequence1      , [sequence_length]  sequence_length1
                    , [raw_count]        raw_count1
                    , [v_gene]           v_gene1    , [j_gene]           j_gene1
                    , [percent_total_reads] percent_total_reads1
                    , [cell_equipment]    cell_equipment1
                    
                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''     v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3      , '' sequence_length3
                    , '' raw_count3
                    , ''     v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3
                    
                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''    v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5      , '' sequence_length5
                    , '' raw_count5
                    , ''    v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''    v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''    v_gene7, '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''    v_gene8, ''           j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''    v_gene9, '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''    v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                    and [var_idx]  = 1
                    and isnull(del_yn, 'N') = 'N'
                union all
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      , '' sequence_length1
                    , '' raw_count1
                    , ''    v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , [sequence] sequence2  , [sequence_length]  sequence_length2       
                    , raw_count raw_count2
                    , [v_gene]   v_gene2    , [j_gene]   j_gene2
                    , [percent_total_reads] percent_total_reads2
                    , [cell_equipment]    cell_equipment2
                    
                    , '' sequence3      , '' sequence_length3
                    , '' raw_count3
                    , ''    v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3
                    
                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''    v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''    v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''    v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''    v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''    v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''     v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''    v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 2
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''    v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''     v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , [sequence] sequence3  
                    , [sequence_length] sequence_length3
                    , [raw_count] raw_count3
                    , [v_gene]           v_gene3
                    , [j_gene]           j_gene3
                    , [percent_total_reads] percent_total_reads3
                    , [cell_equipment]    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''           v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''           v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''        v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 3
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''           v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''           v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , ''           v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , [sequence] sequence4      , [sequence_length] sequence_length4
                    , [raw_count] raw_count4
                    , [v_gene]           v_gene4    , [j_gene]           j_gene4
                    , [percent_total_reads] percent_total_reads4
                    , [cell_equipment]    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , ''           v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''           v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 4
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , ''           v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , ''           v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , ''           v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , ''           v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4
                    
                    , [sequence] sequence5      , [sequence_length] sequence_length5
                    , [raw_count] raw_count5
                    , [v_gene]           v_gene5    , [j_gene]           j_gene5
                    , [percent_total_reads] percent_total_reads5
                    , [cell_equipment]    cell_equipment5

                    , '' sequence6     , '' sequence_length6
                    , '' raw_count6
                    , ''           v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , ''           v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , ''           v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , ''           v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , ''           v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 5
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , [sequence] sequence6      , [sequence_length] sequence_length6
                    , [raw_count] raw_count6
                    , [v_gene]           v_gene6    , [j_gene]           j_gene6
                    , [percent_total_reads] percent_total_reads6
                    , [cell_equipment]    cell_equipment6
                    
                    , '' sequence7     , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 6
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4
                    
                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6
                    
                    , [sequence] sequence7     , [sequence_length] sequence_length7
                    , [raw_count] raw_count7
                    , [v_gene]           v_gene7    , [j_gene]           j_gene7
                    , [percent_total_reads] percent_total_reads7
                    , [cell_equipment]    cell_equipment7

                    , '' sequence8      , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 7
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7
                    
                    , [sequence] sequence8     , [sequence_length] sequence_length8
                    , [raw_count] raw_count8
                    , [v_gene]           v_gene8    , [j_gene]           j_gene8
                    , [percent_total_reads] percent_total_reads8
                    , [cell_equipment]    cell_equipment8
                    
                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 8
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1

                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2     , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7
                    
                    , '' sequence8     , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , [sequence] sequence9      , [sequence_length] sequence_length9
                    , [raw_count] raw_count9
                    , [v_gene]           v_gene9    , [j_gene]           j_gene9
                    , [percent_total_reads] percent_total_reads9
                    , [cell_equipment]    cell_equipment9
                    
                    , '' sequence10      , '' sequence_length10
                    , '' raw_count10 
                    , '' v_gene10    , '' j_gene10
                    , '' percent_total_reads10
                    , ''    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 9
                and isnull(del_yn, 'N') = 'N'
                union all 
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , isnull(report_seq, 1) report_seq
                    ,  '' sequence1      ,  '' sequence_length1
                    ,  '' raw_count1
                    , '' v_gene1    , '' j_gene1
                    , '' percent_total_reads1
                    , ''    cell_equipment1
                    
                    , '' sequence2      , '' sequence_length2
                    , '' raw_count2
                    , '' v_gene2    , '' j_gene2
                    , '' percent_total_reads2
                    , ''    cell_equipment2

                    , '' sequence3     , '' sequence_length3
                    , '' raw_count3
                    , '' v_gene3    , '' j_gene3
                    , '' percent_total_reads3
                    , ''    cell_equipment3

                    , '' sequence4     , '' sequence_length4
                    , '' raw_count4
                    , '' v_gene4    , '' j_gene4
                    , '' percent_total_reads4
                    , ''    cell_equipment4

                    , '' sequence5     , '' sequence_length5
                    , '' raw_count5
                    , '' v_gene5    , '' j_gene5
                    , '' percent_total_reads5
                    , ''    cell_equipment5

                    , '' sequence6      , '' sequence_length6
                    , '' raw_count6
                    , '' v_gene6    , '' j_gene6
                    , '' percent_total_reads6
                    , ''    cell_equipment6

                    , '' sequence7      , '' sequence_length7
                    , '' raw_count7
                    , '' v_gene7    , '' j_gene7
                    , '' percent_total_reads7
                    , ''    cell_equipment7

                    , '' sequence8     , '' sequence_length8
                    , '' raw_count8
                    , '' v_gene8    , '' j_gene8
                    , '' percent_total_reads8
                    , ''    cell_equipment8

                    , '' sequence9      , '' sequence_length9
                    , '' raw_count9
                    , '' v_gene9    , '' j_gene9
                    , '' percent_total_reads9
                    , ''    cell_equipment9

                    , [sequence] sequence10      , [sequence_length] sequence_length10
                    , [raw_count] raw_count10
                    , [v_gene]           v_gene10    , [j_gene]           j_gene10
                    , [percent_total_reads] percent_total_reads10
                    , [cell_equipment]    cell_equipment10
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo in ` + resultspecimenNo  + `
                and [var_idx]  = 10
                and isnull(del_yn, 'N') = 'N'
            ) a 
            group by specimenNo, report_date , report_seq
        ) aa
        on a1.specimenNo = aa.specimenNo
        and a1.report_date = aa.report_date
        and a1.report_seq = aa.report_seq
        where a1.specimenNo in ` + resultspecimenNo  + `
        order by report_date desc, a1.report_seq desc`;

        logger.info('[1850]igtcrListHandler_557 sql=' + qry);
        
        try {

            const request = pool.request()
            .input('specimenNo', mssql.VarChar, resultspecimenNo);

            const result = await request.query(qry);
            return result.recordset; 
        }catch (error) {
            logger.error('[1860]igtcrListHandler_557 err=' + error.message);
        }
}

// get igtcr List
exports.igtcrList = (req, res, next) => {
    logger.info('[1866]igtcrList req=' + JSON.stringify(req.body));

    let specimenNo = req.body.specimenNo;
    let resultspecimenNo = "('";
    let resultspecimenNo2 = "('";

    const result = igtcrSelectHandler(specimenNo);
    result.then(data => {  

        let igtcrData_length =  data.length
  
        logger.info('[1877][igtcrList specimenNo= ' + specimenNo 
                                     + ', length=' + igtcrData_length);
     

        var arrData = data.filter(function(e){
            return e.specimenNo === specimenNo;
        })

        logger.info('[1885][igtcrList arrData= ' + arrData);

        var a_cnt = arrData[0].cnt ;

        // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
        for (i = 0; i < a_cnt; i++)
        {
            if (specimenNo !=  data[i].specimenNo ) {
                resultspecimenNo2 = resultspecimenNo2 + data[i].specimenNo + "','";
            }
            resultspecimenNo = resultspecimenNo + data[i].specimenNo + "','";
        }

        resultspecimenNo = resultspecimenNo + "')";
        resultspecimenNo2 = resultspecimenNo2 + "')";

        logger.info('[1901][igtcrList resultspecimenNo=' + resultspecimenNo);

        const result = igtcrListHandler(resultspecimenNo, resultspecimenNo2, specimenNo);
        result.then(data => {  
            //  console.log('[108][igtcrList]', data);
            res.json(data);
        })
        .catch( error => {
            logger.error('[1909]igtcrList err=' + error.message);
            res.sendStatus(500)
        }); 
    })
    .catch( error => {
        logger.error('[19014]igtcrList err=' + error.message);
        res.sendStatus(500)
    }); 
 };

 // get igtcr List
 exports.igtcrList_557 = (req, res, next) => {
     logger.info('[1921]igtcrList_557 req=' + JSON.stringify(req.body));
 
     let specimenNo = req.body.specimenNo;
     let gene = req.body.gene;
     let resultspecimenNo = "('";
     let resultspecimenNo2 = "('";
 
     logger.info('[1928]igtcrList_557 specimenNo=' + specimenNo);
 
     const result = igtcrSelectHandler(specimenNo);
     result.then(data => {  
 
         let igtcrData_length =  data.length
   
         logger.info('[1935][igtcrList_557 specimenNo= ' + specimenNo 
                                      + ', length=' + igtcrData_length);
      
 
         var arrData = data.filter(function(e){
             return e.specimenNo === specimenNo;
         })
 
         logger.info('[1943][igtcrList_557 arrData= ' + arrData);
 
         var a_cnt = arrData[0].cnt ;
 
         // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
         for (i = 0; i < a_cnt; i++)
         {
             if (specimenNo !=  data[i].specimenNo ) {
                 resultspecimenNo2 = resultspecimenNo2 + data[i].specimenNo + "','";
             }
             resultspecimenNo = resultspecimenNo + data[i].specimenNo + "','";
         }
 
         resultspecimenNo = resultspecimenNo + "')";
         resultspecimenNo2 = resultspecimenNo2 + "')";
 
         logger.info('[1959][igtcrList_557 resultspecimenNo=' + resultspecimenNo);
 
         const result = igtcrListHandler_557(resultspecimenNo, resultspecimenNo2, specimenNo, gene);
         result.then(data => {  
             //  console.log('[108][igtcrList]', data);
             res.json(data);
         })
         .catch( error => {
             logger.error('[1967]igtcrList_557 err=' + error.message);
             res.sendStatus(500)
         }); 
     })
     .catch( error => {
         logger.error('[1972]igtcrList_557 err=' + error.message);
         res.sendStatus(500)
     }); 
  };
 

 const reportigtcrHandler = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[1980] reportigtcrHandler =' + specimenNo);
    //select Query 생성
        let qry = `select 
            aa.sequence1         sequence, aa.sequence_length1  sequence_length,  aa.raw_count1   raw_count,
            aa.v_gene1           v_gene,   aa.j_gene1           j_gene, 
            aa.percent_total_reads1  percent_total_reads,       aa.cell_equipment1  cell_equipment
        from
            dbo.report_detected_igtcr a1
            left outer  join 
            (                
                SELECT specimenNo specimenNo
                    , report_date report_date 
                    , [sequence]         sequence1  
                    , [sequence_length]  sequence_length1
                    , [raw_count]        raw_count1
                    , [v_gene]           v_gene1
                    , [j_gene]           j_gene1
                    , [percent_total_reads] percent_total_reads1
                    , [cell_equipment]    cell_equipment1
                    
                FROM [dbo].[report_detected_variants_igtcr]
                where specimenNo = @specimenNo2
                and isnull(del_yn, 'N') = 'N'
        ) aa
        on a1.specimenNo = aa.specimenNo
        and a1.report_date = aa.report_date
        and isnull(a1.del_yn, 'N') = 'N'
        where a1.specimenNo = @specimenNo2 `;

    logger.info('[2009]reportigtcrHandler sql=' + qry);
    
    try {

        const request = pool.request()
            .input('specimenNo2', mssql.VarChar, specimenNo);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[2019]igtcrListHandler err=' + error.message);
    }
};

// get igtcr report List
exports.reportigtcr = (req, res, next) => {
    logger.info('[2025]reportigtcr req=' + JSON.stringify(req.body));

    let specimenNo = req.body.specimenNo;
    const result = reportigtcrHandler(specimenNo);
    result.then(data => {  
        //  console.log('[108][reportigtcr]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[2034]reportigtcr err=' + error.message);
        res.sendStatus(500)
    }); 
 };

 const reportigtcrHandler2 = async (specimenNo) => {
    await poolConnect; // ensures that the pool has been created
    logger.info('[2041] reportigtcrHandler2 =' + specimenNo);
    //select Query 생성
        let qry = `select a1.specimenNo specimenNo,
            a1.report_date report_date,
            a1.gene gene,
            a1.total_read_count total_read_count,
            a1.percent_of_LQIC percent_of_LQIC ,
            a1.read_of_LQIC read_of_LQIC ,
            a1.total_Bcell_Tcell_count total_Bcell_Tcell_count,
            a1.total_IGH_read_depth total_IGH_read_depth,
            a1.total_nucelated_cells total_nucelated_cells,
            a1.total_cell_equipment total_cell_equipment,
            a1.IGHV_mutation IGHV_mutation
        from
            dbo.report_detected_igtcr a1
        where a1.specimenNo = @specimenNo2
        and isnull(a1.del_yn, 'N') = 'N' 
        order by report_date `;

    logger.info('[2060]reportigtcrHandler2 sql=' + qry);
    
    try {

        const request = pool.request()
            .input('specimenNo2', mssql.VarChar, specimenNo);

        const result = await request.query(qry);
        return result.recordset; 
    }catch (error) {
        logger.error('[2070]igtcrListHandler err=' + error.message);
    }
};

// get igtcr report2List
exports.reportigtcr2 = (req, res, next) => {
    logger.info('[2076]reportigtcr req=' + JSON.stringify(req.body));

    let specimenNo = req.body.specimenNo;
    const result = reportigtcrHandler2(specimenNo);
    result.then(data => {  
        //  console.log('[108][reportigtcr]', data);
          res.json(data);
    })
    .catch( error => {
        logger.error('[2085]reportigtcr err=' + error.message);
        res.sendStatus(500)
    }); 
};

// 검사자 갱신
const checkerHandler = async (request, specimenNo2, examin, recheck, method, sendEMRDate, report_date, detected, comment) => {
    //await poolConnect; // ensures that the pool has been created

    logger.info('[2094][checkerHandler][update screen]data=' + specimenNo2 + ", "  + examin  + ", " + recheck
                         + ", method=" + method  +  ", " + sendEMRDate + ", " + report_date +  ", " + detected + ", " + comment ); 

    var detected2 = nvl(detected, '0');

    logger.info('[2099][checkerHandler][update screen]detected=' + detected2  ); 

    let sql =`update [dbo].[patientinfo_diag]
                set examin=@examin, 
                    recheck=@recheck, 
                    report_title=@method,
                    detected=@detected2, 
                    path_comment=@comment,
                    sendEMRDate=@sendEMRDate,
                    report_date=@report_date
                where specimenNo=@specimenNo2 `;   

    logger.info('[2111][checkerHandler][set screen]sql=' + sql);

    try {
        const request = pool.request()
            .input('examin', mssql.NVarChar, examin)
            .input('recheck', mssql.NVarChar, recheck)
            .input('method', mssql.NVarChar, method)
            .input('specimenNo2', mssql.VarChar, specimenNo2)
            .input('comment', mssql.VarChar, comment)
            .input('detected2', mssql.VarChar, detected2)
            .input('report_date', mssql.VarChar, report_date)
            .input('sendEMRDate', mssql.VarChar, sendEMRDate); 

        const result = await request.query(sql).then(data => {
            console.dir(data);
        }).catch( err => {
             console.log(err);
             logger.error('[2130][checkerHandler]err=' + err.message);
             reject(err);            
        });

        return result;
    } catch (error) {
      logger.error('[2136][checkerHandler][set screen]err=' + error.message);
      reject(error);
    }

};

// 검사자 갱신
const insertigtcrReportHandler = async (request, specimenNo, fu_comment, init_comment, fu_result, init_result1, init_result2, cnt) => {
    //await poolConnect; // ensures that the pool has been created

    logger.info('[2146][insertigtcrReportHandler][update screen]data=' + specimenNo + ", init_comment="  + init_comment  + ", fu_comment=" + fu_comment
                         + ", fu_result=" + fu_result  +  ", init_result1=" + init_result1 + ", init_result2=" + init_result2 + ", cnt=" + cnt); 

    let sql = '';
    cnt  = nvl(cnt, '0');

    if (cnt == '0' )
    {
        sql =`insert into [dbo].[report_comments]
                    (
                     init_comment
                        , init_result1
                        , init_result2
                        , cnt
                        , specimenNo 
                    )
                    values (
                     @init_comment
                        , @init_result1
                        , @init_result2
                        , 1
                        , @specimenNo2
                        )
                    `;   
        logger.info('[2170][insertigtcrReportHandler]sql=' + sql);
        try {
            const request = pool.request()
                .input('specimenNo2', mssql.VarChar, specimenNo)
                .input('init_comment', mssql.NVarChar, init_comment)
                .input('init_result1', mssql.NVarChar, init_result1)
                .input('init_result2', mssql.NVarChar, init_result2); 

            const result2 = await request.query(sql).then(data => {
                console.dir(data);
            }).catch( err => {
                 console.log(err);
                 logger.error('[2879][insertigtcrReportHandler]err=' + err.message);
                 reject(err);
                
            });

            return result2;
        } catch (error) {
            logger.error('[2191][insertigtcrReportHandler]err=' + error.message);
            reject(error);
        }
    }
    else if (cnt == '1' )
    {
        sql =`update [dbo].[report_comments]
            set  init_comment = @init_comment
                , init_result1 = @init_result1
                , init_result2 = @init_result2
                , cnt = 1
            where specimenNo  = @specimenNo2
            `;   
        logger.info('[2204][insertigtcrReportHandler]sql=' + sql);
        try {
            const request = pool.request()
                .input('specimenNo2', mssql.VarChar, specimenNo)
                .input('init_comment', mssql.NVarChar, init_comment)
                .input('init_result1', mssql.NVarChar, init_result1)
                .input('init_result2', mssql.NVarChar, init_result2); 

            const result2 = await request.query(sql).then(data => {
                console.dir(data);
            }).catch( err => {
                 console.log(err);
                 logger.error('[2218][insertigtcrReportHandler]err=' + err.message);
                 reject(err);     
            });

            return result2;
        } catch (error) {
            logger.error('[2224][insertigtcrReportHandler]err=' + error.message);
            reject(error);
        }
    }
    else
    {
        sql =`update [dbo].[report_comments]
                    set fu_comment=@fu_comment
                        , fu_result=@fu_result
                        , cnt = @cnt
                    where specimenNo=@specimenNo2 `;   
        logger.info('[2235][insertigtcrReportHandler]sql=' + sql);
        try {
            const request = pool.request()
                .input('specimenNo2', mssql.VarChar, specimenNo)
                .input('fu_comment', mssql.NVarChar, fu_comment)
                .input('fu_result', mssql.NVarChar, fu_result)
                .input('cnt', mssql.NVarChar, cnt); 

            const result3 = await request.query(sql).then(data => {
                console.dir(data);
            }).catch( err => {
                 console.log(err);
                 logger.error('[2249][insertigtcrReportHandler]err=' + err.message);
                 reject(err);     
            });

            return result3;
        } catch (error) {
            logger.error('[2255][insertigtcrReportHandler]err=' + error.message);
            reject(error);
        }
    }

};

const  insertigtcrDataHandler = async (request, specimenNo, igtcrData, patientid) => {
    //await poolConnect; // ensures that the pool has been created
      
    //입력 파라미터를 수신한다
    //1. Detected Variants
    
    let result
    let igtcrData_length =  igtcrData.length
  
    logger.info('[2270][insertigtcrDataHandler specimenNo= ' + specimenNo + ", patientid=" + patientid
                                 + ', igtcrData=' +  JSON.stringify( igtcrData)
                                 + ', length=' + igtcrData_length);

    let j = igtcrData_length + 1;
  
    // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
    for (i = 0; i < igtcrData_length; i++)
    {
        let specimenNo2             = nvl(igtcrData[i].specimenNo, specimenNo);
        let gene                    = igtcrData[i].gene;
        let report_date             = igtcrData[i].report_date;

        let sequence1               = igtcrData[i].sequence1;
        let sequence_length1        = igtcrData[i].sequence_length1;
        let raw_count1              = igtcrData[i].raw_count1;
        let v_gene1                 = igtcrData[i].v_gene1;  
        let j_gene1                 = igtcrData[i].j_gene1;   
        let percent_total_reads1    = igtcrData[i].percent_total_reads1; 
        let cell_equipment1         = nvl(igtcrData[i].cell_equipment1, ''); 
      
        let sequence2               = igtcrData[i].sequence2;
        let sequence_length2        = igtcrData[i].sequence_length2;
        let raw_count2              = igtcrData[i].raw_count2;
        let v_gene2                 = igtcrData[i].v_gene2;  
        let j_gene2                 = igtcrData[i].j_gene2;   
        let percent_total_reads2    = igtcrData[i].percent_total_reads2; 
        let cell_equipment2         = nvl(igtcrData[i].cell_equipment2, ''); 
      
        let sequence3               = igtcrData[i].sequence3;
        let sequence_length3        = igtcrData[i].sequence_length3;
        let raw_count3              = igtcrData[i].raw_count3;
        let v_gene3                 = igtcrData[i].v_gene3;  
        let j_gene3                 = igtcrData[i].j_gene3;   
        let percent_total_reads3    = igtcrData[i].percent_total_reads3; 
        let cell_equipment3         = nvl(igtcrData[i].cell_equipment3, ''); 
        
        let sequence4               = igtcrData[i].sequence4;
        let sequence_length4        = igtcrData[i].sequence_length4;
        let raw_count4              = igtcrData[i].raw_count4;
        let v_gene4                 = igtcrData[i].v_gene4;  
        let j_gene4                 = igtcrData[i].j_gene4;   
        let percent_total_reads4    = igtcrData[i].percent_total_reads4; 
        let cell_equipment4         = nvl(igtcrData[i].cell_equipment4, '');         
      
        let sequence5               = igtcrData[i].sequence5;
        let sequence_length5        = igtcrData[i].sequence_length5;
        let raw_count5              = igtcrData[i].raw_count5;
        let v_gene5                 = igtcrData[i].v_gene5;  
        let j_gene5                 = igtcrData[i].j_gene5;   
        let percent_total_reads5    = igtcrData[i].percent_total_reads5; 
        let cell_equipment5         = nvl(igtcrData[i].cell_equipment5, '');
        
        let sequence6               = igtcrData[i].sequence6;
        let sequence_length6        = igtcrData[i].sequence_length6;
        let raw_count6              = igtcrData[i].raw_count6;
        let v_gene6                 = igtcrData[i].v_gene6;  
        let j_gene6                 = igtcrData[i].j_gene6;   
        let percent_total_reads6    = igtcrData[i].percent_total_reads6; 
        let cell_equipment6         = nvl(igtcrData[i].cell_equipment6, '');
      
        let sequence7               = igtcrData[i].sequence7;
        let sequence_length7        = igtcrData[i].sequence_length7;
        let raw_count7              = igtcrData[i].raw_count7;
        let v_gene7                 = igtcrData[i].v_gene7;  
        let j_gene7                 = igtcrData[i].j_gene7;   
        let percent_total_reads7    = igtcrData[i].percent_total_reads7; 
        let cell_equipment7         = nvl(igtcrData[i].cell_equipment7, ''); 
        
        let sequence8               = igtcrData[i].sequence8;
        let sequence_length8        = igtcrData[i].sequence_length8;
        let raw_count8              = igtcrData[i].raw_count8;
        let v_gene8                 = igtcrData[i].v_gene8;  
        let j_gene8                 = igtcrData[i].j_gene8;   
        let percent_total_reads8    = igtcrData[i].percent_total_reads8; 
        let cell_equipment8         = nvl(igtcrData[i].cell_equipment8, '');
        
        let sequence9               = igtcrData[i].sequence9;
        let sequence_length9        = igtcrData[i].sequence_length9;
        let raw_count9              = igtcrData[i].raw_count9;
        let v_gene9                 = igtcrData[i].v_gene9;  
        let j_gene9                 = igtcrData[i].j_gene9;   
        let percent_total_reads9    = igtcrData[i].percent_total_reads9; 
        let cell_equipment9         = nvl(igtcrData[i].cell_equipment9, '');
        
        let sequence10              = igtcrData[i].sequence10;
        let sequence_length10       = igtcrData[i].sequence_length10;
        let raw_count10             = igtcrData[i].raw_count10;
        let v_gene10                = igtcrData[i].v_gene10;  
        let j_gene10                = igtcrData[i].j_gene10;   
        let percent_total_reads10   = igtcrData[i].percent_total_reads10; 
        let cell_equipment10        = nvl(igtcrData[i].cell_equipment10, '');

        let total_read_count        = igtcrData[i].total_read_count;
        let percent_of_LQIC         = igtcrData[i].percent_of_LQIC;
        let read_of_LQIC            = igtcrData[i].read_of_LQIC;
        let total_Bcell_Tcell_count = igtcrData[i].total_Bcell_Tcell_count;
        let total_IGH_read_depth    = igtcrData[i].total_IGH_read_depth;
        let total_nucelated_cells   = igtcrData[i].total_nucelated_cells;
        let total_cell_equipment    = igtcrData[i].total_cell_equipment;
        let IGHV_mutation           = igtcrData[i].IGHV_mutation;
        let bigo                    = nvl(igtcrData[i].bigo, '');
        let comment                 = nvl(igtcrData[i].comment, '');
        let density                 = nvl(igtcrData[i].density, '');
        let use_yn1                 = igtcrData[i].use_yn1; 
        let deleted                 = nvl(igtcrData[i].deleted, ''); 
          
        logger.info("[2377][insertigtcrDataHandler  specimenNo=" + specimenNo2 + ", deleted=" + deleted  + ", gene=" + gene + ", report_date=" + report_date 
                            + ", total_read_count=" + total_read_count
                            + ', read_of_LQIC=' + read_of_LQIC
                            + ', percent_of_LQIC=' + percent_of_LQIC + ' ,total_Bcell_Tcell_count=' + total_Bcell_Tcell_count 
                            + ', total_nucelated_cells='  + total_nucelated_cells + ', IGHV_mutation=' + IGHV_mutation
                            + ', IGHV_mutation= ' + IGHV_mutation + ', bigo=' + bigo 
                            + ', comment=' + comment + ', density=' + density + ", use_yn1=" + use_yn1);
  
        j = j - 1;

        result = igtcrReportDetectedHandler(request, specimenNo2, j);

        let sql; 

        result.then(data => {

            let resultCnt = data[0].count;

            logger.info ("cnt 0=" + resultCnt);

            if (resultCnt > 0){
                sql = `update report_detected_igtcr 
                        set report_date = @report_date
                            , gene= @gene
                            , total_read_count = @total_read_count
                            , read_of_LQIC = @read_of_LQIC
                            , percent_of_LQIC = @percent_of_LQIC
                            , total_Bcell_Tcell_count = @total_Bcell_Tcell_count
                            , total_IGH_read_depth = @total_IGH_read_depth
                            , total_nucelated_cells = @total_nucelated_cells
                            , total_cell_equipment = @total_cell_equipment
                            , IGHV_mutation = @IGHV_mutation
                            , bigo = @bigo
                            , comment = @comment
                            , density = @density
                            , use_yn = @use_yn1
                            , del_yn = 'N'
                        where specimenNo=@specimenNo2
                        and report_seq=@j `;
            }
            else
            {
                //insert Query 생성;
                sql = `insert into report_detected_igtcr (specimenNo, report_date, gene, 
                            total_read_count, read_of_LQIC, percent_of_LQIC, total_Bcell_Tcell_count, 
                            total_IGH_read_depth, total_nucelated_cells, total_cell_equipment, 
                            IGHV_mutation, bigo, comment, density, use_yn, report_seq, del_yn) 
                        values(@specimenNo2, @report_date, @gene, 
                            @total_read_count, @read_of_LQIC, @percent_of_LQIC, @total_Bcell_Tcell_count, 
                            @total_IGH_read_depth, @total_nucelated_cells, @total_cell_equipment, 
                            @IGHV_mutation, @bigo, @comment, @density, @use_yn1, @j, 'N')`;
            }

            logger.info('[2430][insertigtcrDataHandler report_detected_igtcr messageHandler sql=' + sql);
            try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('gene', mssql.VarChar, gene)
                        .input('total_read_count', mssql.VarChar, total_read_count)
                        .input('percent_of_LQIC', mssql.VarChar, percent_of_LQIC)
                        .input('read_of_LQIC', mssql.VarChar, read_of_LQIC)
                        .input('total_Bcell_Tcell_count', mssql.VarChar, total_Bcell_Tcell_count)
                        .input('total_IGH_read_depth', mssql.VarChar, total_IGH_read_depth)
                        .input('total_nucelated_cells', mssql.VarChar, total_nucelated_cells)
                        .input('total_cell_equipment', mssql.VarChar, total_cell_equipment)
                        .input('IGHV_mutation', mssql.VarChar, IGHV_mutation)
                        .input('bigo', mssql.NVarChar, bigo)
                        .input('comment', mssql.NVarChar, comment)
                        .input('density', mssql.NVarChar, density)
                        .input('use_yn1', mssql.NVarChar, use_yn1)
                        .input('j', mssql.VarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2456][insertigtcrDataHandler report_detected_igtcr]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2461][insertigtcrDataHand report_detected_igtcr err=' + error.message);
                    reject(error);
                }
        });

        if (deleted !== "y" )
        {
            let result3 = igtcrVisibleCountHandler(request, specimenNo2, specimenNo, j);

            sql = ''; 
            result3.then(data => {

            resultCnt = data[0].count;

            logger.info ("cnt 0=" + resultCnt);

            if (resultCnt > 0){
                sql = `update report_igtcr_visible 
                        set patientid = @patientid
                            , gene = @gene
                            , del_yn = 'N'
                        where disp_specimenNo=@disp_specimenNo 
                        and specimenNo=@specimenNo2
                        and report_seq = @j `;
            }
            else
            {
                sql = `insert into report_igtcr_visible (patientid, specimenNo, disp_specimenNo, report_seq, gene, del_yn) 
                    values(@patientid, @specimenNo2, @disp_specimenNo, @j, @gene, 'N')`;
            }
             
            logger.info('[2492][insertigtcrDataHandler report_igtcr_visible messageHandler sql=' + sql);
    
            try {
                const request = pool.request()
                    .input('specimenNo2', mssql.VarChar, specimenNo2)
                    .input('disp_specimenNo', mssql.VarChar, specimenNo)
                    .input('patientid', mssql.VarChar, patientid)
                    .input('j', mssql.VarChar, j)
                    .input('gene', mssql.VarChar, gene);
                
                const result2 = request.query(sql).then(data => {
                    console.dir(data);
                }).catch( err => {
                     console.log(err);
                     logger.error('[2508][insertigtcrDataHandler]err=' + err.message);
                     reject(err);     
                });
    
            } catch (error) {
                logger.error('[2513][insertigtcrDataHandler err=' + error.message);
                reject(error);     
            }

            });
        }

        result = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 1);

        sql = ""; 
        result.then(data => {

            let resultCnt = data[0].count;

            logger.info ("cnt 1=" + resultCnt);

            if (resultCnt > 0){
                sql = `update report_detected_variants_igtcr 
                        set report_date = @report_date
                            , sequence = @sequence1
                            , sequence_length = @sequence_length1
                            , raw_count = @raw_count1
                            , v_gene = @v_gene1
                            , j_gene = @j_gene1
                            , percent_total_reads = @percent_total_reads1
                            , cell_equipment = @cell_equipment1
                            , del_yn = 'N'
                        where specimenNo=@specimenNo2
                        and report_seq = @j 
                        and var_idx = 1`;
            }
            else
            {      
                //insert Query 생성;
                sql = `insert into report_detected_variants_igtcr 
                        (specimenNo, report_date, var_idx, 
                        sequence, sequence_length, raw_count, 
                        v_gene, j_gene, percent_total_reads, 
                        cell_equipment, report_seq, del_yn) 
                        values(@specimenNo2, @report_date, 1, 
                        @sequence1, @sequence_length1, @raw_count1, 
                        @v_gene1, @j_gene1, @percent_total_reads1, 
                        @cell_equipment1, @j, 'N')`;
            }
             
            logger.info('[2558][insertigtcrDataHandler report_detected_variants_igtcr messageHandler sql=' + sql);
    
            try {
                const request = pool.request()
                    .input('specimenNo2', mssql.VarChar, specimenNo2)
                    .input('report_date', mssql.VarChar, report_date)
                    .input('sequence1', mssql.VarChar, sequence1)
                    .input('sequence_length1', mssql.VarChar, sequence_length1)
                    .input('raw_count1', mssql.VarChar, raw_count1)
                    .input('v_gene1', mssql.VarChar, v_gene1)
                    .input('j_gene1', mssql.VarChar, j_gene1)
                    .input('percent_total_reads1', mssql.VarChar, percent_total_reads1)
                    .input('cell_equipment1', mssql.VarChar, cell_equipment1)
                    .input('j', mssql.NVarChar, j);
                    
                const result2 = request.query(sql).then(data => {
                    console.dir(data);
                }).catch( err => {
                     console.log(err);
                     logger.error('[2579][insertigtcrDataHandler report_detected_variants_igtcr]err=' + err.message);
                     reject(err);     
                });
    
            } catch (error) {
                logger.error('[2584][insertigtcrDataHandler report_detected_variants_igtcr]err=' + error.message);
                reject(error);     
            }

        });

        if (sequence2 != "") {

            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo, j, 2);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 2=" + resultCnt);

                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence2
                                , sequence_length = @sequence_length2
                                , raw_count = @raw_count2
                                , v_gene = @v_gene2
                                , j_gene = @j_gene2
                                , percent_total_reads = @percent_total_reads2
                                , cell_equipment = @cell_equipment2
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 2 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 2, 
                            @sequence2, @sequence_length2, @raw_count2, 
                            @v_gene2, @j_gene2, @percent_total_reads2, 
                            @cell_equipment2, @j, 'N')`;
                }
                
                logger.info('[2630][insertigtcrDataHandler report_detected_variants_igtcr 2 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence2', mssql.VarChar, sequence2)
                        .input('sequence_length2', mssql.VarChar, sequence_length2)
                        .input('raw_count2', mssql.VarChar, raw_count2)
                        .input('v_gene2', mssql.VarChar, v_gene2)
                        .input('j_gene2', mssql.VarChar, j_gene2)
                        .input('percent_total_reads2', mssql.VarChar, percent_total_reads2)
                        .input('cell_equipment2', mssql.VarChar, cell_equipment2)
                        .input('j', mssql.NVarChar, j);
                        
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2651][insertigtcrDataHandler report_detected_variants_igtcr 2]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2656][insertigtcrDataHandler report_detected_variants_igtcr 2]err=' + error.message);
                    reject(error);     
                }

            });
        }

        if (sequence3 != "") {
            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 3);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 3=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence3
                                , sequence_length = @sequence_length3
                                , raw_count = @raw_count3
                                , v_gene = @v_gene3
                                , j_gene = @j_gene3
                                , percent_total_reads = @percent_total_reads3
                                , cell_equipment = @cell_equipment3
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 3 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 3, 
                            @sequence3, @sequence_length3, @raw_count3, 
                            @v_gene3, @j_gene3, @percent_total_reads3, 
                            @cell_equipment3, @j, 'N')`;
                }
                
                logger.info('[2702][insertigtcrDataHandler report_detected_variants_igtcr 3 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence3', mssql.VarChar, sequence3)
                        .input('sequence_length3', mssql.VarChar, sequence_length3)
                        .input('raw_count3', mssql.VarChar, raw_count3)
                        .input('v_gene3', mssql.VarChar, v_gene3)
                        .input('j_gene3', mssql.VarChar, j_gene3)
                        .input('percent_total_reads3', mssql.VarChar, percent_total_reads3)
                        .input('cell_equipment3', mssql.VarChar, cell_equipment3)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2723][insertigtcrDataHandler report_detected_variants_igtcr 3]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2728][insertigtcrDataHandler report_detected_variants_igtcr 3]err=' + error.message);
                    reject(error);     
                }

            });
        }
        
        if (sequence4 != "") {

            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 4);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 4=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence4
                                , sequence_length = @sequence_length4
                                , raw_count = @raw_count4
                                , v_gene = @v_gene4
                                , j_gene = @j_gene4
                                , percent_total_reads = @percent_total_reads4
                                , cell_equipment = @cell_equipment4
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 4 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 4, 
                            @sequence4, @sequence_length4, @raw_count4, 
                            @v_gene4, @j_gene4, @percent_total_reads4, 
                            @cell_equipment4, @j, 'N')`;
                }
                
                logger.info('[2775][insertigtcrDataHandler report_detected_variants_igtcr 4 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence4', mssql.VarChar, sequence4)
                        .input('sequence_length4', mssql.VarChar, sequence_length4)
                        .input('raw_count4', mssql.VarChar, raw_count4)
                        .input('v_gene4', mssql.VarChar, v_gene4)
                        .input('j_gene4', mssql.VarChar, j_gene4)
                        .input('percent_total_reads4', mssql.VarChar, percent_total_reads4)
                        .input('cell_equipment4', mssql.VarChar, cell_equipment4)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2796][insertigtcrDataHandler report_detected_variants_igtcr 4]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2801][insertigtcrDataHandler report_detected_variants_igtcr 4]err=' + error.message);
                    reject(error);     
                }

            });
        }
        
        if (sequence5 != "") {

            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 5);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 5=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence5
                                , sequence_length = @sequence_length5
                                , raw_count = @raw_count5
                                , v_gene = @v_gene5
                                , j_gene = @j_gene5
                                , percent_total_reads = @percent_total_reads5
                                , cell_equipment = @cell_equipment5
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 5 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 5, 
                            @sequence5, @sequence_length5, @raw_count5, 
                            @v_gene5, @j_gene5, @percent_total_reads5, 
                            @cell_equipment5, @j, 'N')`;
                }
                
                logger.info('[2848][insertigtcrDataHandler report_detected_variants_igtcr 5 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence5', mssql.VarChar, sequence5)
                        .input('sequence_length5', mssql.VarChar, sequence_length5)
                        .input('raw_count5', mssql.VarChar, raw_count5)
                        .input('v_gene5', mssql.VarChar, v_gene5)
                        .input('j_gene5', mssql.VarChar, j_gene5)
                        .input('percent_total_reads5', mssql.VarChar, percent_total_reads5)
                        .input('cell_equipment5', mssql.VarChar, cell_equipment5)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2860][insertigtcrDataHandler report_detected_variants_igtcr 5]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2874][insertigtcrDataHandler report_detected_variants_igtcr 5]err=' + error.message);
                    reject(error);     
                }

            });
        }
        
        if (sequence6 != "") {
            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 6);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 6=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence6
                                , sequence_length = @sequence_length6
                                , raw_count = @raw_count6
                                , v_gene = @v_gene6
                                , j_gene = @j_gene6
                                , percent_total_reads = @percent_total_reads6
                                , cell_equipment = @cell_equipment6
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 6 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 6, 
                            @sequence6, @sequence_length6, @raw_count6, 
                            @v_gene6, @j_gene6, @percent_total_reads6, 
                            @cell_equipment6, @j, 'N')`;
                }
                
                logger.info('[2920][insertigtcrDataHandler report_detected_variants_igtcr 6 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence6', mssql.VarChar, sequence6)
                        .input('sequence_length6', mssql.VarChar, sequence_length6)
                        .input('raw_count6', mssql.VarChar, raw_count6)
                        .input('v_gene6', mssql.VarChar, v_gene6)
                        .input('j_gene6', mssql.VarChar, j_gene6)
                        .input('percent_total_reads6', mssql.VarChar, percent_total_reads6)
                        .input('cell_equipment6', mssql.VarChar, cell_equipment6)
                        .input('j', mssql.NVarChar, j);
                        
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[2941][insertigtcrDataHandler report_detected_variants_igtcr 6]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[2946][insertigtcrDataHandler report_detected_variants_igtcr 6]err=' + error.message);
                    reject(error);     
                }

            });
        }

        if (sequence7 != "") {

            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 7);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 7=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence7
                                , sequence_length = @sequence_length7
                                , raw_count = @raw_count7
                                , v_gene = @v_gene7
                                , j_gene = @j_gene7
                                , percent_total_reads = @percent_total_reads7
                                , cell_equipment = @cell_equipment7
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 7 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 7, 
                            @sequence7, @sequence_length7, @raw_count7, 
                            @v_gene7, @j_gene7, @percent_total_reads7, 
                            @cell_equipment7, @j, 'N')`;
                }
                
                logger.info('[2993][insertigtcrDataHandler report_detected_variants_igtcr 7 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence7', mssql.VarChar, sequence7)
                        .input('sequence_length7', mssql.VarChar, sequence_length7)
                        .input('raw_count7', mssql.VarChar, raw_count7)
                        .input('v_gene7', mssql.VarChar, v_gene7)
                        .input('j_gene7', mssql.VarChar, j_gene7)
                        .input('percent_total_reads7', mssql.VarChar, percent_total_reads7)
                        .input('cell_equipment7', mssql.VarChar, cell_equipment7)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[3014][insertigtcrDataHandler report_detected_variants_igtcr 7]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[3019][insertigtcrDataHandler report_detected_variants_igtcr 7]err=' + error.message);
                    reject(error);     
                }

            });
        }
        
        if (sequence8 != "") {
            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 8);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 8=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence8
                                , sequence_length = @sequence_length8
                                , raw_count = @raw_count8
                                , v_gene = @v_gene8
                                , j_gene = @j_gene8
                                , percent_total_reads = @percent_total_reads8
                                , cell_equipment = @cell_equipment8
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 8 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 8, 
                            @sequence8, @sequence_length8, @raw_count8, 
                            @v_gene8, @j_gene8, @percent_total_reads8, 
                            @cell_equipment8, @j, 'N')`;
                }
                
                logger.info('[3065][insertigtcrDataHandler report_detected_variants_igtcr 8 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence8', mssql.VarChar, sequence8)
                        .input('sequence_length8', mssql.VarChar, sequence_length8)
                        .input('raw_count8', mssql.VarChar, raw_count8)
                        .input('v_gene8', mssql.VarChar, v_gene8)
                        .input('j_gene8', mssql.VarChar, j_gene8)
                        .input('percent_total_reads8', mssql.VarChar, percent_total_reads8)
                        .input('cell_equipment8', mssql.VarChar, cell_equipment8)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[3086][insertigtcrDataHandler report_detected_variants_igtcr 8]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[3091][insertigtcrDataHandler report_detected_variants_igtcr 8]err=' + error.message);
                    reject(error);     
                }

            });
        }

        
        if (sequence9 != "") {

            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 9);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 9=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence9
                                , sequence_length = @sequence_length9
                                , raw_count = @raw_count9
                                , v_gene = @v_gene9
                                , j_gene = @j_gene9
                                , percent_total_reads = @percent_total_reads9
                                , cell_equipment = @cell_equipment9
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 9 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 9, 
                            @sequence9, @sequence_length9, @raw_count9, 
                            @v_gene9, @j_gene9, @percent_total_reads9, 
                            @cell_equipment9, @j, 'N')`;
                }
                
                logger.info('[3130][insertigtcrDataHandler report_detected_variants_igtcr 9 messageHandler sql1=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence9', mssql.VarChar, sequence9)
                        .input('sequence_length9', mssql.VarChar, sequence_length9)
                        .input('raw_count9', mssql.VarChar, raw_count9)
                        .input('v_gene9', mssql.VarChar, v_gene9)
                        .input('j_gene9', mssql.VarChar, j_gene9)
                        .input('percent_total_reads9', mssql.VarChar, percent_total_reads9)
                        .input('cell_equipment9', mssql.VarChar, cell_equipment9)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(qry).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[3160][insertigtcrDataHandler report_detected_variants_igtcr 9]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[3165][insertigtcrDataHandler report_detected_variants_igtcr 9]err=' + error.message);
                    reject(error);     
                }

            });
        }

        if (sequence10 != "") {
            let result3 = igtcrReportDetectedVariantsHandler(request, specimenNo2, j, 10);

            sql = ""; 
            result3.then(data => {

                let resultCnt = data[0].count;

                logger.info ("cnt 10=" + resultCnt);
                
                if (resultCnt > 0){
                    sql = `update report_detected_variants_igtcr 
                            set report_date = @report_date
                                , sequence = @sequence10
                                , sequence_length = @sequence_length10
                                , raw_count = @raw_count10
                                , v_gene = @v_gene10
                                , j_gene = @j_gene10
                                , percent_total_reads = @percent_total_reads10
                                , cell_equipment = @cell_equipment10
                                , del_yn = 'N'
                            where specimenNo=@specimenNo2
                            and report_seq = @j 
                            and var_idx = 10 `;
                }
                else
                {      
                    //insert Query 생성;
                    sql = `insert into report_detected_variants_igtcr 
                            (specimenNo, report_date, var_idx, 
                            sequence, sequence_length, raw_count, 
                            v_gene, j_gene, percent_total_reads, 
                            cell_equipment, report_seq, del_yn) 
                            values(@specimenNo2, @report_date, 10, 
                            @sequence10, @sequence_length10, @raw_count10, 
                            @v_gene10, @j_gene10, @percent_total_reads10, 
                            @cell_equipment10, @j, 'N')`;
                }
                
                logger.info('[3211][insertigtcrDataHandler report_detected_variants_igtcr 10 messageHandler sql=' + sql);
    
                try {
                    const request = pool.request()
                        .input('specimenNo2', mssql.VarChar, specimenNo2)
                        .input('report_date', mssql.VarChar, report_date)
                        .input('sequence10', mssql.VarChar, sequence10)
                        .input('sequence_length10', mssql.VarChar, sequence_length10)
                        .input('raw_count10', mssql.VarChar, raw_count10)
                        .input('v_gene10', mssql.VarChar, v_gene10)
                        .input('j_gene9', mssql.VarChar, j_gene10)
                        .input('percent_total_reads10', mssql.VarChar, percent_total_reads10)
                        .input('cell_equipment10', mssql.VarChar, cell_equipment10)
                        .input('j', mssql.NVarChar, j);
                    
                    const result2 = request.query(sql).then(data => {
                        console.dir(data);
                    }).catch( err => {
                        console.log(err);
                        logger.error('[3232][insertigtcrDataHandler report_detected_variants_igtcr 10]err=' + err.message);
                        reject(err);     
                    });
        
                } catch (error) {
                    logger.error('[3237][insertigtcrDataHandler report_detected_variants_igtcr 10]err=' + error.message);
                    reject(error);     
                }

            });
        }
    }

    return result;
};

// get report_igtcr_visible Count
const igtcrVisibleCountHandler = async (request, specimenNo2, dispSpecimenNo, report_seq) => {
    //await poolConnect; // ensures that the pool has been created
   
    logger.info('[3252][igtcr]get report_igtcr_visible data=' + specimenNo2 + ", " + dispSpecimenNo + ", " + report_seq );
    const sql =`select count(1) as count
                    from report_igtcr_visible
                    where disp_specimenNo=@dispSpecimenNo 
                    and specimenNo=@specimenNo2 
                    and report_seq=@report_seq `;
    logger.info('[3259][igtcr]get igtcrVisibleCountHandler sql=' + sql);  
  
    try {
        const request = pool.request()
        .input('specimenNo2', mssql.VarChar, specimenNo2)
        .input('dispSpecimenNo', mssql.VarChar, dispSpecimenNo)
        .input('report_seq', mssql.VarChar, report_seq); 
      const result = await request.query(sql)
      // console.dir( result);
      
      return result.recordset;
    } catch (error) {
      logger.error('[3271][igtcr]get igtcrVisibleCountHandler err=' + error.message);
    }
}

// get report_detected_igtcr Count
const igtcrReportDetectedHandler = async (request, specimenNo2, report_seq) => {
    //await poolConnect; // ensures that the pool has been created
   
    logger.info('[3279][igtcr]get report_detected_igtcr data=' + specimenNo2 + ", " + report_seq );
    const sql =`select count(1) as count from report_detected_igtcr
                         where specimenNo=@specimenNo2
                        and report_seq=@report_seq `;
    logger.info('[3284][igtcr]get igtcrReportDetectedHandler sql=' + sql);  
  
    try {
        const request = pool.request()
            .input('specimenNo2', mssql.VarChar, specimenNo2)
            .input('report_seq', mssql.VarChar, report_seq); 
            
      const result = await request.query(sql)
      // console.dir( result);
      
      return result.recordset;
    } catch (error) {
      logger.error('3295][igtcr]get igtcrReportDetectedHandler err=' + error.message);
    }
}

// get report_detected_variants_igtcr Count
const igtcrReportDetectedVariantsHandler = async (request, specimenNo, report_seq, var_idx) => {
    //await poolConnect; // ensures that the pool has been created
   
    logger.info('[3303][igtcr]get report_detected_variants_igtcr data=' + specimenNo + ", " + report_seq + ", " + var_idx );
    const sql =`select count(1) as count from report_detected_variants_igtcr
                     where specimenNo=@specimenNo2
                    and report_seq=@report_seq 
                    and var_idx=@var_idx `;
    logger.info('[3309][igtcr]get igtcrReportDetectedVariantsHandler sql=' + sql);  
  
    try {
        const request = pool.request()
            .input('specimenNo2', mssql.VarChar, specimenNo)
            .input('report_seq', mssql.VarChar, report_seq)
            .input('var_idx', mssql.VarChar, var_idx); 
            
      const result = await request.query(sql)
      // console.dir( result);
      
      return result.recordset;
    } catch (error) {
      logger.error('[3321][igtcr]get igtcrReportDetectedVariantsHandler err=' + error.message);
    }
}



// igtcr DATA 삭제
const deleteigtcrDataHandler = async (request, specimenNo) => {
    await poolConnect;

    let result;

    for (i = 0; i < specimenNo.length; i++)
    {
        logger.info('[3333][deleteigtcrDataHandler]delete igtcrData] specimenNo=' + specimenNo[i]);
        //delete Query 생성;    
        const qry ="update report_detected_igtcr set del_yn = 'Y' where specimenNo=@specimenNo2";           
        logger.info("[3336][deleteMigtcrDataHandler][del igtcr Data]del sql=" + qry);
    
        try {
            const request = pool.request()
                .input('specimenNo2', mssql.VarChar, specimenNo[i]);
            let result2 = await request.query(qry).then(data => {
                console.dir(data);
                
            }).catch( err => {
                 console.log(err);
                 reject(err);
                
            });   
            result = result2;
            
        } catch (error) {
            logger.error('[3351][deleteigtcrDataHandler][del igtcr Data]err=' +  error.message);
            reject(error);
            break;
        }
    }
      
    return result;
};

// igtcr DATA 삭제
const deleteigtcrHandler = async (request, specimenNo) => {
    await poolConnect;

    let result;

    for (i = 0; i < specimenNo.length; i++)
    {
        logger.info('[3366][deleteigtcrHandler]delete igtcrData] specimenNo=' + specimenNo[i]);
        //delete Query 생성;    
        const qry ="update report_detected_variants_igtcr set del_yn = 'Y' where specimenNo=@specimenNo2";           
        logger.info("[3369][deleteigtcrHandler][del igtcr Data]del sql=" + qry);
    
        try {
            const request = pool.request()
                .input('specimenNo2', mssql.VarChar, specimenNo[i]);
            let result2 = await request.query(qry).then(data => {
                console.dir(data);
               
            }).catch( err => {
                console.log(err);
                reject(err);
                
            });   
            result = result2;

        } catch (error) {
            logger.error('[3384][deleteigtcrHandler][del igtcr Data]err=' +  error.message);
            reject(error);
        }
    }
      
    return result;
};

// igtcr Visible 삭제
const deleteigtcrVisibleHandler = async (request, specimenNo, arrSpecimenNo) => {
    await poolConnect;

    let result;

    logger.info('[3396][deleteigtcrVisibleHandler]delete igtcrData] disp_specimenNo=' + arrSpecimenNo[i] + ", specimenNo=" + specimenNo);
    //delete Query 생성;    
    const qry ="update report_igtcr_visible set del_yn = 'Y'  where disp_specimenNo=@specimenNo2 ";           
    logger.info("[3399][deleteigtcrVisibleHandler][del igtcr Data]del sql=" + qry);

    try {
        const request = pool.request()
            .input('specimenNo2', mssql.VarChar, specimenNo);

        let result2 = await request.query(qry).then(data => {
            console.dir(data);
        }).catch( err => {
            console.log(err);
            reject(err);
            
        });   

        result = result2;

    } catch (error) {
        logger.error('[3415][deleteigtcrVisibleHandler][del igtcr Data]err=' +  error.message);
        reject(error);
    }

    return result;
};

exports.saveScreenigtcr = async (req,res, next) => {
    logger.info('[3423][igtcr][saveScreenigtcr]req=' + JSON.stringify(req.body));
    
    const specimenNo        = req.body.specimenNo;
    
    let method = req.body.method;
    let detected = req.body.detected;
    let comment = req.body.comment;

    let igtcrData = req.body.data;
    
    let examin    = req.body.examin;
    let recheck   = req.body.recheck;
    let sendEMRDate   = req.body.sendEMRDate;
    let report_date   = req.body.report_date;
    
    let fu_comment   = nvl(req.body.fu_comment, '');
    let fu_result    = nvl(req.body.fu_result, '');

    let init_comment  = nvl(req.body.init_comment, '');
    let init_result1   = nvl(req.body.init_result1,'');
    let init_result2   = nvl(req.body.init_result2,'');
    let patientid = nvl (req.body.patientid, '');

    var igtcrSpecimenNo = igtcrData.filter(function(item1, idx1){
        //filter() 메서드는 콜백함수에서 정의한 조건이 true인 항목만 리턴한다.(필터링)
        return igtcrData.findIndex(function(item2, idx2){
            //findIndex() 메서드는 콜백함수에 정의한 조건이 true인 항목의 index를 리턴한다.
            return item1.specimenNo == item2.specimenNo
        }) == idx1;
    });

    var arrSpecimenNo = new Array(); 

    for (i = 0; i < igtcrSpecimenNo.length; i++)
    {
        logger.info('[3458][igtcr][saveScreenigtcr]igtcrSpecimenNo= ' + igtcrSpecimenNo[i].specimenNo); 

        if (igtcrSpecimenNo[i].specimenNo == ""  )
        {
            igtcrSpecimenNo[i].specimenNo = specimenNo;
        }
        arrSpecimenNo[i] = igtcrSpecimenNo[i].specimenNo;
    }

    logger.info('[3467][igtcr][saveScreenigtcr]arrSpecimenNo= ' + arrSpecimenNo); 
    logger.info('[3468][igtcr][saveScreenigtcr]specimenNo= ' + specimenNo); 
    logger.info('[3469][igtcr][saveScreenigtcr]fu_result= ' + fu_result + ", " + nvl(req.body.fu_result, '')); 
    
    let igtcrData_cnt =  '';

    const  igtcrDataComment = igtcrReportHandler(specimenNo );
    igtcrDataComment.then(data => {

        let igtcrData_length =  data.length;

        logger.info('[3478][igtcrList specimenNo= ' + specimenNo 
                                    + ', length=' + igtcrData_length);
    
        // for 루프를 돌면서 Detected Variants 카운트 만큼       //Detected Variants Count
        for (i = 0; i < igtcrData_length; i++)
        {
            if (specimenNo == data[i].specimenNo)
            {
                igtcrData_cnt = data[i].cnt;
                break;
            }
        }

        logger.info('[3491][igtcrList specimenNo= ' + specimenNo 
                                    + ', cnt=' + igtcrData_cnt);
    });

    const transaction = new mssql.Transaction(pool);
    try {
      await transaction.begin();

      const request = new mssql.Request(transaction);

      const results = await Promise.all([

        deleteigtcrDataHandler(request, arrSpecimenNo),
        deleteigtcrHandler(request, arrSpecimenNo),
        deleteigtcrVisibleHandler(request, specimenNo, arrSpecimenNo),
        insertigtcrDataHandler(request, specimenNo, igtcrData, patientid),
        insertigtcrReportHandler(request, specimenNo, fu_comment, init_comment, fu_result, init_result1, init_result2, igtcrData_cnt),
        checkerHandler(request, specimenNo,  examin, recheck, method, sendEMRDate, report_date, detected, comment),
      ]);

      await transaction.commit();

      res.json({message: 'OK', result: results});

    } catch (err) {
      await transaction.rollback();
      logger.error('[3516][screenList][saveScreenigtcr]err=' + err.message);
      res.sendStatus(500);
    } finally {
      // await conn.close();
    }
   
};
