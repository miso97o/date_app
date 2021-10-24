/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {URL} from '../../utils/misc';
import {
  sendMsg,
  recieveMsg,
  completeVote,
} from '../../store/actions/chat_action';

import {connect} from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
    console.log('store', props.Chat);
    this.state = {
      roomId: props.Chat.roomId,
      senderId: props.Chat.senderId,
      senderName: props.Chat.senderName,
      newMessage: '',
    };
    // connection(props.Chat.roomId, props.Chat.senderId);
    var sock = new SockJS(`${URL}start-ws`);
    var ws = Stomp.over(sock);
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
          senderName: this.state.senderName,
          message: `${this.state.senderName}님이 입장하였습니다.`,
        }),
      ),
        (e) => alert('error', e);
    });
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
    if (this.props.Chat.vote && !this.props.Chat.voted) {
      // 다른 함수 적용
      return (
        <View style={styles.voteContainer}>
          <Icon name="vote" size={36} />
          <View style={{justifyContent: 'center', margin: 10, width: '60%'}}>
            <Text style={{fontSize: 19}}>{this.props.Chat.discription}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => {
                alert('참가 투표');
                this.props.completeVote();
              }}>
              <Text>참가</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => {
                alert('불참 투표');
                this.props.completeVote();
              }}>
              <Text>불참</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {this.createVote()}
        <ScrollView
          style={{flex: 1, backgroundColor: '#eeeeee'}}
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd({animated: true});
          }}
          onLayout={() => this.scrollView.scrollToEnd({animated: true})}>
          {this.props.Chat.messages.map((item, idx) => {
            if (item.senderId === 'SYSTEM') {
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
            }
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
                <Text>{item.name}</Text>
                <Text
                  style={[styles.messages, {backgroundColor: 'white'}]}
                  key={idx}>
                  {item.txtMsg}
                </Text>
              </View>
            );
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
            style={[
              {width: '84%', height: 48, backgroundColor: 'white'},
              styles.messages,
            ]}
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
    height: 48,
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
    borderRadius: 10,
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {Chat: state.Chat, User: state.User};
}

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, {sendMsg, recieveMsg, completeVote})(Chat);
