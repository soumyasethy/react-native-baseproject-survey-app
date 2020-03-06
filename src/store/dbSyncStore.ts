import {action, autorun, computed, observable} from 'mobx';
import {_storeData, _retrieveData} from 'component-library';
import {constants} from '../constants';
import moment from 'moment';

class DbSyncStore {
  @observable isLoading = false;
  @observable surveyMain = {
    currentActiveIndex: 0,
    currentSurveyType: constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
    surveyFormsArray: [],
    surveysOngoingArray: [],
    surveysSubmittedOfflineArray: [],
    surveysSubmittedSyncedArray: [],
  };

  /**************** Setter ****************/
  @action setLoading = (isLoading: boolean) => (this.isLoading = isLoading);
  @action setCurrentIndex = (index: number) => {
    this.surveyMain.currentActiveIndex = index;
  };
  @action setCurrentSurveyType = (type: string) => {
    this.surveyMain.currentSurveyType = type;
  };
  @action setStoreDataByType = (type: string, data: any) => {
    this.surveyMain[type] = data;
    this.surveyMain = {...this.surveyMain};
  };
  /******************* ManualTrigger ********/
  @action updateStoreToDb = async (
    newSurveys: any,
    type: string,
    isReset: boolean,
  ) => {
    let updatedSurveys = [];
    let typeX = type || this.surveyMain.currentSurveyType;
    let oldSurveys = await this.surveyMain[typeX];

    if (isReset) updatedSurveys = newSurveys;
    else
      updatedSurveys =
        oldSurveys && oldSurveys.length > 0
          ? [...oldSurveys, ...newSurveys]
          : newSurveys;

    if (!typeX && !updatedSurveys) return;

    await this.setStoreDataByType(typeX, updatedSurveys);
    await _storeData(typeX, updatedSurveys);
  };
  @action updateDbToStore = async (surveyType: string) => {
    let offlineData = await _retrieveData(surveyType);
    if (!offlineData) return;
    await this.setStoreDataByType(surveyType, offlineData);
  };
  @action syncAllDbToStore = async () => {
    await this.updateDbToStore(
      constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
    );
    await this.updateDbToStore(
      constants.asyncStorageKeys.dbSyncType.surveysOngoingArray,
    );
    await this.updateDbToStore(
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray,
    );
    await this.updateDbToStore(
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray,
    );
  };
  @action updateCurrentSurveyAnswer = async (questionAnswerPayload: any) => {
    if (!questionAnswerPayload) return;
    let surveys = this.surveyMain[this.surveyMain.currentSurveyType];
    let {questions} = surveys[this.surveyMain.currentActiveIndex];
    (await questions) &&
      (await questions.map(
        async (
          question: {question: any; answer: any},
          questionIndex: number,
        ) => {
          if (
            question?.answer &&
            question?.answerId !== questionAnswerPayload?.answerId
          ) {
            return;
          }
          if (
            question.question === (await questionAnswerPayload.question) &&
            !Object.is(question?.answer, questionAnswerPayload.answer)
          ) {
            surveys[this.surveyMain.currentActiveIndex].questions[
              questionIndex
            ] = {
              ...questionAnswerPayload,
              answer: questionAnswerPayload.answer,
              lastUpdated: moment().format(commonDateFormat),
            };
          }
        },
      ));
    await this.setStoreDataByType(
      constants.asyncStorageKeys.dbSyncType.surveysOngoingArray,
      surveys,
    );
  };
}
export const dbSyncStore = new DbSyncStore();
const commonDateFormat = 'YYYY-MM-DD hh:mm a';
