import axiosInstance from './axios/axiosInstance';
import {SetupInterceptor} from './axios/interceptor';
import {_retrieveData, _storeData} from '../storage';
import {asyncStorage} from '../storage/Type';
import Snackbar from 'react-native-snackbar';
import {API} from './Api';
import {COLORS} from 'component-library';
import moment from 'moment';

/*const setupNetworkConfig = async () => {
  return new Promise(async (resolve, reject) => {
    // Override timeout default for the library
    // Now all requests using this instance will wait 2.5 seconds before timing out
    // axiosInstance.defaults.timeout = 2500;
    let loginData = await _retrieveData(asyncStorage.loginData);
    let selectedCity = await _retrieveData(asyncStorage.selectedCity);
    let selectedFacility = await _retrieveData(asyncStorage.selectedFacility);

    if (loginData) {
      global.token = loginData.access;
      resolve({loginData, selectedCity, selectedFacility});
    } else reject();
  });
};*/

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

const login = (username: string, password: string) => {
  let url = API.login;
  //setAuthToken(username, password);
  var bodyFormData = new FormData();
  // bodyFormData.set('username', username);
  bodyFormData.append('username', username);
  bodyFormData.append('password', password);

  return axiosInstance
    .post(
      url,
      {username, password},
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    )
    .catch(error => handleError(error));
  //
  //
  // var myHeaders = new Headers();
  // myHeaders.append('Content-Type', 'application/json;charset=utf-8');
  //
  // var raw = '{"username":"user_chattarpur","password":"chattarpur.123"}';
  //
  // var requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw,
  // };
  //
  // return fetch(API.login, requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.warn('faetch response->', result))
  //   .catch(error => console.warn('error', error));
};

const getSurveys = () => {
  return axiosInstance
    .get(API.surverys, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    .catch(error => handleError(error));
};
const getProfile = () => {
  return axiosInstance.get(API.profile).catch(error => handleError(error));
};

export const Network = {
  // setupNetworkConfig,
  SetupInterceptor,
  login,
  getSurveys,
};

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo3MDUwLCJ1c2VybmFtZSI6InVzZXJfY2hhdHRhcnB1ciIsImV4cCI6MTU4NDQ0MTgzMCwiZW1haWwiOiIiLCJvcmlnX2lhdCI6MTU4MTg0OTgzMH0.2J5rzJo8bIOwQz9yrEPo8HtY6wF77eoV-xgXJeq6VDI';
