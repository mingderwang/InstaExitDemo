import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from '@material-ui/core';
import HyphenModal from '../HyphenModal';
import { updateTransferState } from '../../redux';

const useStyles = makeStyles((theme) => ({
    bottomContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    topContainer: {
        padding: "50px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    approveText: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    checkbox: {
        padding: "10px"
    },
    approvalInfo: {
        justifyContent: "center",
        fontSize: "14px",
        marginTop: "20px"
    }
}));

const HyphenCheckbox = withStyles({
    root: {
      color: "#615CCD",
      '&$checked': {
        color: "#615CCD",
      },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

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

export default function ApprovePopup(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const selectedToken = useSelector(state => state.tokens.selectedToken);
    const selectedFromChain = useSelector(state => state.network.selectedFromChain);

    const [headerText, setHeaderText] = useState("Approve Details");
    const [infiniteApproval, setInfiniteApproval] = useState(props.infiniteApproval);

    const onModalClose = () => {
        if(props.handleClose) {
            props.handleClose();
        }
    }

    const handleInfiniteApprovalChange = () => {
        setInfiniteApproval(!infiniteApproval);
    }

    const onClickProceed = () => {
        if (props.onProceed) {
            props.onProceed(infiniteApproval);
            dispatch(updateTransferState({showApprovePopup: false}));
        }
    }

    let topContent = (
        <div className={classes.topContainer}>
            <div className={classes.approveText}>Allow Hyphen to spend your {selectedToken.tokenSymbol} on {selectedFromChain.name} </div>
            <FormControlLabel
                className={classes.checkbox}
                control={<HyphenCheckbox checked={infiniteApproval} onChange={handleInfiniteApprovalChange} name="approvalCheckbox" />}
                label="Infinite Approval"
            />

            <div className={classes.approvalInfo}>
                {props.infiniteApproval && 
                    <div>
                        NOTE: This approval will only be used when you deposit your {selectedToken.tokenSymbol} on Hyphen Contracts on {selectedFromChain.name} for cross chain transfers.
                    </div>
                }
            </div>
        </div>
    );

    let bottomContent = (
        <div className={classes.bottomContainer}>
            <DetailsButton onClick={onClickProceed}>
                Proceed
            </DetailsButton>
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