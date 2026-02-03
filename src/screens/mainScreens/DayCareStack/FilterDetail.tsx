/* eslint-disable react-native/no-inline-styles */
import { Text, ScrollView, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../assets/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../assets/responsive_dimensions';
import BackIcon from '../../../Components/BackIcon';
import { images } from '../../../assets/images';
import SvgIcons from '../../../Components/SvgIcons';
import { NormalText } from '../../../Components/Titles';
import { calendar, pin, time } from '../../../assets/icons';
import { Button } from '../../../Components/Button';
import { getServiceById } from '../../../GlobalFunctions';
import { ImageBaseUrl } from '../../../BaseUrl';

const FilterDetail = ({ navigation, route }) => {
  console.log('route', route.params);
  const { id } = route?.params;
  const [data, setData] = useState([]);
  console.log('data  images', data?.images);
  const getServiceByIdHandler = async () => {
    const response = await getServiceById(id);
    console.log('res', response);
    setData(response.data);
  };
  useEffect(() => {
    getServiceByIdHandler();
  }, [])
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.white, padding: responsiveHeight(2) }}>
      <BackIcon  />
      {data?.images ? (
        <Image source={{ uri: `${ImageBaseUrl}${data?.images[0]}` }} style={{ marginTop: responsiveHeight(4), height: responsiveHeight(30), width: '100%', borderRadius: responsiveHeight(1) }} />
      ) : null}

      <View style={{ gap: 10, marginTop: 5 }}>
        <NormalText mrgnTop={responsiveHeight(2)} fontSize={responsiveFontSize(2.5)} fontWeight="700" title={data.selectService} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1), marginTop: responsiveHeight(1) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <SvgIcons xml={calendar} height={20} width={20} />
            <NormalText fontSize={responsiveFontSize(1.7)} color="#9DA5B3" alignSelf="none" title={data?.date} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <SvgIcons xml={time} height={20} width={20} />
            <NormalText fontSize={responsiveFontSize(1.7)} color="#9DA5B3" alignSelf="none" title={data?.time} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
          <SvgIcons xml={pin} height={20} width={20} />
          <NormalText fontSize={responsiveFontSize(1.7)} color="#9DA5B3" alignSelf="none" title={data?.address} />
        </View>

        <NormalText fontWeight="400" mrgnTop={responsiveHeight(1)} color="#9DA5B3" title={data?.description} />
      </View>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(2), marginTop: responsiveHeight(2), alignItems: 'center', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>
        <Button handlePress={() => navigation.navigate('BottomStack')} bgColor={Colors.buttonBg} textColor={Colors.white} title="Reject" width={responsiveWidth(45)} />
        <Button handlePress={() => navigation.navigate('BottomStack')} bgColor={Colors.buttonBg} textColor={Colors.white} title="Accept" width={responsiveWidth(45)} />

      </View>
    </ScrollView>
  );
};

export default FilterDetail;
