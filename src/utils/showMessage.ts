import Snackbar from 'react-native-snackbar';
import {COLORS} from 'component-library';

export const showMessage = (title: string, color: string) => {
  Snackbar.show({
    text: title,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: color || COLORS.blue,
  });
};
