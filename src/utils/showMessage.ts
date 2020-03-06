import Snackbar from 'react-native-snackbar';
import {COLORS} from 'component-library';

export const showMessage = (title: string, color: string) => {
  Snackbar.show({
    title: title,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: color || COLORS.blue,
  });
};
