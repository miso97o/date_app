export const APIKEY = 'AIzaSyBwLWHUNQir-HoAGjtYe6eB8SgDpJL3CJg';
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`;
import AsyncStorage from '@react-native-async-storage/async-storage';

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
