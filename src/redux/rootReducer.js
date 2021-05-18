import { combineReducers } from 'redux'

import tokenReducer from "./tokens/tokenReducer";
import networkReducer from "./network/networkReducer";
import transactionReducer from "./transaction/transactionReducer";

const rootReducer = combineReducers({
  tokens: tokenReducer,
  network: networkReducer,
  transaction: transactionReducer
})

export default rootReducer