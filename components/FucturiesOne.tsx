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



export interface FucturiesOne {
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
        fontSize: 10,
    },
}))(TableCell);


const StyledTableCellDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#DCDCDC",
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 10,
    },
}))(TableCell);

const StyledTableHeadDetail = withStyles((theme) => ({
    head: {
        backgroundColor: "#2196f3",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 10,
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




export function FucturiesOne( {data,todayFrom,todayTo,totalRows,acc}) {

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




FucturiesOne.getInitialProps = async ({query,req: NextApiRequest}) => {

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
    json  =
        [
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
                TOTALCOUNT: 2,
                HISTORY: '[{ "recnum":"1947374","adj_date":"31.08.2020","amount":"-3958.8","vat_20":"-791.76","rec_nn_for_adj":"1","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '},{ "recnum":"1947374","adj_date":"31.08.2020","amount":"3911.74","vat_20":"782.348","rec_nn_for_adj":"2","correason_type":"1","adj_group_num":"1","quantity":"","delta_det":"","num_det":"2",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            },
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
                TOTALCOUNT: 2,
                HISTORY: '[{ "recnum":"1658311","adj_date":"31.08.2020","amount":"3958.8","vat_20":"791.76","rec_nn_for_adj":"","correason_type":"","adj_group_num":"","quantity":"","delta_det":"3911.74","num_det":"1",\n' +
                    `"itemnumber":"Послуги рухомого (мобільного) зв'язку","unit_value":""\n` +
                    '}]'
            }
        ];

    if (Array.isArray(json)) {
        TotalRows = json[0]?.TOTALCOUNT;

    }


    return {  data:json,todayFrom : TodayFrom,todayTo:TodayTo,totalRows:TotalRows||0,acc:acc};
};
