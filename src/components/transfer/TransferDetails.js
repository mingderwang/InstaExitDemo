import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from  'clsx';
import { useSelector, useDispatch } from 'react-redux'

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';
import ArrowIcon from '../../assets/arrow.svg';

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
        padding: "10px",
        width: "40%",
        display: "flex",
        flexDirection: "column"
    },
    networkDetailsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "10px",
        alignItems: "center"
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
        flexDirection: "row",
        justifyContent: "center",
        margin: "20px 0 10px 0"
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
    chainDirectionLabel: {
        color: "#615CCD",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: "500",
        fontSize: "11px"
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

    const transferState = useSelector(state => state.transfer);
    const selectedFromChain = useSelector(state => state.network.selectedFromChain);
    const selectedToChain = useSelector(state => state.network.selectedToChain);
    const selectedTokenAmount = useSelector(state => state.tokens.tokenAmount);
    const selectedToken = useSelector(state => state.tokens.selectedToken);
    const transferStepsLabelArray = useSelector(state => state.transfer.transferStepsLabelArray);
    const transferStepsContentArray = useSelector(state => state.transfer.transferStepsContentArray);
    const estimatedAmountToGet = useSelector(state => state.transfer.estimatedAmountToGet);
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
            if(selectedToken && selectedToken.tokenSymbol && selectedTokenAmount 
                && selectedFromChain && selectedFromChain.name) {
                dispatch(updateTransferStepsLabelArray(1, `Deposit ${selectedTokenAmount} ${selectedToken.tokenSymbol} on ${selectedFromChain.name}`));

            }
        }
    }, [selectedTokenAmount, selectedToken, selectedFromChain]);

    const openExplorer = () => {
        if(transferHash && props.getExplorerURL) {
            let url = props.getExplorerURL(transferHash, selectedToChain.chainId);
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
                        <div className={classes.networkDetails}>
                            <img src={chainLogoMap[selectedFromChain.chainId]} className={classes.chainLogo} />
                            <span className={classes.networkName}>{selectedFromChain.name}</span>
                        </div>
                    </div>
                    <div className={classes.amountDetails}>
                        <div className={classes.amount}>{tokenAmount}</div>
                        <div className={classes.tokenName}>{selectedToken.tokenSymbol}</div>
                    </div>
                </div>
                <div className={classes.arrowContainer}>
                    <img src={ArrowIcon} alt="=>" />
                </div>
                <div className={classes.detailsContainer}>
                    <div className={classes.networkDetailsContainer}>
                        <div className={classes.chainDirectionLabel}>TO</div>
                        <div className={classes.networkDetails}>
                            <img src={chainLogoMap[selectedToChain.chainId]} className={classes.chainLogo} />
                            <span className={classes.networkName}>{selectedToChain.name}</span>
                        </div>
                    </div>
                    <div className={classes.amountDetails}>
                        <div className={classes.amount}>{recievedAmount}</div>
                        <div className={classes.tokenName}>{selectedToken.tokenSymbol}</div>
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
                        {tokenAmount} {selectedToken.tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Amount Recieved
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {recievedAmount} {selectedToken.tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Liquidity Provider Fee
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {lpFee} {selectedToken.tokenSymbol}
                    </div>
                </div>
                <div className={classes.feeDetailsRow}>
                    <div className={classes.feeDetailLabel}>
                        Transaction Fee    
                    </div>    
                    <div className={classes.feeDetailValue}>
                        {transactionFee} {selectedToken.tokenSymbol}
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