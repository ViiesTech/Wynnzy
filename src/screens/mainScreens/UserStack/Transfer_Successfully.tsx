/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { images } from '../../../assets/images';
import { Button } from '../../../Components/Button';
import { Colors } from '../../../assets/colors';
import { NormalText } from '../../../Components/Titles';
import BackIcon from '../../../Components/BackIcon';

const Transfer_Successfully = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <BackIcon  />
        <View style={{ height: responsiveHeight(80), alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <View style={{ padding: 20, width: responsiveWidth(90), borderRadius: 10, elevation: 2, backgroundColor: '#FFFFFF' }}>
            <NormalText alignSelf={'center'} title="Transfer Successfully" fontWeight="900" fontSize={responsiveFontSize(2.3)} />
            <Image source={images.green} style={{ height: responsiveHeight(12), width: responsiveHeight(12), marginTop: responsiveHeight(2), resizeMode: 'contain', alignSelf: 'center' }} />
            <Text style={{ width: responsiveWidth(40), textAlign: 'center', alignSelf: 'center', color: Colors.themeText, fontWeight: '500', lineHeight: responsiveHeight(3), marginTop: responsiveHeight(1) }}>You Have Successfully Transferred $228</Text>

            <View style={{ alignItems: 'center', width: '100%', alignSelf: 'center', marginTop: responsiveHeight(4) }}>
              <Button handlePress={() => navigation.navigate('BottomStack')} textColor="white" title="Go Back" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Transfer_Successfully;
