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
  return axiosInstance
    .post(url, {
      username,
      password,
    })
    .catch(error => handleError(error));
};

const getSurveys = () => {
  return axiosInstance.get(API.surverys).catch(error => handleError(error));
};

export const Network = {
  // setupNetworkConfig,
  SetupInterceptor,
  login,
  getSurveys,
};
