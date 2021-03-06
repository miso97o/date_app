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
        // roomId: action.payload.roomId || false,
      };
    case SIGN_UP:
      return {
        ...state,
        auth: {
          userId: action.payload.userId || false,
          userName: action.payload.userName || false,
        },
      };
    case AUTO_SIGN_IN:
      return {
        ...state,
        auth: {
          userId: action.payload.userId || false,
          userName: action.payload.userName || false,
        },
        // roomId: action.payload.roomId || false,
      };
    default:
      return state;
  }
}
