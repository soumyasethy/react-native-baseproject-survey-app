import React from 'react';
import Navigator from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import AppContext from './src/context/AppContext';
import codePush from 'react-native-code-push';

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const App: () => any = () => {
  return (
    <Provider {...stores}>
      <AppContext {...stores}>
        <Navigator />
      </AppContext>
    </Provider>
  );
};
export default codePush(codePushOptions)(App);
