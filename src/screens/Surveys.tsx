import React, {useEffect} from 'react';
import {SurveyCard} from 'component-library';
import PropTypes from 'prop-types';
import {pageType} from '../navigator/pageType';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goToPage} from '../navigator/RootNavigator';
import {Network} from '../network';

const Surveys = (props: any) => {
  let {surveys, setActiveSurvey, setSurveysPayload} = props.surveyStore;

  useEffect(() => {
    Network.getSurveys().then(response => {
      setSurveysPayload(response.data);
    });
  }, []);

  useEffect(() => {
    console.warn('***surveys***', surveys);
  }, [surveys]);

  return (
    <SurveyCard
      data={surveys}
      onCollect={(data: any) => {
        setActiveSurvey(data);
        _goToPage(pageType.TakeSurvey);
      }}
    />
  );
};

Surveys.propTypes = {};
export default inject(storeType.surveyStore)(observer(Surveys));
