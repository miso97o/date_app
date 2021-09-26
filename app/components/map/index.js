/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  BackHandler,
} from 'react-native';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
  Align,
} from 'react-native-nmap';
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
    mode: 'create', // create or enter
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
        this.setState({address: roadAddr});
      })
      .catch((e) => console.log(e));
  };

  touchedMarker = (P) => {
    // this.getAddress(P.longitude, P.latitude);
    return <Marker coordinate={P} width={80} height={90} />;
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
        {this.state.touched ? (
          <View>
            <NaverMapView
              style={{width: '100%', height: '85%'}}
              showsMyLocationButton={true}
              center={{...this.state.marker, zoom: 16}}
              // onCameraChange={(e) =>
              //   console.warn('onCameraChange', JSON.stringify(e))
              // }
              onMapClick={(e) => this.getloc(e)}>
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
              {/* {this.state.marker ? this.getAddress(this.state.marker) : null} */}
              {this.state.touched
                ? this.touchedMarker(this.state.marker)
                : null}
              {this.state.loc.latitude !== 0 ? (
                <Marker
                  coordinate={this.state.loc}
                  onClick={() =>
                    this.setState({
                      touched: true,
                      marker: {
                        longitude: this.state.loc.longitude,
                        latitude: this.state.loc.latitude,
                      },
                    })
                  }
                />
              ) : null}
            </NaverMapView>
            <View style={styles.container}>
              <View>
                <Text style={styles.titleText}>제목</Text>
                <Text style={styles.defText}>카테고리</Text>
                <Text style={styles.defText}>{this.state.address}</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'skyblue',
                  borderRadius: 15,
                  padding: 15,
                  marginRight: 15,
                }}
                onPress={() => this.props.navigation.navigate('Chat')}>
                <Text>참여</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <NaverMapView
              style={{width: '100%', height: '90%'}}
              showsMyLocationButton={true}
              center={{...P0, zoom: 16}}
              onMapClick={(e) => this.getloc(e)}>
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
              {this.state.loc.latitude !== 0 ? (
                <Marker
                  coordinate={this.state.loc}
                  onClick={() => [
                    this.setState({
                      touched: true,
                      marker: {
                        longitude: this.state.loc.longitude,
                        latitude: this.state.loc.latitude,
                      },
                    }),
                    this.getAddress(
                      this.state.loc.longitude,
                      this.state.loc.latitude,
                    ),
                  ]}
                />
              ) : null}
            </NaverMapView>
            <View
              style={{
                height: '10%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                  방 만들기
                </Text>
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
});

export default MapComponent;
