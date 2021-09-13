/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

class Info extends Component {
  constructor(props) {
    super(props);
    const params = props.route.params;

    this.state = {
      name: params.name,
      introduce: params.introduce,
      newImage: false,
      edit: false,
      imageUri: '',
    };

    // console.log(params);
  }

  onChangeInput = (value) => {
    this.setState({introduce: value});
  };

  setEdit = () => {
    this.state.edit
      ? this.setState({edit: false})
      : this.setState({edit: true});
  };

  selectImage = () => {
    launchImageLibrary({}, (response) => {
      this.setState({
        newImage: true,
        imageUri: response.uri,
      });
    });
  };

  render() {
    return (
      <View
        style={{flex: 1, padding: 100, paddingTop: 150, alignItems: 'center'}}>
        {this.state.edit ? (
          <TouchableOpacity
            style={{padding: 15, backgroundColor: 'white', borderRadius: 40}}
            onPress={() => this.selectImage()}>
            {this.state.newImage ? (
              <Image
                source={{uri: this.state.imageUri}}
                style={{height: 120, width: 120}}
                resizeMode={'cover'}
              />
            ) : (
              <Image
                source={require('../../assests/images/good.png')}
                style={{height: 120, width: 120}}
                resizeMode={'cover'}
              />
            )}
            <Icon
              name="image-edit-outline"
              size={20}
              style={{position: 'absolute', left: 125, top: 135}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{padding: 15, backgroundColor: 'white', borderRadius: 40}}
            onPress={() => this.props.navigation.navigate('EnlargedImage')}>
            {this.state.newImage ? (
              <Image
                source={{uri: this.state.imageUri}}
                style={{height: 120, width: 120}}
                resizeMode={'cover'}
              />
            ) : (
              <Image
                source={require('../../assests/images/good.png')}
                style={{height: 120, width: 120}}
                resizeMode={'cover'}
              />
            )}
          </TouchableOpacity>
        )}
        <View style={{padding: 15, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {this.state.name}
          </Text>
        </View>
        <View>
          {this.state.edit ? (
            <TextInput
              value={this.state.introduce}
              onChangeText={(value) => this.onChangeInput(value)}
              editable={true}
              multiline={true}
            />
          ) : (
            <TextInput
              value={this.state.introduce}
              onChangeText={(value) => this.onChangeInput(value)}
              editable={false}
              multiline={true}
            />
          )}
        </View>
        <View style={{padding: 50}}>
          {this.state.edit ? (
            <TouchableOpacity onPress={() => this.setEdit()}>
              <Icon name="check-circle-outline" size={60} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.setEdit()}>
              <Icon name="square-edit-outline" size={60} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Info;
