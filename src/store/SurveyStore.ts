import {action, computed, observable} from 'mobx';

/************ SurveyStore **************/
export class SurveyStore {
  @observable activeSurveyIndex = 0;
  @observable activeSurvey = {};
  @action setActiveSurveyIndex = (index: number) => {
    this.activeSurveyIndex = index;
  };
  @action setActiveSurvey = (payload: object) => {
    this.activeSurvey = payload;
  };
  @computed get getActiveSurveyIndex() {
    return (this.activeSurveyIndex = findIndex(
      this.surveys,
      this.activeSurvey,
    ));
  }

  @observable surveys = [
    {
      topic: 'Assets Mapping',
      questions_count: 4,
      question_version: 1,
      url: '/api/v1/gps/<gp_id>/assets',
      questions: [
        {
          question: 'Choose a asset type',
          type: 'singleChoice',
          options: [
            {
              text: 'household',
              value: 'household',
            },
            {
              text: 'Inception meeting',
              value: 'Inception meeting',
            },
            {
              text: 'Legacy waste',
              value: 'Legacy waste',
            },
            {
              text: 'Littering Places Cleaned',
              value: 'Littering Places Cleaned',
            },
          ],
          isMandatory: true,
          formName: 'asset_type',
        },
        {
          question: 'Take pictures',
          type: 'cameraPicker',
          options: [],
          isMandatory: true,
          formName: 'images',
          formType: 'array',
        },
        {
          question: 'Get the geo location',
          type: 'mapPicker',
          options: [],
          isMandatory: true,
          formName: 'latitude, longitude',
        },

        {
          question: 'What is name of the asset?',
          type: 'textInput',
          options: [],
          isMandatory: true,
          formName: 'name',
        },
      ],
    },
  ];
  @action setSurveysPayload(payload: any): void {
    console.warn('***Payload***', payload);
    this.surveys = [...payload];
  }

  @action updateAnswer = (questionAnswerPayload: any) => {
    let questions = this.surveys[this.activeSurveyIndex].questions;

    questions.map((question, questionIndex) => {
      if (question.question === questionAnswerPayload.question) {
        this.surveys[this.activeSurveyIndex].questions[
          questionIndex
        ] = questionAnswerPayload;
      }
    });
  };
}
export const surveyStore = new SurveyStore();

const findIndex = (arr: any, obj: any) =>
  arr.findIndex((survey: any) => Object.is(survey, obj));
