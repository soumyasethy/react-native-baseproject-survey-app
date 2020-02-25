import {pageType} from './pageType';
import Login from '../screens/Login';
import Surveys from '../screens/Surveys';
import TakeSurvey from '../screens/TakeSurvey';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
export const AppNavigator = props => {
  return (
    <Stack.Navigator initialRouteName={pageType.Surveys}>
      {!props.token ? (
        <Stack.Screen
          name={pageType.Login}
          component={Login}
          options={{
            headerShown: false,
            title: 'Login',
            animationTypeForReplace: 'pop',
          }}
        />
      ) : (
        <Stack.Screen
          name={pageType.Surveys}
          component={Surveys}
          options={{
            headerShown: false,
            title: 'Surveys',
            animationTypeForReplace: 'push',
          }}
        />
      )}
      <Stack.Screen
        name={pageType.TakeSurvey}
        component={TakeSurvey}
        options={{
          headerShown: false,
          title: 'Take Survey',
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
};
