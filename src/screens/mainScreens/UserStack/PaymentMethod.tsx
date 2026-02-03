/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { FlatList } from 'react-native';
import { Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import BackIcon from '../../../Components/BackIcon';
import { Colors } from '../../../assets/colors';
import { Button } from '../../../Components/Button';
import { NormalText } from '../../../Components/Titles';
import SvgIcons from '../../../Components/SvgIcons';
import { tick } from '../../../assets/icons';

const PaymentMethod = ({ navigation }) => {
  const [checked, setChecked] = useState(true);
  console.log('checked', checked)
  return (
    <View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ padding: responsiveHeight(2) }}>
          <BackIcon />
          <NormalText mrgnTop={responsiveHeight(5)} title="Payment Method" fontWeight="900" fontSize={responsiveFontSize(2.3)} />
        </View>
        <View
          style={{
            paddingLeft: responsiveHeight(2),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              height: responsiveHeight(15),
              width: responsiveWidth(12),
              backgroundColor: Colors.buttonBg,
              marginRight: responsiveHeight(0.5),
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Octicons
              name={'plus'}
              size={responsiveFontSize(3)}
              color={'#FFFFFF'}
            />
          </TouchableOpacity>
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingRight:responsiveHeight(2)}}
            renderItem={() => {
              return (
                <Image
                  source={images.Visa}
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(40),
                    marginLeft: 10,
                    borderRadius: 10,
                  }}
                />
              );
            }}
          />
        </View>
        <View style={{ paddingHorizontal: responsiveHeight(2) }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#DEDEDE',
              padding: 10,
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={{ fontSize: responsiveFontSize(2) }}>Name</Text>
            <TextInput
              placeholder="Jordan Delgado"
              placeholderTextColor={'#000000'}
              style={{ height: 40 }}
            />
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#DEDEDE',
              padding: 10,
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={{ fontSize: responsiveFontSize(2) }}>Card number</Text>
            <TextInput
              placeholder="***** ***** **** 789"
              placeholderTextColor={'#000000'}
              style={{ height: 40 }}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#DEDEDE',
                padding: 10,
                justifyContent: 'center',
                marginTop: 20,
                width: responsiveWidth(44),
              }}>
              <Text style={{ fontSize: responsiveFontSize(2) }}>Expiry Date</Text>
              <TextInput
                placeholder="10-27-2025"
                placeholderTextColor={'#000000'}
                style={{ height: 40 }}
              />
            </View>

            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#DEDEDE',
                padding: 10,
                justifyContent: 'center',
                marginTop: 20,
                width: responsiveWidth(44),
              }}>
              <Text style={{ fontSize: responsiveFontSize(2) }}>CVV</Text>
              <TextInput
                placeholder="***"
                placeholderTextColor={'#000000'}
                style={{ height: 40 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: responsiveHeight(1), marginTop: responsiveHeight(2.5), alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setChecked(!checked)} style={{ backgroundColor: checked ? Colors.buttonBg : null, borderWidth: checked ? null : 1, borderColor: checked ? null : '#9da5b3', alignItems: 'center', justifyContent: 'center', height: responsiveHeight(3.5), width: responsiveWidth(7), borderRadius: responsiveHeight(0.5) }}>
              {checked && (
                <SvgIcons xml={tick} height={20} width={20} />
              )}
            </TouchableOpacity>
            <NormalText alignSelf="center" color={'#9da5b3'} title="Save Detail Information" fontWeight="400" fontSize={responsiveFontSize(1.8)} />
          </View>
          <View style={{ alignItems: 'center', width: '100%', alignSelf: 'center', marginTop: responsiveHeight(4) }}>
            <Button handlePress={() => navigation.navigate('AddCard')} textColor="white" title="Continue" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethod;
