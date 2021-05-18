import {
    UPDATE_TRANSACTION_FEE
} from './transactionTypes'

const initialState = {
    transactionFee: "8.9",
    tokenCurrency: "USDC"
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TRANSACTION_FEE:
            return {
                ...state,
                transactionFee: action.payload.transactionFee,
                tokenCurrency: action.payload.tokenCurrency
            }
        default: return state
    }
}

export default reducer