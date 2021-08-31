/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import AuthLogo from './authLogo';
import AuthForm from './authForm';
import {getTokens, setTokens} from '../../utils/misc';
// autoSignIn 함수는 firebase에 post요청을 하고 반환된 값과 action-type을 객체로 반환함
import {autoSignIn} from '../../store/actions/user_action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class AuthComponent extends Component {
  goWithoutLogin = () => {
    this.props.navigation.navigate('AppTabComponent');
  };

  componentDidMount() {
    /*
      values
      ['@learn_app@userId', 'asdf..']
      ['@learn_app@token', 'hrgsd..']
      ['@learn_app@refToken' 'gdfhwe..']
      */
    getTokens((value) => {
      // token을 통해 로그인 정보가 있는지 확인
      if (value[1][1] !== null) {
        // token이 있으면 autoSignIn 함수를 통해 로그인정보를 받아오고 받아온 로그인정보가 유효하면 화면이동
        this.props.autoSignIn(value[2][1]).then(() => {
          if (this.props.User.auth.token) {
            setTokens(this.props.User.auth, () => {
              this.goWithoutLogin();
            });
          }
        });
      }
    });
    // beforeRemove는 유저가 이전화면으롤 떠나지 못하게 함.
    this.props.navigation.addListener('beforeRemove', (e) => {
      // preventDefault는 이벤트로 정의된 기본 액션을 취함
      e.preventDefault();
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <AuthLogo />
          <AuthForm goWithoutLogin={this.goWithoutLogin} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
    padding: 100,
    paddingLeft: 50,
    paddingRight: 50,
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브의 Props의 User에 Redux Store가 가진 state안의 User를 할당함
    User: state.User,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({autoSignIn}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthComponent);
