import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import React from 'react';
import { Form, Formik } from 'formik';
import router, { useRouter } from 'next/router';
import {getAsString} from "../functions/getAsString";
import Card from '@material-ui/core/Card';
import {withStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';



export function DataFields() {

    const Today = new Date;

    const TodayFrom = (Today.getFullYear() - 7) + '-' + ('00' + (Today.getMonth() + 1)).slice(-2)
        + '-01';
    const TodayTo =  Today.getFullYear()+'-'+('00'+(Today.getMonth()+1)).slice(-2)
        +'-01';

    const {query}=useRouter();
    const acc = getAsString(query.id);
    return (
        <React.Fragment>

        <Card>
            <Formik
                initialValues={{  datefrom: getAsString(query.datefrom) || TodayFrom,dateto: getAsString(query.dateto) || TodayTo}}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {router.push(
                        {
                            pathname: '/fucturies/'+acc,
                            query: { ...values, page: 1 },
                        },
                        undefined,
                        { shallow: false }
                    );
                    setSubmitting(false);
                }, 400);



                }}

            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <div className="row clearfix">
                        <div className="header">
                        </div>
                        <Form>

                            <TextField
                                       id="datefrom"
                                       label="Дата с"
                                       type="date"
                                       //format="dd.MM.yyyy"
                                       defaultValue= {values.datefrom}

                                      onChange={date => setFieldValue('datefrom', date.target.value)}
                                //    className={classes.textField}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />,

                            <TextField
                                       id="dateto"
                                       label="Дата по"
                                       type="date"
                                     //  format="dd.MM.yyyy"
                                       defaultValue= {values.dateto}

                                       onChange={date => setFieldValue('dateto',date.target.value)}
                                //       className={classes.textField}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />




                                <Button style={{background : "#2196f3",color: "white"}} variant="contained"  type="submit" disabled={isSubmitting}>Показать</Button>
                        </Form>
                    </div>
                )}
            </Formik>
         </Card>

            <Divider variant="inset"  />
            </React.Fragment>
    );
}

