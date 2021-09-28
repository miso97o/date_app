/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';
import NaverMapView, {Marker, Align} from 'react-native-nmap';
import {Picker} from '@react-native-picker/picker';
import {CLIENT_ID, CLIENT_SECERET} from '../../utils/misc';

class MapComponent extends Component {
  state = {
    loc: {
      latitude: 0,
      longitude: 0,
    },
    address: '',
    marker: {
      latitude: 0,
      longitude: 0,
    },
    touched: false,
    mode: 'enter', // create or enter
    title: '',
    category: '',
  };

  getloc = (e) => {
    this.setState({
      loc: {latitude: e.latitude, longitude: e.longitude},
      touched: false,
    });
  };

  getAddress = async (longitude, latitude) => {
    await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${longitude},${latitude}&sourcecrs=epsg:4326&output=json&orders=addr,roadaddr
      `,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
          'X-NCP-APIGW-API-KEY': CLIENT_SECERET,
        },
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        let jibunAddr = '';
        let roadAddr = '';
        for (let key in responseJson.results) {
          const item = responseJson.results[key];
          if (responseJson.results[key].name === 'addr') {
            jibunAddr = `${item.region.area1.name} ${item.region.area2.name} ${item.region.area3.name} ${item.land.number1} `;
            if (item.land.number2) {
              jibunAddr += `- ${item.land.number2}`;
            }
          } else if (responseJson.results[key].name === 'roadaddr') {
            roadAddr = `${item.region.area1.name} ${item.region.area2.name} ${item.land.name} ${item.land.number1} ${item.land.addition0.value}`;
          }
        }
        console.log('road: ', roadAddr + ' jibun: ', jibunAddr);
        roadAddr === ''
          ? this.setState({address: jibunAddr})
          : this.setState({address: roadAddr});
      })
      .catch((e) => console.log(e));
  };

  touchedMarker = (P) => {
    // this.getAddress(P.longitude, P.latitude);
    return <Marker coordinate={P} width={80} height={90} />;
  };

  modeChange = () => {
    this.state.mode === 'create'
      ? this.setState({mode: 'enter'})
      : this.setState({mode: 'create'});
    console.log(this.state.mode);
  };

  onChangeInput = (value) => {
    this.setState({title: value});
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  render() {
    const P0 = {latitude: 37.564362, longitude: 126.977011};
    const P1 = {latitude: 37.565051, longitude: 126.978567};
    const P2 = {latitude: 37.565383, longitude: 126.976292};
    const P3 = {latitude: 37.564562, longitude: 126.976592};
    const P = [P0, P1, P2, P3];
    return (
      <View>
        {this.state.mode === 'enter' ? (
          <View>
            {this.state.touched ? (
              // enter에 touched가 true
              <View>
                <NaverMapView
                  style={{width: '100%', height: '85%'}}
                  showsMyLocationButton={true}
                  center={{...this.state.marker, zoom: 16}}
                  onMapClick={() => this.setState({touched: false})}>
                  {P.map((item, idx) => (
                    <Marker
                      coordinate={item}
                      key={idx}
                      onClick={() => [
                        this.setState({
                          marker: {
                            longitude: item.longitude,
                            latitude: item.latitude,
                          },
                        }),
                        this.getAddress(item.longitude, item.latitude),
                      ]}
                    />
                  ))}
                  {this.state.touched
                    ? this.touchedMarker(this.state.marker)
                    : null}
                </NaverMapView>
                <View style={styles.container}>
                  <View>
                    <Text style={styles.titleText}>제목</Text>
                    <Text style={styles.defText}>카테고리</Text>
                    <Text style={styles.defText}>{this.state.address}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Chat')}>
                    <Text>참여</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // enter에 touched가 false
              <View>
                <NaverMapView
                  style={{width: '100%', height: '90%'}}
                  showsMyLocationButton={true}
                  center={{...P0, zoom: 16}}>
                  {P.map((item, idx) => (
                    <Marker
                      coordinate={item}
                      key={idx}
                      onClick={() => [
                        this.setState({
                          touched: true,
                          marker: {
                            longitude: item.longitude,
                            latitude: item.latitude,
                          },
                        }),
                        this.getAddress(item.longitude, item.latitude),
                      ]}
                    />
                  ))}
                  {this.state.touched
                    ? this.touchedMarker(this.state.marker)
                    : null}
                </NaverMapView>
                <View
                  style={{
                    height: '10%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#09affc',
                  }}>
                  <TouchableOpacity onPress={() => this.modeChange()}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                      방 만들기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          //mode가 create
          <View>
            <NaverMapView
              style={{width: '100%', height: '85%'}}
              center={{...P0, zoom: 16}}
              onMapClick={(e) => [
                this.getloc(e),
                this.getAddress(e.longitude, e.latitude),
              ]}>
              <Marker coordinate={this.state.loc} />
            </NaverMapView>
            <View style={styles.container}>
              <View>
                <TextInput
                  value={this.state.title}
                  onChangeText={(value) => this.onChangeInput(value)}
                  style={[
                    styles.titleText,
                    {backgroundColor: 'white', marginLeft: 5},
                  ]}
                  autoCapitalize={false}
                  placeholder="제목을 입력해주세요. "
                />
                <Picker
                  selectedValue={this.state.category}
                  onValueChange={(value, idx) =>
                    this.setState({category: value})
                  }
                  style={{backgroundColor: 'white', margin: 5, height: 20}}>
                  <Picker.Item label="운동" value="운동" />
                  <Picker.Item label="거래" value="거래" />
                  <Picker.Item label="이성" value="이성" />
                  <Picker.Item label="식사" value="식사" />
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.modeChange()}>
                <Text>완성</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defText: {
    padding: 3,
    paddingLeft: 10,
    color: 'gray',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    padding: 2,
  },
  button: {
    backgroundColor: 'skyblue',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
  },
});

export default MapComponent;
