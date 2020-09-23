import { Box, Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';

import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import classes from "*.module.css";
import styled from 'styled-components';

//axios.defaults.baseURL = 'http://localhost:3000';

// Create a theme instance.


export default class MyApp extends App {
    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Налоговые накладные</title>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                </Head>


                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />


                        <Container maxWidth={false}>
                            <Box marginTop={0}>
                                <Component {...pageProps} />
                            </Box>
                        </Container>


            </React.Fragment>
        );
    }
}
