import { combineReducers } from 'redux'

import tokenReducer from "./tokens/tokenReducer";
import networkReducer from "./network/networkReducer";

const rootReducer = combineReducers({
  tokens: tokenReducer,
  network: networkReducer
})

export default rootReducer