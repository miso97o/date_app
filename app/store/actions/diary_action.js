import {GET_DIARIES} from '../types';

import axios from 'axios';

// 서버에 저장된 다이어리 데이터를 가져오는 함수 payload에 데이터를 담음
export function getDiaries() {
  const request = axios({
    method: 'GET',
    url: 'https://rn-learn-app-dcbba-default-rtdb.asia-southeast1.firebasedatabase.app/diary.json',
  })
    .then((response) => {
      const diaryData = [];
      for (let key in response.data) {
        if (response.data[key]) {
          diaryData.push({
            ...response.data[key],
          });
        }
      }
      return diaryData;
    })
    .catch((err) => {
      alert('Get Faild!!');
      return false;
    });
  return {
    type: GET_DIARIES,
    payload: request,
  };
}
