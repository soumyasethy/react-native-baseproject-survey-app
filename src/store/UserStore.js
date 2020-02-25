import {action, observable} from 'mobx';
import {_storeData} from 'component-library';
import {constants} from '../constants';

/************ UserStore **************/
export class UserStore {
  @observable userDetails = '';
  @action setUserPayload(payload) {
    this.userDetails = payload;
  }
  @observable token = '';
  @action
  setToken(token) {
    // console.warn("Got New Token",token)
    this.token = token;
    _storeData(constants.asyncStorageKeys.token, token);
  }
}
export const userStore = new UserStore();
