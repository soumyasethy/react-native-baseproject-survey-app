import {action, computed, observable} from 'mobx';
import {_storeData, _retrieveData, COLORS} from 'component-library';
import {constants} from '../constants';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';

/************ SurveyStore **************/
export class SurveyStore {
  @observable isLoading = false;
  @action setLoading = (isLoading: boolean) => (this.isLoading = isLoading);
  @observable surveyType = constants.surveysType.current;
  @action setSurveyType = (type: string) => {
    this.surveyType = type;
  };
  @computed get currentSurveys() {
    switch (this.surveyType) {
      case constants.surveysType.current: {
        return this.test;
      }
      case constants.surveysType.completed: {
        return this.completedSurvey;
      }
    }
    return [];
  }
  @action updateCurrentSurveys(updateSurveys: any) {
    switch (this.surveyType) {
      case constants.surveysType.current: {
        this.test = updateSurveys;
        _storeData(constants.asyncStorageKeys.offlineSurveys, this.test);
      }
      case constants.surveysType.completed: {
        this.completedSurvey = updateSurveys;
        _storeData(
          constants.asyncStorageKeys.offlineSurveysCompleted,
          updateSurveys,
        );
      }
    }
  }

  @observable test = [];
  @observable completedSurvey = [];
  @action setTest = async data => {
    if (!data) return;
    this.test = await data;
    this.syncCompletedSurvey();
    // this.syncWithOfflineData();
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
    let surveys = this.currentSurveys;
    let {questions} = surveys[this.activeSurveyIndex];
    // console.warn('questions->', questions);
    // return;
    questions &&
      questions.map(
        (question: {question: any; answer: any}, questionIndex: number) => {
          if (
            question.question === questionAnswerPayload.question &&
            !Object.is(question?.answer, questionAnswerPayload.answer)
          ) {
            surveys[this.activeSurveyIndex].questions[questionIndex] = {
              ...questionAnswerPayload,
              lastUpdated: moment().format(commonDateFormat),
            };
          }
        },
      );
    this.updateCurrentSurveys(surveys);
  };
  @action syncWithOfflineData = async () => {
    let updateCounter = 0;
    let offlineSurveys = await _retrieveData(
      constants.asyncStorageKeys.offlineSurveys,
    );

    !!offlineSurveys &&
      offlineSurveys.map((offlineSurvey: {topic_id: any; questions: any[]}) => {
        this.test.map((serverSurvey, serverSurveyIndex) => {
          // console.warn('Matched Survey');
          //Matched Survey
          if (serverSurvey.topic_id === offlineSurvey.topic_id) {
            offlineSurvey.questions.map(async offlineQuestion => {
              serverSurvey.questions.map(
                (serverQuestion, serverQuestionIndex) => {
                  if (
                    offlineQuestion.questionId === serverQuestion.questionId
                  ) {
                    console.warn('Syncing with Offline Question');
                    updateCounter += 1;
                    this.test[serverSurveyIndex].questions[
                      serverQuestionIndex
                    ] = offlineQuestion;
                    console.warn(
                      'Syncing with Offline Question',
                      offlineQuestion,
                    );
                    //Update Each Matched Question
                    //End of update
                  }
                },
              );
            });
          }
        });
        // console.warn('*****Synced Surveys Count->', updateCounter);
        Snackbar.show({
          text: `Synced ${updateCounter} Questions`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: COLORS.green,
        });
      });
  };
  ////////////////////////////////////////////////////////
  @action syncSurveys = async () => {
    let offlineSurveys = await _retrieveData(
      constants.asyncStorageKeys.offlineSurveys,
    );
    this.test = offlineSurveys;
  };
  @action syncCompletedSurvey = async () => {
    let offlineCompletedSurveys = await _retrieveData(
      constants.asyncStorageKeys.offlineSurveysCompleted,
    );
    this.completedSurvey = offlineCompletedSurveys;
  };

  @action syncStore = async () => {
    await this.syncSurveys();
    await this.syncCompletedSurvey();
  };
}
export const surveyStore = new SurveyStore();

const findIndex = (arr: any, obj: any) =>
  arr.findIndex((survey: any) => Object.is(survey, obj));
const commonDateFormat = 'YYYY-MM-DD hh:mm a';
