import {RECIEVE_MESSAGE, SEND_MESSAGE, GET_ROOMID, LEAVE_ROOM} from '../types';

const initialState = {
  messages: [],
  // 저장하는 메세지 유형은 객체에 sender, senderId, senderName, message가 들어있는 형태
};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case GET_ROOMID:
      return {
        ...state,
        roomId: payload.roomId,
        senderId: payload.userId,
        senderName: payload.userName,
      };
    case RECIEVE_MESSAGE:
      if (payload.type === 'SYSTEM') {
        var message = {
          sender: payload.senderId === state.senderId,
          senderId: 'SYSTEM',
          senderName: payload.senderName,
          txtMsg: payload.message,
        };
        if (state.messages.length === 0) {
          return {...state, messages: [...state.messages, message]};
        }
      }
      var message = {
        sender: payload.senderId === state.senderId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        txtMsg: payload.message,
      };
      if (message.senderId === state.senderId) {
        return state;
      } else {
        return {
          ...state,
          messages: [...state.messages, message],
        };
      }
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    case LEAVE_ROOM:
      return initialState;
    default:
      return state;
  }
}
