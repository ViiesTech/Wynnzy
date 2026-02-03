/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TextInput } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from '../../../assets/responsive_dimensions';
import BackIcon from '../../../Components/BackIcon';
import { Button } from '../../../Components/Button';
import { Colors } from '../../../assets/colors';
import Input from '../../../Components/Input';
import { NormalText } from '../../../Components/Titles';
const AddNewCard = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <BackIcon  />

        <View style={{ height: responsiveHeight(80), alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ padding: 20, width: responsiveWidth(90), borderRadius: 10, elevation: 2, backgroundColor: '#FFFFFF' }}>
            <NormalText alignSelf={'center'} title="Add New Card" fontWeight="900" fontSize={responsiveFontSize(2.3)} />
            <View style={{ gap: responsiveHeight(2), marginTop: responsiveHeight(3) }}>
              <Input icon={false} placeHolder={'Select Bank'} color={''} fontSize={responsiveFontSize(2)} fontWeight={'600'} backgroundColor={''} placeholderTxtColor={'#131E5E'} xml={''} handlePress={function (): void {
                // throw new Error('Function not implemented.');
              }} setShowPassword={function (): void {
                // throw new Error('Function not implemented.');
              }} />
              <Input icon={false} placeHolder={'Account number'} color={''} fontSize={responsiveFontSize(2)} fontWeight={'600'} backgroundColor={''} placeholderTxtColor={'#131E5E'} xml={''} handlePress={function (): void {
                // throw new Error('Function not implemented.');
              }} setShowPassword={function (): void {
                // throw new Error('Function not implemented.');
              }} />
              <Input icon={false} placeHolder={'Card Number'} color={''} fontSize={responsiveFontSize(2)} fontWeight={'600'} backgroundColor={''} placeholderTxtColor={'#131E5E'} xml={''} handlePress={function (): void {
                // throw new Error('Function not implemented.');
              }} setShowPassword={function (): void {
                // throw new Error('Function not implemented.');
              }} />
              <Input icon={false} placeHolder={'CVV'} color={''} fontSize={responsiveFontSize(2)} fontWeight={'600'} backgroundColor={''} placeholderTxtColor={'#131E5E'} xml={''} handlePress={function (): void {
                // throw new Error('Function not implemented.');
              }} setShowPassword={function (): void {
                // throw new Error('Function not implemented.');
              }} />
            </View>
            <View style={{ alignItems: 'center', width: '100%', alignSelf: 'center', marginTop: responsiveHeight(4) }}>
              <Button handlePress={() => navigation.navigate('TransferSuccessfully')} textColor="white" title="Add Card" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddNewCard;
