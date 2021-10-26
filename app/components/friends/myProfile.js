import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

class MyProfile extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => {
            this.props.goToInfo(this.props.user);
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assests/images/good.png')}
              resizeMode="contain"
              style={{width: 60, height: 60, margin: 10}}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {this.props.user.name}
            </Text>
          </View>
          <Text style={styles.introduce}> {this.props.user.introduce} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    height: 100,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 0,
  },
  introduce: {
    fontSize: 15,
    backgroundColor: 'skyblue',
    borderRadius: 7,
    padding: 5,
  },
});

export default MyProfile;
