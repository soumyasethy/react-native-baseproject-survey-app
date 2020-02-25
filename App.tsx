import React from 'react';
import Navigator from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import AppContext from './src/context/AppContext';
import SplashScreen from './src/lib/spalshScreen';
import {Platform} from 'react-native';

const App: () => any = () => {
  // React.useEffect(() => {
  //   if (Platform.OS === 'android') SplashScreen.hide();
  // }, []);
  return (
    <Provider {...stores}>
      <AppContext {...stores}>
        <Navigator />
      </AppContext>
    </Provider>
  );
};
export default App;
