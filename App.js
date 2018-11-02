import React, { Component } from 'react';
import { StackActions, createStackNavigator } from 'react-navigation';

import Route from './Route';
import Login from './component/login'

export default App = createStackNavigator({
  Route: {
      screen: Route,
      path: 'app',
    },
    Login: {
      screen: Login,
      path: 'login'
    },
  }, {
      headerMode: 'none'
    });