import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EthIcon from "eth-icon";
import Button from '@material-ui/core/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import HyphenModal from '../HyphenModal';
import { useSelector, useDispatch } from 'react-redux'
import { config as cssConfig } from "../../css-config";
import { updateUserState } from '../../redux';
import TrimmedText from "../../components/util/TrimmedText";
import CopyIcon from "../../assets/copy-icon.svg";

const useStyles = makeStyles((theme) => ({
    userDetailsContainer: {
        background: cssConfig.theme.dark.secondaryBackground,
        padding: "2px",
        borderRadius: "10px",
        marginTop: "20px"        
    },
    userAddressContainer: {
        background: cssConfig.theme.dark.buttonBackground,
        color: cssConfig.theme.dark.secondaryTextColor,
        padding: "20px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column"
    },
    addressLabelRow: {
        color: cssConfig.theme.dark.primaryTextColor,
        fontFamily: 'Roboto Mono',
        fontSize: "12px",
        letterSpacing: "4px",
        fontWeight: "bold"
    },
    addressValueRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "10px",
        justifyContent: "space-between"
    },
    userAddressIcon: {
        borderRadius: "16px",
        marginRight: "10px",
        width: "24px!important",
        height: "24px!important"
    },
    iconAndAddressContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    userAddress: {
        flexGrow: 1,
        fontSize: "20px",
        fontWeight: "bold"
    },
    copyTextContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: "12px",
        cursor: "pointer"
    },
    copyIcon: {
        marginRight: "5px"
    },
    walletInfoContainer: {
        padding: "10px"
    },
    walletInfoRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "12px",
        color: cssConfig.theme.dark.primaryTextColor1
    },
    changeWalletButton: {
        color: cssConfig.theme.dark.primaryTextColor1,
        borderColor: cssConfig.theme.dark.primaryTextColor1,
        fontSize: "12px",
        textTransform: "capitalize"
    },
    recentTransactionsContainer: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        color: cssConfig.theme.dark.secondaryTextColor,
        fontWeight: "bold"
    }
}));

export default function UserDetails(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showUserDetails = useSelector(state => state.user.showUserDetails);
    const userAddress = useSelector(state => state.user.userAddress);
    const selectedWallet = useSelector(state => state.network.selectedWallet);

    const [headerText, setHeaderText] = useState("Account");
    const [openCopyTooltip, setOpenCopyTooltip] = useState(false);

    let onModalClose = () => {
        dispatch(updateUserState({showUserDetails: false}))
    }

    let handleTooltipClose = () => {
        setOpenCopyTooltip(false);
    }

    let onClickCopyIcon = () => {
        setOpenCopyTooltip(true);
    }

    let onClickWalletChanged = () => {
        if(props.onClickWalletChange) {
            props.onClickWalletChange();
        }
    }

    let topContent = (
        <div>
            <div className={classes.userDetailsContainer} >
                <div className={classes.userAddressContainer}>
                    <div className={classes.addressLabelRow}>
                        <span>ADDRESS</span>
                    </div>
                    <div className={classes.addressValueRow}>
                        <div className={classes.iconAndAddressContainer}>
                            <EthIcon address={userAddress} scale={8} className={classes.userAddressIcon}/>
                            <TrimmedText text={userAddress} startIndex={6} endIndex={38} className={classes.userAddress}/>
                        </div>
                        <CopyToClipboard text={userAddress}>
                            <ClickAwayListener onClickAway={handleTooltipClose}>
                                <Tooltip
                                    PopperProps={{
                                    disablePortal: true,
                                    }}
                                    onClose={handleTooltipClose}
                                    open={openCopyTooltip}
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    title="Address Copied">
                                    <div className={classes.copyTextContainer} onClick={onClickCopyIcon}>
                                        <img src={CopyIcon} alt="copy" className={classes.copyIcon}/>
                                        <span>Copy Address</span>
                                    </div>
                                </Tooltip>
                            </ClickAwayListener>
                        </CopyToClipboard>
                    </div>
                </div>
                <div className={classes.walletInfoContainer}>
                    <div className={classes.walletInfoRow}>
                        <div>Connected with {selectedWallet}</div>
                        <Button variant="outlined" className={classes.changeWalletButton}
                        onClick={onClickWalletChanged}>
                            Change Wallet
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    let bottomContent = (
        <div>
            <div className={classes.recentTransactionsContainer}>
                <div className={classes.recentTransactionsHeader}>
                    Recent Transactions
                </div>
                <div className={classes.recentTransactionsBody}>

                </div>
            </div>
        </div>
    );

    return (
        <HyphenModal 
            topContent={topContent}
            bottomContent={bottomContent}
            headerText={headerText}
            open={showUserDetails}
            onModalClose={onModalClose}/>
    )
}