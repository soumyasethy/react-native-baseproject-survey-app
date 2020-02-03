import axiosInstance from './axios/axiosInstance';
import {setupIntercepter} from './axios/interceptor';
import {_retrieveData, _storeData} from '../storage';
import {asyncStorage} from '../storage/Type';
import Snackbar from 'react-native-snackbar';
import {API} from './Api';
import {COLORS} from '../utils/Colors/Colors';
import moment from 'moment';

const setupNetworkConfig = async () => {
  return new Promise(async (resolve, reject) => {
    // Override timeout default for the library
    // Now all requests using this instance will wait 2.5 seconds before timing out
    axiosInstance.defaults.timeout = 2500;
    let loginData = await _retrieveData(asyncStorage.loginData);
    let selectedCity = await _retrieveData(asyncStorage.selectedCity);
    let selectedFacility = await _retrieveData(asyncStorage.selectedFacility);

    if (loginData) {
      global.token = loginData.access;
      resolve({loginData, selectedCity, selectedFacility});
    } else reject();
  });
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
const getPermission = () => {
  return axiosInstance.get(API.permissions).catch(error => handleError(error));
};
const getCities = () => {
  return axiosInstance.get(API.cities).catch(error => handleError(error));
};
const getFacilities = cityId => {
  return axiosInstance
    .get(`${API.entities}${cityId}/`)
    .catch(error => handleError(error));
};
const postPrimaScan = (pc_id, barcode) => {
  return axiosInstance
    .post(API.primeScan, {
      pc_id,
      items: [
        {
          barcode,
          quantity: 1,
          scan_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
      final: 1,
    })
    .catch(error => handleError(error));
};

const postInward = (destination_entity, barcode) => {
  return axiosInstance
    .post(API.inward, {
      destination_entity,
      items: {
        barcode,
        quantity: 1,
        scan_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    })
    .catch(error => handleError(error));
};
const postOutwardConfirmation = (connection_id, barcode) => {
  return axiosInstance
    .post(API.outward, {
      connection_id,
      items: [
        {
          barcode,
          quantity: 1,
          scan_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
      final: 0,
    })
    .catch(error => handleError(error));
};
const postOutwardFinal = (connection_id, itemList) => {
  return axiosInstance
    .post(API.outward, {
      connection_id,
      items: itemList,
      final: 1,
    })
    .catch(error => handleError(error));
};

const getOutwardConnection = pc_id => {
  return axiosInstance
    .get(`${API.outwardConnection}${pc_id}/?page_size=all`)
    .catch(error => handleError(error));
};

export const Network = {
  setupNetworkConfig,
  setupIntercepter,
  login,
  getPermission,
  getCities,
  getFacilities,
  postPrimaScan,
  postInward,
  postOutwardConfirmation,
  postOutwardFinal,
  getOutwardConnection,
};
