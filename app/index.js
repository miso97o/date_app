import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RootNavigator} from './routes';

// RouteNavigator안에서 전체적인 화면구조를 짜고 APP 클래스를 export함
class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
