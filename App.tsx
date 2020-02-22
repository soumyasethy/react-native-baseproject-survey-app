import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Navigator from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import {Network} from './src/network';
import MyContext, {ContextHOC} from './src/context/MyContext';

const App: () => any = () => {
  return (
    <Provider {...stores}>
      <MyContext>
        <Navigator />
      </MyContext>
    </Provider>
  );
};

export default App;

const tokenX =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo3MDUwLCJ1c2VybmFtZSI6InVzZXJfY2hhdHRhcnB1ciIsImV4cCI6MTU4NDQ0MTgzMCwiZW1haWwiOiIiLCJvcmlnX2lhdCI6MTU4MTg0OTgzMH0.2J5rzJo8bIOwQz9yrEPo8HtY6wF77eoV-xgXJeq6VDI';
