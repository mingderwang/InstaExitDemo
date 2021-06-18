import { UPDATE_TRANSACTION_FEE, UPDATE_TRANSFER_BUTTON_STATE, 
    UPDATE_APPROVE_BUTTON_STATE } from './transactionTypes'

export const updateTransactionFee = (transactionFee, tokenCurrency) => {
    return {
        type: UPDATE_TRANSACTION_FEE,
        payload: {
            transactionFee: transactionFee,
            tokenCurrency: tokenCurrency
        }
    }
}

export const updateApproveButtonState = (enabled, visible, text) => {
    return {
        type: UPDATE_APPROVE_BUTTON_STATE,
        payload: {
            enabled,
            visible,
            text
        }
    }
}

export const updateTransferButtonState = (enabled, text) => {
    return {
        type: UPDATE_TRANSFER_BUTTON_STATE,
        payload: {
            enabled,
            text
        }
    }
}