import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const Input = (props) => {
  let templete = null;
  switch (props.type) {
    case 'textinput':
      templete = <TextInput {...props} style={styles.input} />;
      break;
    case 'textinputRevised':
      templete = <TextInput {...props} style={styles.inputRevised} />;
      break;

    default:
      return templete;
  }
  return templete;
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 17,
    padding: 5,
    marginTop: 25,
  },
  inputRevised: {
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: 'red',
    fontSize: 17,
    padding: 5,
    marginTop: 25,
  },
});

export default Input;
