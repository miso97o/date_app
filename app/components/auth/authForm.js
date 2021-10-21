import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, Platform} from 'react-native';
import Input from '../../utils/forms/input';
import ValidationRules from '../../utils/forms/validationRules';

import {connect} from 'react-redux';
import {signIn, signUp} from '../../store/actions/user_action';
import {bindActionCreators} from 'redux';
import {setTokens} from '../../utils/misc';

class AuthForm extends Component {
  state = {
    type: '로그인', // 타입값은 로그인 혹은 등록
    action: '로그인', // 로그인 혹은 등록
    actionMode: '회원가입', // 회원가입 혹은 로그인 화면으로
    hasErrors: false,
    form: {
      email: {
        value: '',
        type: 'textinput',
        rules: {
          isRequired: true,
          isEmail: true,
        },
        valid: false,
      },
      name: {
        value: '',
        type: 'textinput',
        rules: {
          isRequired: true,
        },
        valid: false,
      },
      password: {
        value: '',
        type: 'textinput',
        rules: {
          isRequired: true,
          minLength: 6,
        },
        valid: false,
      },
      confirmPassword: {
        value: '',
        type: 'textinput',
        rules: {
          confirmPassword: 'password',
        },
        valid: false,
      },
    },
  };

  // TextInput에 입력을 받는 함수, 이메일 형식이나 비밀번호 조건이 맞는지도 확인
  updateInput = (name, value) => {
    this.setState({hasErrors: false});

    let formCopy = this.state.form;
    formCopy[name].value = value;

    // Rules 내용 추가
    let rules = formCopy[name].rules;
    let valid = ValidationRules(value, rules, formCopy);
    formCopy[name].valid = valid;

    this.setState({form: formCopy});

    // console.warn(this.state.form);
  };

  // 비밀번호 재입력 컴포넌트 반환 / 회원가입 버튼이 눌렸을떄
  confirmPassword = () =>
    this.state.type !== '로그인' ? (
      <Input
        value={this.state.form.confirmPassword.value}
        type={this.state.form.confirmPassword.type}
        secureTextEntry={true}
        placeholder="비밀번호 재입력"
        placeholderTextColor="#fff"
        onChangeText={(value) => this.updateInput('confirmPassword', value)}
      />
    ) : null;

  enterName = () =>
    this.state.type !== '로그인' ? (
      <Input
        value={this.state.form.name.value}
        type={this.state.form.name.type}
        placeholder="이름 "
        placeholderTextColor="#fff"
        onChangeText={(value) => this.updateInput('name', value)}
      />
    ) : null;

  // 형식이 틀리는 등 오류가 생기면 오류를 화면에 나타냄
  formHasErrors = () =>
    this.state.hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}>로그인 정보를 다시 확인해주세요!</Text>
      </View>
    ) : null;

  // 회원가입 버튼을 누르면 버튼들을 바꿔줌
  changeForm = () => {
    const type = this.state.type;

    this.setState({
      type: type === '로그인' ? '등록' : '로그인',
      action: type === '로그인' ? '등록' : '로그인',
      actionMode: type === '로그인' ? '로그인 화면으로' : '회원가입',
    });
  };

  // 로그인 버튼의 onPress 함수
  submitUser = () => {
    // 초기화
    let isFormValid = true;
    let submittedForm = {};
    const formCopy = this.state.form;

    for (let key in formCopy) {
      if (this.state.type === '로그인') {
        // 이메일 / 패스워드가 valid한지 확인
        if (key !== 'confirmPassword' && key !== 'name') {
          isFormValid = isFormValid && formCopy[key].valid;
          submittedForm[key] = formCopy[key].value;
        }
      } else {
        // 이메일 / 이름 / 패스워드 / 확인패스워드가 valid한지 확인
        isFormValid = isFormValid && formCopy[key].valid;
        submittedForm[key] = formCopy[key].value;
      }
    }

    if (isFormValid) {
      // 입력한 형식이 맞는지
      if (this.state.type === '로그인') {
        this.props.signIn(submittedForm);
        setTimeout(() => {
          this.manageAccess();
        }, 500);
      } else {
        this.props.signUp(submittedForm);
        setTimeout(() => {
          if (this.props.User.auth.userId) {
            alert('회원가입 성공');
            this.changeForm();
          }
        }, 500);
      }
    } else {
      console.log(submittedForm);
      this.setState({
        hasErrors: true,
      });
    }
  };

  manageAccess = () => {
    // console.log('ManageAccess');
    if (!this.props.User.auth.userId) {
      this.setState({hasErrors: true});
    } else {
      this.setState({hasErrors: false});
      this.props.goWithoutLogin();
    }
  };

  render() {
    return (
      <View>
        <Input
          value={this.state.form.email.value}
          type={this.state.form.email.type}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
          placeholder="이메일 주소"
          placeholderTextColor="#fff"
          onChangeText={(value) => this.updateInput('email', value)}
        />
        {this.enterName()}
        <Input
          value={this.state.form.password.value}
          type={this.state.form.password.type}
          secureTextEntry={true}
          placeholder="비밀번호"
          placeholderTextColor="#fff"
          onChangeText={(value) => this.updateInput('password', value)}
        />

        {this.confirmPassword()}
        {this.formHasErrors()}

        <View style={{marginTop: 20}}>
          <View style={styles.button}>
            <Button
              title={this.state.action}
              color="#48567f"
              onPress={this.submitUser}
            />
          </View>

          <View style={styles.button}>
            <Button
              title={this.state.actionMode}
              color="#48567f"
              onPress={this.changeForm}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ee3344',
  },
  errorLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  button: {
    ...Platform.select({
      ios: {
        marginTop: 15,
      },
      android: {
        marginTop: 13,
        marginBottom: 10,
      },
    }),
  },
});

function mapStateToProps(state) {
  return {
    // 리액트 네이티브 세계관의 User Props에 Redux Store가 가진 state의 User를 넣어줌
    User: state.User,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({signIn, signUp}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
