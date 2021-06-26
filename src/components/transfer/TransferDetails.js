import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import clsx from  'clsx';
import VerticalStepper from '../stepper/VerticalStepper';
import { useSelector, useDispatch } from 'react-redux'

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';
import ArrowIcon from '../../assets/arrow.svg';
import { display } from '@material-ui/system';
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

    modalContainer: {
        width: 450,
        top: '50px',
        borderRadius: '20px',
        position: 'relative',
        display: 'flex',
        margin: 'auto',     
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
    },
    modalRow: {
        paddingRight: "5%",
        paddingLeft: "5%",
        width: "90%"        
    },
    modalContent: {
        display: "flex",
        width: "100%",
        flexDirection: "column"
    },
    modalTop: {
        display: "flex",
        flexDirection: "column",
        width: "90%",
        borderRadius: '20px 20px 0px 0px',
        paddingTop: "20px",
        paddingBottom: "10px"
    },
    modalHeader: {
        display: "flex",
        flexDirection: "row",
        fontStyle: "normal",
        lineHeight: "38px",
        textTransform: "capitalize",
        color: "rgba(0, 0, 0, 0.5)",
        width: "100%"
    },
    modalHeaderText: {
        display: "flex",
        flexGrow: "1",
        fontWeight: "600",
        fontSize: "22px",
    },
    modalHeaderClose: {
        display: "flex",
        cursor: "pointer"
    },
    modalBottom: {
        background: "#F1F0FF",
        borderRadius: '0 0 20px 20px',
        paddingBottom: "10px",
        paddingTop: "10px"
    },
    modalBody: {
        width: "100%"
    },
    modalFooter: {
        width: "100%",
        display: "flex",
        justifyContent: "center"
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
        }
    }

    const onModalClose = () => {
        setDetailsButtonEnabled(false);
        if(props.handleClose) {
            props.handleClose();
        }
    }

    let body = (
        <div className={classes.modalContainer}>
            <div className={classes.modalContent}>
                <div className={clsx(classes.modalTop, classes.modalRow)}>
                    <div className={classes.modalHeader}>
                        <div className={classes.modalHeaderText}>
                            {headerText}
                        </div>
                        <div className={classes.modalHeaderClose} onClick={onModalClose}>
                            X
                        </div>
                    </div>
                    <div className={classes.modalBody}>
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
                                Transfer completed in {timeForTransfer}
                            </div>
                        }
                    </div>
                </div>
                <div className={clsx(classes.modalBottom, classes.modalRow)}>
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
            </div>
        </div>
    );

    return (
    <div>
        <Modal
        disableEnforceFocus
        disableAutoFocus
        open={props.open}
        onClose={onModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    </div>
    );
}