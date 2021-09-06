export const APIKEY = 'AIzaSyBwLWHUNQir-HoAGjtYe6eB8SgDpJL3CJg'; //firebase에서 제공하는 apikey
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`;
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase';

//firebase API의 상세내용
const firebaseConfig = {
  apiKey: 'AIzaSyBwLWHUNQir-HoAGjtYe6eB8SgDpJL3CJg',
  authDomain: 'rn-learn-app-dcbba.firebaseapp.com',
  databaseURL:
    'https://rn-learn-app-dcbba-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'rn-learn-app-dcbba',
  storageBucket: 'rn-learn-app-dcbba.appspot.com',
  messagingSenderId: '923116090504',
  appId: '1:923116090504:web:4ccaeae00ea1cbfd761b3d',
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const database = firebase.database();
export const auth = firebase.auth();

// 로그인하면 그 정보에 대한 토큰을 로컬저장소에 저장
export const setTokens = async (values, callBack) => {
  const firstPair = ['@learn_app@userId', values.userId];
  const secondPair = ['@learn_app@token', values.token];
  const thirdPair = ['@learn_app@refToken', values.refToken];
  try {
    await AsyncStorage.multiSet([firstPair, secondPair, thirdPair]).then(
      (response) => {
        callBack();
      },
    );
  } catch (e) {
    //save error
  }
};

// 저장한 토큰을 가져옴
export const getTokens = async (callBack) => {
  let values;
  try {
    values = await AsyncStorage.multiGet([
      '@learn_app@userId',
      '@learn_app@token',
      '@learn_app@refToken',
    ]).then((values) => {
      callBack(values);
    });
  } catch (e) {
    // read error
  }

  // example console.log output:
  // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
};

export const removeTokens = async (callBack) => {
  try {
    await AsyncStorage.multiRemove([
      '@learn_app@userId',
      '@learn_app@token',
      '@learn_app@refToken',
    ]).then(() => {
      callBack();
    });
  } catch (e) {}
};
