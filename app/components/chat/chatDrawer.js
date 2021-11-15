/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialog from 'react-native-dialog';
import AndroidDialogPicker from 'react-native-android-dialog-picker';
import Stars from 'react-native-stars';

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
      modalVisible: false,
      userScore: 0,
      modalName: '',
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
      console.log('roomInfo', res);
      this.setState({users: res.data.userList, ownerId: res.data.ownerId});
    });
  };

  makeVote = () => {
    this.props.createVote(this.state.dialogText, this.props.Chat.roomId);
    this.setState({dialogVisible: false, dialogText: ''});
  };

  endVote = () => {
    if (
      this.props.Chat.voteState === 'ING' ||
      this.props.Chat.voteState === 'DID'
    ) {
      fetch(`${URL}chat/endVote/${this.props.Chat.roomId}`, {
        method: 'POST',
      }).then((res) => {
        console.log(res);
        alert('투표가 완료되었습니다.');
      });
    }
  };

  showPicker = (list) => {
    AndroidDialogPicker.show(
      {
        title: '방장 위임',
        items: list,
        cancelText: '취소',
      },
      (index) => console.log(index),
    );
  };

  showDialog = () => {
    return (
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
        <Dialog.Button label="예" onPress={() => this.makeVote()} />
        <Dialog.Button
          label="취소"
          onPress={() => this.setState({dialogVisible: false, dialogText: ''})}
        />
      </Dialog.Container>
    );
  };

  viewScore = (userId) => {
    fetch(`${URL}user/viewUser/${userId}`).then((res) => {
      console.log(res);
      res.json().then((json) =>
        this.setState({
          userScore: json.score,
          modalName: json.userName,
          modalVisible: true,
        }),
      );
    });
  };

  scoreModal = () => {
    return (
      <Modal transparent={true} visible={this.state.modalVisible}>
        <View style={styles.modalView}>
          <View style={styles.modalInner}>
            <Text style={{fontSize: 20, fontWeight: 'bold', margin: 10}}>
              {this.state.modalName}
            </Text>
            {this.state.userScore !== 0 ? (
              <Stars
                display={this.state.userScore}
                spacing={5}
                starSize={30}
                fullStar={require('../../assests/images/filledstar.png')}
                emptyStar={require('../../assests/images/emptystar.png')}
              />
            ) : null}
            <Text
              style={{alignSelf: 'center'}}>{`${this.state.userScore}/5`}</Text>
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
  };

  render() {
    var userList = this.state.users;
    var nameList = userList.map((item) => item.name);

    return (
      <View style={{flex: 1}}>
        {this.scoreModal()}
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuContent}
              onPress={() => {
                if (this.state.ownerId === this.props.User.auth.userId) {
                  this.setState({dialogVisible: true});
                } else {
                  alert('방장만 가능합니다.');
                }
              }}>
              <Icon name="vote" size={36} />
              <Text> 참가 투표</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuContent}
              onPress={() => {
                if (this.state.ownerId === this.props.User.auth.userId) {
                  this.endVote();
                } else {
                  alert('방장만 가능합니다.');
                }
              }}>
              <Icon name="check-circle-outline" size={36} />
              <Text> 약속 완료</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuContent}
              onPress={() => {
                if (this.state.ownerId === this.props.User.auth.userId) {
                  this.showPicker(nameList);
                } else {
                  alert('방장만 가능합니다.');
                }
              }}>
              <Icon name="account-arrow-right" size={36} />
              <Text> 방장 위임</Text>
            </TouchableOpacity>
          </View>

          {this.showDialog()}
          <View style={styles.userContainer}>
            <Text style={{fontSize: 24, fontWeight: 'bold', padding: 5}}>
              대화상대
            </Text>
            {userList.map((item, idx) => (
              <TouchableOpacity
                onPress={() => this.viewScore(item.userId)}
                key={idx}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.userId === this.state.ownerId ? (
                  <Text style={[styles.note, {backgroundColor: 'yellow'}]}>
                    {'방장'}
                  </Text>
                ) : null}
                {item.userId === this.props.User.auth.userId ? (
                  <Text style={[styles.note, {backgroundColor: 'skyblue'}]}>
                    {'나'}
                  </Text>
                ) : null}
                <Text style={styles.userText}>{item.name}</Text>
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
            this.props.navigation.navigate('Main'),
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
  note: {
    padding: 5,
    borderRadius: 10,
    marginRight: 5,
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
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
    Chat: state.Chat,
  };
}

export default connect(mapStateToProps, {leaveRoom, createVote})(ChatDrawer);
