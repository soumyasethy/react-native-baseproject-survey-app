import {NavigationNativeContainer} from '@react-navigation/native';
import {Login} from '../screens/Login';
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Surveys from '../screens/Surveys';
import TakeSurvey from '../screens/TakeSurvey';
import {pageType} from './pageType';
import {navigationRef, isMountedRef} from './RootNavigator';
import {YellowBox} from 'react-native';
const Stack = createStackNavigator();
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

  useEffect(() => {
    // console.warn('Token Updated', props.token);
  }, [props.token]);

  return (
    <NavigationNativeContainer ref={navigationRef}>
      {props.token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationNativeContainer>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={pageType.Surveys}>
      <Stack.Screen
        name={pageType.Surveys}
        component={Surveys}
        options={{
          title: 'Surveys',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: /*state.isSignout ? 'pop' : */ 'push',
        }}
      />
      <Stack.Screen
        name={pageType.TakeSurvey}
        component={TakeSurvey}
        options={{
          title: 'Take Survey',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: /*state.isSignout ? 'pop' : */ 'push',
        }}
      />
    </Stack.Navigator>
  );
};
const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={pageType.Login}>
      <Stack.Screen name={pageType.Login} component={Login} />
    </Stack.Navigator>
  );
};
