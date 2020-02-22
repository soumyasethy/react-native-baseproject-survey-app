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
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('loading...');
  }
}
