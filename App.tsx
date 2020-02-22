import React from 'react';
import Navigator from './src/navigator';
import {stores} from './src/store';
import {Provider} from 'mobx-react';
import AppContext from './src/context/AppContext';

const App: () => any = () => {
  return (
    <Provider {...stores}>
      <AppContext {...stores}>
        <Navigator />
      </AppContext>
    </Provider>
  );
};

export default App;
