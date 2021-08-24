import {SIGN_IN, SIGN_UP} from '../types';

export function signIn(data) {
  return {
    type: SIGN_IN,
    payload: {
      email: data.email,
      token: data.password,
    },
  };
}

export function signUp(data) {
  return {
    type: SIGN_UP,
    payload: {
      email: data.email,
      token: data.password,
    },
  };
}
