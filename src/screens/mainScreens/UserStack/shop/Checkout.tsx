/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { notification } from '../../../../assets/icons';
import { Colors } from '../../../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../assets/responsive_dimensions';
import Header from '../../../../Components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BoldText, NormalText } from '../../../../Components/Titles';
import LinearGradient from 'react-native-linear-gradient';

const Checkout = ({ navigation }) => {
  const paymentData = [
    { id: 1, title: 'Subtotal', value: '280.00', isBold: false },
    { id: 2, title: 'Shipping Fee', value: '20.00', isBold: false },
    { id: 3, title: 'Total', value: '300.00', isBold: true },
  ];

  const data = [
    { id: 1, title: 'Shipping Address', value: '22 Baker Street London MG91 9AF', navigateTo: 'ChangeDetails' },
    { id: 2, title: 'Billing Address', value: '22 Baker Street London MG91 9AF', navigateTo: 'ChangeDetails' },
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

        <BoldText mrgnTop={responsiveHeight(2)} title="Check Out" color={Colors.black} />
        <BoldText
          mrgnTop={responsiveHeight(2)}
          title="Payment Information"
          color={Colors.black}
          fontSize={responsiveFontSize(2.3)}
          fontWeight="700"
        />
        <NormalText
          mrgnTop={responsiveHeight(1)}
          title="12 Dec 2018, 08:08 • Credit / Debit Card"
          color="#9B9EA9"
        />

        {/* Payment Details */}
        <View>
          <FlatList
            contentContainerStyle={{ gap: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}
            data={paymentData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <NormalText
                  fontSize={responsiveFontSize(2.1)}
                  title={item.title}
                  fontWeight={item.isBold ? '800' : '400'}
                />
                <NormalText
                  fontSize={responsiveFontSize(2.1)}
                  title={`USD ${item.value}`}
                  fontWeight={item.isBold ? '800' : '400'}
                />
              </View>
            )}
          />
        </View>
        {/* Address Section */}
        <View style={{ marginTop: responsiveHeight(3) }}>
          <FlatList
            contentContainerStyle={{ gap: responsiveHeight(3) }}
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <BoldText
                    color={Colors.black}
                    fontSize={responsiveFontSize(2.4)}
                    title={item.title}
                  />
                  <TouchableOpacity onPress={() => navigation.navigate(item.navigateTo)}>
                    <NormalText
                      fontSize={responsiveFontSize(2.2)}
                      title="Change"
                      color="#4C69FF"
                    />
                  </TouchableOpacity>
                </View>
                <NormalText
                  fontSize={responsiveFontSize(2.2)}
                  title={item.value}
                  color={Colors.black}
                  width={responsiveWidth(40)}
                  mrgnTop={responsiveHeight(1)}
                />
              </View>
            )}
          />
        </View>

        {/* Total + Checkout Button */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
            <View>
              <NormalText color="#7B7F8F" fontSize={responsiveFontSize(2.2)} title="Total" />
              <NormalText color={Colors.black} fontSize={responsiveFontSize(2.2)} fontWeight="700" title="USD 300.00" />
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('PaymentMethod')} activeOpacity={0.8}>
              <LinearGradient
                colors={['#3A8DFF', '#00E0C6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}>
                <Text style={styles.btnText}>Check Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Checkout;

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
