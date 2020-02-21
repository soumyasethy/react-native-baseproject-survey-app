import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Navigator} from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import {Network} from './src/network';

const App: () => any = () => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      // Network.SetupInterceptor();
      setLoading(true);
      const userToken = true; //tokenX; //await AsyncStorage.getItem('token');
      if (userToken) {
        setToken(userToken);
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Provider {...stores}>
      <Navigator token={token} />
    </Provider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

const tokenX =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo3MDUwLCJ1c2VybmFtZSI6InVzZXJfY2hhdHRhcnB1ciIsImV4cCI6MTU4NDQ0MTgzMCwiZW1haWwiOiIiLCJvcmlnX2lhdCI6MTU4MTg0OTgzMH0.2J5rzJo8bIOwQz9yrEPo8HtY6wF77eoV-xgXJeq6VDI';
