import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  shadow,
  COLORS,
  InputComponent,
  ButtonCard,
  mS,
} from 'component-library';
import {_goToPage} from '../navigator/RootNavigator';
import {pageType} from '../navigator/pageType';
import {inject, observer} from 'mobx-react';
import {storeType} from '../store/storeType';
import {Network} from '../network';
import {AuthContext} from '../context/MyContext';
type Props = {
  navigation: any;
};
const usernameRef = React.createRef();
const passwordRef = React.createRef();

const Login = (props: Props) => {
  const {signIn} = React.useContext(AuthContext);
  const [userName, setUserName] = useState('user_chattarpur');
  const [password, setPassword] = useState('chattarpur.123');

  const onChangeText = ({text, type}) => {
    switch (type) {
      case 'userName': {
        setUserName(text);
      }
      case 'password': {
        setPassword(text);
      }
    }
  };
  const onSubmitEmail = () => {
    passwordRef.current.focus();
  };

  const onSubmitPassword = () => {
    passwordRef.current.blur();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={style.container}>
          <View style={{height: mS(60), width: '100%%'}}>
            <InputComponent.TextField
              label={'User Name'}
              onChangeText={(text: any) =>
                onChangeText({text, type: 'userName'})
              }
              multiline={false}
              onSubmitEditing={() => {
                onSubmitEmail();
              }}
              fontSize={18}
              ref={usernameRef}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              // onFocus={this.onFocus}
              returnKeyType="next"
              title="Example, soumyasethy"
              maxLength={30}
              characterRestriction={20}
              // error={errors.firstname}
            />
          </View>
          <View style={{height: mS(60), width: '100%', marginTop: mS(16 * 2)}}>
            <InputComponent.TextField
              label={'Password'}
              onChangeText={(text: any) =>
                onChangeText({text, type: 'password'})
              }
              multiline={false}
              onSubmitEditing={() => {
                onSubmitPassword();
              }}
              fontSize={18}
              ref={passwordRef}
              returnKeyType="done"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              // onFocus={this.onFocus}
              // error={errors.password}
              title="Your Account Password"
              maxLength={30}
              characterRestriction={20}
            />
          </View>

          <ButtonCard
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: mS(16 * 5),
            }}
            item={{text: 'Login'}}
            addToSelected={() => {
              Network.login(userName, password).then(res => {
                console.warn('***res***', res);
                props.userStore.setToken('dummy-token');
              });
              // signIn(userName, password);
            }}
            isSelected={true}
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: mS(16),
    backgroundColor: COLORS.white,
    ...shadow,
  },
});

let styles = {
  scroll: {
    backgroundColor: COLORS.white,
  },

  container: {
    margin: 8,
    marginTop: Platform.select({ios: 8, android: 32}),
    flex: 1,
  },

  contentContainer: {
    padding: 8,
  },

  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
};

export default inject(storeType.userStore)(observer(Login));
