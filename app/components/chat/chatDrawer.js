/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';

import {CommonActions} from '@react-navigation/routers';
import {connect} from 'react-redux';

class ChatDrawer extends Component {
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

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.userContainer}>
            <Image
              source={require('../../assests/images/very_good.png')}
              style={{width: 50, height: 50, marginRight: 20}}
            />
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              {this.props.User.auth.userName}님
            </Text>
          </View>
          <View>
            <Text>User 목록</Text>
          </View>
        </ScrollView>
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
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
  };
}

export default connect(mapStateToProps)(ChatDrawer);
