/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {storage, database} from '../../utils/misc';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';

class DiaryDocu extends Component {
  constructor(props) {
    super(props);
    const params = props.route.params;
    // params에 있는 newDiary값에 따라서 작성 / 불러오기로 분기됨 false이면 state값에 params값을 옮겨줌
    !params.newDiary
      ? (this.state = {
          newDiary: false,
          isLoading: false,
          index: params.index,
          diaryData: {
            id: params.diaryData.data.id,
            date: params.diaryData.data.date,
            title: params.diaryData.data.title,
            description: params.diaryData.data.description,
            imagePath: params.diaryData.data.imagePath,
          },
          image: '',
        })
      : (this.state = {
          newDiary: true,
          isLoading: false,
          index: params.index,
          diaryData: {
            id: params.id,
            date: '',
            title: '',
            description: '',
            imagePath: '',
          },
        });
    // console.warn(this.state);
    !params.newDiary && params.diaryData.data.imagePath
      ? this.getImage()
      : null;
  }

  onChangeInput = (item, value) => {
    if (item === 'date') {
      this.setState((prevState) => ({
        diaryData: {
          ...prevState.diaryData,
          date: value,
        },
      }));
    } else if (item === 'title') {
      this.setState((prevState) => ({
        diaryData: {
          ...prevState.diaryData,
          title: value,
        },
      }));
    } else if (item === 'description') {
      this.setState((prevState) => ({
        diaryData: {
          ...prevState.diaryData,
          description: value,
        },
      }));
    }
  };

  // firebase의 storage에 저장된 이미지의 url값을 state의 image에 넣는 함수
  getImage = () => {
    storage
      .ref('diaryimage')
      .child(`index${this.state.diaryData.id}/image.jpg`)
      .getDownloadURL()
      .then((url) => {
        this.setState({image: url});
      });
  };

  // 갤러리의 이미지를 가져와서 state의 image에 할당하는 함수
  // image를 넣었으므로 imagePath의 값을 채워줘야 함.
  selectImage = () => {
    launchImageLibrary({}, (response) => {
      this.setState({
        image: response.uri,
      });
    });
    let imageDir = `diaryimage/index${this.state.diaryData.id}`;
    this.setState((prevState) => ({
      diaryData: {
        ...prevState.diaryData,
        imagePath: imageDir,
      },
    }));
  };

  deleteData = async () => {
    const id = this.state.diaryData.id;
    // child 함수는 인자로 들어간 파일의 경로를 찾음
    const databaseDirectory = `diary/${id}`;
    const databaseRef = database.ref(databaseDirectory).child('data');
    const storageDirectory = `diaryimage/index${id}`;
    const storageRef = storage.ref(storageDirectory).child('image.jpg');

    try {
      await databaseRef.remove();
      await storageRef
        .getDownloadURL()
        .then(() => {
          // getDownloadURL 함수를 사용해서 이미지 파일이 있으면 그 경로의 이미지 삭제
          storageRef.delete().then(() => {
            this.props.navigation.push('Diary');
          });
        })
        .catch(() => {
          // 이미지 파일이 없어서 그냥 Diary 화면으로 돌아감
          this.props.navigation.push('Diary');
        });
    } catch (err) {
      alert('삭제 실패: ', err.message);
    }
  };

  updateData = () => {
    this.setState({newDiary: true});
  };

  // 데이터 호출시에 데이터가 존재하는지 먼저 확인하고 호출하기위해 isLoading 사용
  createData = async () => {
    this.setState({isLoading: true});

    const data = this.state.diaryData;
    const id = data.id;

    const databaseDirectory = `diary/${id}`;
    const databaseRef = database.ref(databaseDirectory);
    const storageDirectory = `diaryimage/index${id}/image.jpg`;

    try {
      // set = databaseRef의 주소에 data를 쓰는 함수
      await databaseRef.set({data});
      this.uploadImage(storageDirectory);
    } catch (err) {
      // realtime database에 데이터를 쓰는게 실패했을 경우
      this.setState({isLoading: false});
      alert('저장 실패: ', err.message);
    }
  };

  uploadImage = async (imgDir) => {
    if (this.state.image) {
      // state.image에는 local 이미지 경로가 들어가있음
      const response = await fetch(this.state.image);
      const blob = await response.blob(); // 이미지를 서버에 저장할 수 있게 형태를 바꿈

      try {
        // eslint-disable-next-line prettier/prettier
        await storage.ref(imgDir).put(blob)
          .then(() => {
            this.setState({isLoading: false});
            this.props.navigation.push('Diary');
          });
      } catch (err) {
        this.setState({isLoading: false});
        alert('저장 실패: ', err.message);
      }
    } else {
      this.setState({isLoading: false});
      // naviagte와는 다르게 push는 화면에 대한 update사항이 반영되어 이동함
      this.props.navigation.push('Diary');
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={{flex: 1}} enabled={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.diaryContainer}>
            <View style={styles.indexView}>
              <Text style={styles.indexText}># {this.state.index + 1}</Text>
            </View>

            <View style={styles.dateView}>
              <Text style={styles.dateText}>Date: </Text>
              <View style={styles.dateInputView}>
                {this.state.newDiary ? (
                  <TextInput
                    value={this.state.diaryData.date}
                    style={{fontSize: 18, paddingTop: 0, paddingBottom: 0}}
                    placeholder="날짜"
                    placeholderTextColor="#777"
                    onChangeText={(value) => this.onChangeInput('date', value)}
                    editable={true}
                  />
                ) : (
                  <TextInput
                    value={this.state.diaryData.date}
                    style={{
                      fontSize: 18,
                      paddingTop: 0,
                      paddingBottom: 0,
                      color: 'black',
                    }}
                    editable={false}
                  />
                )}
              </View>
            </View>

            <View style={styles.dateView}>
              <Text style={styles.dateText}>Title: </Text>
              <View style={styles.dateInputView}>
                {this.state.newDiary ? (
                  <TextInput
                    value={this.state.diaryData.title}
                    style={{fontSize: 18, paddingTop: 0, paddingBottom: 0}}
                    placeholder="제목"
                    placeholderTextColor="#777"
                    onChangeText={(value) => this.onChangeInput('title', value)}
                    editable={true}
                  />
                ) : (
                  <TextInput
                    value={this.state.diaryData.title}
                    style={{
                      fontSize: 20,
                      paddingTop: 0,
                      paddingBottom: 0,
                      color: 'black',
                    }}
                    editable={false}
                  />
                )}
              </View>
            </View>

            <View style={styles.descriptionView}>
              <Text style={styles.dateText}>Description: </Text>
              <View style={[styles.dateInputView, styles.descriptionInputView]}>
                <ScrollView>
                  {this.state.newDiary ? (
                    <TextInput
                      value={this.state.diaryData.description}
                      style={{fontSize: 18, paddingTop: 0, paddingBottom: 0}}
                      placeholder="내용"
                      placeholderTextColor="#777"
                      onChangeText={(value) =>
                        this.onChangeInput('description', value)
                      }
                      editable={true}
                      multiline={true}
                    />
                  ) : (
                    <TextInput
                      value={this.state.diaryData.description}
                      style={{
                        fontSize: 20,
                        paddingTop: 0,
                        paddingBottom: 0,
                        color: 'black',
                      }}
                      editable={false}
                      multiline={true}
                    />
                  )}
                </ScrollView>
              </View>
            </View>

            <View style={styles.imageView}>
              <View style={{flex: 10, paddingRight: 15}}>
                <Text style={styles.dateText}>Image: </Text>
                <View style={[styles.dateInputView, styles.imageDisplayView]}>
                  {this.state.diaryData.imagePath ? (
                    <Image
                      source={{uri: this.state.image}}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="contain"
                    />
                  ) : null}
                </View>
              </View>
              <View style={{flex: 1, paddingTop: 30, paddingRight: 10}}>
                {this.state.newDiary ? (
                  <TouchableOpacity onPress={() => this.selectImage()}>
                    <Image
                      source={require('../../assests/images/image.png')}
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                    />
                  </TouchableOpacity>
                ) : (
                  <Image
                    source={require('../../assests/images/image.png')}
                    resizeMode="contain"
                    style={{width: 30, height: 30, opacity: 0.2}}
                  />
                )}
              </View>
            </View>

            <View style={styles.buttonView}>
              {!this.state.newDiary ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={{fontSize: 15, padding: 5}}
                    onPress={() => this.deleteData()}>
                    <Text>삭제</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {!this.state.newDiary ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={{fontSize: 15, padding: 5}}
                    onPress={() => this.updateData()}>
                    <Text>수정</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{fontSize: 15, padding: 5}}
                  onPress={() => this.createData()}>
                  <Text>완료</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Spinner
              visible={this.state.isLoading}
              textContent={'다이어리 업로드 중...'}
              overlayColor={'rgba(0,0,0,0.6)'}
              textStyle={{color: '#fff'}}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  diaryContainer: {
    flexDirection: 'column',
    backgroundColor: '#eee',
    height: '100%',
  },
  indexView: {
    flex: 1,
    paddingLeft: 15,
    marginTop: 10,
  },
  indexText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateView: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateInputView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderWidth: 1,
    borderRadius: 1,
    margin: 0.5,
  },
  descriptionView: {
    flex: 7,
    paddingLeft: 10,
    paddingRight: 10,
  },
  descriptionInputView: {
    flex: 0.95,
    marginTop: 5,
  },
  imageView: {
    flex: 4,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
  },
  imageDisplayView: {
    flex: 0.9,
    marginTop: 5,
  },
  buttonView: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15,
  },
  buttonContainer: {
    width: 80,
    height: 30,
    marginLeft: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiaryDocu;
