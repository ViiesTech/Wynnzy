/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../Components/Header';
import { nike, notification, search, store } from '../../../../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../assets/responsive_dimensions';
import { Colors } from '../../../../assets/colors';
import SearchInput from '../../../../Components/SearchInput';
import { BoldText, NormalText } from '../../../../Components/Titles';
import SvgIcons from '../../../../Components/SvgIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { images } from '../../../../assets/images';
const MyCart = ({ navigation }) => {
  const [currentValue, setCurrentValue] = useState(1);
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Lorem ipsum', subTitle: 'Laser Fuschia UK 10', image: images.product, checkMarkColor: Colors.buttonBg, price: '180.00', isStore: true, isHr: true, store: 'Lorem ipsum', quantity: 1 },
    { id: 2, title: 'Lorem ipsum', subTitle: 'Laser Fuschia UK 10', image: images.product, checkMarkColor: '#C9CFE5', price: '113.00', isStore: false, isHr: false, quantity: 1 },
    { id: 3, title: 'Lorem ipsum', subTitle: 'Laser Fuschia UK 10', image: images.product, checkMarkColor: Colors.buttonBg, price: '100.00', isStore: false, isHr: false, quantity: 1 },
  ]);

  const handleIncrease = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: responsiveHeight(4), backgroundColor: Colors.white }}>
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <Header
          handleFilterPress={() => navigation.navigate('Filter2')}
          iconName={notification}
          handleNotificationPress={() => navigation.navigate('Notification')}
          handlePress={() => navigation.navigate('Location')}
          bgColor={''}
          whiteNotification={false}
        />
        <SearchInput txtColor={Colors.black} xml={search} placeHolder="Find best Hotels and Pet Care" placeHolderColor="#CACACA" bgColor="#F6F6F6" />
        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', justifyContent: 'space-between' }}>

          <BoldText
            color={Colors.black}
            title="My Cart"
            alignSelf="left"
          />
          <NormalText title="Remove (2)" color="#F04D96" alignSelf="center" />
        </View>

        <View style={{ flexDirection: 'row', gap: responsiveHeight(2), marginTop: responsiveHeight(2) }}>
          <SvgIcons xml={nike} height={responsiveHeight(7)} width={responsiveWidth(8)} />
          <NormalText title="Lorem ipusm" color={Colors.black} fontWeight="700" alignSelf="center" />
        </View>
        <View style={{ borderWidth: 1.2, borderColor: '#E5E5E5', marginTop: responsiveHeight(1) }} />
        <View>
          <FlatList contentContainerStyle={{ gap: responsiveHeight(3.5), marginVertical: responsiveHeight(3), marginRight: responsiveHeight(0.3) }} data={cartItems} keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
                    <View style={{ backgroundColor: item.checkMarkColor, zIndex: 10, height: responsiveHeight(3.8), width: responsiveWidth(8.2), borderRadius: responsiveHeight(2), justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="checkmark-sharp" color={Colors.white} size={20} />
                    </View>
                    <View style={{ backgroundColor: Colors.white, flex: 1, elevation: 5, padding: responsiveHeight(1.5), paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(3), borderRadius: responsiveHeight(2) }}>
                      <View style={{ flexDirection: 'row', gap: responsiveHeight(0.5) }}>
                        <Image source={item.image} style={{ height: responsiveHeight(12), width: responsiveWidth(25) }} resizeMode="contain" />
                        <View style={{ flexDirection: 'row', top: responsiveHeight(1.5), flex: 1, justifyContent: 'space-between' }}>
                          <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View>
                              <BoldText fontWeight="700" fontSize={responsiveFontSize(2.2)} title={item.title} color={Colors.black} />
                              <BoldText fontSize={responsiveFontSize(2.2)} title={`USD ${item.price}`} color={Colors.buttonBg} />
                            </View>
                            <View style={{ flexDirection: 'row', width: responsiveWidth(48), justifyContent: 'space-between' }}>
                              <NormalText width={responsiveWidth(25)} title="Laser Fuschia UK 10" color="#40434D" fontSize={responsiveFontSize(1.7)} />
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.2) }}>
                                <TouchableOpacity onPress={() => handleDecrease(item.id)} style={{ borderWidth: 1.5, borderColor: currentValue > 1 ? Colors.buttonBg : '#DBE1FF', padding: responsiveHeight(0.3), borderRadius: responsiveHeight(1) }}>
                                  <AntDesign name="minus" color={currentValue > 1 ? Colors.buttonBg : '#DBE1FF'} size={20} />
                                </TouchableOpacity>
                                <NormalText fontSize={responsiveFontSize(1.8)} title={item?.quantity} alignSelf="center" />
                                <TouchableOpacity onPress={() => handleIncrease(item.id)} style={{ borderWidth: 1.5, borderColor: Colors.buttonBg, padding: responsiveHeight(0.3), borderRadius: responsiveHeight(1) }}>
                                  <AntDesign name="plus" color="#DBE1FF" size={20} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                          <TouchableOpacity style={{ height: responsiveHeight(2) }}>
                            <AntDesign name="minus" color="#F04D96" size={25} />
                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  </View>
                  {item.isStore ? (
                    <View style={{ flexDirection: 'row', gap: responsiveHeight(2), marginTop: responsiveHeight(2) }}>
                      <SvgIcons xml={store} height={responsiveHeight(8)} width={responsiveWidth(8)} />
                      <BoldText title={item.store} alignSelf="center" fontSize={responsiveFontSize(2.2)} />
                    </View>
                  ) : null}
                  {item?.isHr ? (
                    <View style={{ borderWidth: 1.2, borderColor: '#E5E5E5' }} />
                  ) : null}
                </>
              )
            }} />
        </View>


        <View style={{ paddingHorizontal: responsiveHeight(2) }}>
          <NormalText fontSize={responsiveFontSize(2)} color={Colors.buttonBg} title="Apply Voucher Code" />
        </View>
        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <NormalText fontSize={responsiveFontSize(2)} color="#7B7F8F" title="Total" />
            <NormalText color={Colors.black} fontSize={responsiveFontSize(2.3)} title="USD 280.00" />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Checkout')} style={{ width: responsiveWidth(35), backgroundColor: Colors.buttonBg, borderRadius: responsiveHeight(1.5), justifyContent: 'center', alignItems: 'center', paddingVertical: responsiveHeight(1.5) }}>
            <Ionicons name="arrow-forward" color={Colors.white} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyCart;
