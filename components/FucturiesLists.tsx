import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import axios from 'axios';
import React from 'react';

import {DataFields} from './DataFields';
import {FPaginator} from './paginator';

import {makeStyles, ThemeProvider, withStyles} from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Collapse from "@material-ui/core/Collapse";
import {useRouter} from "next/router";
import {getAsString} from "../functions/getAsString";
import styled from 'styled-components';
import Typography from "@material-ui/core/Typography";



export interface FucturiesLists {
    data?: JSON;
    todayFrom:String;
    todayTo:String;
    totalRows:number;
    acc:String
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#2196f3",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);


const StyledTableCellDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#DCDCDC",
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const StyledTableHeadDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#2196f3",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const Container = styled.div`
  text-align: center;
`;

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});




export function FucturiesLists( {data,todayFrom,todayTo,totalRows,acc}) {

    const {query}=useRouter();
    //const {data} = useSWR('api/fucturies/'+query.id+'?datefrom='+todayFrom +'&dateto='+todayTo, { initialData: ListDat});
   // const {data} = ListDat;


    const classes = useRowStyles();
    const [page, setPage] = React.useState(Number(getAsString(query.page)||1));

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(+event.target.value);
        setPage(0);
    };    return (

        <React.Fragment>
            <Container>
                <Typography variant="subtitle1">Налоговые накладные: Лицевой счет №{acc}</Typography>
                </Container>
            <Container maxWidth={false}>
            <Box paddingBottom={2} className="divcenter">
                <DataFields/>
            </Box>
            </Container>
            <TableContainer component={Paper} key="MainTable" >
                <Table  aria-label="collapsible table" stickyHeader={true}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell />
                            <StyledTableCell>Дата НН</StyledTableCell>
                            <StyledTableCell>Номер НН</StyledTableCell>
                            <StyledTableCell align="center">Тип НН</StyledTableCell>
                            <StyledTableCell align="center">Имя клиента</StyledTableCell>
                            <StyledTableCell align="center">Сумма с налогами</StyledTableCell>
                            <StyledTableCell align="center">Сумма б/н</StyledTableCell>
                            <StyledTableCell align="center">НДС</StyledTableCell>
                            <StyledTableCell align="center">ПФ</StyledTableCell>
                            <StyledTableCell align="center">Сумма без ПФ</StyledTableCell>
                            <StyledTableCell align="center">НН для корр.</StyledTableCell>
                            <StyledTableCell align="center">Дата НН для корр.</StyledTableCell>
                            <StyledTableCell align="center">Статус</StyledTableCell>
                            <StyledTableCell align="center">Остаток по НН</StyledTableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.map((row) => (
                            <Row key={row.FCTR_ID} row={row} />
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <div>
                <FPaginator
    countlength={totalRows||10}/>

            </div>

        </React.Fragment>

    );
}





function Row(props) {
    const { row } = props;

    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const jrow = JSON.parse(row.HISTORY);


    return (
        <React.Fragment>
            <TableRow className={classes.root} tabIndex={-1} >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>


                <TableCell align="left">{row.F_DATE}</TableCell>
                <TableCell align="left">{row.F_NUMBER}</TableCell>
                <TableCell align="left">{row.F_NAME}</TableCell>
                <TableCell align="left">{row.CLNT_NAME}</TableCell>
                <TableCell align="right">{Number(row.F_AMOUNT_ALL).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.F_AMOUNT).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.F_VAT_20).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.F_VAT_PF).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(row.F_AMOUNT_WITH_VAT).toFixed(2)}</TableCell>
                <TableCell align="left">{row.F_ADJ_FUCT_NUMBER}</TableCell>
                <TableCell align="left">{row.F_ADJ_FUCT_DATE}</TableCell>
                <TableCell align="left">{row.F_STATUS}</TableCell>
                <TableCell align="right">{Number(row.F_DELTA_AMOUNT).toFixed(2)}</TableCell>


            </TableRow>
            <TableRow   >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={14} tabIndex={-1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>

                                    <TableRow>
                                        <StyledTableHeadDetail>Номер записи книги продаж</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Дата операции</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Сумма детали без налогов</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Неизрасход. остаток суммы</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>п/н детали</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Номенклатура</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Сумма по номенклатуре</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Количество</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Номер строки НН для коррекции</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Номер группы для корректировки</StyledTableHeadDetail>
                                        <StyledTableHeadDetail>Тип причины корректировки</StyledTableHeadDetail>

                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {jrow.map((historyRow) => (

                                            <TableRow key={historyRow.recnum} style={{backgroundColor:"light-gray"}}>

                                                <StyledTableCellDetail>{historyRow.recnum}</StyledTableCellDetail>

                                                <StyledTableCellDetail align="left">{historyRow.adj_date}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="right">{historyRow.amount}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.delta_det}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="right">{historyRow.num_det}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.itemnumber}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="right">{historyRow.unit_value}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.quantity}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.rec_nn_for_adj}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.adj_group_num}</StyledTableCellDetail>
                                                <StyledTableCellDetail align="left">{historyRow.correason_type}</StyledTableCellDetail>
                                            </TableRow>
                                    ))}



                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}




FucturiesLists.getInitialProps = async ({query}) => {

    const dateFrPar = getAsString(query.datefrom);
    const dateToPar = getAsString(query.dateto);
    const page = getAsString(query.page)||1;
    const Today = new Date;
    const acc= getAsString(query.id);
    let TotalRows;
    const TodayFrom = dateFrPar ||(Today.getFullYear() - 7) + '-' + ('00' + (Today.getMonth() + 1)).slice(-2)
        + '-01';
    const TodayTo = dateToPar || Today.getFullYear()+'-'+('00'+(Today.getMonth()+1)).slice(-2)
        +'-01';
    let res,json;

    const str =
        [
            {
                FCTR_ID: 206505803,
                F_DATE: '31.03.2019',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 782619,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 99,
                F_AMOUNT: 77.65,
                F_VAT_20: 15.530000000000001,
                F_VAT_PF: 5.82,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 99,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"782619","adj_date":"31.03.2019","amount":"77.65","vat_20":"15.53","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"77.65","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 204699076,
                F_DATE: '28.02.2019',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1260952,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 392.25,
                F_AMOUNT: 307.65000000000003,
                F_VAT_20: 61.53,
                F_VAT_PF: 23.07,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 392.25,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"1260952","adj_date":"28.02.2019","amount":"307.65","vat_20":"61.53","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"307.65","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 202473886,
                F_DATE: '31.01.2019',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 229921,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 404,
                F_AMOUNT: 316.86,
                F_VAT_20: 63.370000000000005,
                F_VAT_PF: 23.77,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 404,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"229921","adj_date":"31.01.2019","amount":"316.86","vat_20":"63.372","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"316.86","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 200388319,
                F_DATE: '31.12.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 360512,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 284.55,
                F_AMOUNT: 223.18,
                F_VAT_20: 44.64,
                F_VAT_PF: 16.73,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 284.55,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"360512","adj_date":"31.12.2018","amount":"223.18","vat_20":"44.636","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"223.18","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 197707048,
                F_DATE: '30.11.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1644345,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 145.5,
                F_AMOUNT: 114.12,
                F_VAT_20: 22.82,
                F_VAT_PF: 8.56,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 145.5,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"1644345","adj_date":"30.11.2018","amount":"114.12","vat_20":"22.824","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"114.12","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 195878898,
                F_DATE: '31.10.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 376279,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 145,
                F_AMOUNT: 113.73,
                F_VAT_20: 22.75,
                F_VAT_PF: 8.52,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 145,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"376279","adj_date":"31.10.2018","amount":"113.73","vat_20":"22.75","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"113.73","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 193877091,
                F_DATE: '30.09.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1683020,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 150,
                F_AMOUNT: 117.65,
                F_VAT_20: 23.53,
                F_VAT_PF: 8.82,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 150,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"1683020","adj_date":"30.09.2018","amount":"117.65","vat_20":"23.53","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"117.65","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 191810902,
                F_DATE: '31.08.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1236666,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 104,
                F_AMOUNT: 81.57000000000001,
                F_VAT_20: 16.31,
                F_VAT_PF: 6.12,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 104,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"1236666","adj_date":"31.08.2018","amount":"81.57","vat_20":"16.31","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"81.57","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 189325240,
                F_DATE: '31.07.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 415674,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 597.5,
                F_AMOUNT: 468.63,
                F_VAT_20: 93.73,
                F_VAT_PF: 35.14,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 597.5,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"415674","adj_date":"31.07.2018","amount":"468.63","vat_20":"93.73","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"468.63","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 187333440,
                F_DATE: '30.06.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 703612,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 474.5,
                F_AMOUNT: 372.16,
                F_VAT_20: 74.43,
                F_VAT_PF: 27.91,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 474.5,
                TOTALCOUNT: 45,
                HISTORY: '[{ "recnum":"703612","adj_date":"30.06.2018","amount":"372.16","vat_20":"74.43","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"372.16","num_det":"1",\n' +
                    '"itemnumber":"Послуги рухомого (мобільного) зв\'язку","unit_value":""\n' +
                    '}]'
            }
        ]

    //  res = await axios('/api/fucturies/fuct_list_test');
    json = str;
      // json = res.data;
      if (Array.isArray(json)) {
          TotalRows = json[0]?.TOTALCOUNT;

      }

    return {  data:json,todayFrom : TodayFrom,todayTo:TodayTo,totalRows:TotalRows||0,acc:acc};
};
