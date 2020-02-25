import axiosInstance from './axios/axiosInstance';
import SetupInterceptor from './axios/interceptor';
import Snackbar from 'react-native-snackbar';
import {API} from '../constants/Api';
import {COLORS} from 'component-library';

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
    // _retrieveData(constants.asyncStorageKeys.offlineSurveys).then(res => {
    //   console.warn('*******App Offline****');
    //   props.setTest(res);
    // });
    return handleError(error);
  });
};

const getProfile = () => {
  return axiosInstance
    .get(API.profile, defaultApiConfig)
    .catch(error => handleError(error));
};
const surveySubmit = (endPoints: any, survey: any) => {
  return axiosInstance
    .post(`${API.baseUrl}${endPoints}`, survey, defaultApiConfig)
    .catch(error => handleError(error));
};

export const Network = {
  // setupNetworkConfig,
  SetupInterceptor,
  login,
  getSurveys,
  surveySubmit,
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
