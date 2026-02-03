/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SvgIcons from '../../../Components/SvgIcons';
import { notification2, plus, rating, search2 } from '../../../assets/icons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import { Colors } from '../../../assets/colors';
import { BoldText, NormalText } from '../../../Components/Titles';
import { View, Image, FlatList, ScrollView } from 'react-native';
import Header from '../../../Components/Header';
import { images } from '../../../assets/images';
import { Button } from '../../../Components/Button';
import ListHeading from '../../../Components/ListHeading';
import SearchInput from '../../../Components/SearchInput';
import FlashSaleCards from '../../../Components/FlashSaleCards';

const Home = ({ navigation }) => {
  const data = [
    {
      id: 1,
      picture: images.boarding,
    },
    {
      id: 2,
      picture: images.boarding,
    },
  ];

  const nearByData = [
    {
      id: 1,
      pic: images.dog1,
    },
    {
      id: 2,
      pic: images.dog2,
    },
  ];

  const renderNearbyItems = ({ item, index }) => {
    return (
      <View key={index} style={{ padding: 10, width: responsiveWidth(48) }}>
        <Image source={item.pic} style={{ width: '100%', height: responsiveHeight(17), borderRadius: responsiveHeight(1) }} />
        <BoldText title="Store Name" fontSize={responsiveFontSize(2.4)} color="#2A1E51" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 5, backgroundColor: '#F5F5F5', padding: 7 }}>
            <SvgIcons xml={rating} height={20} width={20} />
            <NormalText title="4.9" alignSelf="center" color="#5F5F63" />
          </View>
          <NormalText title="Rating" alignSelf="center" color="#5F5F63" />
        </View>
      </View>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: responsiveHeight(2), backgroundColor: Colors.white }}>
      <View style={{ paddingHorizontal: responsiveHeight(1.5) }}>
        <View style={{ backgroundColor: Colors.buttonBg, marginBottom: responsiveHeight(2), paddingHorizontal: responsiveHeight(1), paddingTop: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
          <Header iconName={notification2} handleNotificationPress={() => navigation.navigate('Notification')}
            handlePress={() => navigation.navigate('Location')} whiteNotification={true} bgColor={'#A7ADFB'} />
          <SearchInput txtColor={Colors.black} xml={search2} placeHolder="Find best Hotels and Pet Care" placeHolderColor="#fff" bgColor="#C9D1FF" />
          <View style={{ marginVertical: responsiveHeight(2) }}>
            <Image style={{ width: '100%' }} resizeMode="contain" source={images.slide2} />
            <View style={{ position: 'absolute', height: '100%', marginTop: responsiveHeight(2.5), gap: responsiveHeight(0.8), left: responsiveHeight(3.5) }}>
              <BoldText fontSize={responsiveFontSize(2)} color={Colors.white} alignSelf="right" title="Flash Sale" />
              <NormalText color={Colors.white} title="Lorem Ipsum Dummy
Text."/>
              <Button alignSelf="flex-start" height={responsiveHeight(5)} width={responsiveHeight(11)} textColor={Colors.white} bgColor="#8079DD" title="See All" borderColor={''} borderRadius={0} xml={''} textFont={0} handlePress={function (): void {
                console.log('abc');
              }} />
            </View>

          </View>
        </View>
        <ListHeading btnContainer title="Flash Sale" mrgnTop={0} />
      </View>
      <FlatList contentContainerStyle={{ gap: 20, marginBottom: 10, paddingHorizontal: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} horizontal data={data} renderItem={() => <FlashSaleCards />} />
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{ marginTop: responsiveHeight(2) }}>

          <ListHeading title="Nearby Pet Hotel / Daycares" />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{ justifyContent: 'space-between' }}
          data={nearByData}
          renderItem={renderNearbyItems}
          keyExtractor={(item) => item.id.toString()} // Unique key for each item
        />
      </View>
      <View style={{ position: 'absolute', bottom: responsiveHeight(2), right: responsiveHeight(2), zIndex: 10 }}>
        <Button width={responsiveWidth(34)} height={responsiveHeight(6.5)} title="Add Pet" bgColor={Colors.buttonBg} textColor="white" icon xml={plus} borderColor={''} borderRadius={0} textFont={0} handlePress={function (): void {
          console.log('abc');
        }} />
      </View>
    </ScrollView>
  );
};

export default Home;
