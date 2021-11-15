/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Stars from 'react-native-stars';

import {URL} from '../../utils/misc';
import axios from 'axios';

import {connect} from 'react-redux';

const screenWidth = Dimensions.get('window').width;

class Evaluation extends Component {
  constructor(props) {
    super(props);
    const params = props.route.params;
    this.state = {
      users: [],
      historyId: params.historyId,
    };
    this.getUsers();
  }

  getUsers = () => {
    axios({
      method: 'GET',
      url: `${URL}history/${this.state.historyId}`,
    }).then((res) => {
      console.log('userList', res.data);
      this.setState({users: res.data});
    });
  };

  updateScore = (userList) => {
    console.log(userList);
    this.setState({users: userList});
  };

  submitScore = () => {
    console.log('제출', this.state.users);
    axios({
      method: 'POST',
      url: `${URL}history/${this.state.historyId}`,
      data: {mainList: this.state.users},
    }).then((res) => console.log(res));
    this.props.navigation.navigate('Friends');
  };

  render() {
    var userList = this.state.users;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.container}>
            {this.state.users.map((item, idx) => {
              if (item.userId !== this.props.User.auth.userId) {
                return (
                  <View key={idx}>
                    <Text
                      style={{fontSize: 18, fontWeight: 'bold', padding: 5}}>
                      {item.userName}
                    </Text>
                    <Stars
                      default={3}
                      spacing={5}
                      update={(val) => [
                        (userList[idx].score = val),
                        this.updateScore(userList),
                      ]}
                      count={5}
                      half={true}
                      starSize={35}
                      fullStar={require('../../assests/images/filledstar.png')}
                      emptyStar={require('../../assests/images/emptystar.png')}
                      halfStar={require('../../assests/images/halfstar.png')}
                    />
                  </View>
                );
              }
            })}
          </View>
          <View style={{margin: 10, alignItems: 'center'}}>
            <Text>사용자들을 평가해 주세요.</Text>
          </View>
          <View
            style={{
              width: 70,
              left: screenWidth - 90,
            }}>
            <Button title="제출" onPress={() => this.submitScore()} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
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

export default connect(mapStateToProps)(Evaluation);
