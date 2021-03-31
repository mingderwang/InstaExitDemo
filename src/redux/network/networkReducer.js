import {config} from "../../config";

import {
    UPDATE_SELECTED_FROM_CHAIN,
    UPDATE_SELECTED_TO_CHAIN,
    UPDATE_SWITCH_NETWORK_TEXT, 
    TOGGLE_SWITCH_NETWORK_DISPALY
  } from './networkTypes'
  
  const initialState = {
    selectedFromChain: config.chains.MUMBAI,
    selectedToChain: config.chains.GOERLI,
    switchNetworkText: "Switch to Mumbai",
    showSwitchNetworkButton: false
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
      case UPDATE_SWITCH_NETWORK_TEXT:
        return {
          ...state,
          switchNetworkText: action.payload.text
        }
      case TOGGLE_SWITCH_NETWORK_DISPALY:
        return {
          ...state,
          showSwitchNetworkButton: action.payload.open
        }
      default: return state
    }
  }
  
  export default reducer