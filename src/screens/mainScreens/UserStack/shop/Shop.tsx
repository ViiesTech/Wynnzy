/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Header from '../../../../Components/Header';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../assets/responsive_dimensions';
import { notification, search } from '../../../../assets/icons';
import SearchInput from '../../../../Components/SearchInput';
import { Colors } from '../../../../assets/colors';
import { BoldText, NormalText } from '../../../../Components/Titles';
import { images } from '../../../../assets/images';

const Shop = ({ navigation }) => {

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
        <BoldText
          color={Colors.labelText}
          title="Products"
          mrgnTop={responsiveHeight(3)}
          fontSize={responsiveFontSize(2.3)}
          alignSelf="left"
        />
        <View>
          <FlatList numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }} contentContainerStyle={{ gap: responsiveHeight(3), marginTop: responsiveHeight(2) }} data={[1, 2, 3, 4, 5, 6]} renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetails')}>
                <View style={{ borderWidth: 2, width: responsiveWidth(43), alignItems: 'center', borderColor: Colors?.buttonBg, padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
                  <Image style={{ height: responsiveHeight(18) }} source={images.product} />
                </View>
                <BoldText
                  color={Colors.labelText}
                  title="Lorem ipsum"
                  mrgnTop={responsiveHeight(1.2)}
                  fontSize={responsiveFontSize(2.3)}
                  alignSelf="left"
                />
                <View style={{
                  flexDirection: 'row', marginTop: responsiveHeight(1),
                  alignItems: 'center', gap: responsiveHeight(2),
                }}>
                  <View style={{ backgroundColor: '#F5F5F5', width: responsiveWidth(12), height: responsiveHeight(4), borderRadius: responsiveHeight(1), justifyContent: 'center', alignItems: 'center' }}>
                    <NormalText
                      color="#5F6063"
                      alignSelf="center"
                      title="$50"
                    />
                  </View>
                  <NormalText
                    alignSelf="center"
                    color="#5F6063"
                    title="Add to Cart"
                  />
                </View>
              </TouchableOpacity>
            );
          }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Shop;
