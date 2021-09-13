import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//Screens
import SignIn from './components/auth';
import Diary from './components/diary';
import News from './components/news';
import Friends from './components/friends';
import Map from './components/map';

import DiaryDocu from './components/diary/diaryDocu';
import Info from './components/friends/info';
import Chat from './components/friends/chat';
import EnlargedImage from './components/friends/enlargeImage';
import Logo from './utils/logo';
// import Loading from './components/auth/loading';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthStack = createStackNavigator();
const MainScreenTab = createBottomTabNavigator();
const DiaryStack = createStackNavigator();

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
  headerTitle: '',
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
  if (name === 'Diary') {
    iconName = 'notebook-outline';
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

const DiaryStackComponent = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen name="Map" component={Map} />
      <DiaryStack.Screen
        name="Diary"
        component={Diary}
        options={headerConfig_}
      />
      <DiaryStack.Screen
        name="DiaryDocu"
        component={DiaryDocu}
        options={headerConfig}
      />
    </DiaryStack.Navigator>
  );
};

const NewsStackComponent = () => {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen name="News" component={News} options={headerConfig_} />
    </DiaryStack.Navigator>
  );
};

const FriendsStackComponent = ({navigation, route}) => {
  // console.log('route.state ? ', route.state && route.state);
  // console.log('route.state.index ? ', route.state && route.state.index);
  route.state && route.state.index > 0
    ? navigation.setOptions({tabBarVisible: false})
    : navigation.setOptions({tabBarVisible: true});
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name="Friends"
        component={Friends}
        options={headerConfig_}
      />
      <DiaryStack.Screen name="Info" component={Info} options={headerConfig} />
      <DiaryStack.Screen name="Chat" component={Chat} />
      <DiaryStack.Screen
        name="EnlargedImage"
        component={EnlargedImage}
        options={headerConfig}
      />
    </DiaryStack.Navigator>
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
      initialRouteName="Diary"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => TabBarIcons(focused, route.name),
      })}>
      <MainScreenTab.Screen name="Friends" component={FriendsStackComponent} />
      <MainScreenTab.Screen name="Diary" component={DiaryStackComponent} />
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
