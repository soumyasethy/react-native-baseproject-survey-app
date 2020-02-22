import * as React from 'react';
import {Network} from '../network';

export const AppContextX = React.createContext(null);

const AppContext = () => {
  return ({children, ...props}: any) => {
    console.warn('***StoreProps***', props);
    const authContext = React.useMemo(
      () => ({
        test: (message: any) => {
          console.warn('***Test***', message);
        },
        signIn: async (userName: string, password: string) => {
          Network.login(userName, password).then(res => {
            props.userStore.setToken('dummy-token');
          });
        },
      }),
      [],
    );

    return (
      <AppContextX.Provider value={authContext}>
        {children}
      </AppContextX.Provider>
    );
  };
};
export default AppContext();
