import axiosInstance from './axios/axiosInstance';
import SetupInterceptor from './axios/interceptor';
import Snackbar from 'react-native-snackbar';
import {API} from '../constants/Api';
import {COLORS} from 'component-library';
import RNFetchBlob from 'react-native-fetch-blob';
import React from 'react';
import {AppContextX} from '../context/AppContext';
import {Platform} from 'react-native';
import moment from 'moment';

const login = (username: string, password: string) => {
  let url = API.login;
  let bodyFormData = new FormData();
  bodyFormData.append('username', username);
  bodyFormData.append('password', password);

  return axiosInstance
    .post(url, {username, password}, defaultApiConfig)
    .catch(error => handleError(error));
};
const getSurveys = () => {
  return axiosInstance.get(API.surveys, defaultApiConfig).catch(error => {
    return handleError(error);
  });
};

const getProfile = () => {
  return axiosInstance
    .get(API.profile, defaultApiConfig)
    .catch(error => handleError(error));
};
const surveySubmit = (url: any, survey: any) => {
  console.warn('api called', url, JSON.stringify(survey));
  return axiosInstance.post(url, survey, defaultApiConfig).catch(error => {
    handleError(error);
  });
};
const uploadPicture = (
  url: string,
  filePathUri: string,
  access_token: string,
) => {
  // console.warn('url', url, 'filePathUri', filePathUri);
  if (!url || !filePathUri) return;
  // console.warn('***Uploading***', RNFetchBlob.wrap(filePathUri));

  return RNFetchBlob.fetch(
    'POST',
    url,
    {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
    [
      {
        name: 'file',
        filename: 'image.jpg', // `image_' + ${moment().format('YYYY-DD-MM-HH:mm')}.jpg`,
        type: 'image/jpg',
        data:
          Platform.OS === 'android'
            ? filePathUri
            : RNFetchBlob.wrap(filePathUri.replace('file://', '')),
      },
    ],
  );
};

/*const uploadPicture = async (
  url: string,
  fileUri: string,
  access_token: string,
) => {
  console.warn('**** request url', url, 'fileUri', fileUri);
  return;
  const createFormData = (fileUri: string) => {
    const data = new FormData();

    data.append('file', {
      name: 'file',
      type: 'image/jpg',
      uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
    });
    return data;
  };
  return await axiosInstance
    .post(url, createFormData(fileUri))
    .catch(error => handleError(error));
};*/

export const Network = {
  // setupNetworkConfig,
  SetupInterceptor,
  login,
  getSurveys,
  surveySubmit,
  uploadPicture,
};
/************************ Api Config utils ****************************/
const defaultApiConfig = {
  headers: {
    'Content-Type': 'application/json',
    //Authorization: 'Bearer ' + global.token,
  },
};
const handleError = (error: {
  response: {data: any};
  request: any;
  message: any;
  config: any;
}) => {
  console.warn('error', error);
  if (error.message && error.message === 'Network Error') {
    Snackbar.show({
      title: error.message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: COLORS.black,
    });
  } else if (error.response) {
    Snackbar.show({
      title: error.response.data.message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: COLORS.black,
    });
    return error.response;
  }
};
