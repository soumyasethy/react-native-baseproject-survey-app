import {action, observable} from 'mobx';

/************ UserStore **************/
export class UserStore {
  @observable userDetails = '';
  @action setUserPayload(payload) {
    this.userDetails = payload;
  }
  @observable token = '';
  @action setToken(token) {
    this.token = token;
  }
}
export const userStore = new UserStore();
