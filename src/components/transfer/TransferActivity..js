import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import VerticalStepper from '../stepper/VerticalStepper';
import { useSelector, useDispatch } from 'react-redux'
import HyphenModal from '../HyphenModal';

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';

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
        margin: "10px 0px"
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

    const [headerText, setHeaderText] = useState("Transfer Activity");
    const [stepperSteps, setStepperSteps] = useState([]);
    const [detailsButtonEnabled, setDetailsButtonEnabled] = useState(false);

    useEffect(()=>{
        if(props.activityName === "Transfer") {
            if(selectedToken && selectedToken.tokenSymbol && selectedTokenAmount 
                && selectedFromChain && selectedFromChain.name) {
                dispatch(updateTransferStepsLabelArray(1, `Deposit ${selectedTokenAmount} ${selectedToken.tokenSymbol} on ${selectedFromChain.name}`));

            }
        }
    }, [selectedTokenAmount, selectedToken, selectedFromChain]);

    useEffect(()=>{
        if(estimatedAmountToGet) {
            dispatch(updateTransferStepsLabelArray(2, `Get ~ ${estimatedAmountToGet} ${selectedToken.tokenSymbol} on ${selectedToChain.name}`));
        }
    }, [estimatedAmountToGet]);

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
            onModalClose={onModalClose}/>
    );
}