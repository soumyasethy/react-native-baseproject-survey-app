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
  uploadPictureX: (upload_url: any, uri: string) => {},
  syncWithServerX: () => {},
  syncWithServer: () => {},
  syncWithDb: () => {},
  signIn: () => {},
  getSurveys: () => {},
  onSubmitSurvey: () => {},
  uploadPicture: (upload_url: string, uri: string, token: string) => {},
});

const AppContext = () => {
  return ({children, ...props}: any) => {
    // console.warn('***StoreProps***', props);
    const appContext = React.useMemo(() => {
      return {
        globalProps: props,
        access_token: props.userStore.token,
        uploadPictureX: (upload_url: any, uri: string) => {
          return Network.uploadPicture(
            upload_url,
            uri,
            props.userStore.token,
          ).then((response: any) => {
            // console.warn('****response****', response.respInfo.status);
            return {
              status: response.respInfo.status,
              public_url: JSON.parse(response.data).public_url || uri,
            };
          });
        },
        uploadPicture: async (
          upload_url: string,
          uri: string,
          callback: any,
        ) => {
          // console.warn('upload_url', upload_url, 'uri', uri);
          let surveyAnswer =
            props.dbSyncStore.surveyMain[
              props.dbSyncStore.surveyMain.currentSurveyType
            ][props.dbSyncStore.surveyMain.currentActiveIndex];

          console.warn('surveyAnswer', surveyAnswer.upload_url);
          if (!surveyAnswer || !uri) return;
          try {
            let uploadResponse = await Network.uploadPicture(
              upload_url === null ? surveyAnswer.upload_url : upload_url,
              uri,
              props.userStore.token,
            );
            console.warn('uploadResponse', uploadResponse);
            return;
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
        syncWithServerX: async () => {
          let promiseUploadImage = [];
          let promiseSyncServer = [];
          let surveysSubmittedOfflineArray =
            props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray;
          //Survey Level
          for (let i = 0; i < surveysSubmittedOfflineArray.length; i++) {
            for (
              let j = 0;
              j < surveysSubmittedOfflineArray[i].questions.length;
              j++
            ) {
              //Question level
              let question = surveysSubmittedOfflineArray[i].questions[j];
              if (
                question.type === 'cameraPicker' &&
                !!question.answer &&
                (question.answer.includes('file://') ||
                  question.answer.includes('content://'))
              ) {
                let uploadImage = await appContext.uploadPictureX(
                  surveysSubmittedOfflineArray[i].upload_url,
                  question.answer,
                );
                console.warn(
                  '***uploadImage***',
                  uploadImage?.public_url,
                  uploadImage,
                );
                surveysSubmittedOfflineArray[i].questions[j] = {
                  ...question,
                  answer: uploadImage?.public_url,
                };
                console.warn(
                  'temp surveysSubmittedOfflineArray',
                  surveysSubmittedOfflineArray,
                );
                // props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray = surveysSubmittedOfflineArray;
                //check all promise to upload image
                promiseUploadImage.push(uploadImage);
              }
            }
            promiseSyncServer.push(
              Promise.all(promiseUploadImage).then(uploadResponses => {
                console.warn('uploadResponses', uploadResponses);
                //send single survey post all image upload

                // appContext.onSubmitSurvey()
                return appContext.onSubmitSurvey(
                  surveysSubmittedOfflineArray[i],
                  surveysSubmittedOfflineArray,
                  i,
                );
              }),
            );
          }
          return Promise.all(promiseSyncServer);

          // Now I know how many images in single survey
          /* return Promise.all(promiseUploadImage).then(uploadResponses => {
            console.warn('uploadResponses', uploadResponses);
            return uploadResponses;
          });*/

          //upload all images in single survey
          //after post Single survey
          //Next jump to new survey
          //repeat
        },
        syncWithServer: async () => {
          let surveysSubmittedOfflineArray =
            props.dbSyncStore.surveyMain.surveysSubmittedOfflineArray;
          if (!surveysSubmittedOfflineArray) return;

          await surveysSubmittedOfflineArray.map(
            async (surveysSubmittedOfflineItem: any, surveyIndex: number) => {
              const assetsUpload: any[] = [];
              await surveysSubmittedOfflineItem.questions.map(
                //Loop all question of each Survey
                async (question: any, questionIndex: number) => {
                  //Upload Logic goes here
                  if (
                    (question.type === 'cameraPicker' &&
                      !!question.answer &&
                      question.answer.includes('file://')) ||
                    question.answer.includes('content://')
                  ) {
                    let uploadResponse = await appContext.uploadPicture(
                      surveysSubmittedOfflineItem.upload_url,
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
                    );
                    await assetsUpload.push(uploadResponse);
                  }
                },
              );
              await props.dbSyncStore.setLoading(true);

              await Promise.all(assetsUpload)
                .then(async listOfS3BucketUrls => {
                  console.warn('listOfS3BucketUrls', listOfS3BucketUrls);
                  // return;

                  //List of S3BucketImageUrls ***
                  appContext.onSubmitSurvey(
                    surveysSubmittedOfflineArray[surveyIndex],
                    surveysSubmittedOfflineArray,
                    surveyIndex,
                  );
                  props.dbSyncStore.setLoading(false);
                })
                .catch(function(error) {
                  props.dbSyncStore.setLoading(false);
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
          props.dbSyncStore.setLoading(true);
          await Network.getSurveys().then(response => {
            props.dbSyncStore.updateStoreToDb(
              response?.data,
              constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
              true,
            );
            props.dbSyncStore.setLoading(false);
          });
        },
        onSubmitSurvey: (
          dynamicSurvey: any,
          surveysSubmittedOfflineArray?: any,
          surveyIndex?: number,
        ) => {
          let surveyAnswer =
            dynamicSurvey ||
            props.dbSyncStore.surveyMain[
              props.dbSyncStore.surveyMain.currentSurveyType
            ][props.dbSyncStore.surveyMain.currentActiveIndex];
          // console.warn('*****OnSubmit Survey***', surveyAnswer);
          props.dbSyncStore.setLoading(true);
          return Network.surveySubmit(surveyAnswer.url, surveyAnswer).then(
            response => {
              props.dbSyncStore.setLoading(false);
              if (response) {
                showMessage('Saved Successfully', COLORS.green);
                props.dbSyncStore.updateStoreToDb(
                  [{...surveyAnswer, answerId: Math.random() * 10000}],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedSyncedArray,
                  false,
                );

                //Sync with DB
                //Remove Survey from List
                if (surveysSubmittedOfflineArray && surveyIndex >= 0) {
                  surveysSubmittedOfflineArray = surveysSubmittedOfflineArray.filter(
                    (item: any, index: number) => {
                      return index !== surveyIndex;
                    },
                  );

                  props.dbSyncStore.updateStoreToDb(
                    surveysSubmittedOfflineArray,
                    constants.asyncStorageKeys.dbSyncType
                      .surveysSubmittedOfflineArray,
                    true,
                  );
                }
              } else {
                if (surveysSubmittedOfflineArray && surveyIndex >= 0) {
                  showMessage('Unable to Sync with Server', COLORS.orange);
                  return;
                }
                props.dbSyncStore.updateStoreToDb(
                  [surveyAnswer],
                  constants.asyncStorageKeys.dbSyncType
                    .surveysSubmittedOfflineArray,
                  false,
                );
                showMessage('Saved Offline', COLORS.orange);
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
      <AppContextX.Provider value={appContext}>
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
          <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
          {children}
        </SafeAreaView>
      </AppContextX.Provider>
    );
  };
};
export default AppContext();
