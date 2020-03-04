import {userStore} from './UserStore';
import {surveyStore} from './SurveyStore';
import {dbSyncStore} from './dbSyncStore';

/**
 * Combine all stores
 */
export const stores = {
  userStore,
  surveyStore,
  dbSyncStore,
};
