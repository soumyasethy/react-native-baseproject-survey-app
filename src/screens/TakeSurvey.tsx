import React from 'react';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goBack} from '../navigator/_goToPage';
import {AppContextX} from '../context/AppContext';
import {constants} from '../constants';

const TakeSurvey = (props: any) => {
  const {
    dbSyncStore: {updateCurrentSurveyAnswer},
  } = props;
  const {onSubmitSurvey} = React.useContext(AppContextX);

  let editingDisabled =
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray ||
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray;

  return (
    <TakeSurveyCard
      data={
        props.dbSyncStore.surveyMain[
          props.dbSyncStore.surveyMain.currentSurveyType
        ][props.dbSyncStore.surveyMain.currentActiveIndex]
      }
      updateAnswer={updateCurrentSurveyAnswer}
      onExit={_goBack}
      onSubmit={editingDisabled ? _goBack : onSubmitSurvey}
      editingDisabled={editingDisabled}
    />
  );
};
export default inject(
  // storeType.surveyStore,
  storeType.dbSyncStore,
)(observer(TakeSurvey));
