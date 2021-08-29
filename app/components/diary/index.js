/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {getDiaries} from '../../store/actions/diary_action';
import TextTruncate from 'react-native-text-truncate';

// 스마트폰 기종에 관계없이 상대적인 길이를 나타내기위해 사용하는 변수
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class DiaryComponent extends Component {
  componentDidMount() {
    this.props.dispatch(getDiaries());
  }

  renderDiary = (Diaries) =>
    // Diaries안에 documents 배열이 존재 -> Diaries는 reducer에서 react-native의 props로 가져온 state이다
    // action creator에서 action을 넘길때 payload에 DiaryData라는 배열을 넘기고 그것을 documens에 저장했음
    Diaries.documents
      ? Diaries.documents.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.props.navigation.push('DiaryDocu', {
                newDiray: false,
                diaryData: item,
                index: index,
                id: item.data.id,
              });
            }}>
            <View style={styles.diaryContainer}>
              <View style={{height: 160}}>
                {item.data.imagePath ? (
                  <View style={styles.indexView}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      # {index + 1}
                    </Text>
                    <Image
                      source={require('../../assests/images/image.png')}
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                    />
                  </View>
                ) : (
                  <View style={{paddingTop: 7, paddingLeft: 7}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      # {index + 1}
                    </Text>
                  </View>
                )}

                {item.data.date ? (
                  <View style={styles.dateView}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Date:{' '}
                    </Text>
                    <Text style={{fontSize: 16}}>{item.data.date}</Text>
                  </View>
                ) : null}

                {item.data.title ? (
                  <View style={styles.dateView}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Title:{' '}
                    </Text>
                    <Text style={{fontSize: 16}}>{item.data.title}</Text>
                  </View>
                ) : null}

                {item.data.description ? (
                  <View style={{paddingTop: 7, paddingLeft: 7}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Description:{' '}
                    </Text>
                    <TextTruncate style={{fontSize: 16}} numberOfLines={2}>
                      {item.data.description}
                    </TextTruncate>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        ))
      : null;

  checkNextID = (Diaries) => {
    if (Diaries.documents.length > 0) {
      let numOfArrayElements = Diaries.documents.length;
      let lastDiaryIndex = Number(numOfArrayElements) - 1;
      let NextDiaryID = Diaries.documents[lastDiaryIndex].data.id + 1;
      return NextDiaryID;
    } else {
      return 0;
    }
  };

  render() {
    return (
      <View>
        <ScrollView style={{backgroundColor: '#f0f0f0'}}>
          <View style={{flexDirection: 'column-reverse'}}>
            {this.renderDiary(this.props.Diaries)}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: screenWidth * 0.8,
            top: screenHeight * 0.7,
          }}
          onPress={() =>
            this.props.navigation.push('DiaryDocu', {
              // index는 Diary의 순서를 나타내고 id는 Diary의 고유한 id를 나타냄. id는 다른 diary가 수정, 삭제 되어도 변하지 않음
              newDiary: true,
              index: this.props.Diaries.documents.length,
              id: this.checkNextID(this.props.Diaries),
            })
          }>
          <Image
            source={require('../../assests/images/pen_circle.png')}
            style={{width: 50, height: 50}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  diaryContainer: {
    backgroundColor: '#fff',
    margin: 10,
    elevation: 2,
    borderRadius: 2,
  },
  indexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingLeft: 7,
    paddingRight: 12,
    alignItems: 'center',
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingTop: 7,
    paddingLeft: 7,
  },
});

function mapStateToProps(state) {
  return {
    Diaries: state.Diaries,
  };
}

export default connect(mapStateToProps)(DiaryComponent);
