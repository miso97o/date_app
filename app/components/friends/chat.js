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

class Chat extends Component {
  constructor(props) {
    super(props);
    // const params = props.route.params;

    this.state = {
      Messages: [
        {
          sender: true,
          name: '나',
          txtMsg: '안녕하세요',
        },
        {
          sender: false,
          name: '상대',
          txtMsg: '네 안녕하세요',
        },
        {
          sender: false,
          name: '상대',
          txtMsg: 'ㅎㅎㅎㅎ',
        },
      ],
      newMessage: {
        sender: true,
        name: '나',
        txtMsg: '',
      },
    };

    // console.log(params);
  }

  onChangeInput = (value) => {
    this.setState((prevState) => ({
      newMessage: {...prevState.newMessage, txtMsg: value},
    }));
  };

  pushMessage = (newMsg) => {
    this.setState((prevState) => ({
      Messages: [...prevState.Messages, newMsg],
      newMessage: {txtMsg: ''},
    }));
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ScrollView style={{flex: 1, backgroundColor: '#eeeeee'}}>
          {this.state.Messages.map((item, idx) => {
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

export default Chat;
