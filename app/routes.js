import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/routers';

//Screens
import SignIn from './components/auth';
import News from './components/news';
import Friends from './components/friends';
import Map from './components/map';

import Info from './components/friends/info';
import Chat from './components/chat/chat';
import EnlargedImage from './components/friends/enlargeImage';
import MapDrawer from './components/map/mapDrawer';
import ChatDrawer from './components/chat/chatDrawer';
import Evaluate from './components/friends/evaluate';
import Loading from './components/auth/loading';
import Logo from './utils/logo';
// import Loading from './components/auth/loading';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';

const AuthStack = createStackNavigator();
const MainScreenTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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

// App
// - Stack Auth

// - Stack Component
// 	- Tab Component
// 		- My Profile Screen
// 		- Map Drawer
// 			- Home map
// 			- Profile setting
// 			- etc..
// 		- News Screen
// 	- Chat Drawer
// 		- User Profile Screen
// 		- Leave Room button
//    - etc...

const MapDrawerComponent = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerContent={(props) => <MapDrawer {...props} />}>
      <Drawer.Screen name="Home" component={Map} />
      <Drawer.Screen name="Info" component={Info} />
    </Drawer.Navigator>
  );
};

const ChatDrawerComponent = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerPosition="right"
      drawerContent={(props) => <ChatDrawer {...props} />}>
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Info" component={Info} />
    </Drawer.Navigator>
  );
};

const NewsStackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="News" component={News} options={headerConfig_} />
    </Stack.Navigator>
  );
};

const FriendsStackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Friends"
        component={Friends}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Evaluate"
        component={Evaluate}
        options={{headerTitle: ''}}
      />
      <Stack.Screen name="Info" component={Info} options={headerConfig} />
      <Stack.Screen
        name="EnlargedImage"
        component={EnlargedImage}
        options={headerConfig}
      />
    </Stack.Navigator>
  );
};

// 메인이 되는 탭 네비게이터
const MainTabComponent = () => {
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
      <MainScreenTab.Screen name="Map" component={MapDrawerComponent} />
      <MainScreenTab.Screen name="News" component={NewsStackComponent} />
    </MainScreenTab.Navigator>
  );
};

// 인증 확인 네비게이터, 앱 폴더의 index.js에서 사용
export const RootNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Loading"
        component={Loading}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={() => ({gestureEnabled: false, headerShown: false})}
      />
      <AuthStack.Screen
        name="Main"
        component={MainTabComponent}
        options={() => ({gestureEnabled: false, headerShown: false})}
      />
      <AuthStack.Screen
        name="Chat"
        component={ChatDrawerComponent}
        options={({navigation}) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{marginRight: 10}}>
              <Icon name="menu" size={36} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => navigation.navigate('Main')}>
              <Icon name="map-outline" size={36} />
            </TouchableOpacity>
          ),
          headerTitle: '채팅방',
        })}
      />
    </AuthStack.Navigator>
  );
};
