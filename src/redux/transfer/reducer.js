import _ from "lodash"

import {
  UPDATE_TRANSFER_STATE,
  UPDATE_TRANSFER_STATUS,
  UPDATE_TRANSFER_STEPS_LABEL_ARRAY,
  UPDATE_TRANSFER_STEPS_CONTENT_ARRAY,
  UPDATE_CURRENT_STATE
} from './types';

import { transferStepsLabelArray, transferStepsContentArray } from '../../config/transferConfig';

const initialState = {
  fromChaindId: undefined,
  toChainId: undefined,
  tokenAddress: undefined,
  tokenAmount: undefined,
  tokenDecimals: undefined,
  tokenSymbol: undefined,
  estimatedTransferTime: undefined,
  transferState: {},
  transferActivityStatus: "", // Overall status of the Transfer to be shown on TransferActivity Modal Window
  currentState: undefined,
  currentStep: 0,
  lpFee: undefined,
  minRecieved: undefined,
  recievedAmount: undefined,
  recievedTokenAddress: undefined,
  recieverAddress: undefined,
  transactionFee: undefined,
  transactionFeeCurrency: undefined,
  transferStepsLabelArray: transferStepsLabelArray,
  transferStepsContentArray: transferStepsContentArray,
  savingAmount: undefined,
  showTransferDetailsModal: false,
  transferHash: undefined,
  startTime: undefined,
  endTime: undefined
}

const reducer = (state = initialState, action) => {
  let localState = state;
  let localTransferStepsLabelArray = [...state.transferStepsLabelArray];
  let localTransferStepsContentArray = [...state.transferStepsContentArray];

  switch (action.type) {
    case UPDATE_TRANSFER_STATE:

      let keys = Object.keys(action.payload);
      for(let index=0; index < keys.length; index++) {
        localState[keys[index]] = action.payload[keys[index]];
      }
      return localState;
    case UPDATE_TRANSFER_STATUS:
      localState.transferState[action.payload.stateName] = action.payload.state;
      return localState;
    case UPDATE_TRANSFER_STEPS_LABEL_ARRAY:
      localTransferStepsLabelArray[action.payload.index] = action.payload.value;
      return {
        ...state,
        transferStepsLabelArray: localTransferStepsLabelArray
      }
    case UPDATE_TRANSFER_STEPS_CONTENT_ARRAY:
      localTransferStepsContentArray[action.payload.index] = action.payload.value;
      return {
        ...state,
        transferStepsContentArray: localTransferStepsContentArray
      }
    case UPDATE_CURRENT_STATE:
      return {
        ...state,
        currentState: action.payload
      }
    default: return state
  }
}

export default reducer