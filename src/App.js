import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { ethers } from "ethers";
import abi from "ethereumjs-abi";
// import {EthUtil} from "ethereumjs-util";
import { InstaExit } from "@biconomy/inex";
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Box } from "@material-ui/core";
let sigUtil = require("eth-sig-util");
var EthUtil = require('ethereumjs-util');
const { config } = require("./config");
const EIP712_SIGN = "EIP712_SIGN";
const PERSONAL_SIGN = "PERSONAL_SIGN";

let instaExit ;
let ethersProvider, signer;
let contract, contractInterface, contractWithBasicSign;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  link: {
    marginLeft: "5px"
  }
}));

function App() {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  const [quote, setQuote] = useState("This is a default quote");
  const [owner, setOwner] = useState("Default Owner Address");
  const [newQuote, setNewQuote] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [metaTxEnabled, setMetaTxEnabled] = useState(true);
  const [transactionHash, setTransactionHash] = useState("");

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
          instaExit = new InstaExit(provider, {fromChainId: 5, toChainId: 80001} );
          signer = ethersProvider.getSigner();
         
      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    init();
  }, []);

  const onQuoteChange = event => {
    setNewQuote(event.target.value);
  };

  const generateTxId = async (event) => {
    let data = {
        sender : "0xF86B30C63E068dBB6bdDEa6fe76bf92F194Dc53c",
        tokenAddress : "0x455025322EfA1f7648eB9683B68b54c88265B95B",
        amount : "1000000000000000000", 
        fromChainId : "5", 
        toChainId : "80001" 
    }

    // let idStatus = await instaExit.generateTxId(data, signer, "PERSONAL_SIGN");
    let idStatus = await instaExit.generateTxId(data, signer, "EIP712_SIGN");
    console.log(idStatus);
  }

  // const onSubmitWithEIP712Sign = async event => {
  //   if (newQuote != "" && contract) {
  //     setTransactionHash("");
  //     if (metaTxEnabled) {
  //       let userAddress = selectedAddress;
  //       let nonce = await contract.getNonce(userAddress);
  //       let functionSignature = contractInterface.encodeFunctionData("setQuote", [newQuote]);
  //       let message = {};
  //       message.nonce = parseInt(nonce);
  //       message.from = userAddress;
  //       message.functionSignature = functionSignature;

  //       const dataToSign = JSON.stringify({
  //         types: {
  //           EIP712Domain: domainType,
  //           MetaTransaction: metaTransactionType
  //         },
  //         domain: domainData,
  //         primaryType: "MetaTransaction",
  //         message: message
  //       });
  //       let signature = await ethersProvider.send("eth_signTypedData_v4", [userAddress, dataToSign])
  //       let { r, s, v } = getSignatureParameters(signature);
  //       sendSignedTransaction(userAddress, functionSignature, r, s, v, EIP712_SIGN);
  //     } else {
  //       console.log("Sending normal transaction");
  //       let tx = await contract.setQuote(newQuote);
  //       console.log("Transaction hash : ", tx.hash);
  //       showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
  //       let confirmation = await tx.wait();
  //       console.log(confirmation);
  //       setTransactionHash(tx.hash);

  //       showSuccessMessage("Transaction confirmed on chain");
  //       getQuoteFromNetwork();
  //     }
  //   } else {
  //     showErrorMessage("Please enter the quote");
  //   }
  // };

  // const onSubmitWithPersonalSign = async event => {
  //   if (newQuote != "" && contractWithBasicSign && signer) {
  //     setTransactionHash("");
  //     if (metaTxEnabled) {
  //       let userAddress = selectedAddress;
  //       let nonce = await contractWithBasicSign.getNonce(userAddress);
  //       let functionSignature = contractInterface.encodeFunctionData("setQuote", [newQuote]);
  //       let messageToSign = abi.soliditySHA3(
  //           ["uint256","address","uint256","bytes"],
  //           [parseInt(nonce), config.contractWithBasicSign.address, chainId, toBuffer(functionSignature)]
  //       );
  //       const signature = await signer.signMessage(messageToSign);
  //       let { r, s, v } = getSignatureParameters(signature);
  //       sendSignedTransaction(userAddress, functionSignature, r, s, v, PERSONAL_SIGN);
  //     } else {
  //       console.log("Sending normal transaction");
  //       let tx = await contractWithBasicSign.setQuote(newQuote);
  //       console.log("Transaction hash : ", tx.hash);
  //       showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
  //       let confirmation = await tx.wait();
  //       console.log(confirmation);
  //       setTransactionHash(tx.hash);

  //       showSuccessMessage("Transaction confirmed on chain");
  //       getQuoteFromNetwork();
  //     }
  //   } else {
  //     showErrorMessage("Please enter the quote or check contract and signer object");
  //   }
  // };

  // const getSignatureParameters = signature => {
  //   if (!ethers.utils.isHexString(signature)) {
  //     throw new Error(
  //       'Given value "'.concat(signature, '" is not a valid hex string.')
  //     );
  //   }
  //   var r = signature.slice(0, 66);
  //   var s = "0x".concat(signature.slice(66, 130));
  //   var v = "0x".concat(signature.slice(130, 132));
  //   v = ethers.BigNumber.from(v).toNumber();
  //   if (![27, 28].includes(v)) v += 27;
  //   return {
  //     r: r,
  //     s: s,
  //     v: v
  //   };
  // };

  // const getQuoteFromNetwork = async (signType) => {
  //   if (contract) {
  //     let result;
  //     if(signType == PERSONAL_SIGN) {
  //       result = await contractWithBasicSign.getQuote();
  //     } else {
  //       result = await contract.getQuote();
  //     }
  //     if (
  //       result &&
  //       result.currentQuote != undefined &&
  //       result.currentOwner != undefined
  //     ) {
  //       if (result.currentQuote == "") {
  //         showErrorMessage("No quotes set on blockchain yet");
  //       } else {
  //         setQuote(result.currentQuote);
  //         setOwner(result.currentOwner);
  //       }
  //     } else {
  //       showErrorMessage("Not able to get quote information from Network");
  //     }
  //   }
  // };

  const showErrorMessage = message => {
    NotificationManager.error(message, "Error", 5000);
  };

  const showSuccessMessage = message => {
    NotificationManager.success(message, "Message", 3000);
  };

  const showInfoMessage = message => {
    NotificationManager.info(message, "Info", 3000);
  };

  // const sendSignedTransaction = async (userAddress, functionData, r, s, v, signType) => {
  //   if (contract) {
  //     try {
  //       let tx;
  //       if(signType == PERSONAL_SIGN) {
  //         tx = await contractWithBasicSign.executeMetaTransaction(userAddress, functionData, r, s, v);
  //       } else {
  //         tx = await contract.executeMetaTransaction(userAddress, functionData, r, s, v);
  //       }
  //       console.log("Transaction hash : ", tx.hash);
  //       showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
  //       let confirmation = await tx.wait();
  //       console.log(confirmation);
  //       setTransactionHash(tx.hash);

  //       showSuccessMessage("Transaction confirmed on chain");
  //       getQuoteFromNetwork(signType);

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  return (
    <div className="App">
      <section className="main">
        <div className="mb-wrap mb-style-2">
          <blockquote cite="http://www.gutenberg.org/ebboks/11">
            <p>{quote}</p>
          </blockquote>
        </div>

        <div className="mb-attribution">
          <p className="mb-author">{owner}</p>
          {selectedAddress.toLowerCase() === owner.toLowerCase() && (
            <cite className="owner">You are the owner of the quote</cite>
          )}
          {selectedAddress.toLowerCase() !== owner.toLowerCase() && (
            <cite>You are not the owner of the quote</cite>
          )}
        </div>
      </section>
      <section>
        {transactionHash !== "" && <Box className={classes.root} mt={2} p={2}>
          <Typography>
            Check your transaction hash
            <Link href={`https://kovan.etherscan.io/tx/${transactionHash}`} target="_blank"
            className={classes.link}>
              here
            </Link>
          </Typography>
        </Box>}
      </section>
      <section>
        <div className="submit-container">
          <div className="submit-row">
            <input
              type="text"
              placeholder="Enter your quote"
              onChange={onQuoteChange}
              value={newQuote}
            />
            <Button variant="contained" color="primary" onClick={generateTxId}>
              Generate id
            </Button>
            {/* <Button variant="contained" color="primary" onClick={onSubmitWithPersonalSign} style={{marginLeft: "10px"}}>
              Submit (Persoanl Sign)
            </Button> */}
          </div>
        </div>
      </section>
      <NotificationContainer />
    </div>
  );
}

export default App;
