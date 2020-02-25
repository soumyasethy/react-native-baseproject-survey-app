import {NavigationNativeContainer} from '@react-navigation/native';
import Login from '../screens/Login';
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Surveys from '../screens/Surveys';
import TakeSurvey from '../screens/TakeSurvey';
import {pageType} from './pageType';
import {navigationRef, isMountedRef} from './_goToPage';
import {ActivityIndicator, StyleSheet, View, YellowBox} from 'react-native';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_retrieveData} from 'component-library';
import {constants} from '../constants';
import {Network} from '../network';
import {AppNavigator} from './AppNavigator';

export const Navigator = props => {
  React.useEffect(() => {
    isMountedRef.current = true;
    YellowBox.ignoreWarnings([
      'Warning: componentWill',
      'Warning: Async Storage',
      'Warning: Each',
      'VirtualizedLists',
      'Warning: Functions',
    ]);
    return () => (isMountedRef.current = false);
  }, []);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userToken = await _retrieveData(constants.asyncStorageKeys.token);
      if (!!userToken) {
        props.userStore.setToken(userToken);
        Network.SetupInterceptor(userToken);
      }
      setLoading(false);
    };
    init();
  }, [props.userStore.token]);
  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationNativeContainer ref={navigationRef}>
      <AppNavigator {...props} token={props.userStore.token} />
    </NavigationNativeContainer>
  );
};
export default inject(storeType.userStore)(observer(Navigator));

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
