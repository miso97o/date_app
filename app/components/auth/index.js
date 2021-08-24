/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AuthLogo from './authLogo';
import AuthForm from './authForm';
import {getTokens, setTokens} from '../../utils/misc';
// autoSignIn 함수는 firebase에 post요청을 하고 반환된 값과 action-type을 객체로 반환함
import {autoSignIn} from '../../store/actions/user_action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class AuthComponent extends Component {
  state = {
    loading: false,
  };

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
      if (value[1][1] === null) {
        this.setState({loading: false});
      } else {
        this.props.autoSignIn(value[2][1]).then(() => {
          if (!this.props.User.auth.token) {
            this.setState({loading: false});
          } else {
            setTokens(this.props.User.auth, () => {
              this.goWithoutLogin();
            });
          }
        });
      }
      console.log('Get Tokens: ', value);
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    } else {
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
