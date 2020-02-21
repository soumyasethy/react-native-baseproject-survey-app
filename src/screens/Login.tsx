import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS, InputComponent, ButtonCard, mS} from 'component-library';
import {_goToPage} from '../navigator/RootNavigator';
import {pageType} from '../navigator/pageType';

type Props = {
  navigation: any;
};
const usernameRef = React.createRef();
const passwordRef = React.createRef();
export const Login = (props: Props) => {
  const onChangeText = (text: string) => {};
  /**********************/
  const onSubmitEmail = () => {
    // this.password.focus();
  };

  const onSubmitPassword = () => {
    // this.password.blur();
  };
  /**********************/

  return (
    <View style={style.container}>
      <View style={{height: mS(60), width: '100%%'}}>
        <InputComponent.TextField
          label={'User Name'}
          onChangeText={(text: any) => onChangeText(text)}
          multiline={true}
          onSubmitEditing={() => {
            console.warn('userName');
          }}
          fontSize={18}
          ref={usernameRef}
          returnKeyType="done"
        />
      </View>
      <View style={{height: mS(60), width: '100%', marginTop: mS(16 * 2)}}>
        <InputComponent.TextField
          label={'Password'}
          onChangeText={(text: any) => onChangeText(text)}
          multiline={true}
          onSubmitEditing={() => {
            console.warn('password');
          }}
          fontSize={18}
          ref={passwordRef}
          returnKeyType="done"
        />
      </View>

      <ButtonCard
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: mS(16 * 3),
        }}
        item={{text: 'Login'}}
        addToSelected={() => {
          // _goToPage(pageType.Surveys);
          props.navigation('Surveys');
        }}
        isSelected={true}
      />
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: mS(16 * 2),
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
  label: {
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});
