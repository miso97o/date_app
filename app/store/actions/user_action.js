import {SIGN_IN, SIGN_UP, AUTO_SIGN_IN} from '../types';

import axios from 'axios';
import {SIGNUP, SIGNIN, REFRESH} from '../../utils/misc';

// firebase에 토큰이 존재하면 자동로그인 하는 요청을 보내는 request와 action type을 반환하는 함수
export const autoSignIn = (refToken) => {
  const request = axios({
    method: 'POST',
    url: REFRESH,
    data: 'grant_type=refresh_token&refresh_token=' + refToken,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      return false;
    });

  return {
    type: AUTO_SIGN_IN,
    payload: request,
  };
};

// firebase에 SIGNIN 요청과 action type을 반환하는 함수
export function signIn(data) {
  const request = axios({
    method: 'POST',
    url: SIGNIN,
    data: {
      email: data.email,
      password: data.password,
      returnSecureToken: true,
    },
    header: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      return false;
    });

  return {
    type: SIGN_IN,
    payload: request,
  };
}

// firebase에 SIGNUP요청을 보내는 request와 action type을 반환하는 함수
export function signUp(data) {
  const request = axios({
    method: 'POST',
    url: SIGNUP,
    data: {
      email: data.email,
      password: data.password,
      returnSecureToken: true,
    },
    header: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      return false;
    });

  return {
    type: SIGN_UP,
    payload: request,
  };
}
