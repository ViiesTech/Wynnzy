/* eslint-disable react-native/no-inline-styles */
import { View, Image, ScrollView } from 'react-native';
import React from 'react';
import { search } from '../../../assets/icons';
import { responsiveHeight } from '../../../assets/responsive_dimensions';
import BackIcon from '../../../Components/BackIcon';
import { Colors } from '../../../assets/colors';
import { images } from '../../../assets/images';
import SearchInput from '../../../Components/SearchInput';
import LocationCard, { CurrentLocation } from '../../../Components/LocationCard';
import { NormalText } from '../../../Components/Titles';
import { Button } from '../../../Components/Button';

const Location = ({ navigation }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, backgroundColor: Colors.white, flexGrow: 1 }}>
      <BackIcon  />
      <SearchInput txtColor={Colors.black} xml={search} placeHolder="Find best Hotels and Pet Care" placeHolderColor="#CACACA" bgColor="#F6F6F6" />
      <View style={{ marginBottom: responsiveHeight(2.5) }}>
        <Image source={images.map} style={{ height: responsiveHeight(50), width: '100%', marginTop: responsiveHeight(2) }} />
        <CurrentLocation />
      </View>
      <LocationCard />
      <View style={{ gap: responsiveHeight(2.2), marginTop: responsiveHeight(2) }}>
        <NormalText txtDecoration="underline" fontWeight="600" title="Add New Location" />
        <Button handlePress={() => navigation.navigate('Filter2')} textColor="white" title="Submit" bgColor={Colors.buttonBg} borderColor={''} borderRadius={0} xml={''} width={0} height={0} textFont={0} />
      </View>
    </ScrollView>
  );
};

export default Location;
