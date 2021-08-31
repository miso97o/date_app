import {GET_DIARIES} from '../types';

import axios from 'axios';
import {auth, data, database} from '../../utils/misc';

// 로그인이 되어있다면 user값에 firebase에서 제공하는 로그인정보가 들어감
export function getDiaries(User) {
  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     console.warn('user id is..', user);
  //   } else {
  //     console.warn('not logged in');
  //   }
  // });

  return (dispatch) => {
    const url = `diary/${User.auth.userId}`;
    // value는 event type, 참조하는 경로에 저장된 데이터가 있다면 트리거됨 callback 함수인 dataSnapShot의 val에 그 데이터가 담김, 비어있다면 null 반환
    database.ref(url).on('value', (dataSnapShot) => {
      const diaryData = [];
      for (let key in dataSnapShot.val()) {
        if (dataSnapShot.val()[key]) {
          diaryData.push({...dataSnapShot.val()[key]});
        }
      }
      dispatch({type: GET_DIARIES, payload: diaryData});
    });
  };
}
