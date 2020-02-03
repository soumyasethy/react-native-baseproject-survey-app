import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {s, mVs} from 'components-library';

export function Home() {
  return (
    <View style={style.container}>
      <View style={{height: mVs(100), width: s(200), backgroundColor: 'red'}} />
      <Text style={{width: s(100)}}>Home Page</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
