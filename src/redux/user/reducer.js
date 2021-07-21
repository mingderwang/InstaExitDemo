import _ from "lodash"

import {
  UPDATE_USER_STATE
} from './types';

const initialState = {
  showUserDetails: false,
  userAddress: undefined
}

const reducer = (state = initialState, action) => {
  let localState = state;
  
  switch (action.type) {
    case UPDATE_USER_STATE:
      let keys = Object.keys(action.payload);
      if(keys) {
        for(let index=0; index < keys.length; index++) {
          localState[keys[index]] = action.payload[keys[index]];
        }
      }
      return localState;
    default: return state
  }
}

export default reducer