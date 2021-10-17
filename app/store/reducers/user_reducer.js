import {SIGN_IN, SIGN_UP, AUTO_SIGN_IN} from '../types';

export default function (state = {}, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        auth: {
          userId: action.payload.userId || false,
          userName: action.payload.userName || false,
        },
        //   token: action.payload.idToken || false,
        //   refToken: action.payload.refreshToken || false,
        // },
      };
    case SIGN_UP:
      return {
        ...state,
      };
    case AUTO_SIGN_IN:
      return {
        ...state,
        auth: {
          userId: action.payload.userId || false,
          userName: action.payload.userName || false,
        },
      };
    default:
      return state;
  }
}
