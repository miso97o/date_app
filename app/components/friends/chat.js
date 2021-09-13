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
          txtMsg: '안녕하세요',
        },
        {
          sender: false,
          txtMsg: '네 안녕하세요',
        },
      ],
      newMessage: '',
    };

    // console.log(params);
  }

  onChangeInput = (value) => {
    this.setState({newMessage: value});
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
              <View style={{alignItems: 'flex-end', margin: 10}}>
                <Text
                  style={[styles.messages, {backgroundColor: 'yellow'}]}
                  key={idx}>
                  {item.txtMsg}
                </Text>
              </View>
            ) : (
              <View style={{alignItems: 'flex-start', margin: 10}}>
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
            style={[{width: 375, backgroundColor: 'white'}, styles.messages]}
          />
          <TouchableOpacity style={{backgroundColor: 'skyblue', padding: 7}}>
            <Icon name="send-circle-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messages: {
    padding: 5,
    justifyContent: 'center',
    fontSize: 16,
  },
});

export default Chat;
