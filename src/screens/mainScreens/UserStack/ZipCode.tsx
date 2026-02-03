/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import BackIcon from '../../../Components/BackIcon';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import SearchInput from '../../../Components/SearchInput';
import { Colors } from '../../../assets/colors';
import { checkIn, search } from '../../../assets/icons';
import ListHeading from '../../../Components/ListHeading';
import SearchedComp from '../../../Components/SearchedComp';
import TopSearchedCards from '../../../Components/TopSearchedCards';
import { Button } from '../../../Components/Button';
import { images } from '../../../assets/images';
import { BoldText, NormalText } from '../../../Components/Titles';
import SvgIcons from '../../../Components/SvgIcons';

const ZipCode = ({ navigation }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: responsiveHeight(2), paddingTop: responsiveHeight(4), backgroundColor: Colors.white, flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>

        <BackIcon  />
        <SearchInput flex={1} mrgnTop={responsiveHeight(0.1)} placeHolder={'Search Hotel'} placeHolderColor={'#9ba4bc'} borderWidth={2} height={responsiveHeight(5.7)} borderRadius={responsiveHeight(3)} borderColor={'#F3F6FB'} bgColor={'white'} xml={search} txtColor={'#9ba4bc'} />
      </View>
      <ListHeading title="Recent Search" title2="Clear All" title2Color="#969AA8" fntWeight2="400" mrgnTop={responsiveHeight(3)} />
      <View style={{ gap: responsiveHeight(2.5), marginTop: responsiveHeight(2.5) }}>
        <View style={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
          <SearchedComp />
          <SearchedComp />
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
          <SearchedComp />
          <SearchedComp />
          <SearchedComp />
        </ScrollView>
      </View>
      <View style={{ borderWidth: 0.8, borderColor: '#EFF3FA', marginTop: responsiveHeight(3) }} />
      <ListHeading title="Top Search" title2="Show More" title2Color="#848FAC" fntWeight1="600" fntWeight2="500" mrgnTop={responsiveHeight(2)} />
      <View style={{ marginTop: responsiveHeight(2), gap: responsiveHeight(1.5) }}>
        <TopSearchedCards handlePress={() => navigation.navigate('Reviews')} />
        <TopSearchedCards handlePress={() => navigation.navigate('Reviews')} />
        <TopSearchedCards handlePress={() => navigation.navigate('Reviews')} />
      </View>
      <ListHeading showSeeAll={false} fntWeight1="500" mrgnTop={responsiveHeight(2)} title="Last View" title2="" />
      <TouchableOpacity onPress={() => navigation.navigate('Hotel')} style={{ flexDirection: 'row', marginVertical: responsiveHeight(2.5), gap: responsiveHeight(2), elevation: 10, backgroundColor: Colors.white, borderRadius: responsiveHeight(2), padding: responsiveHeight(2) }}>
        <Image source={images.checkIn} height={responsiveHeight(15)} width={responsiveWidth(30)} />
        <View>
          <NormalText color="#969AA8" title="Hotel 1" />
          <BoldText fontSize={responsiveFontSize(2.3)} fontWeight="700" title="PavilJonki Convantion" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
            <SvgIcons xml={checkIn} height={15} width={15} />
            <NormalText width={responsiveWidth(47)} fontWeight="bold" fontSize={responsiveFontSize(1.8)} color="#848FAC" title="Jl Mangga Dua Bl G/1 RT 009" />

          </View>
        </View>
      </TouchableOpacity>

      <Button handlePress={() => navigation.navigate('Filter', { stack: 'user' })} xml="" title="Submit" bgColor={Colors.buttonBg} textColor={Colors.white} />
    </ScrollView>
  );
};

export default ZipCode;
