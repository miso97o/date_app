/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Animated, View} from 'react-native';

import {autoSignIn} from '../../store/actions/user_action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const LogoImage = require('../../assests/images/logo.png');

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xValue: new Animated.Value(60),
      opacity: new Animated.Value(0),
    };
  }

  onComplete = () => {
    this.props.autoSignIn().then(() => {
      if (this.props.User.auth.userId) {
        this.props.navigation.navigate('Main');
      } else {
        this.props.navigation.navigate('SignIn');
      }
    });
  };

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 2000,
    }).start(() => {
      this.onComplete();
    });
  };

  render() {
    return (
      <View
        style={{
          height: '100%',
          backgroundColor: 'skyblue',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.Image
          source={LogoImage}
          resizeMode="cover"
          style={{
            width: 350,
            height: 500,
            opacity: this.state.opacity,
            left: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 0],
            }),
          }}
          onLoad={this.onLoad}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
  };
}

function mapDispatchToProps(dispatch) {
  // reducer에 action을 알리는 함수 dispatch를 props와 엮음
  return bindActionCreators({autoSignIn}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
