import React, {Component} from 'react';
import {
  DynamicQuestionCard,
  questionType,
  AppContainer,
  Swiper,
} from 'component-library';
import PropTypes from 'prop-types';

class HomePage extends Component {
  render() {
    return (
      <Swiper showsButtons={false} showsPagination={false} loop={false}>
        <DynamicQuestionCard
          type={questionType.singleChoice}
          isMandatory={true}
          question={' 1. What is the Source of drinking water'}
          options={['River', 'Water Pump', 'Sea']}
          onSelect={items => {
            // console.warn('selected->', items);
          }}
          selectLimit={1}
          selected={['Sea', 'River']}
        />
        <DynamicQuestionCard
          type={questionType.gps}
          isMandatory={true}
          question={' 1. What is the Source of drinking water'}
          options={['River', 'Water Pump', 'Sea']}
          onSelect={items => {
            // console.warn('selected->', items);
          }}
          selectLimit={0}
          selected={['Sea', 'River']}
        />
        <DynamicQuestionCard
          type={questionType.multiChoice}
          isMandatory={true}
          question={' 1. What is the Source of drinking water'}
          options={['River', 'Water Pump', 'Sea']}
          onSelect={items => {
            // console.warn('selected->', items);
          }}
          selectLimit={0}
          selected={['Sea', 'River']}
        />
      </Swiper>
    );
  }
}

HomePage.propTypes = {};
export default AppContainer(HomePage);
