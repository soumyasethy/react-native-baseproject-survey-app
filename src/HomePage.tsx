import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {SingleMultiChoiceCard} from 'component-library';
import PropTypes from 'prop-types';

class HomePage extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <SingleMultiChoiceCard
          question={' 1. What is the Source of drinking water'}
          options={['River', 'Water Pump', 'Sea']}
          onSelect={items => {
            // console.warn('selected->', items);
          }}
          selectLimit={0}
          selected={['Sea', 'River']}
        />
      </SafeAreaView>
    );
  }
}

HomePage.propTypes = {};
export default HomePage;
