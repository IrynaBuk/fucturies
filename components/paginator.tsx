import React from "react";
import {getAsString} from "../functions/getAsString";
import {useRouter} from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

import {PaginationRenderItemParams} from "@material-ui/lab";
import {ParsedUrlQuery} from "querystring";
import Link from "next/link";
import {GetServerSideProps} from "next";

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}

export interface FPaginator {
    countlength?: number
    }

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
    return (
        <Link
            href={{
                pathname: '/fucturies/'+query.id,
                query: { ...query, page: item.page },
            }}
        >
            <a {...props}></a>
        </Link>
    );
}

export  function FPaginator({countlength}:FPaginator)
{
    const {query}=useRouter();
    const [page, setPage] = React.useState(getAsString(query.page)||1);

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return <React.Fragment>
        <Pagination
            page={parseInt(getAsString(query.page) || '1')}
            count={Math.ceil(countlength / rowsPerPage) }
            renderItem={(item) => (
                <PaginationItem
                    component={MaterialUiLink}
                    query={query}
                    item={item}
                    {...item}
                />
            )}
        />
        </React.Fragment>
}

export const getServerSideProps: GetServerSideProps = async () => {
   const countlength=10;
    return {
        props: {
            countlength
        },
    };
};