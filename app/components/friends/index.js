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
// import Stars from 'react-native-stars';
import MyProfile from './myProfile';

class FriendsComponent extends Component {
  state = {
    // 인증이 된 상태인지 확인하는 변수
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

          <View style={{marginLeft: 10}}>
            <Text>평가점수</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text>Star</Text>
          </View>

          <View style={{marginLeft: 10}}>
            <Text>기록</Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              margin: 10,
              paddingBottom: 10,
            }}>
            <View style={styles.container}>
              <Text style={styles.titleText}>방 제목</Text>
              <Text>방 정보</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Evaluate')}
              style={styles.button}>
              <Text style={{fontSize: 18}}>평가 하기</Text>
            </TouchableOpacity>
            <View style={styles.container}>
              <Text style={styles.titleText}>방 제목 2</Text>
              <Text>방 정보</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Evaluate')}
              style={styles.button}>
              <Text style={{fontSize: 18}}>평가 하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderBottomWidth: 6,
    borderBottomColor: 'rgb(226,226,226)',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    paddingBottom: 5,
    borderBottomWidth: 0.5,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    height: 70,
    borderBottomWidth: 0.5,
  },
});

export default FriendsComponent;
