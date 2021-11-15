import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {URL} from '../../utils/misc';

import {
  SEND_MESSAGE,
  RECIEVE_MESSAGE,
  GET_ROOMID,
  LEAVE_ROOM,
  CREATE_VOTE,
  COMPLETE_VOTE,
  GET_VOTE_STATE,
} from '../../store/types';
import axios from 'axios';

export var sock = new SockJS(`${URL}websocket-endpoint`);
export var ws = Stomp.over(sock);

// 안쓰는 함수
export const connection = (roomId, senderId) => {
  ws.connect({}, () => {
    ws.subscribe('/sub/chat/room/' + roomId, (msg) => {
      var recv = JSON.parse(msg.body);
      recieveMsg(recv);
    });
    ws.send(
      '/pub/chat/message',
      {},
      JSON.stringify({
        roomId: roomId,
        sender: senderId,
        message: '테스트',
        type: 'SYSTEM',
      }),
    ),
      (e) => alert('error', e);
  });
};

// 메세지 형식
// var message = {
//   sender: Boolean,
//   senderId: String (email 형식),
//   senderName: String,
//   txtMsg: String,
// };

export const sendMsg =
  ({roomId, senderId, txtMsg, senderName}) =>
  async (dispatch) => {
    ws.send(
      '/pub/chat/message',
      {},
      JSON.stringify({
        type: 'USER',
        roomId: roomId,
        senderId: senderId,
        message: txtMsg,
      }),
    );
    dispatch({
      type: SEND_MESSAGE,
      payload: {
        sender: true,
        senderId: senderId,
        txtMsg: txtMsg,
        senderName: senderName,
      },
    });
  };

export const recieveMsg = (recv) => async (dispatch) => {
  dispatch({type: RECIEVE_MESSAGE, payload: recv});
  console.log('recv log: ', recv);
};

export const getRoomId = (roomId, userId, userName) => async (dispatch) => {
  dispatch({type: GET_ROOMID, payload: {roomId, userId, userName}});
  console.log('store roomId');
};

export const leaveRoom = (roomId, userId) => async (dispatch) => {
  fetch(`${URL}chat/leaveRoom/${roomId}?userId=${userId}`).then(() => {
    console.log('leave room');
    dispatch({type: LEAVE_ROOM});
  });
};

export const createVote = (title, roomId) => async (dispatch) => {
  axios({
    method: 'POST',
    url: `${URL}chat/createVote/${roomId}`,
    data: {
      state: 'ING',
      name: title,
    },
  }).then((response) => console.log(response));
  dispatch({type: CREATE_VOTE, payload: {title, state: 'ING'}});
};

export const completeVote = (roomId) => async (dispatch) => {
  fetch(`${URL}chat/vote/${roomId}`, {
    method: 'POST',
  }).then((res) => console.log(res));
  dispatch({type: COMPLETE_VOTE});
};

export const getVoteState = (roomId) => async (dispatch) => {
  fetch(`${URL}chat/vote/${roomId}`).then((res) =>
    res.json().then((json) => {
      console.log(json);
      dispatch({type: GET_VOTE_STATE, payload: json});
    }),
  );
};
