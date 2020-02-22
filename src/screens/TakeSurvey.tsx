import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import {TakeSurveyCard} from 'component-library';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goBack} from '../navigator/_goToPage';

@inject(storeType.surveyStore)
@observer
class TakeSurvey extends Component {
  render() {
    const {test, activeSurveyIndex, updateAnswer} = this.props.surveyStore;
    const update = (answer: any) => {
      updateAnswer(answer);
    };
    const onExit = () => {
      _goBack();
    };
    return (
      <TakeSurveyCard
        data={test[activeSurveyIndex]}
        updateAnswer={update}
        onExit={onExit}
      />
    );
  }
}

TakeSurvey.propTypes = {};

export default TakeSurvey;
