import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

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
import Link from 'next/link';


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
        fontSize: 8,
    },
}))(TableCell);


const StyledTableCellDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#DCDCDC",
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 8,
    },
}))(TableCell);

const StyledTableHeadDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#2196f3",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 8,
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

    const [rowsPerPage, setRowsPerPage] = React.useState(14);

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
                    countlength={totalRows||14}/>

            </div>

        </React.Fragment>

    );
}





function Row(props) {
    const { row } = props;
    const {query}=useRouter();
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
                <TableCell align="left">
                    <Link href={{
                        pathname: '/fucturies/'+query.id+'/'+row.F_ADJ_FUCT_NUMBER,
                        query: { ...query },
                    }}
                    >
                        <a>{row.F_ADJ_FUCT_NUMBER}</a>

                    </Link>
                </TableCell>
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
                                        <StyledTableHeadDetail>Сумма НДС детали</StyledTableHeadDetail>
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
                                            <StyledTableCellDetail align="right">{historyRow.vat_20}</StyledTableCellDetail>
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
                FCTR_ID: 249458489,
                F_DATE: '31.08.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1658311,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 5047.47,
                F_AMOUNT: 3958.8,
                F_VAT_20: 791.76,
                F_VAT_PF: 296.91,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 4987.47,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"1658311","adj_date":"31.08.2020","amount":"3958.8","vat_20":"791.76","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"3911.74","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 249458629,
                F_DATE: '31.08.2020',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 1947374,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: -60,
                F_AMOUNT: -47.06,
                F_VAT_20: -9.41,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -56.47,
                F_ADJ_FUCT_NUMBER: 1658311,
                F_ADJ_FUCT_DATE: '31.08.2020',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"1947374","adj_date":"31.08.2020","amount":"-3958.8","vat_20":"-791.76","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"1947374","adj_date":"31.08.2020","amount":"3911.74","vat_20":"782.348","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 247378421,
                F_DATE: '31.07.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1647331,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 10015,
                F_AMOUNT: 7854.900000000001,
                F_VAT_20: 1570.98,
                F_VAT_PF: 589.12,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 10015,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"1647331","adj_date":"31.07.2020","amount":"7854.9","vat_20":"1570.98","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"7854.9","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 244841889,
                F_DATE: '30.06.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 696196,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 7500,
                F_AMOUNT: 5882.35,
                F_VAT_20: 1176.47,
                F_VAT_PF: 441.18,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 7500,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"696196","adj_date":"30.06.2020","amount":"5882.35","vat_20":"1176.47","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"5882.35","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 242655444,
                F_DATE: '31.05.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 670951,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 7885,
                F_AMOUNT: 6184.31,
                F_VAT_20: 1236.8600000000001,
                F_VAT_PF: 463.83,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 7885,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"670951","adj_date":"31.05.2020","amount":"6184.31","vat_20":"1236.862","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"6184.31","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 239266874,
                F_DATE: '30.04.2020',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 2528440,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: -250,
                F_AMOUNT: -196.08,
                F_VAT_20: -39.22,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -235.3,
                F_ADJ_FUCT_NUMBER: 1737943,
                F_ADJ_FUCT_DATE: '30.04.2020',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"2528440","adj_date":"30.04.2020","amount":"-6333.29","vat_20":"-1266.658","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"2528440","adj_date":"30.04.2020","amount":"6137.21","vat_20":"1227.442","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 239266774,
                F_DATE: '30.04.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1737943,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 8074.9400000000005,
                F_AMOUNT: 6333.29,
                F_VAT_20: 1266.66,
                F_VAT_PF: 474.99,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 7824.9400000000005,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"1737943","adj_date":"30.04.2020","amount":"6333.29","vat_20":"1266.658","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"6137.21","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 238092010,
                F_DATE: '31.03.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1249900,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 1562.01,
                F_AMOUNT: 1225.1100000000001,
                F_VAT_20: 245.02,
                F_VAT_PF: 91.88,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 1522.01,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"1249900","adj_date":"31.03.2020","amount":"1225.11","vat_20":"245.022","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"1193.74","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 238092191,
                F_DATE: '31.03.2020',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 2633391,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: -40,
                F_AMOUNT: -31.37,
                F_VAT_20: -6.2700000000000005,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -37.64,
                F_ADJ_FUCT_NUMBER: 1249900,
                F_ADJ_FUCT_DATE: '31.03.2020',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"2633391","adj_date":"31.03.2020","amount":"-1225.11","vat_20":"-245.022","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"2633391","adj_date":"31.03.2020","amount":"1193.74","vat_20":"238.748","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 233853415,
                F_DATE: '29.02.2020',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 2597955,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: -500,
                F_AMOUNT: -392.16,
                F_VAT_20: -78.43,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -470.59000000000003,
                F_ADJ_FUCT_NUMBER: 930103,
                F_ADJ_FUCT_DATE: '29.02.2020',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"2597955","adj_date":"29.02.2020","amount":"-5811.76","vat_20":"-1162.352","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"2597955","adj_date":"29.02.2020","amount":"5419.6","vat_20":"1083.92","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 233853255,
                F_DATE: '29.02.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 930103,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 7410,
                F_AMOUNT: 5811.76,
                F_VAT_20: 1162.3500000000001,
                F_VAT_PF: 435.89,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 6910,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"930103","adj_date":"29.02.2020","amount":"5811.76","vat_20":"1162.352","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"5419.6","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 229579886,
                F_DATE: '31.01.2020',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 713918,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 4550,
                F_AMOUNT: 3568.63,
                F_VAT_20: 713.73,
                F_VAT_PF: 267.64,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 3190,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"713918","adj_date":"31.01.2020","amount":"3568.63","vat_20":"713.726","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"2501.96","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 229706125,
                F_DATE: '31.01.2020',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 2384696,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: -1360,
                F_AMOUNT: -1066.67,
                F_VAT_20: -213.33,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -1280,
                F_ADJ_FUCT_NUMBER: 713918,
                F_ADJ_FUCT_DATE: '31.01.2020',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"2384696","adj_date":"31.01.2020","amount":"-3568.63","vat_20":"-713.726","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"2384696","adj_date":"31.01.2020","amount":"2501.96","vat_20":"500.392","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 227869501,
                F_DATE: '31.12.2019',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 239719,
                CLNT_NAME: 'Просто тест тест тест',
                F_AMOUNT_ALL: 7984.68,
                F_AMOUNT: 6262.49,
                F_VAT_20: 1252.5,
                F_VAT_PF: 469.69,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 145,
                HISTORY: '[{ "recnum":"239719","adj_date":"31.12.2019","amount":"6262.49","vat_20":"1252.498","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"0","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
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
