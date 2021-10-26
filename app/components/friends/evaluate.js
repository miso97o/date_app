/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Stars from 'react-native-stars';

import {URL} from '../../utils/misc';
import axios from 'axios';

import {connect} from 'react-redux';

class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    this.getUsers();
  }

  getUsers = () => {
    axios({
      method: 'GET',
      url: `${URL}chat/roomInfo/${this.props.Chat.roomId}`,
    }).then((res) => {
      console.log('roomInfo', res.data);
      this.setState({users: res.data.userList, ownerId: res.data.ownerId});
    });
  };

  render() {
    var userList = this.state.users;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <Text>평가 스크린</Text>
          <Stars
            default={2.5}
            count={5}
            half={true}
            starSize={50}
            fullStar={require('../../assests/images/filledstar.png')}
            emptyStar={require('../../assests/images/emptystar.png')}
            halfStar={require('../../assests/images/halfstar.png')}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
    Chat: state.Chat,
  };
}

export default connect(mapStateToProps)(Evaluation);
