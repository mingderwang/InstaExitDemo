import {
    UPDATE_TRANSACTION_FEE,
    UPDATE_APPROVE_BUTTON_STATE,
    UPDATE_TRANSFER_BUTTON_STATE,
    UPDATE_ESTIMATED_AMOUNT_TO_GET
} from './transactionTypes'

const initialState = {
    transactionFee: "",
    tokenCurrency: "",
    estimatedAmountToGet: 0,
    approveButtonEnabled: false,
    approveButtonVisible: false,
    approveButtonText: "Approve",
    transferButtonEnabled: false,
    transferButtonText: "Please connect your wallet"
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TRANSACTION_FEE:
            return {
                ...state,
                transactionFee: action.payload.transactionFee,
                tokenCurrency: action.payload.tokenCurrency
            }
        case UPDATE_TRANSFER_BUTTON_STATE:
            return {
                ...state,
                transferButtonEnabled: action.payload.enabled,
                transferButtonText: action.payload.text ? action.payload.text : state.transferButtonText
            }
        case UPDATE_APPROVE_BUTTON_STATE:
            return {
                ...state,
                approveButtonEnabled: action.payload.enabled,
                approveButtonVisible: action.payload.visible,
                approveButtonText: action.payload.text ? action.payload.text : state.approveButtonText
            }
        case UPDATE_ESTIMATED_AMOUNT_TO_GET:
            return {
                ...state,
                estimatedAmountToGet: action.payload
            }
        default: return state
    }
}

export default reducer