import React from 'react';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goBack} from '../navigator/_goToPage';
import {AppContextX} from '../context/AppContext';

const TakeSurvey = (props: any) => {
  const {
    surveyStore: {test, activeSurveyIndex, updateAnswer},
  } = props;
  const {onSubmitSurvey} = React.useContext(AppContextX);
  return (
    <TakeSurveyCard
      data={test[activeSurveyIndex]}
      updateAnswer={updateAnswer}
      onExit={_goBack}
      onSubmit={onSubmitSurvey}
    />
  );
};
export default inject(storeType.surveyStore)(observer(TakeSurvey));
