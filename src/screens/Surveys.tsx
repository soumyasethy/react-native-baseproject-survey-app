import React from 'react';
import {SurveyCard, COLORS, mS, shadow} from 'component-library';
import {pageType} from '../navigator/pageType';
import {_goToPage} from '../navigator/_goToPage';
import {AppContextX} from '../context/AppContext';
import {observer, inject} from 'mobx-react';
import {storeType} from '../store/storeType';
import {View, ActivityIndicator} from 'react-native';
import {constants} from '../constants';
import {SurveyFormHeader} from '../components/SurveyFormsHeader';

const Surveys = (props: any) => {
  const {getSurveys, syncWithDb, syncWithServer} = React.useContext(
    AppContextX,
  );
  const syncNow = () => {
    console.warn('Start sync...');
    syncWithServer();
  };

  React.useEffect(() => {
    syncWithDb();
    getSurveys();
  }, []);

  let editingDisabled =
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray ||
    props.dbSyncStore.surveyMain.currentSurveyType ===
      constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray;
  return (
    <View style={{backgroundColor: COLORS.white, flex: 1}}>
      <SurveyFormHeader {...props} syncNow={syncNow} />


      {props.dbSyncStore.isLoading && (
        <View style={{padding: mS(20)}}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      )}

      <SurveyCard
        data={
          props.dbSyncStore.surveyMain[
            props.dbSyncStore.surveyMain.currentSurveyType
          ]
        }
        onCollect={(data: any, index: number) => {
          props.dbSyncStore.setCurrentIndex(index);
          props.dbSyncStore.setCurrentSurveyType(
            editingDisabled
              ? props.dbSyncStore.surveyMain.currentSurveyType
              : constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
          );

          _goToPage(pageType.TakeSurvey);
        }}
        isUpdate={editingDisabled}
      />
    </View>
  );
};

export default inject(storeType.dbSyncStore)(observer(Surveys));
