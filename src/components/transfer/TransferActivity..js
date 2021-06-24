import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import clsx from  'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import VerticalStepper from '../stepper/VerticalStepper';
import { useSelector, useDispatch } from 'react-redux'

import { updateTransferState,
    updateTransferStepsLabelArray } from '../../redux';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    disabledButton: {
        opacity: "0.5"
    },

    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    modalContainer: {
        width: 400,
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
        fontWeight: "500",
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
    const estimatedAmountToGet = useSelector(state => state.transaction.estimatedAmountToGet);

    const [headerText, setHeaderText] = useState("Transfer Activity");
    const [stepperSteps, setStepperSteps] = useState([]);
    const [detailsButtonEnabled, setDetailsButtonEnabled] = useState(false);

    let transferSteps = ['Approve', 'Deposit Funds on Ethereum', 'Release Funds on Polygon', 'Transfer Confirmed'];

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
            dispatch(updateTransferStepsLabelArray(2, `Transfer of ~ ${estimatedAmountToGet} ${selectedToken.tokenSymbol} on ${selectedToChain.name}`));
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
        
    }

    const getStepContent = (step) => {
        console.log(transferStepsContentArray);

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
                        <VerticalStepper
                            steps={stepperSteps}
                            activeStep={currentStep}
                            handleNext={handleNext}
                            handleBack={handleBack}
                            handleReset={handleReset}
                            getStepContent={getStepContent}/>
                    </div>
                </div>
                <div className={clsx(classes.modalBottom, classes.modalRow)}>
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