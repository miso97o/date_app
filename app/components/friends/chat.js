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
  connection,
  recieveMsg,
  ws,
} from '../../store/actions/chat_action';

import {connect} from 'react-redux';

class Chat extends Component {
  constructor(props) {
    super(props);
    const params = props.route.params;
    this.state = {
      Messages: [],
      roomId: params.roomId,
      senderName: '나',
      newMessage: {
        sender: true,
        name: '나',
        txtMsg: '',
      },
    };
    // connection(params.roomId);
    var sock = new SockJS(`${URL}/start-ws`);
    var ws = Stomp.over(sock);
    ws.connect({}, () => {
      ws.subscribe('/sub/chat/room/' + params.roomId, (msg) => {
        var recv = JSON.parse(msg.body);
        this.props.recieveMsg(recv);
      });
      ws.send(
        '/pub/chat/message',
        {},
        JSON.stringify({roomId: params.roomId, sender: '나'}),
      ),
        (e) => alert('error', e);
    });
  }

  onChangeInput = (value) => {
    this.setState((prevState) => ({
      newMessage: {...prevState.newMessage, txtMsg: value},
    }));
  };

  pushMessage = (newMsg) => {
    if (newMsg !== '') {
      this.props.sendMsg({
        roomId: this.state.roomId,
        sender: this.state.senderName,
        txtMsg: newMsg,
      });
      this.setState((prevState) => ({
        newMessage: {txtMsg: ''},
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
        <ScrollView style={{flex: 1, backgroundColor: '#eeeeee'}}>
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
            value={this.state.newMessage.txtMsg}
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
            onPress={() => this.pushMessage(this.state.newMessage.txtMsg)}>
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
  return {Chat: state.Chat};
}

export default connect(mapStateToProps, {sendMsg, recieveMsg})(Chat);
