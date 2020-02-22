import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';

@inject(storeType.surveyStore)
@observer
class TakeSurvey extends Component {
  render() {
    const {test, activeSurveyIndex, updateAnswer} = this.props.surveyStore;
    const update = (answer: any) => {
      updateAnswer(answer);
    };
    return (
      <TakeSurveyCard data={test[activeSurveyIndex]} updateAnswer={update} />
    );
  }
}

TakeSurvey.propTypes = {};

export default TakeSurvey;
