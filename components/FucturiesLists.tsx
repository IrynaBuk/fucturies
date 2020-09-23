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
                FCTR_ID: 184482728,
                F_DATE: '01.05.2018',
                F_NAME: 'Корректировка НДС (моб.связь)',
                F_NUMBER: 2033561,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: -164.70000000000002,
                F_AMOUNT: -137.25,
                F_VAT_20: -27.45,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: -164.70000000000002,
                F_ADJ_FUCT_NUMBER: 1987344,
                F_ADJ_FUCT_DATE: '30.04.2018',
                F_STATUS: 'Передан в фин. систему',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"2033561","adj_date":"01.05.2018","amount":"-137.25","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 183682566,
                F_DATE: '30.04.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 668896,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 1248.05,
                F_AMOUNT: 978.86,
                F_VAT_20: 195.77,
                F_VAT_PF: 73.42,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 1248.05,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"668896","adj_date":"30.04.2018","amount":"978.86","vat_20":"195.77","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"978.86","num_det":"1",\n' +
                    '"itemnumber":"","unit_value":""\n' +
                    '}]'
            },
    
            {
                FCTR_ID: 179476126,
                F_DATE: '28.02.2018',
                F_NAME: 'Корректировка номенклатуры',
                F_NUMBER: 1894891,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: -125.18,
                F_AMOUNT: 0,
                F_VAT_20: 0,
                F_VAT_PF: null,
                F_AMOUNT_WITH_VAT: 0,
                F_ADJ_FUCT_NUMBER: 710017,
                F_ADJ_FUCT_DATE: '28.02.2018',
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: -98.18,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"1894891","adj_date":"28.02.2018","amount":"-98.18","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"1894891","adj_date":"28.02.2018","amount":"98.18","vat_20":"","rec_nn_for_adj":"2","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                    '}]'
            },
            {
                FCTR_ID: 179476121,
                F_DATE: '28.02.2018',
                F_NAME: 'Налоговая накладная (фиксир. связь)',
                F_NUMBER: 710018,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 7.37,
                F_AMOUNT: 6.140000000000001,
                F_VAT_20: 1.23,
                F_VAT_PF: 0,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 0,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"710018","adj_date":"28.02.2018","amount":"6.14","vat_20":"1.23","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"6.14","num_det":"1",\n' +
                    '"itemnumber":"","unit_value":""\n' +
                    '}]'
            },
            {
                FCTR_ID: 179475844,
                F_DATE: '28.02.2018',
                F_NAME: 'Налоговая накладная (моб.связь)',
                F_NUMBER: 710017,
                CLNT_NAME: 'TEST_CLIENT',
                F_AMOUNT_ALL: 25000,
                F_AMOUNT: 19607.84,
                F_VAT_20: 3921.57,
                F_VAT_PF: 1470.59,
                F_AMOUNT_WITH_VAT: null,
                F_ADJ_FUCT_NUMBER: null,
                F_ADJ_FUCT_DATE: null,
                F_STATUS: 'Постинг',
                F_DELTA_AMOUNT: 24874.82,
                TOTALCOUNT: 77,
                HISTORY: '[{ "recnum":"710017","adj_date":"28.02.2018","amount":"19607.84","vat_20":"3921.57","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"19509.66","num_det":"1",\n' +
                    '"itemnumber":"","unit_value":""\n' +
                    '}]'
            },
         
                {
                    FCTR_ID: 160544266,
                    F_DATE: '30.04.2017',
                    F_NAME: 'Корректировка НДС (фиксир.связь)',
                    F_NUMBER: 1845354,
                    CLNT_NAME: 'TEST_CLIENT',
                    F_AMOUNT_ALL: 7.36,
                    F_AMOUNT: 6.13,
                    F_VAT_20: 1.23,
                    F_VAT_PF: null,
                    F_AMOUNT_WITH_VAT: 7.36,
                    F_ADJ_FUCT_NUMBER: 333397,
                    F_ADJ_FUCT_DATE: '30.04.2017',
                    F_STATUS: 'Постинг',
                    F_DELTA_AMOUNT: 125,
                    TOTALCOUNT: 77,
                    HISTORY: '[{ "recnum":"1845354","adj_date":"30.04.2017","amount":"6.13","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"0",\n' +
                        `"itemnumber":"Послуги фiксованого зв'язку","unit_value":""\n` +
                        '}]'
                },
                {
                    FCTR_ID: 160544165,
                    F_DATE: '30.04.2017',
                    F_NAME: 'Налоговая накладная (моб.связь)',
                    F_NUMBER: 333397,
                    CLNT_NAME: 'TEST_CLIENT',
                    F_AMOUNT_ALL: 31100.99,
                    F_AMOUNT: 24392.93,
                    F_VAT_20: 4878.59,
                    F_VAT_PF: 1829.47,
                    F_AMOUNT_WITH_VAT: null,
                    F_ADJ_FUCT_NUMBER: null,
                    F_ADJ_FUCT_DATE: null,
                    F_STATUS: 'Постинг',
                    F_DELTA_AMOUNT: 31100.99,
                    TOTALCOUNT: 77,
                    HISTORY: '[{ "recnum":"333397","adj_date":"30.04.2017","amount":"24392.93","vat_20":"4878.59","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"24392.93","num_det":"1",\n' +
                        '"itemnumber":"","unit_value":""\n' +
                        '}]'
                },
                {
                    FCTR_ID: 158735037,
                    F_DATE: '31.03.2017',
                    F_NAME: 'Налоговая накладная (фиксир. связь)',
                    F_NUMBER: 291761,
                    CLNT_NAME: 'TEST_CLIENT',
                    F_AMOUNT_ALL: 125.09,
                    F_AMOUNT: 104.24000000000001,
                    F_VAT_20: 20.85,
                    F_VAT_PF: 0,
                    F_AMOUNT_WITH_VAT: null,
                    F_ADJ_FUCT_NUMBER: null,
                    F_ADJ_FUCT_DATE: null,
                    F_STATUS: 'Постинг',
                    F_DELTA_AMOUNT: 125.09,
                    TOTALCOUNT: 77,
                    HISTORY: '[{ "recnum":"291761","adj_date":"31.03.2017","amount":"104.24","vat_20":"20.85","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"104.24","num_det":"1",\n' +
                        '"itemnumber":"","unit_value":""\n' +
                        '}]'
                },
                {
                    FCTR_ID: 158735032,
                    F_DATE: '31.03.2017',
                    F_NAME: 'Налоговая накладная (моб.связь)',
                    F_NUMBER: 291760,
                    CLNT_NAME: 'TEST_CLIENT',
                    F_AMOUNT_ALL: 23931.21,
                    F_AMOUNT: 18769.58,
                    F_VAT_20: 3753.92,
                    F_VAT_PF: 1407.71,
                    F_AMOUNT_WITH_VAT: null,
                    F_ADJ_FUCT_NUMBER: null,
                    F_ADJ_FUCT_DATE: null,
                    F_STATUS: 'Постинг',
                    F_DELTA_AMOUNT: 23931.21,
                    TOTALCOUNT: 77,
                    HISTORY: '[{ "recnum":"291760","adj_date":"31.03.2017","amount":"18769.58","vat_20":"3753.92","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"18769.58","num_det":"1",\n' +
                        '"itemnumber":"","unit_value":""\n' +
                        '}]'
                },
                {
                    FCTR_ID: 156834045,
                    F_DATE: '28.02.2017',
                    F_NAME: 'Корректировка НДС (фиксир.связь)',
                    F_NUMBER: 1778882,
                    CLNT_NAME: 'TEST_CLIENT',
                    F_AMOUNT_ALL: 7.36,
                    F_AMOUNT: 6.13,
                    F_VAT_20: 1.23,
                    F_VAT_PF: null,
                    F_AMOUNT_WITH_VAT: 7.36,
                    F_ADJ_FUCT_NUMBER: 774843,
                    F_ADJ_FUCT_DATE: '28.02.2017',
                    F_STATUS: 'Постинг',
                    F_DELTA_AMOUNT: 125.14,
                    TOTALCOUNT: 77,
                    HISTORY: '[{ "recnum":"1778882","adj_date":"28.02.2017","amount":"6.13","vat_20":"","rec_nn_for_adj":"1","correason_type":"","adj_group_num":"","quantity":"","delta_det":"","num_det":"0",\n' +
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
