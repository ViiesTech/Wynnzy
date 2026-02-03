/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../assets/colors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import { BoldText, NormalText } from '../../Components/Titles';
import { Button } from '../../Components/Button';
import SvgIcons from '../../Components/SvgIcons';
import { back, otp } from '../../assets/icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { resendOtp, ShowToast, verifyOtp, verifyOtpPassword } from '../../GlobalFunctions/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserData } from '../../redux/Slices';
const Otp = ({ navigation, route }) => {
  const [value, setValue] = useState();
  const [showTime, setShowTime] = useState(true);
  const accessToken = useSelector(state => state.user.token);
  console.log('token', accessToken)
  const [timeLeft, setTimeLeft] = useState<number>(59); // Start from 59 seconds
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const dispatch = useDispatch();
  const { registeration, email, token } = route?.params;
  console.log('route token', token);
  console.log('type of ', typeof (value));
  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  console.log('registeration', registeration);

  useEffect(() => {
    if (timeLeft === 0) { return; }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft < 1) {
      setShowTime(false);
    }
  }, [timeLeft]);

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;
    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value })}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View
        style={{
          backgroundColor: Colors.white,
          // paddingVertical: 6,
          // paddingHorizontal: 4,
          borderRadius: responsiveHeight(1),
        }}>
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}>
          {textChild}
        </Text>
      </View>
    );
  };

  const handleOtpIntegration = async () => {
    if (!value) {
      ShowToast('error', 'Please enter your otp to proceed');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await verifyOtp(email, value, token);
      console.log('response', response);
      if (response.success) {
        ShowToast('success', 'Otp Verified');
        dispatch(setToken(response.accessToken));
        dispatch(setUserData(response.data));
      } else {
        ShowToast('error', response.message);

      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ShowToast('error', error);
      console.log('error', error);
    }
  };

  const resendOtpIntegration = async () => {
    if (timeLeft < 1) {
      setShowTime(true);
      setTimeLeft(59);
      return;
    }
    try {
      setResendOtpLoading(true);
      const response = await resendOtp(email);
      ShowToast('success', 'Otp Sent Successfully');
      setTimeLeft(59);
      console.log('response', response);
      setResendOtpLoading(false);
    } catch (error) {
      setResendOtpLoading(false);
      ShowToast('error', error);
      console.log('error', error);
    }
  };

  const verifyPassOtpHandler = async () => {
    if (!value) {
      ShowToast('error', 'Please enter your otp to proceed');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await verifyOtpPassword(email, value);
      setIsLoading(false);
      if (response?.success) {
        ShowToast('success', response.msg);
        navigation.navigate('ResetPass', { email });
      } else {
        ShowToast('error', response.msg);
      }
      console.log('response', response);
    } catch (error) {
      setIsLoading(true);
      console.log('error', error);
      ShowToast('error', error?.response?.data?.msg);
    }
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        // justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: 20,
        paddingTop: 30,
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <SvgIcons xml={back} height={20} width={20} />
      </TouchableOpacity>
      <View
        style={{
          gap: responsiveHeight(1),
          marginBottom: responsiveHeight(1.5),
          flex: 0.8,
          justifyContent: 'center',
        }}>
        <SvgIcons align="center" xml={otp} height={150} width={150} />
        <BoldText alignSelf="center" color={Colors.themeText2} mrgnTop={responsiveHeight(2)} title="Enter OTP" />
        <NormalText

          color={Colors.themeText}
          fontWeight="400"
          txtAlign="center"
          alignSelf="center"
          title="We have sent you an email containing 4 digits
verification code. Please enter the code
to verify your identity"
        />
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        <TouchableOpacity onPress={() => resendOtpIntegration()}>
          <NormalText
            alignSelf="center"
            color={Colors.themeText2}
            txtAlign="center"
            title={
              resendOtpLoading ? (
                <ActivityIndicator size="large" color={Colors.buttonBg} />
              ) : `Resend code ${showTime ? `(00:${timeLeft})` : ''}`
            } />
        </TouchableOpacity>
        <View style={{ marginTop: responsiveHeight(2.5) }}>
          <Button

            handlePress={() => registeration ? handleOtpIntegration() : verifyPassOtpHandler()}
            textColor={Colors.white}
            bgColor={Colors.buttonBg}
            title={isLoading ? <ActivityIndicator size={'large'} color={Colors.white} /> : 'Continue'}
          />
        </View>
      </View>

    </ScrollView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: responsiveHeight(1.8),
    gap: 0,
    padding: 0,
  },
  cell: {
    width: responsiveWidth(17.5),
    height: 67,
    padding: 5,
    fontSize: 34,
    borderWidth: 2.5,
    borderColor: '#EFEFEF',
    textAlign: 'center',
    borderRadius: responsiveHeight(1),
    paddingVertical: 10,
    color: '#041E5E',
  },
  focusCell: {
    borderColor: Colors.buttonBg,
  },
});
