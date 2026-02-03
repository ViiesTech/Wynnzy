/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { fingerPrint, notification, visa } from '../../../../assets/icons';
import { Colors } from '../../../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../assets/responsive_dimensions';
import Header from '../../../../Components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BoldText, NormalText } from '../../../../Components/Titles';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcons from '../../../../Components/SvgIcons';

const ChangeDetails = ({ navigation }) => {
  const [activeShippingAddress, setActiveShippingAddress] = useState(1);
  const [activePaymentMethod, setActivePaymentMethod] = useState(1);
  const shippingData = [
    { id: 1, title: 'Waterway Residences', subTitle: 'London MG91 9AF' },
    { id: 2, title: '22 Baker Street', subTitle: 'London MG91 9AF' },
  ]

  const paymentData = [
    { id: 1, lastFour: '0309' },
    { id: 2, lastFour: '0633' },
    { id: 3, lastFour: '0608' },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: responsiveHeight(4),
        backgroundColor: Colors.white,
      }}>
      <View style={{ flex: 1, paddingHorizontal: responsiveHeight(2) }}>
        <Header
          handleFilterPress={() => navigation.navigate('Filter2')}
          iconName={notification}
          handleNotificationPress={() => navigation.navigate('Notification')}
          handlePress={() => navigation.navigate('Location')}
          bgColor=""
          whiteNotification={false}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: responsiveHeight(3.5) }}>
          <Ionicons name="arrow-back" color={Colors.black} size={30} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <NormalText fontSize={responsiveFontSize(2.2)} mrgnTop={responsiveHeight(2)} title="Shipping Address" color={Colors.black} />
          <NormalText fontSize={responsiveFontSize(2.2)} mrgnTop={responsiveHeight(2)} title="Edit" color="#4C69FF" />

        </View>

        {/* Payment Details */}
        <View>
          <FlatList
            contentContainerStyle={{
              gap: responsiveHeight(2),
              marginTop: responsiveHeight(2),
            }}
            data={shippingData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isActive = item.id === activeShippingAddress;

              return (
                <>
                  {isActive ? (
                    // ✅ Gradient Border (Active)
                    <LinearGradient
                      colors={['#3A8DFF', '#00E0C6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        padding: 2,
                        borderRadius: responsiveHeight(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => setActiveShippingAddress(item.id)}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: responsiveHeight(2),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: responsiveHeight(2),
                        }}>
                        <View>
                          <NormalText
                            color={Colors.black}
                            fontSize={responsiveFontSize(2.1)}
                            title={item.title}
                          />
                          <NormalText
                            color={Colors.black}
                            fontSize={responsiveFontSize(2.1)}
                            title={item.subTitle}
                          />
                        </View>
                        <Ionicons size={25} color="#4C69FF" name="checkmark-sharp" />
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    // ⚫ Simple Black Border (Inactive)
                    <TouchableOpacity
                      onPress={() => setActiveShippingAddress(item.id)}
                      activeOpacity={0.8}
                      style={{
                        borderWidth: 2,
                        borderColor: '#C9CFE5', // or 'black' if you prefer
                        borderRadius: responsiveHeight(2),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: responsiveHeight(2),
                        backgroundColor: 'white',
                      }}>
                      <View>
                        <NormalText
                          color={Colors.black}
                          fontSize={responsiveFontSize(2.1)}
                          title={item.title}
                        />
                        <NormalText
                          color={Colors.black}
                          fontSize={responsiveFontSize(2.1)}
                          title={item.subTitle}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
          />
        </View>
        {/* Address Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <NormalText fontSize={responsiveFontSize(2.2)} mrgnTop={responsiveHeight(2)} title="Payment Method" color={Colors.black} />
          <NormalText fontSize={responsiveFontSize(2.2)} mrgnTop={responsiveHeight(2)} title="Add Card" color="#4C69FF" />

        </View>
        <View>
          <FlatList
            contentContainerStyle={{
              gap: responsiveHeight(2),
              marginTop: responsiveHeight(2),
            }}
            data={paymentData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isActive = item.id === activePaymentMethod;

              return (
                <>
                  {isActive ? (
                    // ✅ Gradient Border when selected
                    <LinearGradient
                      colors={['#3A8DFF', '#00E0C6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        padding: 2, // border thickness
                        borderRadius: responsiveHeight(2),
                      }}>
                      <TouchableOpacity
                        onPress={() => setActivePaymentMethod(item.id)}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: responsiveHeight(2),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: responsiveHeight(2),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: responsiveHeight(2),
                            alignItems: 'center',
                          }}>
                          <SvgIcons
                            xml={visa}
                            height={responsiveHeight(7)}
                            width={responsiveWidth(10)}
                          />
                          <NormalText
                            alignSelf="center"
                            color={Colors.black}
                            fontSize={responsiveFontSize(2.1)}
                            title={`**** **** **** ${item.lastFour}`}
                          />
                        </View>
                        <Ionicons size={25} color="#4C69FF" name="checkmark-sharp" />
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    // ⚫ Normal border when not selected
                    <TouchableOpacity
                      onPress={() => setActivePaymentMethod(item.id)}
                      activeOpacity={0.8}
                      style={{
                        borderWidth: 2,
                        borderColor: '#C9CFE5',
                        borderRadius: responsiveHeight(2),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: responsiveHeight(2),
                        backgroundColor: 'white',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: responsiveHeight(2),
                          alignItems: 'center',
                        }}>
                        <SvgIcons
                          xml={visa}
                          height={responsiveHeight(7)}
                          width={responsiveWidth(10)}
                        />
                        <NormalText
                          alignSelf="center"
                          color={Colors.black}
                          fontSize={responsiveFontSize(2.1)}
                          title={`**** **** **** ${item.lastFour}`}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
          />
        </View>

        {/* Total + Checkout Button */}
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(3) }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgIcons xml={fingerPrint} height={responsiveHeight(8)} width={responsiveWidth(17)} />
          </TouchableOpacity>
          <NormalText alignSelf="center" mrgnTop={responsiveHeight(2)} fontSize={responsiveFontSize(2.2)} title="Confirm with Touch ID" color="#4C69FF" />

        </View>
      </View>
    </ScrollView>
  );
};

export default ChangeDetails;

const styles = StyleSheet.create({
  button: {
    height: responsiveHeight(6.2),
    borderRadius: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(37),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
});
