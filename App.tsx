/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';

import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {NavigationProp} from '@react-navigation/core';
import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

type Props = {
  navigation: NavigationProp;
};
function Login(props: Props) {
  return (
    <View style={style.container}>
      <View style={style.inputContainer}>
        <Text style={style.label}>Username</Text>
        <TextInput placeholder="Username" style={style.input} />
      </View>

      <View style={style.inputContainer}>
        <Text style={style.label}>Password</Text>
        <TextInput placeholder="******" secureTextEntry style={style.input} />
      </View>
      <Button
        title="Login"
        onPress={async () => {
          const {navigation} = props;

          // testing purpose
          //await AsyncStorage.setItem('token', 'yourtoken');
          navigation.navigate('Home');
        }}
      />
    </View>
  );
}

function Home() {
  return (
    <View style={style.container}>
      <Text>Home Page</Text>
    </View>
  );
}

const App: () => any = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const userToken = ''; //await AsyncStorage.getItem('token');

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
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
  label: {
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default App;
