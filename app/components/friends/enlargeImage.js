/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class EnlargedImage extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../assests/images/good.png')}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default EnlargedImage;
