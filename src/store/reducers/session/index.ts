import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
  return {
    token: null
  };
}

const SessionReducer = (state: any = getInitialState(), action: any) =>
  produce((state, draft) => {
    const { payload } = action;
    console.log('payload', payload)
    switch (action.type) {
      case actionTypes.SET_TOKEN_ACTION: {
        draft.token = payload;
        break;
      }
    }
  });

export default SessionReducer;
