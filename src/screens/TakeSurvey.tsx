import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';

const TakeSurvey = (props: any) => {
  const {surveys, activeSurveyIndex, updateAnswer} = props.surveyStore;
  return (
    <TakeSurveyCard
      data={surveys[activeSurveyIndex]}
      updateAnswer={updateAnswer}
    />
  );
};

TakeSurvey.propTypes = {};
export default inject(storeType.surveyStore)(observer(TakeSurvey));
