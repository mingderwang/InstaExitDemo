import { UPDATE_SELECTED_FROM_CHAIN, UPDATE_SELECTED_TO_CHAIN } from './networkTypes'

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