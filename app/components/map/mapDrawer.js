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

import {CommonActions} from '@react-navigation/routers';
import {connect} from 'react-redux';
import {URL} from '../../utils/misc';

class MapDrawer extends Component {
  constructor(props) {
    super(props);
  }

  navigationToScreen = (route) => () => {
    this.props.naviagtion.dispatch(
      CommonActions.navigate({
        name: route,
        params: {},
      }),
    );
  };

  logout = () => {
    fetch(`${URL}user/logout`).then((res) => console.log(res));
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.userContainer}>
            <Image
              source={require('../../assests/images/very_good.png')}
              style={{width: 50, height: 50, marginRight: 20}}
            />
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>
              {this.props.User.auth.userName}님
            </Text>
          </View>
          <View style={styles.menuContainer}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.menuText}>내 정보</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // this.props.Chat.roomId
                //   ? this.props.navigation.push('Chat')
                //   : alert('소속중인 방이 없습니다.');
                this.props.navigation.push('Chat');
              }}>
              <Text style={styles.menuText}>채팅</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{position: 'absolute', right: 15, bottom: 10}}
          onPress={() => [this.logout(), this.props.navigation.push('SignIn')]}>
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
  userContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgb(218,252,252)',
    padding: 15,
    alignItems: 'center',
  },
  menuContainer: {
    marginLeft: 5,
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    margin: 5,
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
  };
}

export default connect(mapStateToProps)(MapDrawer);
