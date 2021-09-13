/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import {CLIENT_ID, CLIENT_SECERET} from '../../utils/misc';

class MapComponent extends Component {
  state = {
    loc: {
      lat: 37.564362,
      lot: 126.977011,
    },
    address: '',
  };

  getloc = (e) => {
    console.log(e);
    this.setState({loc: {lat: e.latitude, lot: e.longitude}});
  };

  getAddress = async () => {
    await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${this.state.loc.lot},${this.state.loc.lat}&sourcecrs=epsg:4326&output=json&orders=addr,roadaddr
      `,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': '5gikt2ep43',
          'X-NCP-APIGW-API-KEY': 'p3k7xH75G8QvPxWORocGDJrKmOVIzCHzZGf2oaWr',
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
          if (
            responseJson.results[key].name === 'addr' &&
            responseJson.results[key].land.number2 !== ''
          ) {
            jibunAddr = `${item.region.area1.name} ${item.region.area2.name} ${item.region.area3.name} ${item.land.number1} - ${item.land.number2} ${item.land.addition0.value}`;
          } else if (responseJson.results[key].name === 'roadaddr') {
            roadAddr = `${item.region.area1.name} ${item.region.area2.name} ${item.land.name} ${item.land.number1} ${item.land.addition0.value}`;
          }
        }
        console.log('road: ', roadAddr + ' jibun: ', jibunAddr);
      })
      .catch((e) => console.log(e));
  };

  render() {
    const P0 = {latitude: 37.564362, longitude: 126.977011};
    const P1 = {latitude: 37.565051, longitude: 126.978567};
    const P2 = {latitude: 37.565383, longitude: 126.976292};
    return (
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        center={{...P0, zoom: 16}}
        onTouch={() => this.getAddress()}
        // onCameraChange={(e) =>
        //   console.warn('onCameraChange', JSON.stringify(e))
        // }
        onMapClick={(e) => this.getloc(e)}>
        <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} />
        <Marker
          coordinate={P1}
          pinColor="blue"
          onClick={() => console.warn('onClick! p1')}
        />
        <Marker
          coordinate={P2}
          pinColor="red"
          onClick={() => console.warn('onClick! p2')}
        />
        <Path
          coordinates={[P0, P1]}
          onClick={() => console.warn('onClick! path')}
          width={10}
        />
        <Polyline
          coordinates={[P1, P2]}
          onClick={() => console.warn('onClick! polyline')}
        />
        <Circle
          coordinate={P0}
          color={'rgba(255,0,0,0.3)'}
          radius={200}
          onClick={() => console.warn('onClick! circle')}
        />
        <Polygon
          coordinates={[P0, P1, P2]}
          color={'rgba(0, 0, 0, 0.5)'}
          onClick={() => console.warn('onClick! polygon')}
        />
      </NaverMapView>
    );
  }
}

const styles = StyleSheet.create({});

export default MapComponent;
