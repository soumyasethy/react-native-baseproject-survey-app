import * as React from 'react';
import {Network} from '../network';
import {_goBack} from '../navigator/_goToPage';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {COLORS, _retrieveData, _storeData} from 'component-library';
import {constants} from '../constants';
import {storeType} from '../store/storeType';
import {API} from '../constants/Api';
import Snackbar from 'react-native-snackbar';

export const AppContextX = React.createContext({
  syncWithServer: () => {},
  syncWithDb: () => {},
  signIn: () => {},
  getSurveys: () => {},
  onSubmitSurvey: () => {},
});

const AppContext = () => {
  return ({children, ...props}: any) => {
    // console.warn('***StoreProps***', props);
    const authContext = React.useMemo(() => {
      return {
        globalProps: props,
        syncWithDb: async () => {
          await props.dbSyncStore.syncAllDbToStore();
        },
        syncWithServer: async () => {
          if (!props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray)
            return;

          await props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray.map(
            async (surveysSubmittedSyncedItem: any) => {
              await Network.surveySubmit(
                API.bulkSubmit,
                surveysSubmittedSyncedItem,
              ).then(async response => {
                if (!response) return;
                await props.dbSyncStore.updateStoreToDb(
                  [
                    /*props.dbSyncStore.surveysSubmittedOfflineArray,*/ surveysSubmittedSyncedItem,
                  ],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedSyncedArray,
                  false,
                );
                await props.dbSyncStore.updateStoreToDb(
                  [],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedOfflineArray,
                  true,
                );

                await props.dbSyncStore.updateStoreToDb(
                  [],
                  constants.asyncStorageKeys.dbSyncType.surveysOngoingArray,
                  true,
                );
                console.warn('*** response bulk submit ***', response.status);
              });
            },
          );
        },
        signIn: async (userName: string, password: string) => {
          Network.login(userName, password).then(response => {
            props.userStore.setToken(response?.data?.token);
          });
        },
        getSurveys: async () => {
          props.surveyStore.setLoading(true);
          await Network.getSurveys().then(response => {
            props.dbSyncStore.updateStoreToDb(
              response?.data,
              constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
              true,
            );
            props.dbSyncStore.setLoading(false);
          });
        },
        onSubmitSurvey: () => {
          let surveyAnswer =
            props.dbSyncStore.surveyMain[
              props.dbSyncStore.surveyMain.currentSurveyType
            ][props.dbSyncStore.surveyMain.currentActiveIndex];

          Network.surveySubmit(surveyAnswer.url, surveyAnswer).then(
            response => {
              if (response) {
                props.dbSyncStore.updateStoreToDb(
                  [{...surveyAnswer, answerId: Math.random() * 10000}],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedSyncedArray,
                  false,
                );
                Snackbar.show({
                  title: 'Saved Successfully',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: COLORS.green,
                });
              } else {
                Snackbar.show({
                  title: 'Saved Offline',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: COLORS.orange,
                });
                props.dbSyncStore.updateStoreToDb(
                  [surveyAnswer],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedOfflineArray,
                  false,
                );
              }
              props.dbSyncStore.updateStoreToDb(
                [],
                constants.asyncStorageKeys.dbSyncType.surveysOngoingArray,
                true,
              );
              _goBack();
            },
          );
        },
      };
    }, []);

    return (
      <AppContextX.Provider value={authContext}>
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
          <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
          {children}
        </SafeAreaView>
      </AppContextX.Provider>
    );
  };
};
export default AppContext();
