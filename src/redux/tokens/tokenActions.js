import { UPDATE_SUPPORTED_TOKENS, SET_SELECTED_TOKEN, 
  SET_TOKEN_AMOUNT, SET_SELECTED_TOKEN_BALANCE } from './tokenTypes'

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

export const updateSelectedTokenBalance = (balance) => {
  return {
    type: SET_SELECTED_TOKEN_BALANCE,
    payload: {
      balance: balance
    }
  }
}


export const updateTokenAmount = (amount) => {
  return {
    type: SET_TOKEN_AMOUNT,
    payload: {
      amount: amount
    }
  }
}