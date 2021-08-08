import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import VerticalStepper from '../stepper/VerticalStepper';
import { useSelector, useDispatch } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LaunchIcon from '@material-ui/icons/Launch';
import HyphenModal from '../HyphenModal';

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';
import { config } from '../../config';

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
        width: 500,
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
        lineHeight: "32px",
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
    transferActivityStatus: {
        display: "flex",
        justifyContent: "center",
        margin: "10px 0px",
    },
    transferHashContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    transferHashRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        margin: "2px 0px",
        width: "80%"
    },
    transferHashLabel: {
        color: "#615CCD"
    },
    transferHashButtonContainer: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #615CCD",
        borderRadius: "5px",
        overflow: "hidden"
    },
    explorerButton: {
        color: "#615CCD",
        textDecoration: "none",
        padding: "3px 10px",
        fontSize: "14px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    icon: {
        width: "14px",
        height: "14px",
        marginLeft: "10px"
    },
    transferStepsHeading: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
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

export default function TransferActivity(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const transferState = useSelector(state => state.transfer);
    const selectedFromChain = useSelector(state => state.network.selectedFromChain);
    const selectedToChain = useSelector(state => state.network.selectedToChain);
    const currentStep = useSelector(state => state.transfer.currentStep);
    const selectedTokenAmount = useSelector(state => state.tokens.tokenAmount);
    const selectedToken = useSelector(state => state.tokens.selectedToken);
    const transferStepsLabelArray = useSelector(state => state.transfer.transferStepsLabelArray);
    const transferStepsContentArray = useSelector(state => state.transfer.transferStepsContentArray);
    const transferActivityStatus = useSelector(state => state.transfer.transferActivityStatus);
    const estimatedAmountToGet = useSelector(state => state.transaction.estimatedAmountToGet);

    const depositHash = useSelector(state => state.transfer.depositHash);
    const depositStatus = useSelector(state => state.transfer.depositStatus);
    const transferHash = useSelector(state => state.transfer.transferHash);
    const transferStatus = useSelector(state => state.transfer.transferStatus);


    const [headerText, setHeaderText] = useState("Transfer Activity");
    const [stepperSteps, setStepperSteps] = useState([]);
    const [detailsButtonEnabled, setDetailsButtonEnabled] = useState(false);

    useEffect(()=>{
        if(props.activityName === "Transfer") {
            if(selectedToken && selectedToken.tokenSymbol && selectedTokenAmount 
                && selectedFromChain && selectedFromChain.name) {
                if(depositHash) {
                    dispatch(updateTransferStepsLabelArray(1, 
                        <div className={classes.transferStepsHeading}>
                            <span>Deposit {selectedTokenAmount} {selectedToken.tokenSymbol} on {selectedFromChain.name}</span>
                            <a href={config.getExplorerURL(depositHash, selectedFromChain.chainId)} target="_blank" className="link">
                                <LaunchIcon className={classes.icon} />
                            </a>
                        </div>
                    ));
                } else {
                    dispatch(updateTransferStepsLabelArray(1, `Deposit ${selectedTokenAmount} ${selectedToken.tokenSymbol} on ${selectedFromChain.name}`));
                }
            }
        }
    }, [selectedTokenAmount, selectedToken, selectedFromChain, depositHash]);

    useEffect(()=>{
        if(estimatedAmountToGet) {
            if(transferHash) {
                dispatch(updateTransferStepsLabelArray(2, 
                    <div className={classes.transferStepsHeading}>
                        <span>Get ~ {estimatedAmountToGet} {selectedToken.tokenSymbol} on {selectedToChain.name}</span>
                        <a href={config.getExplorerURL(transferHash, selectedToChain.chainId)} target="_blank" className="link">
                            <LaunchIcon className={classes.icon} />
                        </a>
                    </div>
                ));
            } else {
                dispatch(updateTransferStepsLabelArray(2, `Get ~ ${estimatedAmountToGet} ${selectedToken.tokenSymbol} on ${selectedToChain.name}`));
            }
        }
    }, [estimatedAmountToGet, transferHash]);

    useEffect(()=>{
        if(transferStepsLabelArray) {
            setStepperSteps(transferStepsLabelArray);
        }
    }, [transferStepsLabelArray]);

    useEffect(()=>{
        if(currentStep != undefined && transferStepsLabelArray) {
            if(currentStep >= transferStepsLabelArray.length) {
                setDetailsButtonEnabled(true);
            }
        }
    }, [currentStep]);

    const handleNext = () => {
        dispatch(updateTransferState({currentStep: currentStep + 1}));
    };
    
    const handleBack = () => {
        dispatch(updateTransferState({currentStep: currentStep - 1}));
    };
    
    const handleReset = () => {
        dispatch(updateTransferState({currentStep: 0}));
    };

    const showTransferDetails = () => {
        dispatch(updateTransferState({showTransferDetailsModal: true}))
        onModalClose();
    }

    const getStepContent = (step) => {
        let content = "";
        if(transferStepsContentArray) {
            content = transferStepsContentArray[step];
        }
        return content;
    }

    const onModalClose = () => {
        setDetailsButtonEnabled(false);
        if(props.handleClose) {
            props.handleClose();
        }
    }

    let topContent = (
        <VerticalStepper
            steps={stepperSteps}
            activeStep={currentStep}
            handleNext={handleNext}
            handleBack={handleBack}
            handleReset={handleReset}
            getStepContent={getStepContent}/>
    );

    let bottomContent = (
        <div>
            <div className={classes.transferActivityStatus}>{transferActivityStatus}</div>
            <div className={classes.transferHashContainer}>
                {depositHash && 
                    <div className={classes.transferHashRow}>
                        <div className={classes.transferHashLabel}>Deposit on {selectedFromChain.name}</div>
                        <div className={classes.transferHashButtonContainer}>
                            <a className={classes.explorerButton} href={config.getExplorerURL(depositHash, selectedFromChain.chainId)} target="_blank">
                                {depositStatus ? depositStatus : "Check Explorer" }
                                <LaunchIcon className={classes.icon}/>
                            </a>
                            {depositStatus === config.transactionStatus.PENDING &&
                                <LinearProgress />
                            }
                        </div>
                    </div>
                }
                {transferHash && 
                    <div className={classes.transferHashRow}>
                        <div className={classes.transferHashLabel}>Transfer on {selectedToChain.name}</div>
                        <div className={classes.transferHashButtonContainer}>
                            <a className={classes.explorerButton} href={config.getExplorerURL(transferHash, selectedToChain.chainId)} target="_blank">
                                {transferStatus ? transferStatus : "Check Explorer"}
                                <LaunchIcon className={classes.icon}/>
                            </a>
                            {transferStatus === config.transactionStatus.PENDING &&
                                <LinearProgress />
                            }
                        </div>
                    </div>
                }
            </div>
            <div className={classes.modalFooter}>
                <DetailsButton 
                variant="contained"
                onClick={showTransferDetails}
                disabled={!detailsButtonEnabled}
                classes={{ disabled: classes.disabledButton }}>
                        See Details
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
            onModalClose={onModalClose}
            footerNote="NOTE: Please do not refresh the page"/>
    );
}