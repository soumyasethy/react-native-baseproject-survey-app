import {View, Text} from 'react-native';
import {COLORS, mS, shadow} from 'component-library';
import {constants} from '../constants';
import {assets} from '../assets';
import React from 'react';

export const SurveyFormHeader = (props: any) => {
  return (
    <View
      style={{backgroundColor: COLORS.white, marginBottom: mS(8), ...shadow}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: mS(16),
        }}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <View
            style={{justifyContent: 'space-between', flexDirection: 'column'}}>
            <assets.menu height={50} width={50} />
            <Text
              style={{
                color: COLORS.black,
                fontSize: mS(20),
                fontWeight: '700',
              }}>{`Survey Forms`}</Text>
            <Text
              style={{
                color: COLORS.grey777,
                fontSize: mS(15),
              }}>{`Recently Updated`}</Text>
          </View>
        </View>
        <assets.sync
          height={mS(40)}
          width={mS(40)}
          onPress={props.syncNow}></assets.sync>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: mS(16),
          paddingBottom: mS(8),
        }}>
        <Text
          style={
            props.dbSyncStore.surveyMain.currentSurveyType ===
            constants.asyncStorageKeys.dbSyncType.surveyFormsArray
              ? selectedText
              : notSelectedText
          }
          onPress={() =>
            props.dbSyncStore.setCurrentSurveyType(
              constants.asyncStorageKeys.dbSyncType.surveyFormsArray,
            )
          }>
          {`Surveys(${props.dbSyncStore.surveyMain[
            constants.asyncStorageKeys.dbSyncType.surveyFormsArray
          ].length || 0})`}
        </Text>
        <View
          style={{
            height: mS(16),
            width: 1,
            marginLeft: mS(8),
            marginRight: mS(8),
            backgroundColor: COLORS.grey777,
          }}></View>
        <Text
          style={
            props.dbSyncStore.surveyMain.currentSurveyType ===
            constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray
              ? selectedText
              : notSelectedText
          }
          onPress={() =>
            props.dbSyncStore.setCurrentSurveyType(
              constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray,
            )
          }>
          {`Completed(${props.dbSyncStore.surveyMain[
            constants.asyncStorageKeys.dbSyncType.surveysSubmittedSyncedArray
          ].length || 0})`}
        </Text>
        <View
          style={{
            height: mS(16),
            width: 1,
            marginLeft: mS(8),
            marginRight: mS(8),
            backgroundColor: COLORS.grey777,
          }}></View>
        <Text
          style={
            props.dbSyncStore.surveyMain.currentSurveyType ===
            constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray
              ? selectedText
              : notSelectedText
          }
          onPress={() =>
            props.dbSyncStore.setCurrentSurveyType(
              constants.asyncStorageKeys.dbSyncType
                .surveysSubmittedOfflineArray,
            )
          }>
          {`Offline(${props.dbSyncStore.surveyMain[
            constants.asyncStorageKeys.dbSyncType.surveysSubmittedOfflineArray
          ].length || 0})`}
        </Text>
      </View>
    </View>
  );
};
const selectedText = {fontSize: mS(18), color: COLORS.blue, fontWeight: '700'};
const notSelectedText = {
  fontSize: mS(18),
  color: COLORS.grey777,
  fontWeight: '200',
};
