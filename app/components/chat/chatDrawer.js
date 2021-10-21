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

import {URL} from '../../utils/misc';
import {leaveRoom} from '../../store/actions/chat_action';
import axios from 'axios';

import {CommonActions} from '@react-navigation/routers';
import {connect} from 'react-redux';

class ChatDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    this.getUsers();
  }

  navigationToScreen = (route) => () => {
    this.props.naviagtion.dispatch(
      CommonActions.navigate({
        name: route,
        params: {},
      }),
    );
  };

  getUsers = () => {
    axios({
      method: 'GET',
      url: `${URL}chat/roomInfo/${this.props.Chat.roomId}`,
    }).then((res) => {
      console.log('console', res.data.userList);
      this.setState({users: res.data.userList});
    });
  };

  // componentDidMount() {
  //   this.getUsers();
  // }

  render() {
    var userList = this.state.users;
    // console.log('users: ', userList);
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.menuContainer}>
            <Text>Menu</Text>
            <TouchableOpacity>
              <Icon name="vote" size={36} />
            </TouchableOpacity>
          </View>
          <View style={styles.userContainer}>
            <Text style={{fontSize: 24, fontWeight: 'bold', padding: 5}}>
              대화상대
            </Text>
            {userList.map((item, idx) => (
              <TouchableOpacity key={idx} style={{flexDirection: 'row'}}>
                {item.userId === this.props.User.auth.userId ? (
                  <Text
                    style={{
                      padding: 7,
                      borderRadius: 20,
                      backgroundColor: 'skyblue',
                    }}>
                    {' 나 '}
                  </Text>
                ) : null}
                <Text style={styles.userText}> {item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{position: 'absolute', left: 15, bottom: 10}}
          onPress={() => [
            this.props.leaveRoom(
              this.props.Chat.roomId,
              this.props.User.auth.userId,
            ),
            this.props.navigation.navigate('Map'),
          ]}>
          <Image
            source={require('../../assests/images/logout.png')}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuContainer: {
    padding: 15,
    height: 100,
    justifyContent: 'center',
    borderBottomWidth: 0.7,
    margin: 3,
  },
  userContainer: {
    marginLeft: 5,
    padding: 10,
  },
  userText: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 3,
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
    Chat: state.Chat,
  };
}

export default connect(mapStateToProps, {leaveRoom})(ChatDrawer);
