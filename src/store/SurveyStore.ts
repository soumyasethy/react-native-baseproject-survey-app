import {action, computed, observable} from 'mobx';
import {_storeData, _retrieveData} from 'component-library';
import {constants} from '../constants';

/************ SurveyStore **************/
export class SurveyStore {
  @observable test = [];
  @action setTest = data => {
    this.test = data;
    _storeData(constants.asyncStorageKeys.offlineSurveys, data);
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
          this.test[this.activeSurveyIndex].questions[
            questionIndex
          ] = questionAnswerPayload;
        }
      },
    );
  };
}
export const surveyStore = new SurveyStore();

const findIndex = (arr: any, obj: any) =>
  arr.findIndex((survey: any) => Object.is(survey, obj));
