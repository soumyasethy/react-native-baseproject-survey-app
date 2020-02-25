import React from 'react';
import {SurveyCard} from 'component-library';
import {pageType} from '../navigator/pageType';
import {_goToPage} from '../navigator/_goToPage';
import {AppContextX} from '../context/AppContext';
import {observer, inject} from 'mobx-react';
import {storeType} from '../store/storeType';

const Surveys = (props: any) => {
  const {getSurveys} = React.useContext(AppContextX);

  React.useEffect(() => getSurveys(), []);

  return (
    <SurveyCard
      data={props.surveyStore.test}
      onCollect={(data: any) => {
        _goToPage(pageType.TakeSurvey);
      }}
    />
  );
};

export default inject(storeType.surveyStore)(observer(Surveys));
