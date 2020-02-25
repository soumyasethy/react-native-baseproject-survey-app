import {action, observable} from 'mobx';
import {_storeData, _retrieveData, COLORS} from 'component-library';
import {constants} from '../constants';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';

/************ SurveyStore **************/
export class SurveyStore {
  @observable test = [];
  @action setTest = async data => {
    if (!data) return;
    this.test = await data;
    this.syncWithOfflineData();
  };
  @observable surveys = [];
  @observable activeSurveyIndex = 0;
  @observable activeSurvey = {};
  @action setActiveSurveyIndex = (index: number) => {
    this.activeSurveyIndex = index;
  };
  @action setActiveSurvey = (payload: any) => {
    this.activeSurvey = payload;
  };
  @action setSurveysPayload(payload: any) {
    this.surveys = payload;
  }

  @action updateAnswer = (questionAnswerPayload: any) => {
    if (!questionAnswerPayload) return;
    let {questions} = this.test[this.activeSurveyIndex];
    questions.map(
      (question: {question: any; answer: any}, questionIndex: number) => {
        if (
          question.question === questionAnswerPayload.question &&
          !Object.is(question?.answer, questionAnswerPayload.answer)
        ) {
          this.test[this.activeSurveyIndex].questions[questionIndex] = {
            ...questionAnswerPayload,
            lastUpdated: moment().format(commonDateFormat),
          };
        }
      },
    );
    _storeData(constants.asyncStorageKeys.offlineSurveys, this.test);
    // console.warn('*** Saved Offline ***', JSON.stringify(this.test));
    // Snackbar.show({
    //   text: `Synced`,
    //   duration: Snackbar.LENGTH_SHORT,
    //   backgroundColor: COLORS.green,
    // });
  };
  @action syncWithOfflineData = async () => {
    let updateCounter = 0;
    let offlineSurveys = await _retrieveData(
      constants.asyncStorageKeys.offlineSurveys,
    );

    await offlineSurveys.map(
      async (offlineSurvey: {topic_id: any; questions: any[]}) => {
        this.test.map(async (serverSurvey, serverSurveyIndex) => {
          if (serverSurvey.topic_id === offlineSurvey.topic_id) {
            // console.warn('Matched Survey');
            //Matched Survey
            if (serverSurvey.topic_id === offlineSurvey.topic_id) {
              await offlineSurvey.questions.map(async offlineQuestion => {
                await serverSurvey.questions.map(
                  async (serverQuestion, serverQuestionIndex) => {
                    if (
                      offlineQuestion.questionId === serverQuestion.questionId
                    ) {
                      // console.warn('Syncing with Offline Question');
                      updateCounter += 1;
                      //return {serverSurveyIndex, serverQuestionIndex};
                      this.test[serverSurveyIndex].questions[
                        serverQuestionIndex
                      ] = await offlineQuestion;
                      //Update Each Matched Question
                      //End of update
                    }
                  },
                );
              });
            }
          }
        });
        // console.warn('*****Synced Surveys Count->', updateCounter);
        Snackbar.show({
          text: `Synced ${updateCounter} Surveys`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: COLORS.green,
        });
      },
    );
  };
}
export const surveyStore = new SurveyStore();

const findIndex = (arr: any, obj: any) =>
  arr.findIndex((survey: any) => Object.is(survey, obj));
const commonDateFormat = 'YYYY-MM-DD hh:mm a';
