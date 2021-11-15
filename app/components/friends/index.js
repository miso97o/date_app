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
import Stars from 'react-native-stars';
import {URL} from '../../utils/misc';
import MyProfile from './myProfile';

import {connect} from 'react-redux';

class FriendsComponent extends Component {
  state = {
    // 인증이 된 상태인지 확인하는 변수
    user: {
      name: this.props.User.auth.userName,
      introduce: '안녕하세요',
      imagePath: '../../assests/images/good.png',
      starScore: 0,
    },
    historys: [],
  };

  goToInfo = (user) => {
    this.props.navigation.push('Info', user);
  };

  getCategory = (key) => {
    switch (key) {
      case 'exercise':
        return '운동';
      case 'business':
        return '거래';
      case 'date':
        return '이성';
      case 'eat':
        return '식사';
      default:
        return '';
    }
  };

  getHistorys = () => {
    fetch(`${URL}history`).then((res) => {
      console.log(res);
      res.json().then((json) => {
        this.setState({historys: json});
      });
    });
  };

  getScore = () => {
    fetch(`${URL}user/viewUser/${this.props.User.auth.userId}`).then((res) => {
      console.log(res);
      res.json().then((json) =>
        this.setState((prevState) => ({
          user: {...prevState.user, starScore: json.score},
        })),
      );
    });
  };

  componentDidMount() {
    this.getHistorys();
    this.getScore();
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <MyProfile user={this.state.user} goToInfo={this.goToInfo} />

          <View style={{marginLeft: 10}}>
            <Text>평가점수</Text>
          </View>
          <View style={styles.scoreContainer}>
            {this.state.user.starScore !== 0 ? (
              <Stars
                display={this.state.user.starScore}
                spacing={5}
                starSize={50}
                fullStar={require('../../assests/images/filledstar.png')}
                emptyStar={require('../../assests/images/emptystar.png')}
              />
            ) : null}
            <Text>{`${this.state.user.starScore}/5`}</Text>
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
            {this.state.historys.map((item, idx) => (
              <View key={idx}>
                <View style={styles.container}>
                  <Text style={styles.titleText}>{item.chatRoomName}</Text>
                  <Text>카테고리: {this.getCategory(item.category)}</Text>
                  <Text>약속 이름: {item.voteName}</Text>
                  {item.score ? <Text>평균 점수: {item.score}점</Text> : null}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Evaluate', {
                      historyId: item.historyId,
                    })
                  }
                  style={styles.button}>
                  <Text style={{fontSize: 18}}>평가 하기</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    padding: 5,
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

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
    Chat: state.Chat,
  };
}

export default connect(mapStateToProps)(FriendsComponent);
