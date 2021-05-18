let config = {};

let chains = {
    MUMBAI: { 
        name: "Mumbai",
        subText: "Polygon testnet",
        chainId: 80001,
        rpcUrl: "https://rpc-mumbai.matic.today",
        currency: "Test MATIC",
        nativeFaucetURL: "https://faucet.matic.network/"
    },
    GOERLI: { 
        name: "Goerli",
        subText: "Ethereum testnet",
        chainId: 5,
        rpcUrl: "https://goerli.infura.io/v3/d126f392798444609246423b06116c77",
        currency: "Goerli ETH",
        nativeFaucetURL: "https://faucet.goerli.mudit.blog/"
    }
}

config.chains = chains;

config.chainIdMap = {
    80001: chains.MUMBAI,
    5: chains.GOERLI
}

config.faucet = {
    80001 : {
        address: "0xad5b33d6Da375e4728e9e11756bD7ea704D1A9B3",
        abi: [ { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getDecimal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
    },
    5 : {
        address: "0xDF006f47De9E70942F82742aE41d7d176A532bc4",
        abi: [ { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getDecimal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "forwarder", "type": "address" } ], "name": "isTrustedForwarder", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "versionRecipient", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
    }
}

config.abi = {
    erc20: [ { "inputs": [ { "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" } ]
}

config.tokensMap = {
    "USDT" : {
        80001: {
            address: "0xeaBc4b91d9375796AA4F69cC764A4aB509080A58",
            transferOverhead: 86147,
            decimal: 18
        },
        5: {
            address: "0x64ef393b6846114bad71e2cb2ccc3e10736b5716",
            transferOverhead: 102866,
            decimal: 18
        }
    },
    "USDC" : {
        80001: {
            address: "0xdA5289fCAAF71d52a80A254da614a192b693e977",
            transferOverhead: 86099,
            decimal: 6
        },
        5: {
            address: "0xb5B640E6414b6DeF4FC9B3C1EeF373925effeCcF",
            transferOverhead: 97512,
            decimal: 6
        }
    },
    "DAI" : {
        80001: {
            address: "0x27a44456bEDb94DbD59D0f0A14fE977c777fC5C3",
            transferOverhead: 86147,
            decimal: 18
        },
        5: {
            address: "0x2686eca13186766760a0347ee8eeb5a88710e11b",
            transferOverhead: 91079,
            decimal: 18
        }
    },

}

config.changeRPCPayload = {
    80001: {
        chainId: '0x13881',
        chainName: 'Mumbai',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [chains.MUMBAI.rpcUrl],
        blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    }
}

config.hyphen = {
    baseURL : "https://hyphen-test-api.biconomy.io",
    getTokenGasPricePath : "/api/v1/insta-exit/get-token-price"
}

module.exports = { config }
