/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import codePush from 'react-native-code-push';
import {constants} from './src/constants';

let codePushOptions = {
  // checkFrequency: codePush.CheckFrequency.ON_APP_START,
  // installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};

AppRegistry.registerComponent(appName, () => {
  // codePush.sync({deploymentKey: constants.keys.codePushStaging});
  codePush.notifyAppReady();
  return codePush(codePushOptions)(App);
});
