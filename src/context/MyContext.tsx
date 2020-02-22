import * as React from 'react';
import {AsyncStorage} from 'react-native';
import {Network} from '../network';
import {pageType} from '../navigator/pageType';
import {_goToPage} from '../navigator/RootNavigator';

export const AuthContext = React.createContext();

const MyContext = () => {
  return ({children, ...props}) => {
    const [state, dispatch] = React.useReducer(
      (prevState, action) => {
        switch (action.type) {
          case 'RESTORE_TOKEN':
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            };
          case 'SIGN_IN': {
            console.warn('SIGN_IN', action.token);
            return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
            };
          }
          case 'SIGN_OUT':
            return {
              ...prevState,
              isSignout: true,
              userToken: null,
            };
          case 'GET_SURVEY': {
            console.warn('SIGN_IN', action.token);
            return {
              ...prevState,
              isSignout: false,
              surveys: action.data,
            };
          }
        }
      },
      {
        isLoading: true,
        isSignout: false,
        userToken: null,
        surveys: [],
      },
    );

    React.useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
          // Restoring token failed
        }

        // After restoring token, we may need to validate it in production apps
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      };

      bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
      () => ({
        signIn: async (userName: string, password: string) => {
          console.warn('Sign In Clicked...');
          Network.login(userName, password).then(res => {
            console.warn('***context api res***', res);

            //props.userStore.setToken('dummy-token');
            dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
          });
        },
        signOut: () => dispatch({type: 'SIGN_OUT'}),
        getSurveys: () => {
          console.warn('GET_SURVEY Clicked...');
          Network.getSurveys().then(response => {
            console.warn('GET_SURVEY context response...', response.data);
            //dispatch({type: 'GET_SURVEY', surveys: response.data});
          });
        },
      }),
      [],
    );
    return (
      <AuthContext.Provider value={authContext}>
        {children}
      </AuthContext.Provider>
    );
  };
};
export default MyContext();

export function ContextHOC(WrappedComponent: any) {
  console.warn('WrappedComponent->', WrappedComponent);
  return ({...props}) => {
    console.warn('props->', props);
    // Wraps the input component in a container, without mutating it. Good!
    return <WrappedComponent {...props} test={() => console.warn('Test...')} />;
  };
}
