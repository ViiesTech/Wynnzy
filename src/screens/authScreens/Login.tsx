/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../Components/Input';
import {Colors} from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import {BoldText, NormalText} from '../../Components/Titles';
import {Button} from '../../Components/Button';
import {Apple, Google, mail, security, tick} from '../../assets/icons';
import SvgIcons from '../../Components/SvgIcons';
import {
  handleLogin,
  ShowToast,
  SocialLogin,
  socialLoginTypes,
} from '../../GlobalFunctions/Auth';
import {useDispatch, useSelector} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Login = ({navigation}: any) => {
  const [checked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading, userData} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [gLoading, setGLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      const rememberMe = await AsyncStorage.getItem('rememberMe');

      if (rememberMe === 'true') {
        setIsChecked(true);
        setForm({
          email: savedEmail || '',
          password: savedPassword || '',
        });
      }
    } catch (error) {
      console.log('Error loading credentials', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const loginHandler = async () => {
    const {email, password} = form;
    if (!email || !password) {
      ShowToast('error', 'Please fill all required fields');
      return;
    }
    try {
      if (checked) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.setItem('rememberMe', 'false');
      }
      const response = await handleLogin(email, password, dispatch);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleGoogleButtonPress = async () => {
    if (gLoading) {
      return;
    }
    setGLoading(true);
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      await GoogleSignin.signOut();

      const signInResult = await GoogleSignin.signIn();

      console.log('Google signInResult:', signInResult);

      if (signInResult.type === 'cancelled' || !signInResult.data) {
        console.log('Google sign-in was cancelled or returned no data');
        return;
      }

      const body = {
        email: signInResult.data.user.email,
        fullName: signInResult.data.user.name,
        socialType: socialLoginTypes?.google,
        socialId: signInResult.data.user.id,
      };

      console.log('body in socialLogin:-', body);
      const res = await SocialLogin(body, dispatch).unwrap();
      console.log('res in socialLogin:-', res);
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google sign-in cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log('Google sign-in already in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ShowToast('error', 'Google Play Services not available');
      } else {
        console.log(
          'Google sign-in error full details:',
          JSON.stringify(err, null, 2),
        );
        console.log('Google sign-in error:', err);
        ShowToast('error', err?.message || 'Something went wrong');
      }
    } finally {
      setGLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <BoldText alignSelf="center" title="Login Account" />
            <NormalText
              alignSelf="center"
              title="Stay signed in with your account"
            />
          </View>

          <View style={styles.formContainer}>
            <Input
              icon
              xml={mail}
              value={form.email}
              placeholderTxtColor={Colors.themeText}
              handlePress={text => handleInputChange('email', text)}
              color={Colors.themeText}
              keyboardType="email-address"
              backgroundColor={Colors.white}
              fontSize={16}
              fontWeight="bold"
              placeHolder="Email"
            />

            <Input
              icon
              xml={security}
              value={form.password}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              security
              placeholderTxtColor={Colors.themeText}
              handlePress={text => handleInputChange('password', text)}
              color={Colors.themeText}
              backgroundColor={Colors.white}
              fontSize={16}
              fontWeight="bold"
              placeHolder="Password"
            />

            <View style={styles.rowBetween}>
              <View style={styles.rememberContainer}>
                <TouchableOpacity
                  onPress={() => setIsChecked(prev => !prev)}
                  style={[
                    styles.checkbox,
                    checked ? styles.checkedBox : styles.uncheckedBox,
                  ]}>
                  {checked && <SvgIcons xml={tick} height={15} width={15} />}
                </TouchableOpacity>

                <NormalText
                  alignSelf="center"
                  color={Colors.black}
                  title="Remember me"
                />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPass')}>
                <NormalText color={Colors.buttonBg} title="Forgot Password?" />
              </TouchableOpacity>
            </View>

            <Button
              handlePress={loginHandler}
              textColor={Colors.white}
              bgColor={Colors.buttonBg}
              disabled={isLoading}
              title={
                isLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  'Sign In'
                )
              }
            />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <NormalText title="Or Sign In With" />
              <View style={styles.divider} />
            </View>

            <Button
              handlePress={handleGoogleButtonPress}
              xml={Google}
              bgColor={Colors.white}
              borderWidth={1}
              textColor={Colors.themeText}
              borderColor={Colors.buttonBg}
              icon
              disabled={gLoading}
              title={
                gLoading ? (
                  <ActivityIndicator size="small" color={Colors.buttonBg} />
                ) : (
                  'Sign in with Google'
                )
              }
            />

            {Platform.OS === 'ios' && (
              <Button
                xml={Apple}
                bgColor={Colors.black}
                textColor={Colors.white}
                icon
                title="Sign in with Apple"
              />
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.registerText}
              onPress={() => navigation.navigate('SelectType')}>
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },

  innerContainer: {
    paddingVertical: responsiveHeight(6),
  },

  headerContainer: {
    gap: responsiveHeight(1),
    marginBottom: responsiveHeight(3.5),
    alignItems: 'center',
  },

  formContainer: {
    gap: responsiveHeight(2),
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },

  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(7),
    height: responsiveHeight(3.5),
    borderRadius: responsiveHeight(1),
  },

  checkedBox: {
    backgroundColor: Colors.buttonBg,
  },

  uncheckedBox: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.buttonBg,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },

  divider: {
    backgroundColor: Colors.buttonBg,
    height: 1,
    flex: 1,
  },

  footer: {
    alignItems: 'center',
    marginTop: responsiveHeight(4),
  },

  footerText: {
    color: Colors.themeText,
    fontSize: responsiveFontSize(2),
  },

  registerText: {
    color: Colors.buttonBg,
    fontWeight: '700',
  },
});
