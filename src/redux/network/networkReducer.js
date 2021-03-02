import {config} from "../../config";

import {
    UPDATE_SELECTED_FROM_CHAIN,
    UPDATE_SELECTED_TO_CHAIN
  } from './networkTypes'
  
  const initialState = {
    selectedFromChain: config.chains.MUMBAI,
    selectedToChain: config.chains.GOERLI
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_SELECTED_FROM_CHAIN:
        return {
          ...state,
          selectedFromChain: action.payload.network
        }
        case UPDATE_SELECTED_TO_CHAIN:
          return {
            ...state,
            selectedToChain: action.payload.network
          }
      default: return state
    }
  }
  
  export default reducer