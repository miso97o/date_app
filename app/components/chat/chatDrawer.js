/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {CommonActions} from '@react-navigation/routers';
import {connect} from 'react-redux';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class ChatDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          userId: props.User.auth.userId,
          userName: props.User.auth.userName,
        },
        {
          userId: 'asd@asd.com',
          userName: 'doyoung',
        },
        {
          userId: 'asd@efg.com',
          userName: 'chaerim',
        },
      ],
    };
  }

  navigationToScreen = (route) => () => {
    this.props.naviagtion.dispatch(
      CommonActions.navigate({
        name: route,
        params: {},
      }),
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor: 'skyblue'}}>
          <View style={styles.menuContainer}>
            <Text>Menu</Text>
          </View>
          <View style={styles.userContainer}>
            <Text style={{fontSize: 24, fontWeight: 'bold', padding: 5}}>
              대화상대
            </Text>
            {this.state.users.map((item, idx) => (
              <TouchableOpacity key={idx}>
                <Text style={styles.userText}> {item.userName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={{position: 'absolute', left: 15, bottom: 10}}>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
  };
}

export default connect(mapStateToProps)(ChatDrawer);
