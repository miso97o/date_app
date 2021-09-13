/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import MyProfile from './myProfile';
import Profile from '../../utils/forms/profile';

class FriendsComponent extends Component {
  state = {
    // 인증이 된 상태인지 확인하는 변수
    isAuth: true,
    user: {
      name: '황준원',
      introduce: '안녕하세요',
      imagePath: '../../assests/images/good.png',
      friends: [
        {
          name: '박도영',
          introduce: '하이하이',
          imagePath: '../../assests/images/very_good.png',
        },
        {
          name: '박종욱',
          introduce: 'Hello',
          imagePath: '',
        },
      ],
    },
  };

  manageState = (isAuth) => {
    this.setState({isAuth});
  };

  goToInfo = (user) => {
    this.props.navigation.push('Info', user);
  };

  goToChat = (user) => {
    this.props.navigation.push('Chat', user);
  };

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <MyProfile user={this.state.user} goToInfo={this.goToInfo} />
          <View style={{alignItems: 'center', margin: 5}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => alert('Not Implemented')}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Matching</Text>
            </TouchableOpacity>
          </View>
          <View style={{borderTopWidth: 1, borderRadius: 15}}>
            {this.state.user.friends.map((item, index) => {
              return (
                <Profile
                  name={item.name}
                  introduce={item.introduce}
                  key={index}
                  goToInfo={this.goToInfo}
                  goToChat={this.goToChat}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
});

export default FriendsComponent;
