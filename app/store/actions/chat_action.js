import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {URL} from '../../utils/misc';

import {SEND_MESSAGE, RECIEVE_MESSAGE} from '../../store/types';

export var sock = new SockJS(`${URL}start-ws`);
export var ws = Stomp.over(sock);

// 안쓰는 함수
export const connection = (roomId) => {
  ws.connect({}, () => {
    ws.subscribe('/sub/chat/room/' + roomId, (msg) => {
      var recv = JSON.parse(msg.body);
      recieveMsg(recv);
    });
    ws.send(
      '/pub/chat/message',
      {},
      JSON.stringify({roomId: roomId, sender: 'userId1'}),
    ),
      (e) => alert('error', e);
  });
};

export const sendMsg =
  ({roomId, senderId, txtMsg}) =>
  async (dispatch) => {
    ws.send(
      '/pub/chat/message',
      {},
      JSON.stringify({roomId: roomId, senderId: senderId, message: txtMsg}),
    );
    dispatch({
      type: SEND_MESSAGE,
      payload: {sender: true, name: senderId, txtMsg: txtMsg},
    });
  };

export const recieveMsg = (recv) => async (dispatch) => {
  dispatch({type: RECIEVE_MESSAGE, payload: recv});
  console.log('recv log: ', recv);
};
