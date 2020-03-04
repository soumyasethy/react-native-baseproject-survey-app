import React from 'react';
import Navigator from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import AppContext from './src/context/AppContext';
import SplashScreen from './src/lib/spalshScreen';
import {Platform, PermissionsAndroid} from 'react-native';
import {_logout} from 'component-library';

const App: () => any = () => {
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      //GetAllPermissions();
      //SplashScreen.hide();
    }
    // _logout();
  }, []);
  return (
    <Provider {...stores}>
      <AppContext {...stores}>
        <Navigator />
      </AppContext>
    </Provider>
  );
};
export default App;

export async function GetAllPermissions() {
  try {
    if (Platform.OS === 'android') {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return userResponse;
    }
  } catch (err) {
    console.warn('Err', err);
  }
  return null;
}
