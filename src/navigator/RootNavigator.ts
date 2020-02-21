// RootNavigation.js

import * as React from 'react';
export const isMountedRef = React.createRef();
export const navigationRef: any = React.createRef();
export const _goBack = () => {
  navigationRef.current?.goBack();
};
export const _goToPage = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export function _navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('loading...');
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
