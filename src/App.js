import React, { useState, useEffect } from "react";
import "./App.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux'
import ProgressDialog from './components/ProgressDialog';
import InfoIcon from '@material-ui/icons/Info';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { BigNumber, ethers } from "ethers";
// import {EthUtil} from "ethereumjs-util";
import { InstaExit, SignatureType, RESPONSE_CODES } from "@biconomy/inex";
import { makeStyles } from '@material-ui/core/styles';
import TokenListContainer from "./components/TokenListContainer";
import { config } from "./config";
import {
  updateSelectedFromChain,
  updateSelectedToChain,
  updateTokenAmount,
  updateSupportedTokens,
  updateSelectedTokenBalance,
  updateSupportedTokensAndSelectedToken,
  updateMinDeposit,
  updateMaxDeposit
} from "./redux";
import Faucet from "./components/Faucet";

let MaticLogo = require("./assets/Matic.png");
let EthereumLogo = require("./assets/Ethereum.png");

let ethersProvider, signer;
let contract, contractInterface, contractWithBasicSign;

let chainLogoMap = {
  80001: MaticLogo,
  5: EthereumLogo,
  137: MaticLogo,
  1: EthereumLogo
}

let explorerURLMap = {
  80001: "https://explorer-mumbai.maticvigil.com/tx/",
  137: "https://explorer-mainnet.maticvigil.com/tx/",
  5: "https://goerli.etherscan.io/tx/",
  1: "https://etherscan.io/tx/"
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  estimationsContainer: {
    background: "#555",
    color: "white",
    display: "flex",
    flexDirection: "column",
    width: "92%",
    padding: "10px",
    margin: '8px',
    borderRadius: "2px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  estimationRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: "4px",
    justifyContent: "space-between",
    fontWeight: "300"
  },
  balanceRow: {
    textAlign: "right",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  formControlFullWidth: {
    margin: theme.spacing(1),
    minWidth: 150,
    width: "100%"
  },
  exitHashLink: {
    textDecoration: "none",
    cursor: "pointer",
    color: "#3f51b5",
    marginLeft: "5px"
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "space-between",
    alignItems: "center"
  },
  feedbackIcon: {
    marginRight: "10px"
  },
  feedbackInfoIcon: {
    color: "#3f51b5"
  },
  feedbackSuccessIcon: {
    color: "#4caf50"
  },
  feedbackErrorIcon: {
    color: "#f44336"
  },
  feedbackMessage: {
    textAlign: "center",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  selectBox: {
    display: "flex!important",
    color: "red"
  },
  heading: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  chainLogo: {
    height: "20px",
    marginRight: "5px"
  },
  selectLabel: {
    textAlign: "left",
    paddingBottom: "5px",
    paddingLeft: "5px"
  },
  tokenInputAmountContainer: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  mainContainer: {
    width: "500px",
    position: "relative",
    marginTop: "100px"
  }
}));

const fromChainList = [config.chains.MUMBAI, config.chains.GOERLI];
const toChainList = [config.chains.MUMBAI, config.chains.GOERLI];

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedToken = useSelector(state => state.tokens.selectedToken);
  const selectedTokenBalance = useSelector(state => state.tokens.selectedTokenBalance);
  const selectedFromChain = useSelector(state => state.network.selectedFromChain);
  const selectedToChain = useSelector(state => state.network.selectedToChain);
  const selectedTokenAmount = useSelector(state => state.tokens.tokenAmount);
  const minDepositAmount = useSelector(state => state.tokens.minDeposit);
  const maxDepositAmount = useSelector(state => state.tokens.maxDeposit);
  const tokenMap = useSelector(state => state.tokens.tokenMap);

  const preventDefault = (event) => event.preventDefault();
  const [userAddress, setUserAddress] = useState();
  const [instaExit, setInstaExit] = useState();
  const [fromChain, setFromChain] = useState(selectedFromChain);
  const [toChain, setToChain] = useState(selectedToChain)
  const [tokenAmount, setTokenAmount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("Status");
  const [feedbackIcon, setFeedbackIcon] = useState();
  const [lpFee, setLpFee] = useState(".3");
  const [showEstimation, setShowEstimation] = useState(false);
  const [walletChainId, setWalletChainId] = useState();
  const [faucetBalance, setFaucetBalance] = useState({});

  useEffect(() => {
    async function init() {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      ) {
        // Ethereum user detected. You can now use the provider.
        const provider = window["ethereum"];
        await provider.enable();
        ethersProvider = new ethers.providers.Web3Provider(provider, "any");

        let network = await ethersProvider.getNetwork();
        setWalletChainId(network.chainId);

        let instaExit = new InstaExit(provider, {
          fromChainId: 5,
          toChainId: 80001,
          debug: true,
          infiniteApproval: true,
          onFundsTransfered: (data) => {
            console.log("Funds transfer successfull");
            console.log(`Exit hash on chainId ${data.toChainId} is ${data.exitHash}`);
            showFeedbackMessage(<div>
              Cross chain transfer successfull !!
                <a className={classes.exitHashLink} target="_blank" href={getExplorerURL(data.exitHash, data.toChainId)}>Check explorer</a>
            </div>, "success");
          }
        });

        await instaExit.init();
        
        if(network && network.chainId && Object.keys(config.chainIdMap).includes(network.chainId.toString()))
          onFromChainSelected({target: {value: network.chainId}});

        signer = ethersProvider.getSigner();
        let userAddress = await signer.getAddress();
        if (userAddress) {
          setUserAddress(userAddress);
        }

        ethersProvider.on("network", (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
              window.location.reload();
          }
        });

        // try {
        //   ethersProvider.on("block", (blockNumber) => {
        //      updateFaucetBalance();
        //   });
        // } catch (error) {
        //   console.log(error);
        // }
        updateFaucetBalance();
        setInstaExit(instaExit);

        // Hanlde user address change
        if(provider.on) {          
          provider.on('accountsChanged', function (accounts) {
            console.log(`Address changed EVENT`);
            console.log(`New account info`, accounts);

            if(accounts && accounts.length > 0) {
              let newUserAddress = accounts[0];
              if (newUserAddress) {
                setUserAddress(newUserAddress);
              }
            }
          })
        }
      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    try {
      init();
    } catch(error) {
      console.log(error);
      showErrorMessage("Error while initiazing the App");
    }
  }, []);

  useEffect(() => {
    console.log("Selected token changed", selectedToken)
    if (selectedToken !== undefined && selectedToken.address && signer && ethersProvider && userAddress) {
      dispatch(updateSelectedTokenBalance(undefined));
      dispatch(updateMinDeposit(undefined));
      dispatch(updateMaxDeposit(undefined));

      checkNetwork().then(async status => {
        if (status) {
          if (userAddress) {
            console.log(`User address is ${userAddress}`)
            console.log("network is same");
            let tokenAddress = selectedToken.address;
            let tokenContract = new ethers.Contract(tokenAddress, config.abi.erc20, signer);
            let userBalance = await tokenContract.balanceOf(userAddress);
            let decimals = await tokenContract.decimals();
            let balance = userBalance.toString() / BigNumber.from(10).pow(decimals).toString();
            if (balance != undefined) balance = balance.toFixed(2);

            dispatch(updateSelectedTokenBalance(balance));
            if(instaExit) {
              let poolInfo = await instaExit.getPoolInformation(tokenAddress, selectedFromChain.chainId, selectedToChain.chainId);
              if(poolInfo && poolInfo.minDepositAmount && poolInfo.maxDepositAmount) {
                dispatch(updateMinDeposit(poolInfo.minDepositAmount));
                dispatch(updateMaxDeposit(poolInfo.maxDepositAmount));
              }
              console.log(poolInfo);
            }
            
          } else {
            showErrorMessage("User address is not initialized");
          }
        }
      })
    }
  }, [selectedToken, userAddress])

  const updateFaucetBalance = async () => {
    let faucetBalance = {};
    let faucetChains = [selectedFromChain.chainId, selectedToChain.chainId];

    if (faucetChains) {
      for (let index = 0; index < faucetChains.length; index++) {
        let faucetPerChain = {};
        let chainId = faucetChains[index];
        let faucet = config.faucet[chainId];
        if (config.tokensMap) {
          let tokensArray = Object.keys(config.tokensMap);
          let rpcUrl = config.chainIdMap[chainId].rpcUrl;
          let ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

          for (let subIndex = 0; subIndex < tokensArray.length; subIndex++) {
            let tokenSymbol = tokensArray[subIndex];
            let tokenAddress = config.tokensMap[tokenSymbol][chainId].address;
            let tokenContract = new ethers.Contract(tokenAddress, config.abi.erc20, ethersProvider);
            let balance = await tokenContract.balanceOf(faucet.address);
            let decimals = await tokenContract.decimals();
            balance = balance.toString() / BigNumber.from(10).pow(decimals).toString();
            if (balance != undefined) balance = balance.toFixed(2);
            faucetPerChain[tokenAddress] = balance;
          }
        }
        faucetBalance[chainId] = faucetPerChain;
      }
    }
    console.log(faucetBalance);
    setFaucetBalance(faucetBalance);
  }

  const checkNetwork = async () => {
    let status = true;
    if (signer && ethersProvider) {
      let currentNetwork = await ethersProvider.getNetwork();
      if (currentNetwork.chainId != selectedFromChain.chainId) {
        status = false;
        showErrorMessage(`Please switch your wallet to ${selectedFromChain.name} network`);
      }
    } else {
      status = false;
      showErrorMessage(`Make sure your wallet in unlocked`);
    }
    return status;
  }

  const handleCloseFeedback = () => {
    setOpenProgressDialog(false);
  }

  const getExplorerURL = (hash, chainId) => {
    return `${explorerURLMap[chainId]}${hash}`;
  }

  const onFromChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]
    let currentToChain = selectedToChain;

    setFromChain(selectedNetwork);
    dispatch(updateSelectedFromChain(selectedNetwork));


    if (currentToChain.chainId === selectedNetwork.chainId) {
      let supportedChainsArray = Object.keys(config.chains);
      let nextChain;
      for (let index = 0; index < supportedChainsArray.length; index++) {
        nextChain = config.chains[supportedChainsArray[index]];
        if (nextChain && nextChain.chainId !== undefined && nextChain.chainId != currentToChain.chainId) {
          break;
        }
      }
      if (nextChain && nextChain.chainId != undefined) {
        setToChain(nextChain);
        dispatch(updateSelectedToChain(nextChain));
      }
    }

    if (instaExit && selectedNetwork.chainId) {
      let tokenList = instaExit.getSupportedTokens(selectedNetwork.chainId);
      if (tokenList) {
        console.log("dispatching updateSupportedTokens")
        dispatch(updateSupportedTokensAndSelectedToken(tokenList));
      } else {
        showErrorMessage(`Unable to get supported token list for network id ${selectedNetwork.chainId} `)
      }
    }
  }

  const onToChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]

    let currentFromChain = selectedFromChain;
    if (currentFromChain.chainId === selectedNetwork.chainId) {
      showInfoMessage(`From and To chain can't be same. Please change the from chain`);
    } else {
      setToChain(selectedNetwork);
      dispatch(updateSelectedToChain(selectedNetwork));
    }
  }

  const handleTokenAmount = (event) => {
    let amount = event.target.value;
    if (amount !== undefined && amount.toString) {
      if (amount != "") {
        if (BigNumber.from(amount).gt(0)) {
          setShowEstimation(true);
        } else {
          setShowEstimation(false);
        }
      }

      setTokenAmount(amount.toString());
      dispatch(updateTokenAmount(amount));
    } else {
      showErrorMessage("Please enter valid amount");
    }
  }

  const onTransfer = async () => {
    try {
      let networkCheck = await checkNetwork();
      if (!networkCheck) {
        return;
      }
      let amount = BigNumber.from(selectedTokenAmount);

      if (amount == 0) {
        showErrorMessage("Please enter non zero value")
        return;
      }
      let fromChainId = selectedFromChain.chainId;
      let toChainId = selectedToChain.chainId;

      showFeedbackMessage("Initiaiting Transfer");
      let tokenDecimals = await instaExit.getERC20TokenDecimals(selectedToken.address);

      amount = amount.mul(BigNumber.from(10).pow(tokenDecimals));

      console.log("Total amount to  be transfered: ", amount.toString())

      showFeedbackMessage("Checking available liquidity");
      let transferStatus = await instaExit.preDepositStatus({
        tokenAddress: selectedToken.address,
        amount: amount.toString(),
        fromChainId,
        toChainId
      });

      if (transferStatus) {
        if (transferStatus.code === RESPONSE_CODES.OK) {
          console.log("All good. Proceed with deposit");
          console.log(transferStatus);
          try {
            showFeedbackMessage("Checking approvals and initiating deposit transaction");
            let depositTx = await deposit({
              sender: await signer.getAddress(),
              receiver: await signer.getAddress(),
              tokenAddress: selectedToken.address,
              depositContractAddress: transferStatus.depositContract,
              amount: amount.toString(),
              fromChainId: fromChainId,
              toChainId: toChainId,
            });

            showFeedbackMessage(`Waiting for deposit confirmation on ${selectedFromChain.name}`);
            console.log(depositTx);
            await depositTx.wait(1);
            showFeedbackMessage(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, "success");
          } catch (error) {
            console.log(error);
            if (error && error.code == RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
              showFeedbackMessage(`Approval not found for ${selectedTokenAmount} ${selectedToken.tokenSymbol}`);
              let approveTx = await instaExit.approveERC20(selectedToken.address, transferStatus.depositContract, amount.toString());
              showFeedbackMessage(`Waiting for approval confirmation`);
              await approveTx.wait(2);
              showSuccessMessage("Approval transaction confirmed");
              showFeedbackMessage("Initiating deposit transaction");
              let depositTx = await deposit({
                sender: await signer.getAddress(),
                receiver: await signer.getAddress(),
                tokenAddress: selectedToken.address,
                depositContractAddress: transferStatus.depositContract,
                amount: amount.toString(),
                fromChainId: fromChainId,
                toChainId: toChainId,
              });

              showFeedbackMessage(`Waiting for deposit confirmation on ${selectedFromChain.name}`);
              console.log(depositTx);
              await depositTx.wait(1);
              showFeedbackMessage(`Deposit Confirmed. Waiting for transaction on ${selectedToChain.name}`, "success");
            }
          }

        } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_NETWORK) {
          showErrorMessage("Target chain id is not supported yet");
        } else if (transferStatus.code === RESPONSE_CODES.NO_LIQUIDITY) {
          showErrorMessage(`No liquidity available for ${selectedTokenAmount} tokens`);
        } else if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_TOKEN) {
          showErrorMessage("Requested token is not supported yet");
        }
      }
    } catch (error) {
      if (error && error.message) {
        showErrorMessage(error.message);
      } else {
        showErrorMessage(`Make sure your wallet is on ${selectedFromChain.name} network`)
      }
    }
  }

  const deposit = async (depositRequest) => {
    let depositResponse = await instaExit.deposit(depositRequest);
    return depositResponse;
  }

  const showErrorMessage = message => {
    NotificationManager.error(message, "Error", 5000);
  };

  const showSuccessMessage = message => {
    NotificationManager.success(message, "Message", 3000);
  };

  const showInfoMessage = message => {
    NotificationManager.info(message, "Info", 3000);
  };

  const showFeedbackMessage = (message, type) => {
    // setOpenProgressDialog(true);
    setFeedbackMessage(message);
    if (type === 'success') {
      setFeedbackIcon(<SuccessIcon className={`${classes.feedbackSuccessIcon} ${classes.feedbackIcon}`} />);
    } else if (type === 'error') {
      setFeedbackIcon(<ErrorIcon className={`${classes.feedbackErrorIcon} ${classes.feedbackIcon}`} />);
    } else {
      setFeedbackIcon(<InfoIcon className={`${classes.feedbackInfoIcon} ${classes.feedbackIcon}`} />);
    }
    // showInfoMessage(message);
  }

  const getTokensFromFaucet = async (symbol, chainId) => {
    try {
      let chainName = config.chainIdMap[chainId].name;
      if (walletChainId !== chainId) {
        return showErrorMessage(`Switch your network to ${chainName} in your wallet`);
      }

      let faucetInfo = config.faucet[chainId];
      console.log(faucetInfo);
      let contract = new ethers.Contract(faucetInfo.address, faucetInfo.abi, signer);
      let token = config.tokensMap[symbol][chainId];

      if (token && token.address) {
        let tx = await contract.getTokens(token.address);
        let receipt = await tx.wait(1);
        if (receipt && receipt.status == 1) {
          showSuccessMessage("Faucet transaction successful");
        } else {
          showErrorMessage("Faucet Transaction failed");
        }
      } else {
        showErrorMessage(`${symbol} is not supported on ${chainName}`);
      }
    } catch (error) {
      console.log(error);
      showErrorMessage("Error while getting tokens from faucet");
    }
  }

  return (
    <div className="App">
      
      <Faucet className={`${classes.chainInfoContainer} ${classes.rightChainContainer}`} 
        chainLogoMap={chainLogoMap}
        selectedChain={selectedFromChain}
        faucetBalance={faucetBalance}
        getTokensFromFaucet={getTokensFromFaucet}
        chainId={selectedFromChain.chainId}
        tokenSymbolList={Object.keys(config.tokensMap)}
      />

      <section className={classes.mainContainer}>

        <div className={classes.heading}>
          Insta Exit
        </div>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <div className={classes.cardRow}>
              <div id="feedback-div" className={classes.feedbackMessage}>
                {feedbackIcon}{feedbackMessage}
              </div>
            </div>
            <div className={classes.cardRow}>

              <FormControl variant="outlined" size="small" className={classes.formControl}>
                {/* <InputLabel id="select-from-chain-label">Select From Chain</InputLabel> */}
                <span className={classes.selectLabel}>From</span>
                <Select
                  labelId="select-from-chain-label"
                  id="from-chain-select"
                  value={fromChain.chainId}
                  onChange={onFromChainSelected}
                  style={{ display: "flex!important" }}
                >
                  {fromChainList && fromChainList.map((chain, index) =>
                    <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`} >
                      <img src={chainLogoMap[chain.chainId]} className={classes.chainLogo} />
                      {chain.name}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <ArrowForwardIcon />
              <FormControl variant="outlined" size="small" className={classes.formControl}>
                {/* <InputLabel id="select-to-chain-label">Select To Chain</InputLabel> */}
                <span className={classes.selectLabel}>To</span>
                <Select
                  labelId="select-to-chain-label"
                  id="to-chain-select"
                  value={toChain.chainId}
                  onChange={onToChainSelected}
                >
                  {toChainList && toChainList.map((chain, index) =>
                    <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`} className={classes.menuItem}>
                      <img src={chainLogoMap[chain.chainId]} className={classes.chainLogo} />
                      {chain.name}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>

            {/* <div className={`${classes.cardRow}`}> */}
            <div className={classes.balanceRow}>
              {selectedTokenBalance != undefined &&
                <span>Balance: {selectedTokenBalance}</span>
              }
              {selectedTokenBalance == undefined &&
                <span>-</span>
              }
            </div>
            {/* </div> */}
            <div className={classes.cardRow} style={{alignItems: "inherit"}}>
              {/* <FormControl variant="outlined" size="small" className={classes.formControl}> */}
              <div style={{ flexGrow: 1 }} className={classes.tokenInputAmountContainer}>
                <TextField id="token-amount" size="small" label="Amount"
                  variant="outlined" className={classes.formControl} type="number"
                  value={tokenAmount}
                  style={{ flexGrow: 1 }} onChange={handleTokenAmount} />
                {minDepositAmount !== undefined && maxDepositAmount !== undefined && 
                  <div className="min-max-container">
                    <span>Min: {minDepositAmount}</span>
                    <span>Max: {maxDepositAmount}</span>
                  </div>
                }
              </div>
              <TokenListContainer instaExit={instaExit}
                toChainId={selectedToChain.chainId} fromChainId={selectedFromChain.chainId} />
              {/* </FormControl> */}
            </div>
            {showEstimation &&
              <div className={classes.cardRow}>
                <div className={classes.estimationsContainer}>
                  {/* <div style={{fontWeight: "500"}}>
                    Estimations
                  </div> */}
                  <div className={classes.estimationRow}>
                    <span>Liquidity Provider Fee</span>
                    <span>{lpFee}%</span>
                  </div>
                  <div className={classes.estimationRow}>
                    <span>Other Fees</span>
                    <span>Network fee</span>
                  </div>
                </div>
              </div>
            }
            <div className={classes.cardRow}>
              <FormControl variant="standard" size="medium" className={classes.formControlFullWidth}>
                <Button onClick={onTransfer} size="large" variant="contained" color="secondary">Transfer</Button>
              </FormControl>
            </div>

          </CardContent>
        </Card>
      </section>

      <Faucet className={`${classes.chainInfoContainer} ${classes.rightChainContainer}`} 
        chainLogoMap={chainLogoMap}
        selectedChain={selectedToChain}
        faucetBalance={faucetBalance}
        getTokensFromFaucet={getTokensFromFaucet}
        chainId={selectedToChain.chainId}
        tokenSymbolList={Object.keys(config.tokensMap)}
      />

      <ProgressDialog open={openProgressDialog}
        feedbackMessage={feedbackMessage} feedbackTitle={feedbackTitle} handleClose={handleCloseFeedback} />
      <NotificationContainer />
    </div>
  );
}

export default App;
