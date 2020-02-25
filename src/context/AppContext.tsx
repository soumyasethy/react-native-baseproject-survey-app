import * as React from 'react';
import {Network} from '../network';
import {_goBack} from '../navigator/_goToPage';

export const AppContextX = React.createContext({
  signIn: () => {},
  getSurveys: () => {},
  onSubmitSurvey: () => {},
});

const AppContext = () => {
  return ({children, ...props}: any) => {
    // console.warn('***StoreProps***', props);
    const authContext = React.useMemo(
      () => ({
        globalProps: props,
        signIn: async (userName: string, password: string) => {
          Network.login(userName, password).then(response => {
            props.userStore.setToken(response?.data?.token);
          });
        },
        getSurveys: async () => {
          Network.getSurveys().then(response => {
            props.surveyStore.setTest(response?.data);
          });
        },
        onSubmitSurvey: () => {
          console.warn(
            '*** submit ***',
            props.surveyStore.test[props.surveyStore.activeSurveyIndex],
          );
          let surveyAnswer =
            props.surveyStore.test[props.surveyStore.activeSurveyIndex];
          Network.surveySubmit(surveyAnswer.url, surveyAnswer).then(
            response => {
              console.warn('*** response submit ***', response), _goBack();
            },
          );
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
