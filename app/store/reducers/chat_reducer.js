import {RECIEVE_MESSAGE, SEND_MESSAGE} from '../types';

const initialState = {
  roomId: 'bc0f702e-d499-428f-a09e-00597873dc80',
  sender: '나',
  messages: [],
  // 메세지 유형은 객체에 roomId, sender, message가 들어있는 형태
};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case RECIEVE_MESSAGE:
      var message = {
        sender: payload.sender === state.sender,
        name: payload.sender,
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
