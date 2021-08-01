import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { useSelector, useDispatch } from 'react-redux'

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';
import ArrowIcon from '../../assets/arrow.svg';
import { config } from '../../config';
import HyphenModal from '../HyphenModal';
let MaticLogo = require("../../assets/polygon-matic-logo.png");
let EthereumLogo = require("../../assets/Ethereum.png");
const ms = require("ms");

let chainLogoMap = {
    80001: MaticLogo,
    5: EthereumLogo,
    137: MaticLogo,
    1: EthereumLogo
}

const useStyles = makeStyles((theme) => ({
    disabledButton: {
        opacity: "0.5"
    },

    paper: {
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    transferDetailsRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        color: "rgba(0, 0, 0, 0.5)"
    },
    bodyRow: {
        margin: "25px 0px",
        textAlign: "center"
    },
    detailsContainer: {
        border: "2px solid #E5E5E5",
        boxSizing: "border-box",
        borderRadius: "10px",
        padding: "10px 0px",
        width: "40%",
        display: "flex",
        flexDirection: "column"
    },
    networkDetailsContainer: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 10px 10px 10px",
        borderBottom: "2px solid #E5E5E5"
    },
    networkDetails: {
        display: "flex",
        flexDirection: "row"
    },
    networkName: {
        marginLeft: "5px",
        fontWeight: "500"
    },
    amountDetails: {
        display: "flex",
        flexDirection: "column",
        margin: "10px 10px 0px 10px"
    },
    chainAmountContainer: {
        display: "flex",
        alignItems: "baseline",
        flexDirection: "row",
    },
    amount: {
        fontSize: "20px",
        fontWeight: "500"
    },
    tokenName: {
        fontSize: "13px",
        marginLeft: "10px",
        lineHeight: "33px",
        fontWeight: "600"
    },
    arrowContainer: {
        display: "flex",
        alignItems: "center"
    },
    chainAmountLabel: {
        color: "#615CCD",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: "11px",
        textAlign: "left",
        paddingLeft: "2px",
        paddingBottom: "8px"
    },
    chainDirectionLabel: {
        color: "#615CCD",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: "11px",
        textAlign: "left",
        paddingLeft: "2px",
        paddingBottom: "8px"
    },
    chainLogo: {
        width: "20px"
    },
    feeDetailsContainer: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        color: "#808080",
        fontWeight: "bold"
    },
    feeDetailsRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "5px"
    },
    transferDurationText: {
        color: "#615CCD"
    },
    modalFooter: {
        width: "100%",
        display: "flex",
        justifyContent: "center"
    }
}));

const DetailsButton = withStyles((theme) => ({
    root: {
        color: "#fff!important",
        backgroundColor: "#615CCD!important",
        height: "50px",
        fontSize: "1.1rem",
        width: "80%",
        margin: "16px 0 16px 0"
    },
}))(Button);

export default function TransferDetails(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    // const transferState = useSelector(state => state.transfer);
    // const selectedFromChain = useSelector(state => state.network.selectedFromChain);
    // const selectedToChain = useSelector(state => state.network.selectedToChain);
    // const selectedTokenAmount = useSelector(state => state.transfer.tokenAmount);
    // const selectedToken = useSelector(state => state.tokens.selectedToken);
    const tokenSymbol = useSelector(state => state.transfer.tokenSymbol);
    const fromChainId = useSelector(state => state.transfer.fromChainId);
    let selectedFromChain;
    if(fromChainId) selectedFromChain = config.chainIdMap[fromChainId];

    const toChainId = useSelector(state => state.transfer.toChainId);
    let selectedToChain;
    if(toChainId) selectedToChain = config.chainIdMap[toChainId];

    const recievedAmount = useSelector(state => state.transfer.recievedAmount);
    const lpFee = useSelector(state => state.transfer.lpFee);
    const tokenAmount = useSelector(state => state.transfer.tokenAmount);
    const transferHash = useSelector(state => state.transfer.transferHash);
    const startTime = useSelector(state => state.transfer.startTime);
    const endTime = useSelector(state => state.transfer.endTime);
    let timeForTransfer;
    if(startTime && endTime) {
        timeForTransfer = ms(endTime - startTime, { long: true })
    }
    let transactionFee;
    if(tokenAmount && lpFee && recievedAmount) {
        transactionFee = parseFloat(tokenAmount) - parseFloat(lpFee) - parseFloat(recievedAmount);
        if(transactionFee) {
            transactionFee = transactionFee.toFixed(2);
        }
    }
    const [headerText, setHeaderText] = useState("Transfer Details");
    const [detailsButtonEnabled, setDetailsButtonEnabled] = useState(true);

    useEffect(()=>{
        if(props.activityName === "Transfer") {
            if(tokenSymbol && tokenAmount 
                && selectedFromChain && selectedFromChain.name) {
                dispatch(updateTransferStepsLabelArray(1, `Deposit ${tokenAmount} ${tokenSymbol} on ${selectedFromChain.name}`));

            }
        }
    }, [tokenAmount, tokenSymbol, selectedFromChain]);

    useEffect(()=>{
        if(transferHash) {
            setDetailsButtonEnabled(true);
        }
    }, [transferHash]);
    
    const openExplorer = () => {
        if(transferHash && props.getExplorerURL) {
            let url = props.getExplorerURL(transferHash, toChainId);
            window.open(url, '_blank').focus();
        } else {
            console.log(`Transfer hash or the explorerURL is not defined. TransferHash: ${transferHash}, ExplorerURL: ${props.getExplorerURL}`)
        }
    }

    const onModalClose = () => {
        setDetailsButtonEnabled(false);
        if(props.handleClose) {
            props.handleClose();
        }
    }

    let topContent = (
        <div>
            <div className={clsx(classes.bodyRow, classes.transferDetailsRow)}>
                <div className={classes.detailsContainer}>
                    <div className={classes.networkDetailsContainer}>
                        <div className={classes.chainDirectionLabel}>FROM</div>
                        {selectedFromChain && 
                            <div className={classes.networkDetails}>
                                    <img src={chainLogoMap[selectedFromChain.chainId]} className={classes.chainLogo} />
                                    <span className={classes.networkName}>{selectedFromChain.name}</span>
                            </div>
                        }
                    </div>
                    <div className={classes.amountDetails}>
                        <div className={classes.chainAmountLabel}>DEPOSITED</div>
                        <div className={classes.chainAmountContainer}>
                            <div className={classes.amount}>{tokenAmount}</div>
                            <div className={classes.tokenName}>{tokenSymbol}</div>
                        </div>
                    </div>
                </div>
                <div className={classes.arrowContainer}>
                    <img src={ArrowIcon} alt="=>" />
                </div>
                <div className={classes.detailsContainer}>
                    <div className={classes.networkDetailsContainer}>
                        <div className={classes.chainDirectionLabel}>TO</div>
                        {selectedToChain && 
                            <div className={classes.networkDetails}>
                                <img src={chainLogoMap[selectedToChain.chainId]} className={classes.chainLogo} />
                                <span className={classes.networkName}>{selectedToChain.name}</span>
                            </div>
                        }
                    </div>
                    <div className={classes.amountDetails}>
                        <div className={classes.chainAmountLabel}>RECEIVED</div>
                        <div className={classes.chainAmountContainer}>
                            <div className={classes.amount}>{recievedAmount}</div>
                            <div className={classes.tokenName}>{tokenSymbol}</div>
                        </div>
                    </div>
                </div>
            </div>
            {timeForTransfer &&
                <div className={classes.bodyRow} style={{margin: "40px 0"}}>
                    Transfer completed in <span className={classes.transferDurationText}>{timeForTransfer}</span>
                </div>
            }
        </div>
    );

    let bottomContent = (
        <div>
            <div className={classes.feeDetailsContainer}>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Amount Deposited
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {tokenAmount} {tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Amount Recieved
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {recievedAmount} {tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Liquidity Provider Fee
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {lpFee} {tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Transaction Fee    
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {transactionFee} {tokenSymbol}
                    </div>      
                </div>
            </div>
            <div className={classes.modalFooter}>
                <DetailsButton 
                variant="contained"
                onClick={openExplorer}
                disabled={!detailsButtonEnabled}
                classes={{ disabled: classes.disabledButton }}>
                        Check On Explorer
                </DetailsButton>
            </div>
        </div>
    );

    return (
        <HyphenModal 
            topContent={topContent}
            bottomContent={bottomContent}
            headerText={headerText}
            open={props.open}
            onModalClose={onModalClose}/>
    );
}