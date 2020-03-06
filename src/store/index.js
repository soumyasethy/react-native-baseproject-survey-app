import {userStore} from './UserStore';
import {dbSyncStore} from './dbSyncStore';

/**
 * Combine all stores
 */
export const stores = {
  userStore,
  dbSyncStore,
};
