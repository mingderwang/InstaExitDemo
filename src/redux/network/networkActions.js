import { UPDATE_SELECTED_FROM_CHAIN, UPDATE_SELECTED_TO_CHAIN,
  UPDATE_SWITCH_NETWORK_TEXT, TOGGLE_SWITCH_NETWORK_DISPALY,
  UPDATE_LP_MANAGER_ADDRESSES, UPDATE_TO_CHAIN_PROVIDER,
  UPDATE_FROM_CHAIN_PROVIDER, 
  UPDATE_SELECTED_WALLET,
  UPDATE_NETWORK_STATE} from './networkTypes'

export const updateLPManagerAddresses = (fromLPManagerAddress, toLPManagerAddress) => {
  return {
    type: UPDATE_LP_MANAGER_ADDRESSES,
    payload: {
      fromLPManagerAddress,
      toLPManagerAddress
    }
  }
}

export const updateSelectedFromChain = (network) => {
  return {
    type: UPDATE_SELECTED_FROM_CHAIN,
    payload: {
        network: network
    }
  }
}

export const updateSelectedToChain = (network) => {
  return {
    type: UPDATE_SELECTED_TO_CHAIN,
    payload: {
        network: network
    }
  }
}

export const updateSwitchNetworkText = (text) => {
  return {
    type: UPDATE_SWITCH_NETWORK_TEXT,
    payload: {
        text: text
    }
  }
}

export const toggleSwitchNetworkDisplay = (open) => {
  return {
    type: TOGGLE_SWITCH_NETWORK_DISPALY,
    payload: {
        open: open
    }
  }
}

export const updateFromChainProvider = (provider) => {
  return {
    type: UPDATE_FROM_CHAIN_PROVIDER,
    payload: provider
  }
}

export const updateToChainProvider = (provider) => {
  return {
    type: UPDATE_TO_CHAIN_PROVIDER,
    payload: provider
  }
}

export const updateSelectedWallet = (wallet) => {
  return {
    type: UPDATE_SELECTED_WALLET,
    payload: wallet
  }
}

export const updateNetworkState = (currentState) => {
  return {
      type: UPDATE_NETWORK_STATE,
      payload: currentState
  }
}