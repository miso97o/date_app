// 앱을 실행시켜주는 엔트리 파일
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './app/index';
import {name as appName} from './app.json';

import {createStore, applyMiddleware, compose} from 'redux';
// createStore는 스토어 생성, applyMiddleware는 미들웨어를 사용하기위해 필요.
// compose는 여러 스토어 enhancer를 조율해주는 함수
import {Provider} from 'react-redux';
// Provider는 리덕스 스토어를 리액트 네이티브 컴포넌트로 패싱해주기 위해 사용
import promiseMiddleware from 'redux-promise';
// 비동기처리가 필요한 액션 크리에이터 사용을 위해 필요
import reducers from './app/store/reducers';
import thunkMiddleware from 'redux-thunk';

// 리덕스 개발자 도구와 미들웨어를 같이 사용하기위해 필요
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreWithMiddleWare = createStore(
  reducers,
  composeEnhancers(applyMiddleware(promiseMiddleware, thunkMiddleware)),
);

// store를 props로 갖게하는 Provider로 App을 감싸서 리액트 네이티브 컴포넌트에 사용한 store를 알려줌
const appRedux = () => (
  <Provider store={createStoreWithMiddleWare}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => appRedux);
