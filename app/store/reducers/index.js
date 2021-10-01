import {combineReducers} from 'redux';
import User from './user_reducer';
import Diaries from './diary_reducer';
import Chat from './chat_reducer';

// 구현한 reducer들을 묶어놓음
const rootReducer = combineReducers({
  User,
  Diaries,
  Chat,
});

export default rootReducer;
