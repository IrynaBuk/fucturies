import {NextApiRequest,NextApiResponse} from 'next';
import oracledb from 'oracledb';

export default async function getAllFucturies(req:NextApiRequest,res:NextApiResponse) {
    const db = await oracledb.getConnection( {
        user          : "fcs",
        password      : "swap_cool_dev2020",
        connectString : "bistest5"
    });
    let sql;

    sql = `

    
select fctr_id,f_date,f_number,clnt_name,f_amount_all,f_amount,f_vat_20,f_vat_pf,f_amount_with_vat,
    f_ADJ_FUCT_NUMBER,f_adj_fuct_date,f_status,f_delta_amount,totalcount,history
     from (
select rownum rnum, 
fctr_id,
to_char(ff.f_date,'dd.mm.yyyy') f_date,
ff.f_number,
ff.f_name,
ff.clnt_name,
ff.f_amount_all,
ff.f_amount,
ff.f_vat_20,
ff.f_vat_pf,
ff.f_amount_with_vat,
ff.f_ADJ_FUCT_NUMBER,
to_char(ff.f_ADJ_FUCT_date,'dd.mm.yyyy') f_adj_fuct_date,
ff.f_status,
ff.f_delta_amount,
count(1) over  (order by null) as  totalcount,
       '['||substr(history,1,length(history)-1)||']' history
       from (
select k.* ,
(select listagg('{ "recnum":"'||recnum||'","adj_date":"'||to_Char(adj_date,'dd.mm.yyyy')
||'","amount":"'||replace(amount,',','.')||'","vat_20":"'||replace(vat_20,',','.')||'","rec_nn_for_adj":"'||rec_nn_for_adj
||'","correason_type":"'||correason_type
||'","adj_group_num":"'||adj_group_num||'","quantity":"'||quantity||'","delta_det":"'||replace(delta_det,',','.')||'","num_det":"'||num_det||'",
"itemnumber":"'||itemnumber||'","unit_value":"'||replace(unit_value,',','.')
||'"
},')
WITHIN GROUP (order by d.fctr_fctr_id) from bis2nn.wcb_ks_fucturie_details_vw d
where d.fctr_fctr_id = k.fctr_id) history
 From bis2nn.wcb_ks_fucturie_vw2  k
 where account = :1
 and k.f_Date between
 to_Date(:2,'yyyy-mm-dd') and to_Date(:3,'yyyy-mm-dd')
 order by to_date(f_date,'dd.mm.yyyy') desc
) ff
) tr
where rnum > (:4*10-10) and rownum<=(10)
`;
    const Today = new Date;
    let binds = [req.query.id,req.query.datefrom || (Today.getFullYear() - 7) + '-' + ('00' + (Today.getMonth() + 1)).slice(-2)
    + '-01',
        req.query.dateto || Today.getFullYear()  + '-' + ('00' + (Today.getMonth() + 1)).slice(-2)
        + '-01',req.query.page||1];

    // For a complete list of options see the documentation.
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    const fucturies = await db.execute(sql, binds, options);

    res.json(fucturies.rows);
}

;