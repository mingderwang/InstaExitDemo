import {
    UPDATE_TRANSFER_STATE,
    UPDATE_TRANSFER_STATUS,
    UPDATE_TRANSFER_STEPS_LABEL_ARRAY,
    UPDATE_CURRENT_STATE,
    UPDATE_TRANSFER_STEPS_CONTENT_ARRAY
  } from './types';


export const updateTransferState = (state) => {
    return {
        type: UPDATE_TRANSFER_STATE,
        payload: state
    }
}

export const updateTransferStatus = (stateName, state) => {
    return {
        type: UPDATE_TRANSFER_STATUS,
        payload: {
            stateName,
            state
        }
    }
}

export const updateTransferStepsLabelArray = (index, value) => {
    return {
        type: UPDATE_TRANSFER_STEPS_LABEL_ARRAY,
        payload: { index, value }
    }
}

export const updateTransferStepsContentArray = (index, value) => {
    return {
        type: UPDATE_TRANSFER_STEPS_CONTENT_ARRAY,
        payload: { index, value }
    }
}

export const updateCurrentState = (currentState) => {
    return {
        type: UPDATE_CURRENT_STATE,
        payload: currentState
    }
}