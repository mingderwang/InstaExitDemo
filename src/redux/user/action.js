import {
    UPDATE_USER_STATE
  } from './types';


export const updateUserState = (state) => {
    return {
        type: UPDATE_USER_STATE,
        payload: state
    }
}