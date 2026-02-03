/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import SvgIcons from '../../Components/SvgIcons';
import { back, bookingSuccess, paymentSuccess, settings, uniqueCode } from '../../assets/icons';
import ListHeading from '../../Components/ListHeading';
import { Colors } from '../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../assets/responsive_dimensions';
import NotificationCard from '../../Components/NotificationCard';
import { NormalText } from '../../Components/Titles';

const Notification = ({ navigation }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.white, padding: responsiveHeight(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#F2F2F2', borderRadius: responsiveHeight(3), width: responsiveWidth(11), alignItems: 'center', padding: responsiveHeight(1.3), justifyContent: 'center' }}>
          <SvgIcons xml={back} height={20} width={20} />
        </TouchableOpacity>
        <NormalText color={Colors.themeText2} alignSelf="center" fontWeight="900" fontSize={responsiveFontSize(2.7)} title="Notifications" />
        <Text style={{ color: Colors.white }}>a</Text>
      </View>
      <ListHeading mrgnTop={responsiveHeight(4)} showSeeAll={false} title="Today" />
      <View style={{ marginTop: responsiveHeight(3), gap: responsiveHeight(2) }}>
        <NotificationCard showBadge iconName={uniqueCode} text1="Recieved Unique Code" text2="Congratulation! Your received code." text3="2 minutes a go" />
        <NotificationCard showBadge iconName={paymentSuccess} text1="Payment Success" text2="You success an order payment from Star Sun Appartment in the amount of $320" text3="10 minutes a go" />
        <NotificationCard iconName={settings} text1="Update Apps" text2="The sewo application has made updates to improve services" text3="1 Oct" />
        <NotificationCard iconName={bookingSuccess} text1="Booking Success" text2="You completed the order from Star Sun Appartment" text3="16 Sept" />
        <NotificationCard iconName={bookingSuccess} text1="Booking Canceled" text2="You completed for canceled the order from Star Sun Appartment" text3="16 Sept" />
      </View>
    </ScrollView>
  );
};

export default Notification;
