import {
  RECIEVE_MESSAGE,
  SEND_MESSAGE,
  GET_ROOMID,
  LEAVE_ROOM,
  CREATE_VOTE,
  COMPLETE_VOTE,
  GET_VOTE_STATE,
} from '../types';

const initialState = {
  messages: [],
  roomId: null,
  senderId: null,
  voteState: 'BEFORE',
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
      var message = {
        sender: payload.senderId === state.senderId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        txtMsg: payload.message,
        type: payload.type,
      };
      if (state.messages.length === 0) {
        return {...state, messages: [...state.messages, message]};
      } else {
        if (state.senderId === message.senderId) {
          return state;
        } else {
          return {...state, messages: [...state, message]};
        }
      }
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    case LEAVE_ROOM:
      return initialState;
    case CREATE_VOTE:
      return {
        ...state,
        voteTitle: payload.title,
        voteState: payload.state,
      };
    case COMPLETE_VOTE:
      return {
        ...state,
        voteState: 'DID',
      };
    case GET_VOTE_STATE:
      payload.userList.map((item) => {
        if (item.userId === state.senderId) {
          return {
            ...state,
            voteTitle: payload.name,
            voteState: 'DID',
            votedUser: payload.userList,
          };
        }
      });
      return {
        ...state,
        voteTitle: payload.name,
        voteState: payload.state,
        votedUser: payload.userList,
      };
    default:
      return state;
  }
}
