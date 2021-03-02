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
import {config} from "./config";
import { 
  updateSelectedFromChain, 
  updateSelectedToChain, 
  updateTokenAmount,
  updateSupportedTokens,
  updateSupportedTokensAndSelectedToken } from "./redux";

let ethersProvider, signer;
let contract, contractInterface, contractWithBasicSign;

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  mainContainer: {
    width: "500px",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    top: "100px"
  }
}));

const fromChainList = [config.chains.MUMBAI, config.chains.GOERLI];
const toChainList = [config.chains.MUMBAI, config.chains.GOERLI];

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedToken = useSelector(state => state.tokens.selectedToken);
  const selectedFromChain = useSelector(state => state.network.selectedFromChain);
  const selectedToChain = useSelector(state => state.network.selectedToChain);
  const selectedTokenAmount = useSelector(state => state.tokens.tokenAmount);

  const preventDefault = (event) => event.preventDefault();
  const [instaExit, setInstaExit] = useState();
  const [fromChain, setFromChain] = useState(selectedFromChain);
  const [toChain, setToChain] = useState(selectedToChain)
  const [tokenAmount, setTokenAmount] = useState(0);

  useEffect(() => {
    async function init() {
      if (
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      ) {
        // Ethereum user detected. You can now use the provider.
        const provider = window["ethereum"];
        await provider.enable();
        ethersProvider = new ethers.providers.Web3Provider(provider);
        let instaExit = new InstaExit(provider, {
          fromChainId: 5,
          toChainId: 80001,
          debug: true,
          infiniteApproval: true,
          onFundsTransfered : (data) => {
            console.log("Funds transfer successfull");
            console.log(`Exit hash on chainId ${data.toChainId} is ${data.exitHash}`);
          }
        });
        await instaExit.init();
        signer = ethersProvider.getSigner();
        setInstaExit(instaExit);
      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    init();
  }, []);

  const onFromChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]
    setFromChain(selectedNetwork);
    dispatch(updateSelectedFromChain(selectedNetwork));

    if(instaExit && selectedNetwork.chainId) {
      let tokenList = instaExit.getSupportedTokens(selectedNetwork.chainId);
      if(tokenList) {
        console.log("dispatching updateSupportedTokens")
        dispatch(updateSupportedTokensAndSelectedToken(tokenList));

      } else {
        showErrorMessage(`Unable to get supported token list for network id ${selectedNetwork.chainId} `)
      }
    }
  }

  const onToChainSelected = (event) => {
    let selectedNetwork = config.chainIdMap[event.target.value]
    setToChain(selectedNetwork);
    dispatch(updateSelectedToChain(selectedNetwork));
  }

  const handleTokenAmount = (event) => {
    let amount = event.target.value;
    if(amount !== undefined && amount.toString) {
      setTokenAmount(amount.toString());
      dispatch(updateTokenAmount(amount));      
    } else {
      showErrorMessage("Please enter valid amount");
    }
  }

  const onTransfer = async () => {
    showInfoMessage("Initiaiting Transfer ...");
    let amount = BigNumber.from(selectedTokenAmount);
    let fromChainId = selectedFromChain.chainId;
    let toChainId = selectedToChain.chainId;

    let tokenDecimals = await instaExit.getERC20TokenDecimals(selectedToken.address);

    amount = amount.mul(BigNumber.from(10).pow(tokenDecimals));
    
    console.log("Total amount to  be transfered: ", amount.toString())

    showInfoMessage("Checking available liquidity ...");
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
          showInfoMessage("Checking approvals ...");
          deposit({
            sender: await signer.getAddress(),
            receiver: await signer.getAddress(),
            tokenAddress: selectedToken.address,
            depositContractAddress: transferStatus.depositContract,
            amount: amount.toString(),
            fromChainId: fromChainId,
            toChainId: toChainId,
          });

        } catch(error) {
          if(error && error.code == RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
            showInfoMessage(`Approval not found for ${selectedTokenAmount} ${selectedToken.tokenSymbol}`);
            let approveTx = await instaExit.approveERC20(selectedToken.address, transferStatus.depositContract, amount.toString());
            showInfoMessage(`Waiting for transaction confirmation ...`);
            await approveTx.wait(1);
            showSuccessMessage("Approval transaction confirmed.");
            showInfoMessage("Initiating deposit transaction ...");
            deposit({
              sender: await signer.getAddress(),
              receiver: await signer.getAddress(),
              tokenAddress: selectedToken.address,
              depositContractAddress: transferStatus.depositContract,
              amount: amount.toString(),
              fromChainId: fromChainId,
              toChainId: toChainId,
            });

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
  }

  const deposit = async (depositRequest) => {
    let depositResponse = await instaExit.deposit(depositRequest);
    console.log(depositResponse);
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

  return (
    <div className="App">
      <section className={classes.mainContainer}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <div className={classes.cardRow}>
              <FormControl variant="outlined" size="small" className={classes.formControl}>
                {/* <InputLabel id="select-from-chain-label">Select From Chain</InputLabel> */}
                <Select
                  labelId="select-from-chain-label"
                  id="from-chain-select"
                  value={fromChain.chainId}
                  onChange={onFromChainSelected}
                >
                  {fromChainList && fromChainList.map((chain, index) =>
                    <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`}>{chain.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <ArrowForwardIcon />
              <FormControl variant="outlined" size="small" className={classes.formControl}>
                {/* <InputLabel id="select-to-chain-label">Select To Chain</InputLabel> */}
                <Select
                  labelId="select-to-chain-label"
                  id="to-chain-select"
                  value={toChain.chainId}
                  onChange={onToChainSelected}
                >
                  {toChainList && toChainList.map((chain, index) =>
                    <MenuItem value={chain.chainId} key={`${chain.chainId}${index}`}>{chain.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
            <div className={classes.cardRow}>

            </div>
            <div className={classes.cardRow}>
              {/* <FormControl variant="outlined" size="small" className={classes.formControl}> */}
                <TextField id="token-amount" size="small" label="Amount" 
                  variant="outlined" className={classes.formControl} type="number"
                  value={tokenAmount}
                  style={{ flexGrow: 1 }} onChange={handleTokenAmount}/>
                <TokenListContainer instaExit={instaExit} 
                  toChainId={selectedToChain.chainId} fromChainId={selectedFromChain.chainId} />
              {/* </FormControl> */}
            </div>

            <div className={classes.cardRow}>
              <FormControl variant="standard" size="small" className={classes.formControl}>
                <Button onClick={onTransfer} variant="contained" color="secondary">Transfer</Button>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      </section>
      <NotificationContainer />
    </div>
  );
}

export default App;
