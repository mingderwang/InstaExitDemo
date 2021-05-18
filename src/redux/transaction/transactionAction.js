import { UPDATE_TRANSACTION_FEE } from './transactionTypes'

export const updateTransactionFee = (transactionFee, tokenCurrency) => {
    return {
        type: UPDATE_TRANSACTION_FEE,
        payload: {
            transactionFee: transactionFee,
            tokenCurrency: tokenCurrency
        }
    }
}