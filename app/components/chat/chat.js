/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {URL} from '../../utils/misc';
import {
  sendMsg,
  recieveMsg,
  completeVote,
  getVoteState,
} from '../../store/actions/chat_action';
import axios from 'axios';

import {connect} from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
    console.log('store', props.Chat);
    this.checkVoteState();
    this.state = {
      roomId: props.Chat.roomId,
      senderId: props.Chat.senderId,
      senderName: props.Chat.senderName,
      newMessage: '',
      voteState: 'BEFORE', // before, ing, did, finish, discover
      voteTitle: '',
      votedUser: [],
      modalVisible: false,
    };

    var sock = new SockJS(`${URL}websocket-endpoint`);
    var ws = Stomp.over(sock);
    console.log('connected?', ws.connected);
    if (!ws.connected) {
      ws.connect({}, () => {
        ws.subscribe('/sub/chat/room/' + this.state.roomId, (msg) => {
          var recv = JSON.parse(msg.body);
          this.props.recieveMsg(recv);
        });
        ws.send(
          '/pub/chat/message',
          {},
          JSON.stringify({
            type: 'SYSTEM',
            roomId: this.state.roomId,
            senderId: this.state.senderId,
            message: `${this.state.senderName}님이 입장하였습니다.`,
          }),
        ),
          (e) => alert('error', e);
      });
    }
  }

  onChangeInput = (value) => {
    this.setState((prevState) => ({
      newMessage: value,
    }));
  };

  pushMessage = (newMsg) => {
    if (newMsg !== '') {
      this.props.sendMsg({
        roomId: this.state.roomId,
        senderId: this.state.senderId,
        txtMsg: newMsg,
        senderName: this.state.senderName,
      });
      this.setState((prevState) => ({
        newMessage: '',
      }));
    }
    console.log(this.props.Chat);
  };

  createVote = () => {
    if (
      this.state.voteState !== 'discover' &&
      this.props.Chat.voteState !== 'BEFORE'
    ) {
      // 다른 함수 적용
      return (
        <TouchableOpacity
          style={styles.voteContainer}
          onPress={() => this.setState({modalVisible: true})}>
          <Icon name="vote" size={36} />
          <View
            style={{
              alignItems: 'center',
              margin: 10,
              width: '60%',
              flexDirection: 'row',
            }}>
            {this.props.Chat.voteState === 'FINISH' ? (
              <Text style={{margin: 7}}>(종료)</Text>
            ) : null}
            <Text style={{fontSize: 19}}>{this.props.Chat.voteTitle}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => {
                this.props.Chat.voteState === 'DID' ||
                this.props.Chat.voteState === 'FINISH'
                  ? alert('이미 투표했습니다.')
                  : [
                      this.props.completeVote(this.state.roomId),
                      alert('투표 되었습니다.'),
                    ];
              }}>
              <Text>참가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => {
                this.setState({voteState: 'discover'});
              }}>
              <Text>숨기기</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  };

  checkVoteState = () => {
    this.props.getVoteState(this.props.Chat.roomId);
    fetch(`${URL}chat/vote/${this.props.Chat.roomId}`).then((res) =>
      res.json().then((json) => {
        this.setState({votedUser: json.userList});
      }),
    );
  };

  checkVotedUser = () => {
    if (
      this.state.voteState !== 'discover' &&
      this.props.Chat.voteState !== 'BEFORE'
    ) {
      return (
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={styles.modalView}>
            <View style={styles.modalInner}>
              <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
                투표자 명단
              </Text>
              {this.state.votedUser &&
                this.state.votedUser.map((item, idx) => (
                  <Text style={{margin: 10}} key={idx}>
                    {item.userName}
                  </Text>
                ))}
              <View style={styles.modalButtonView}>
                <TouchableOpacity
                  style={{margin: 10, paddingRight: 15}}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  };

  componentDidMount() {
    this.setState({
      voteState: this.props.Chat.voteState,
      voteTitle: this.props.Chat.voteTitle,
      votedUser: this.props.Chat.votedUser,
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {this.createVote()}
        {this.checkVotedUser()}
        <ScrollView
          style={{flex: 1, backgroundColor: '#eeeeee'}}
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd({animated: true});
          }}
          showsVerticalScrollIndicator={false}
          onLayout={() => this.scrollView.scrollToEnd({animated: true})}>
          {this.props.Chat.messages.map((item, idx) => {
            if (item.type === 'SYSTEM') {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    margin: 5,
                  }}
                  key={idx}>
                  <Text
                    style={{borderWidth: 0.7, borderRadius: 10, padding: 5}}>
                    {item.txtMsg}
                  </Text>
                </View>
              );
            } else {
              return item.sender ? (
                <View
                  style={{alignItems: 'flex-end', margin: 5, marginRight: 10}}
                  key={idx}>
                  <Text
                    style={[styles.messages, {backgroundColor: 'yellow'}]}
                    key={idx}>
                    {item.txtMsg}
                  </Text>
                </View>
              ) : (
                <View
                  style={{alignItems: 'flex-start', margin: 5, marginLeft: 10}}
                  key={idx}>
                  <Text>{item.senderName}</Text>
                  <Text
                    style={[styles.messages, {backgroundColor: 'white'}]}
                    key={idx}>
                    {item.txtMsg}
                  </Text>
                </View>
              );
            }
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            value={this.state.newMessage}
            onChangeText={(value) => this.onChangeInput(value)}
            multiline={true}
            autoCapitalize="none"
            style={[{width: '84%', backgroundColor: 'white'}, styles.messages]}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.pushMessage(this.state.newMessage)}>
            <Icon name="send-circle-outline" size={28} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messages: {
    padding: 7,
    justifyContent: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 8,
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    padding: 7,
    margin: 5,
    alignItems: 'center',
  },
  voteButton: {
    backgroundColor: 'skyblue',
    padding: 5,
    marginLeft: 5,
    marginRight: 15,
    justifyContent: 'center',
    right: 10,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonView: {
    width: 350,
    alignSelf: 'baseline',
    alignItems: 'flex-end',
  },
  modalInner: {
    width: 350,
    backgroundColor: 'white',
    padding: 10,
  },
});

function mapStateToProps(state) {
  return {Chat: state.Chat, User: state.User};
}

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, {sendMsg, recieveMsg, completeVote, getVoteState})(Chat);
