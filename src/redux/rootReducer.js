import { combineReducers } from 'redux'

import tokenReducer from "./tokens/tokenReducer";
import networkReducer from "./network/networkReducer";
import transactionReducer from "./transaction/transactionReducer";
import transferReducer from './transfer/reducer';

const rootReducer = combineReducers({
  tokens: tokenReducer,
  network: networkReducer,
  transaction: transactionReducer,
  transfer: transferReducer
})

export default rootReducer