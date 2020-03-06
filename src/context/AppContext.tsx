import * as React from 'react';
import {Network} from '../network';
import {_goBack} from '../navigator/_goToPage';
import {SafeAreaView, StatusBar} from 'react-native';
import {COLORS} from 'component-library';
import {constants} from '../constants';
import Snackbar from 'react-native-snackbar';
import {showMessage} from '../utils/showMessage';

export const AppContextX = React.createContext({
  access_token: '',
  syncWithServer: () => {},
  syncWithDb: () => {},
  signIn: () => {},
  getSurveys: () => {},
  onSubmitSurvey: () => {},
  uploadPicture: (url: string, callback: any) => {},
});

const AppContext = () => {
  return ({children, ...props}: any) => {
    // console.warn('***StoreProps***', props);
    const authContext = React.useMemo(() => {
      return {
        globalProps: props,
        access_token: props.userStore.token,
        uploadPicture: async (uri: string, callback: any) => {
          let surveyAnswer =
            props.dbSyncStore.surveyMain[
              props.dbSyncStore.surveyMain.currentSurveyType
            ][props.dbSyncStore.surveyMain.currentActiveIndex];

          if (!uri) return;
          try {
            let uploadResponse = await Network.uploadPicture(
              surveyAnswer.upload_url,
              uri,
              props.userStore.token,
            );
            !!callback &&
              (await callback(
                JSON.parse(uploadResponse.data).public_url || uri,
              ));
            return JSON.parse(uploadResponse.data).public_url || uri;
          } catch (e) {
            console.warn('Error in Uploading Pic', e);
            !!callback && (await callback(uri));
            return uri;
          }
        },
        syncWithDb: async () => {
          await props.dbSyncStore.syncAllDbToStore();
        },
        syncWithServer: async () => {
          let surveysSubmittedOfflineArray =
            props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray;
          if (!surveysSubmittedOfflineArray) return;
          /*console.warn(
            'surveysSubmittedOfflineArray',
            surveysSubmittedOfflineArray,
          );*/

          await surveysSubmittedOfflineArray.map(
            async (surveysSubmittedOfflineItem: any, surveyIndex: number) => {
              const assetsUpload: any[] = [];

              surveysSubmittedOfflineItem.questions.map(
                //Loop all question of each Survey
                async (question: any, questionIndex: number) => {
                  //Upload Logic goes here
                  if (
                    question.type === 'cameraPicker' &&
                    !!question.answer &&
                    question.answer.includes('file')
                  ) {
                    assetsUpload.push(
                      authContext.uploadPicture(
                        question.answer,
                        async (uploadedUrl: any) => {
                          //Uploaded URL Callback....
                          if (!uploadedUrl) return;
                          //Now update offline survey with uploaded url
                          let questionAnswer = {
                            ...question,
                            answer: uploadedUrl,
                          };
                          //Updating answer with S3BucketUrl...
                          surveysSubmittedOfflineArray[surveyIndex].questions[
                            questionIndex
                          ] = questionAnswer;
                        },
                      ),
                    );
                  }
                },
              );
              Promise.all(assetsUpload)
                .then(listOfS3BucketUrls => {
                  //List of S3BucketImageUrls ***
                  authContext.onSubmitSurvey(
                    surveysSubmittedOfflineArray[surveyIndex],
                  );
                })
                .catch(function(error) {
                  // if there's an error, log it
                  console.warn(error);
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
        onSubmitSurvey: (dynamicSurvey: any) => {
          let surveyAnswer =
            dynamicSurvey ||
            props.dbSyncStore.surveyMain[
              props.dbSyncStore.surveyMain.currentSurveyType
            ][props.dbSyncStore.surveyMain.currentActiveIndex];
          // console.warn('*****OnSubmit Survey***', surveyAnswer);

          Network.surveySubmit(surveyAnswer.url, surveyAnswer).then(
            response => {
              if (response) {
                props.dbSyncStore.updateStoreToDb(
                  [{...surveyAnswer, answerId: Math.random() * 10000}],
                  constants.asyncStorageKeys.dbSyncType
                    ./*surveysSubmittedOfflineArray*/ surveysSubmittedSyncedArray,
                  false,
                );

                showMessage('Saved Successfully', COLORS.green);
              } else {
                showMessage('Saved Offline', COLORS.orange);
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
              !dynamicSurvey && _goBack();
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
