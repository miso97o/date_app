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
import {sendMsg, recieveMsg} from '../../store/actions/chat_action';

import {connect} from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
    const params = props.route.params;
    console.log('params', params);
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
          roomId: this.state.roomId,
          senderId: this.state.senderId,
          senderName: this.state.senderName,
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
        senderId: this.state.senderName,
        txtMsg: newMsg,
        senderName: this.state.senderName,
      });
      this.setState((prevState) => ({
        newMessage: '',
      }));
    }
    console.log(this.props.Chat);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ScrollView
          style={{flex: 1, backgroundColor: '#eeeeee'}}
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd({animated: true});
          }}
          onLayout={() => this.scrollView.scrollToEnd({animated: true})}>
          {this.props.Chat.messages.map((item, idx) => {
            return item.sender ? (
              <View
                style={{alignItems: 'flex-end', margin: 5, marginRight: 10}}>
                <Text
                  style={[styles.messages, {backgroundColor: 'yellow'}]}
                  key={idx}>
                  {item.txtMsg}
                </Text>
              </View>
            ) : (
              <View
                style={{alignItems: 'flex-start', margin: 5, marginLeft: 10}}>
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
});

function mapStateToProps(state) {
  return {Chat: state.Chat, User: state.User};
}

export default connect(mapStateToProps, {sendMsg, recieveMsg})(Chat);
