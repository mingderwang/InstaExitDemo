import { config } from "./config";

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function getFixedDecimalPoint(tokenSymbol, chainId, defaultValue = 2) {
    let tokenMap = config.tokensMap[tokenSymbol];
    if(tokenMap && tokenMap[chainId]) {
        let tokenInfo = tokenMap[chainId];
        return tokenInfo.fixedDecimalPoint || defaultValue;
    }
    return defaultValue;
}

export {
    toFixed,
    getFixedDecimalPoint
}