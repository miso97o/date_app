import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';

const Profile = (props) => {
  let templete = null;
  templete = (
    <View>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => props.goToChat(props)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../assests/images/very_good.png')}
            resizeMode="contain"
            style={{width: 55, height: 55, margin: 10}}
          />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.name}</Text>
        </View>
        <Text style={styles.introduce}> {props.introduce} </Text>
      </TouchableOpacity>
    </View>
  );
  return templete;
};

const styles = StyleSheet.create({
  profile: {
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: 'gray',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  introduce: {
    fontSize: 15,
    backgroundColor: 'skyblue',
    borderRadius: 7,
    padding: 5,
  },
});

export default Profile;
