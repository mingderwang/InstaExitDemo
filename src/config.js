let config = {};

let chains = {
    MUMBAI: { name: "Mumbai", chainId: 80001 },
    GOERLI: { name: "Goerli", chainId: 5 }
}

config.chains = chains;

config.chainIdMap = {
    80001: chains.MUMBAI,
    5: chains.GOERLI
}
module.exports = { config }
