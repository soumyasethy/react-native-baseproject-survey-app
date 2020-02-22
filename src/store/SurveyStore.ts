import {action, computed, observable} from 'mobx';

/************ SurveyStore **************/
export class SurveyStore {
  @observable test = [];
  @action setTest = data => {
    this.test = data;
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
    console.warn('***Payload***', payload);
    this.surveys = payload;
  }
  /*@computed get getActiveSurveyIndex() {
    return (this.activeSurveyIndex = findIndex(
      this.test,
      this.activeSurvey,
    ));
  }*/

  @action updateAnswer = (questionAnswerPayload: any) => {
    console.warn('***Updating Answer.***', questionAnswerPayload);
    if (!questionAnswerPayload) return;
    let questions = this.test[this.activeSurveyIndex].questions;
    questions.map((question, questionIndex) => {
      if (
        question.question === questionAnswerPayload.question &&
        !Object.is(question?.answer, questionAnswerPayload.answer)
      ) {
        console.warn('***Updated***', questionIndex, question.question);
        this.test[this.activeSurveyIndex].questions[
          questionIndex
        ] = questionAnswerPayload;
      }
    });
  };
}
export const surveyStore = new SurveyStore();

const findIndex = (arr: any, obj: any) =>
  arr.findIndex((survey: any) => Object.is(survey, obj));
