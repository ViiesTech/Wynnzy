/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { BoldText, NormalText } from './Titles';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { calendar, pin, time } from '../assets/icons';
import SvgIcons from './SvgIcons';
import { Colors } from '../assets/colors';
import { Button } from './Button';
import { images } from '../assets/images';
import { ImageBaseUrl } from '../BaseUrl';
interface FilterCardProps {
  handlePress: () => void;
  data: object;
  status?: string;
  serviceName?: string;
  description?: string;
  date?: string;
  time?: string;
  address?: string;
  price?: string;
  imageUrl: any;
}
const FilterCard: React.FC<FilterCardProps> = ({ handlePress, price, imageUrl, data, status, serviceName, description, date, time, address }) => {
  console.log('data', data);
  return (
    <TouchableOpacity onPress={handlePress} style={{ borderRadius: responsiveHeight(1), borderColor: '#EFEFEF', borderWidth: 2, paddingVertical: responsiveHeight(2), paddingHorizontal: responsiveHeight(1) }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
          <Image style={{ height: responsiveHeight(9.5), width: responsiveWidth(19), borderRadius: responsiveHeight(1) }} source={{ uri: `${ImageBaseUrl}${data ? data?.images[0] : imageUrl}` }} />
          <View style={{ maxWidth: responsiveWidth(55), gap: responsiveHeight(1) }}>
            <Button textColor="#2A1D51" alignSelf="auto" textFont={responsiveFontSize(1.8)} title={data ? data?.status : status} bgColor="#E8EAFE" height={responsiveHeight(5)} width={responsiveWidth(30)} borderColor={''} borderRadius={0} xml={''} handlePress={function (): void {
              console.log('abc');
            }} />
            <BoldText color={Colors.themeText} fontSize={responsiveFontSize(2.2)} fontWeight="600" title={data ? data?.serviceName : serviceName} />
            <NormalText fontSize={responsiveFontSize(1.5)} color="#9DA5B3" title={data ? data?.description : description} />
            <View style={{ gap: 10, marginTop: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                  <SvgIcons xml={calendar} height={20} width={20} />
                  <NormalText fontSize={responsiveFontSize(1.5)} color="#9DA5B3" alignSelf="none" title={data ? data?.date : date} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                  <SvgIcons xml={time} height={20} width={20} />
                  <NormalText fontSize={responsiveFontSize(1.5)} color="#9DA5B3" alignSelf="none" title={data ? data?.time : time} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                <SvgIcons xml={pin} height={20} width={20} />
                <NormalText fontSize={responsiveFontSize(1.5)} color="#9DA5B3" alignSelf="none" title={data ? data?.address : address} />
              </View>
            </View>
          </View>
        </View>
        <View>
          <NormalText fontWeight="800" fontSize={responsiveFontSize(2.2)} color={Colors.themeText} title={`$${data ? data?.price : price}`} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FilterCard;
