import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { config } from '../config';

import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    chainSubInfoContainer: {
        padding: "10px",
        marginTop: "10px",
        background: "#ddd",
        borderRadius: "5px"
    },
    faucetHeading: {
        fontWeight: "600",
        fontSize: "20px",
        textAlign: "left"
    },
    chainInfoSubRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        padding: "10px",
        justifyContent: "space-between"
    },
    chainHeading: {
        display: "flex",
        fontSize: "30px",
        alignItems: "center",
        justifyContent: "center"
    },
    chainLogoBig: {
        height: "40px",
        marginRight: "10px"
    },
    chainInfoContainer: {
        width: "400px",
        height: "315px",
        marginTop: "157px",
        padding: "10px"
    },
    faucetBalanceRow: {
        marginBottom: "10px",
        marginTop: "10px"
    },
    faucetBalance: {
        marginLeft: "5px"
    },
    leftChainContainer: {

    },
    rightChainContainer: {

    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    table: {
        width: "100%"
    },
}));

function Faucet(props) {
    const classes = useStyles();

    let rows = [];
    if(props.tokenSymbolList) {
        for(let index = 0; index<props.tokenSymbolList.length; index++) {
            let tokenSymbol = props.tokenSymbolList[index];
            let balance = props.faucetBalance[props.chainId] ?
                props.faucetBalance[props.chainId][config.tokensMap[tokenSymbol][props.chainId].address] : "-";
            rows.push({
                symbol: tokenSymbol,
                balance: balance
            });
        }
    }
    console.log(rows)
    return (
        <section className={`${classes.chainInfoContainer} ${classes.rightChainContainer}`}>
            <div className={classes.chainHeading}>
                {<img src={props.chainLogoMap[props.chainId]} className={classes.chainLogoBig} />}{props.selectedChain.name}
            </div>
            <section className={classes.chainSubInfoContainer}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="faucet-header"
                    >
                        <Typography className={classes.faucetHeading}>Faucet</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className={classes.chainInfoSubRow}>
                            
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table" size="small">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Token</TableCell>
                                        <TableCell align="right">Balance</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.symbol}>
                                            <TableCell component="th" scope="row">
                                                {row.symbol}
                                            </TableCell>
                                            <TableCell align="right">{row.balance}</TableCell>
                                            <TableCell align="right">
                                                <Button variant="contained" onClick={() => { props.getTokensFromFaucet(row.symbol, props.chainId) }}>Get</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>

                        </div>
                    </AccordionDetails>
                </Accordion>

            </section>
        </section>
    )
}

export default Faucet