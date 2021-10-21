import {SIGN_IN, SIGN_UP, AUTO_SIGN_IN} from '../types';

import axios from 'axios';
import {auth, URL} from '../../utils/misc';

// firebase에 토큰이 존재하면 자동로그인 하는 요청을 보내는 request와 action type을 반환하는 함수
export const autoSignIn = () => {
  const request = axios({
    method: 'GET',
    url: `${URL}user/hi`,
  })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      console.log(error);
      return false;
    });

  return {
    type: AUTO_SIGN_IN,
    payload: request,
  };
};

// firebase에 SIGNIN 요청과 action type을 반환하는 함수
export function signIn(data) {
  // console.log(data);
  const request = axios({
    method: 'POST',
    url: `${URL}user/login`,
    data: {
      userId: data.email,
      userPwd: data.password,
    },
    header: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      console.log(error);
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
    url: `${URL}user/signup`,
    data: {
      userName: data.name,
      userId: data.email,
      userPwd: data.password,
    },
    header: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      alert('에러 발생');
      console.log(error);
      return false;
    });

  return {
    type: SIGN_UP,
    payload: {userId: data.email, userName: data.name},
  };
}
