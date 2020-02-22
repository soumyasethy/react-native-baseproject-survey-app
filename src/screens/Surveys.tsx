import React, {Component, useEffect} from 'react';
import {SurveyCard} from 'component-library';
import PropTypes from 'prop-types';
import {pageType} from '../navigator/pageType';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {_goToPage} from '../navigator/RootNavigator';
import {Network} from '../network';

@inject(storeType.surveyStore)
@observer
class Surveys extends Component {
  componentDidMount(): void {
    let {setSurveysPayload, setTest} = this.props.surveyStore;
    //setTest('Hello world');

    Network.getSurveys().then(response => {
      setSurveysPayload(response.data);
      setTest(response.data);
    });
  }
  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): void {
    let {test, surveys} = this.props.surveyStore;
    console.warn('test', test);
  }

  render() {
    let {
      surveys,
      setActiveSurvey,
      setSurveysPayload,
      test,
      setTest,
    } = this.props.surveyStore;
    return (
      <SurveyCard
        data={test}
        onCollect={(data: any) => {
          setActiveSurvey(data);
          _goToPage(pageType.TakeSurvey);
        }}
      />
    );
  }
}

Surveys.propTypes = {};

export default Surveys;
