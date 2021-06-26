import {config} from "../../config";

import {
    UPDATE_SELECTED_FROM_CHAIN,
    UPDATE_SELECTED_TO_CHAIN,
    UPDATE_SWITCH_NETWORK_TEXT, 
    TOGGLE_SWITCH_NETWORK_DISPALY,
    UPDATE_LP_MANAGER_ADDRESSES,
    UPDATE_FROM_CHAIN_PROVIDER,
    UPDATE_TO_CHAIN_PROVIDER
  } from './networkTypes'
  
  const initialState = {
    selectedFromChain: config.supportedChainArrray[0],
    selectedToChain: config.supportedChainArrray[1],
    switchNetworkText: "Switch to Matic",
    showSwitchNetworkButton: false,
    fromLPManagerAddress: undefined,
    toLPManagerAddress: undefined,
    fromChainProvider: undefined,
    toChainProvider: undefined
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
      case UPDATE_LP_MANAGER_ADDRESSES:
        return {
          ...state,
          fromLPManagerAddress: action.payload.fromLPManagerAddress,
          toLPManagerAddress: action.payload.toLPManagerAddress
        }
      case UPDATE_TO_CHAIN_PROVIDER:
        return {
          ...state,
          toChainProvider: action.payload
        }
      case UPDATE_FROM_CHAIN_PROVIDER:
        return {
          ...state,
          fromChainProvider: action.payload
        }
      default: return state
    }
  }
  
  export default reducer