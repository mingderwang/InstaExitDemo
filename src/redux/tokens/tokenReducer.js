import {
  UPDATE_SUPPORTED_TOKENS,
  SET_SELECTED_TOKEN,
  SET_TOKEN_AMOUNT,
  SET_SELECTED_TOKEN_BALANCE
} from './tokenTypes'

const defaultTokenSymbol = 'USDC';

const initialState = {
  tokenList: [],
  tokenMap: {},
  selectedToken: {
    tokenSymbol: defaultTokenSymbol
  },
  selectedTokenBalance: undefined,
  tokenAmount: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SUPPORTED_TOKENS:
      let tokenMap = {};
      let tokenList = action.payload.tokenList;
      for(let index = 0; index < tokenList.length; index++) {
          let token = tokenList[index];
          tokenMap[token.tokenSymbol] = token;
      }
      if(!state.selectedToken.address) {
        return {
          ...state,
          selectedToken: tokenMap[defaultTokenSymbol],
          tokenList,
          tokenMap
        }
      } else {
        return {
          ...state,
          tokenList,
          tokenMap
        }
      }
    case SET_SELECTED_TOKEN:
      return {
        ...state,
        selectedToken: action.payload.token
      }
    case SET_TOKEN_AMOUNT:
      return {
        ...state,
        tokenAmount: action.payload.amount
      }
    case SET_SELECTED_TOKEN_BALANCE:
      return {
        ...state,
        selectedTokenBalance: action.payload.balance
      }
    default: return state
  }
}

export default reducer