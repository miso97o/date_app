import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//Screens
import SignIn from './components/auth';
import News from './components/news';
import Friends from './components/friends';
import Map from './components/map';

import Info from './components/friends/info';
import Chat from './components/friends/chat';
import EnlargedImage from './components/friends/enlargeImage';
import Logo from './utils/logo';
// import Loading from './components/auth/loading';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getFocusedRouteNameFromRoute} from '@react-navigation/core';

const AuthStack = createStackNavigator();
const MainScreenTab = createBottomTabNavigator();
const MapStack = createStackNavigator();

const headerConfig = {
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: 'skyblue',
  },
  headerTitle: '',
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
  },
};

const headerConfig_ = {
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: 'skyblue',
  },
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
  },
  headerLeft: null,
};

/*
    Stack Navigator
        - Stack Screen A

    Stack Navigator
        - Tab Navigator
            - Tab Screen B
            - Tab Screen C
*/

const TabBarIcons = (focused, name) => {
  let iconName, iconSize;
  if (name === 'Map') {
    iconName = 'map-outline';
  } else if (name === 'News') {
    iconName = 'newspaper-variant-outline';
  } else if (name === 'Friends') {
    iconName = 'account-box-outline';
  }

  if (focused) {
    iconSize = 37;
  } else {
    iconSize = 32;
  }

  return <Icon name={iconName} size={iconSize} color="#fff" />;
};

const MapStackComponent = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="Map"
        component={Map}
        options={{headerShown: false}}
      />
      <MapStack.Screen name="Chat" component={Chat} />
    </MapStack.Navigator>
  );
};

const NewsStackComponent = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="News" component={News} options={headerConfig_} />
    </MapStack.Navigator>
  );
};

const FriendsStackComponent = () => {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="Friends"
        component={Friends}
        options={headerConfig_}
      />
      <MapStack.Screen name="Info" component={Info} options={headerConfig} />
      <MapStack.Screen name="Chat" component={Chat} />
      <MapStack.Screen
        name="EnlargedImage"
        component={EnlargedImage}
        options={headerConfig}
      />
    </MapStack.Navigator>
  );
};

// 메인이 되는 탭 네비게이터
const AppTabComponent = () => {
  return (
    <MainScreenTab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeBackgroundColor: '#97CEFA',
        inactiveBackgroundColor: 'skyblue',
        style: {
          backgroundColor: 'skyblue',
        },
        keyboardHidesTabBar: true,
      }}
      initialRouteName="Map"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => TabBarIcons(focused, route.name),
      })}>
      <MainScreenTab.Screen name="Friends" component={FriendsStackComponent} />
      <MainScreenTab.Screen
        name="Map"
        component={MapStackComponent}
        options={({route}) => ({
          tabBarVisible:
            getFocusedRouteNameFromRoute(route) === 'Chat' ? false : true,
        })}
      />
      <MainScreenTab.Screen name="News" component={NewsStackComponent} />
    </MainScreenTab.Navigator>
  );
};

// 인증 확인 네비게이터, 앱 폴더의 index.js에서 사용
export const RootNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {/* <AuthStack.Screen name="Loading" component={Loading} /> */}
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={() => ({gestureEnabled: false})}
      />
      <AuthStack.Screen
        name="AppTabComponent"
        component={AppTabComponent}
        options={() => ({gestureEnabled: false})}
      />
    </AuthStack.Navigator>
  );
};
