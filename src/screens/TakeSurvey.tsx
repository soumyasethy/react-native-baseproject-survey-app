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
  const {onSubmitSurvey, uploadPicture, uploadPictureX} = React.useContext(
    AppContextX,
  );

  let editingDisabled =
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray ||
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray;
  let currentSurvey =
    props.dbSyncStore.surveyMain[
      props.dbSyncStore.surveyMain.currentSurveyType
    ][props.dbSyncStore.surveyMain.currentActiveIndex];

  const updateAnswer = async (questionAnswer: any, type: string) => {
    if (!type) updateCurrentSurveyAnswer(questionAnswer);
    else if (type === 'image') {
      let uploadImage = await uploadPictureX(
        currentSurvey.upload_url,
        questionAnswer?.answer,
      );
      console.warn('****#uploadImage#***', uploadImage?.public_url);
      updateCurrentSurveyAnswer({
        ...questionAnswer,
        answer: uploadImage?.public_url,
      });
      /* const setS3BucketUrlCallBack = (uploadedS3Url: string) => {
        console.warn('*****updated-image****', uploadedS3Url);
        updateCurrentSurveyAnswer({...questionAnswer, answer: uploadedS3Url});
      };
      await uploadPicture(null, questionAnswer?.answer, setS3BucketUrlCallBack);*/
    }
  };

  return (
    <TakeSurveyCard
      data={currentSurvey}
      updateAnswer={updateAnswer}
      onExit={_goBack}
      onSubmit={editingDisabled ? _goBack : onSubmitSurvey}
      editingDisabled={editingDisabled}
    />
  );
};
export default inject(storeType.dbSyncStore)(observer(TakeSurvey));
