import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EthIcon from "eth-icon";
import { BigNumber } from "ethers";
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
import WhiteArrow from "../../assets/white-arrow.svg";
import ArrowIcon from '../../assets/arrow.svg';
import { config } from '../../config';
import { borderColor } from '@material-ui/system';
import { updateTransferState } from '../../redux';
import CachedIcon from '@material-ui/icons/Cached';

const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
      color: theme.palette.common.black,
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
    },
}));

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
    },
    recentTransactionsHeader: {
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    reloadButton: {
        color: cssConfig.theme.dark.secondaryBackground
    },
    historyRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: "0px 5px",
        margin: "10px 0px",
        fontSize: "14px",
        alignItems: "center",
        width: "fit-content"
    },
    historyArrowIcon: {
        width: "11px",
        marginRight: "10px"
    },
    openInNewIcon: {
        width: "16px",
        marginLeft: "5px"
    },
    openInNewLink: {
        textDecoration: "none",
        display: "flex",
        margin: "0px 5px",
        alignItems: "center",
        color: cssConfig.theme.dark.primaryTextColor
    },
    emptyTransactions: {
        textAlign: "center",
        fontSize: "12px",
        margin: "20px 0px"
    },
    toolTipWhiteArrow: {
        width: "14px",
        margin: "0px 5px"
    },
    tooltipContainer: {
        padding: "5px",
        fontSize: "12px"
    },
    historyParentRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    historyDetailsButton: {
        fontSize: "12px",
        border: "1px solid",
        borderRadius: "3px",
        borderColor: cssConfig.theme.dark.primaryTextColor,
        padding: "3px 10px",
        height: "18px",
        cursor: "pointer"
    },
    tokenLogo: {
        height: "14px",
        margin: "0px 5px 0px 8px"
    }
}));

let graphClientMap = {};

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();
  
    return <Tooltip arrow classes={classes} {...props} />;
}

export default function UserDetails(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showUserDetails = useSelector(state => state.user.showUserDetails);
    const userAddress = useSelector(state => state.user.userAddress);
    const selectedWallet = useSelector(state => state.network.selectedWallet);
    const selectedFromChain = useSelector(state => state.network.selectedFromChain);

    const [headerText, setHeaderText] = useState("Account");
    const [openCopyTooltip, setOpenCopyTooltip] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState();
    const [emptyTransactionHistoryMessage, setEmptyTransactionHistoryMessage] = useState("Fetching transaction history ...");

    async function fetchTransactions() {
        if(selectedFromChain) {

            let graphClient = getGraphClient(selectedFromChain.chainId);
            if(userAddress && graphClient, showUserDetails) {
                try {
                    let _transactionHistory = []
                    let transactions = await getUserDepositTransactions(userAddress, graphClient);
                    if(transactions && transactions.length > 0) {
                        for(let index=0; index < transactions.length; index++) {
                            let curTransaction = transactions[index];
                            let tokenAddress = curTransaction.tokenAddress;
                            let startTimestamp = curTransaction.timestamp;
                            let tokenSymbol;
                            let amount;
                            if(tokenAddress && selectedFromChain && selectedFromChain.chainId) {
                                let {formattedAmount, symbol} = getTokenInfo(curTransaction.amount, tokenAddress, selectedFromChain.chainId);
                                amount = formattedAmount;
                                tokenSymbol = symbol;
                            }
                            let toChainId = curTransaction.toChainId;
                            let toChainLabel = toChainId;
                            if(toChainId && config.chainIdMap[toChainId]) {
                                toChainLabel = config.chainIdMap[toChainId].name;
                            }
                            let txn = {};
    
                            let transferInfo = await getTransferHash(curTransaction.id, toChainId);
                            if(transferInfo && transferInfo.id) {
                                let amountReceived = transferInfo.transferredAmount;
                                let receivedTokenSymbol;
                                if(amountReceived) {
                                    let {formattedAmount, symbol} = getTokenInfo(amountReceived, transferInfo.tokenAddress.toLowerCase(), toChainId);
                                    amountReceived = formattedAmount;
                                    receivedTokenSymbol = symbol;
                                }
                                txn.transferHash = transferInfo.id;
                                txn.toChainId = toChainId;
                                let rawLpFee = transferInfo.feeEarned;
                                let lpFee;
                                if(rawLpFee) {
                                    let {formattedAmount} = getTokenInfo(rawLpFee, transferInfo.tokenAddress.toLowerCase(), toChainId);
                                    lpFee = formattedAmount;
                                }
                                txn.lpFee = lpFee;
                                txn.amountReceived = amountReceived;
                                txn.receivedTokenSymbol = receivedTokenSymbol;
                                txn.receivedTokenAddress = transferInfo.tokenAddress;
                                txn.endTimestamp = transferInfo.timestamp;
                            }
    
                            txn.amount = amount;
                            txn.depositHash = curTransaction.id;
                            txn.tokenSymbol = tokenSymbol;
                            txn.fromChainLabel = selectedFromChain.name;
                            txn.fromChainId = selectedFromChain.chainId;
                            txn.toChainLabel = toChainLabel;
                            txn.receiver = curTransaction.receiver;
                            txn.startTimestamp = startTimestamp;
                            _transactionHistory.push(txn);
                        }
                    }
                    if(_transactionHistory.length == 0) {
                        setEmptyTransactionHistoryMessage("No Transactions Found");
                    }
                    console.log(_transactionHistory);
                    setTransactionHistory(_transactionHistory);
                } catch(error) {
                    console.error("Could not get user transactions");
                    console.error(error);
                    setTransactionHistory([]);
                    setEmptyTransactionHistoryMessage("No Transactions Found");
                }
            }
        }
    }

    useEffect(()=>{
        setTransactionHistory();
        fetchTransactions();
    }, [userAddress, showUserDetails])

    let getTokenInfo = (rawAmount, tokenAddress, chainId) => {
        console.log("getting token info");
        let formattedAmount = rawAmount;
        let tokenInfo = config.tokenAddressMap[tokenAddress.toLowerCase()][chainId];
        let symbol;
        if(tokenInfo) {
            symbol = tokenInfo.symbol
            formattedAmount = rawAmount / BigNumber.from(10).pow(tokenInfo.decimal).toString();
            if (formattedAmount != undefined) formattedAmount = formattedAmount.toFixed(2);
        }
        return {formattedAmount, symbol};
    }
    
    let getUserDepositTransactions = (userAddress, graphClient) => {
        return new Promise(async (resolve, reject) => {
            try {
                let transactions = [];
                if(graphClient && userAddress) {
                    let data = await graphClient.query({
                        query: gql(`
                        query {
                            fundsDepositeds(
                                first: 5,
                                orderBy: timestamp,
                                orderDirection: desc,
                                where: {from: "${userAddress}"}) {
                                id
                                from
                                receiver
                                tokenAddress
                                amount
                                toChainId
                                timestamp
                            }
                        }
                      `)
                    });
                    
                    if(data.data && data.data.fundsDepositeds) {
                        transactions = data.data.fundsDepositeds;
                    }
                } else {
                    reject(`graphClient or userAddress is undefined`);
                }
                resolve(transactions);
            } catch(error) {
                reject(error);
            }
        });
    }

    let getGraphClient = (chainId) => {
        let client = graphClientMap[chainId];
        if(!client) {
            let chain = config.chainIdMap[chainId];
            if(chain && chain.graphURL) {
                client = new ApolloClient({
                    uri: chain.graphURL,
                    cache: new InMemoryCache({
                        fetchPolicy: "no-cache"
                    })
                });
                graphClientMap[chainId] = client;
            }
        }
        return client;
    }

    let getTransferHash = (depositHash, toChainId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let transferInfo;
                let graphClient = getGraphClient(toChainId);
                if(graphClient) {
                    let data = await graphClient.query({
                        query: gql(`
                        query {
                            fundsSentToUsers(where: {depositHash: "${depositHash}"}) {
                                id
                                depositHash
                                tokenAddress
                                amount
                                transferredAmount
                                feeEarned
                                timestamp
                            }
                        }
                      `)
                    });
                    if(data && data.data && data.data.fundsSentToUsers) {
                        transferInfo = data.data.fundsSentToUsers[0];
                    }
                }
                resolve(transferInfo);
            } catch(error) {
                reject(error);
            }
        })
    }

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
            onModalClose();
            props.onClickWalletChange();
        }
    }

    let onDetailsButtonClicked = (index) => {
        let transaction = transactionHistory[index];
        if(transaction) {
            let fromChainId = transaction.fromChainId;
            let toChainId = transaction.toChainId;
            let tokenAmount = transaction.amount;
            let tokenSymbol = transaction.tokenSymbol;
            let recievedAmount = transaction.amountReceived;
            let lpFee = transaction.lpFee;
            let transferHash = transaction.transferHash;
            let startTime = transaction.startTimestamp * 1000;   // Converting in ms
            let endTime =  transaction.endTimestamp * 1000;      // Converting in ms
            dispatch(updateTransferState({
                showTransferDetailsModal: true,
                fromChainId,
                lpFee,
                toChainId,
                tokenAmount,
                tokenSymbol,
                recievedAmount,
                transferHash,
                startTime,
                endTime
            }));
        }
    }

    let reloadTransactionHistory = (chainId) => {
        if(graphClientMap) {
            setTransactionHistory([]);
            graphClientMap[chainId] = undefined;
            fetchTransactions();
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
                                <CopyToClipboard text={userAddress} className={classes.copyTextContainer}>
                                    <div onClick={onClickCopyIcon}>
                                        <img src={CopyIcon} alt="copy" className={classes.copyIcon}/>
                                        <span>Copy Address</span>
                                    </div>
                                </CopyToClipboard>
                            </Tooltip>
                        </ClickAwayListener>
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
                    Recent Transactions (Top 5) 
                    {transactionHistory &&
                        <Button 
                            className={classes.reloadButton}
                            onClick={()=>{reloadTransactionHistory(selectedFromChain.chainId)}}
                            startIcon={<CachedIcon />}>
                            reload
                        </Button>
                    }
                </div>
                <div className={classes.recentTransactionsBody}>
                    {transactionHistory && transactionHistory.length > 0 &&
                        transactionHistory.map((txn, index)=>(
                            <div key={`TxnHistory_${index}`} className={classes.historyParentRow}>
                                <BootstrapTooltip 
                                arrow
                                title={ 
                                    <div className={classes.tooltipContainer}>
                                        {`${txn.amount} ${txn.tokenSymbol}`}
                                        <img src={WhiteArrow} className={classes.toolTipWhiteArrow}/>   
                                        {`${txn.amountReceived} ${txn.receivedTokenSymbol}`}
                                    </div>
                                }
                                placement="top">
                                    <div className={classes.historyRow}>
                                        <img src={ArrowIcon} alt="=>"  className={classes.historyArrowIcon} /> 
                                        {txn.amount} <img src={config.tokenLogoMap[txn.tokenSymbol]} className={classes.tokenLogo}/> {txn.tokenSymbol} from
                                        <a target="_blank" href={config.getExplorerURL(txn.depositHash, txn.fromChainId)}
                                        className={classes.openInNewLink}>
                                            {txn.fromChainLabel}
                                            {/* <OpenInNewIcon className={classes.openInNewIcon} /> */}
                                        </a>
                                        to
                                        <a target="_blank" href={config.getExplorerURL(txn.transferHash, txn.toChainId)}
                                        className={classes.openInNewLink}>
                                            {txn.toChainLabel}
                                            {/* <OpenInNewIcon className={classes.openInNewIcon} /> */}
                                        </a>
                                    </div>
                                </BootstrapTooltip>

                                <div 
                                className={classes.historyDetailsButton} 
                                variant="outlined"
                                size="small" onClick={()=>{onDetailsButtonClicked(index)}}>Details</div>
                            </div>
                        ))
                    }
                    {(!transactionHistory || transactionHistory.length == 0) && 
                        <div className={classes.emptyTransactions}>
                            {emptyTransactionHistoryMessage}
                        </div>
                    }
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