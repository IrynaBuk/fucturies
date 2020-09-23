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
                FCTR_ID: 166112418,
                F_DATE: '31.07.2017',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1626377,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 19213.64,
                F_AMOUNT: 15069.52,
                F_VAT_20: 3013.9,
                F_VAT_PF: 1130.22,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 19213.64,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1626377","adj_date":"31.07.2017","amount":"15069.52","vat_20":"3013.9","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"15069.52","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 166112424,
                F_DATE: '31.07.2017',
                F_NAME: 'Налоговая накладная (фиксир. связь)',
                F_NUMBER: 1482536,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 125.10000000000001,
                F_AMOUNT: 104.25,
                F_VAT_20: 20.85,
                F_VAT_PF: 0,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 125.10000000000001,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1482536","adj_date":"31.07.2017","amount":"104.25","vat_20":"20.85","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"104.25","num_det":"1",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 164275102,
                F_DATE: '30.06.2017',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 1241094,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 19797.420000000002,
                F_AMOUNT: 15527.39,
                F_VAT_20: 3105.48,
                F_VAT_PF: 1164.55,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 19672.2,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1241094","adj_date":"30.06.2017","amount":"15527.39","vat_20":"3105.48","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"15429.18","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 164275114,
                F_DATE: '30.06.2017',
                F_NAME: 'Налоговая накладная (фиксир. связь)',
                F_NUMBER: 1241095,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 0.41000000000000003,
                F_AMOUNT: 0.34,
                F_VAT_20: 0.07,
                F_VAT_PF: 0,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0.41000000000000003,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1241095","adj_date":"30.06.2017","amount":".34","vat_20":".07","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":".34","num_det":"1",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 164275196,
                F_DATE: '30.06.2017',
                F_NAME: 'Корректировка НДС (фиксир.связь)',
                F_NUMBER: 1690813,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 7.37,
                F_AMOUNT: 6.140000000000001,
                F_VAT_20: 1.23,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: 7.37,
                F_ADJ_FUCT_NUMBER: 1241094,
                F_ADJ_FUCT_DATE: '30.06.2017',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 125.22,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1690813","adj_date":"30.06.2017","amount":"6.14","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"0",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 164275204,
                F_DATE: '30.06.2017',
                F_NAME: 'Корректировка номенклатуры',
                F_NUMBER: 1690814,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: -125.22,
                F_AMOUNT: 0,
                F_VAT_20: 0,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: 0,
                F_ADJ_FUCT_NUMBER: 1241094,
                F_ADJ_FUCT_DATE: '30.06.2017',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: -98.21000000000001,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1690814","adj_date":"30.06.2017","amount":"-98.21","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"1690814","adj_date":"30.06.2017","amount":"98.21","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 162448449,
                F_DATE: '31.05.2017',
                F_NAME: 'Налоговая накладная (фиксир. связь)',
                F_NUMBER: 1249727,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 125.97,
                F_AMOUNT: 104.97,
                F_VAT_20: 21,
                F_VAT_PF: 0,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 125.97,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1249727","adj_date":"31.05.2017","amount":"104.97","vat_20":"21","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"104.97","num_det":"1",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
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
