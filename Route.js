import React, { Component } from 'react';
import Home from './Home';
import Event from './Event';
import Profile from './Profile';
import { Icon } from 'react-native-elements';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {
  createBottomTabNavigator,
} from 'react-navigation';

const Route = createMaterialBottomTabNavigator({
  Home: {
    screen: Home, navigationOptions: {
      title: '',
      tabBarIcon: ({ focused }) => (<Icon type='octicon' name="home" color={focused ? "#1976D2" : "#aaa"} size={23} />)
    }
  },
  Event: {
    screen: Event, navigationOptions: {
      title: '',
      tabBarIcon: ({ focused }) => (<Icon type='octicon' iconStyle={{ marginTop: 2 }} name="calendar" color={focused ? "#1976D2" : "#aaa"} size={22} />)
    }
  },
  Profile: {
    screen: Profile, navigationOptions: {
      title: '',
      tabBarIcon: ({ focused }) => (<Icon type='octicon' iconStyle={{ marginTop: 2 }} name="three-bars" color={focused ? "#1976D2" : "#aaa"} size={23} />)
    }
  }
}, {
    initialRouteName: 'Home',
    activeTintColor: '#0D47A1',
    showLabel: false,
    barStyle: {
      height: 44,
      backgroundColor: '#fff',
      borderWidth: 0.5,
      borderColor: '#d6d7da',
    }
  }
);

export default Route;

