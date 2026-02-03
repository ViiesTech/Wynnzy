/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Input from '../../Components/Input';
import { Colors } from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import { BoldText, NormalText } from '../../Components/Titles';
import { Button } from '../../Components/Button';
import { Apple, Google, mail, security, tick } from '../../assets/icons';
import SvgIcons from '../../Components/SvgIcons';
import { handleLogin, ShowToast } from '../../GlobalFunctions/Auth';
import { useDispatch, useSelector } from 'react-redux';

const Login = ({ navigation }) => {
  const [checked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  console.log('userdata', userData);
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const loginHandler = async () => {
    const { email, password } = form;
    if (!email || !password) {
      ShowToast('error', 'Please fill all required fields');
      return;
    }
    try {
      const response = await handleLogin(email, password, dispatch);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: 20,
      }}>
      <View style={{ paddingVertical: responsiveHeight(6) }}>
        <View
          style={{
            gap: responsiveHeight(1),
            marginBottom: responsiveHeight(3.5),
            flex: 0.2,
            alignItems: 'center',
          }}>
          <BoldText alignSelf="center" title="Login Account" />
          <NormalText
            alignSelf="center"
            title="Stay signed in with your account"
          />
        </View>
        <View style={{ gap: responsiveHeight(2) }}>
          <Input
            icon
            xml={mail}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('email', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="Exampleemail@com"
          />
          <Input
            icon
            xml={security}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            security={true}
            placeholderTxtColor={Colors.themeText}
            handlePress={text => handleInputChange('password', text)}
            color={Colors.themeText}
            backgroundColor={Colors.white}
            fontSize={16}
            fontWeight="bold"
            placeHolder="password"
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setIsChecked(!checked)} // Toggle checked state
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(1),
              }}>
              <TouchableOpacity
                onPress={() => setIsChecked(!checked)} // Toggle checked state
                style={[
                  styles.button,
                  checked
                    ? { backgroundColor: Colors.buttonBg }
                    : {
                      backgroundColor: Colors.white,
                      borderWidth: 1.5,
                      borderColor: Colors.buttonBg,
                    },
                ]}>
                {checked && <SvgIcons xml={tick} height={15} width={15} />}{' '}
                {/* Show SVG when checked */}
              </TouchableOpacity>
              <NormalText alignSelf="center" color={Colors.black} title="Remember me" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <NormalText color={Colors.buttonBg} title="Forgot Password?" />
            </TouchableOpacity>
          </View>
          <Button
            handlePress={() => loginHandler()}
            textColor={Colors.white}
            bgColor={Colors.buttonBg}
            title={isLoading ? <ActivityIndicator size={'large'} color={Colors.white} /> : 'Sign In'}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveHeight(1),
            }}>
            <View
              style={{
                backgroundColor: Colors.buttonBg,
                height: 1,
                flex: 1,
              }} />
            <NormalText title="Or Sign In With" />
            <View
              style={{
                backgroundColor: Colors.buttonBg,
                height: 1,
                flex: 1,
              }} />
          </View>
          <Button
            xml={Google}
            bgColor={Colors.white}
            borderWidth={1}
            textColor={Colors.themeText}
            borderColor={Colors.buttonBg}
            icon={true}
            title="Sign in with Google"
          />
          <Button
            xml={Apple}
            bgColor={Colors.black}
            borderWidth={1}
            textColor={Colors.white}
            // borderColor={Colors.buttonBg}
            icon={true}
            title="Sign in with Apple"
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SelectType')} style={{ alignItems: 'center', marginTop: responsiveHeight(4), flex: 1, bottom: 10, justifyContent: 'flex-end' }}>
        <Text style={{ color: '#3B4B68', fontSize: responsiveFontSize(2) }}>Don't have an account ? <Text style={{ color: Colors.buttonBg, fontWeight: '700' }}>Register</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(7),
    height: responsiveHeight(3.5),
    padding: 10, // Add padding for touchable area
    borderRadius: responsiveHeight(1), // Add border radius if required
  },
});
