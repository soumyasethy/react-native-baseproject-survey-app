import React from 'react';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goBack} from '../navigator/_goToPage';

const TakeSurvey = (props: any) => {
  const {
    surveyStore: {test, activeSurveyIndex, updateAnswer},
  } = props;

  return (
    <TakeSurveyCard
      data={test[activeSurveyIndex]}
      updateAnswer={updateAnswer}
      onExit={_goBack}
    />
  );
};
export default inject(storeType.surveyStore)(observer(TakeSurvey));
