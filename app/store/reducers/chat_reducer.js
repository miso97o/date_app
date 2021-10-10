import {RECIEVE_MESSAGE, SEND_MESSAGE} from '../types';

const initialState = {
  sender: 'userId1',
  messages: [],
  // 저장하는 메세지 유형은 객체에 sender, senderName, message가 들어있는 형태
};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case RECIEVE_MESSAGE:
      var message = {
        sender: payload.senderId === state.sender,
        name: payload.senderId,
        txtMsg: payload.message,
      };
      if (message.name === state.sender) {
        return {...state};
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
    default:
      return state;
  }
}
