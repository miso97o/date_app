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
import Dialog from 'react-native-dialog';

import {URL} from '../../utils/misc';
import {leaveRoom, createVote} from '../../store/actions/chat_action';
import axios from 'axios';

import {CommonActions} from '@react-navigation/routers';
import {connect} from 'react-redux';

class ChatDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      ownerId: '',
      dialogVisible: false,
      dialogText: '',
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
      console.log('roomInfo', res.data);
      this.setState({users: res.data.userList, ownerId: res.data.ownerId});
    });
  };

  changeVote = () => {
    this.props.createVote(this.state.dialogText);
    this.setState({dialogVisible: false, dialogText: ''});
  };

  render() {
    var userList = this.state.users;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuContent}
              onPress={() => {
                if (this.state.ownerId === this.props.User.auth.userId) {
                  this.setState({dialogVisible: true});
                } else {
                  alert('방장만 투표를 진행할 수 있습니다.');
                }
              }}>
              <Icon name="vote" size={36} />
              <Text> 참가 투표</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuContent}
              onPress={() => {
                if (this.state.ownerId === this.props.User.auth.userId) {
                  alert('약속 완료');
                } else {
                  alert('방장만 투표를 진행할 수 있습니다.');
                }
              }}>
              <Icon name="check-circle-outline" size={36} />
              <Text> 약속 완료</Text>
            </TouchableOpacity>
          </View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>참가 확인 투표</Dialog.Title>
            <Dialog.Description>
              약속 내용을 적고 참가 확인 투표를 진행하세요.
            </Dialog.Description>
            <Dialog.Input
              placeholder="예시) 저녁 6시 시청역"
              value={this.state.dialogText}
              onChangeText={(value) => this.setState({dialogText: value})}
              style={{borderBottomWidth: 0.7}}
            />
            <Dialog.Button label="예" onPress={() => this.changeVote()} />
            <Dialog.Button
              label="취소"
              onPress={() =>
                this.setState({dialogVisible: false, dialogText: ''})
              }
            />
          </Dialog.Container>
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
    height: 120,
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
  menuContent: {
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    alignItems: 'center',
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
    Chat: state.Chat,
  };
}

export default connect(mapStateToProps, {leaveRoom, createVote})(ChatDrawer);
