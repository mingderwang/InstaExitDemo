import { UPDATE_SUPPORTED_TOKENS, SET_SELECTED_TOKEN, 
  SET_TOKEN_AMOUNT, SET_SELECTED_TOKEN_BALANCE,
  SET_MIN_DEPOSIT, SET_MAX_DEPOSIT } from './tokenTypes'

export const updateMinDeposit = (minDepositAmount) => {
  return {
    type: SET_MIN_DEPOSIT,
    payload: {
      minDepositAmount: minDepositAmount
    }
  }
}

export const updateMaxDeposit = (maxDepositAmount) => {
  return {
    type: SET_MAX_DEPOSIT,
    payload: {
      maxDepositAmount: maxDepositAmount
    }
  }
}


export const updateSupportedTokens = (tokenList) => {
  return {
    type: UPDATE_SUPPORTED_TOKENS,
    payload: {
        tokenList: tokenList
    }
  }
}

export const updateSupportedTokensAndSelectedToken = (tokenList) => {
  return (dispatch, getState) => {
    dispatch(updateSupportedTokens(tokenList));
    let state = getState();
    let previousSelectedToken = state.tokens.selectedToken;
    let tokenMap = state.tokens.tokenMap;
    if(tokenMap && tokenMap[previousSelectedToken.tokenSymbol]) {
        dispatch(updateSelectedToken(tokenMap[previousSelectedToken.tokenSymbol]));
    } else {
        console.error("Token Map is not initialised properly");
    }
  }
}

export const updateSelectedToken = (token) => {
  return {
    type: SET_SELECTED_TOKEN,
    payload: {
        token: token
    }
  }
}

export const updateSelectedTokenBalance = (balance, rawBalance, displayBalance) => {
  return {
    type: SET_SELECTED_TOKEN_BALANCE,
    payload: {
      balance: balance,
      rawBalance,
      displayBalance
    }
  }
}


export const updateTokenAmount = (amount) => {
  console.log("Updating token amount using dispatch ", amount);
  return {
    type: SET_TOKEN_AMOUNT,
    payload: {
      amount: amount
    }
  }
}