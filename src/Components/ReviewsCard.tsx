/* eslint-disable react-native/no-inline-styles */
import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { NormalText } from './Titles';
import { rating } from '../assets/icons';
import SvgIcons from './SvgIcons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../assets/responsive_dimensions';
import { images } from '../assets/images';
import moment from 'moment';
interface ReviewCardProps {
  handlePress?: () => void;
  text?: string;
  reviewData?: object;
}
const ReviewsCard: React.FC<ReviewCardProps> = ({ handlePress, text, reviewData }) => {
  console.log('reviewdata', reviewData)
  return (
    <TouchableOpacity onPress={handlePress} style={{ borderWidth: 2, borderColor: '#E9E9E9', padding: responsiveHeight(2), borderRadius: responsiveHeight(1.5) }}>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
        <Image source={images.pfp2} style={{ height: responsiveHeight(9), width: responsiveWidth(20) }} resizeMode="contain" />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
          <View>
            <NormalText title={reviewData?.userId?.fullName} fontWeight="800" fontSize={responsiveFontSize(2)} />
            <NormalText title={moment(reviewData?.createdAt).fromNow()} fontWeight="400" color="#202D43" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <SvgIcons xml={rating} height={15} width={15} />
            <NormalText title={reviewData?.stars} />
          </View>
        </View>
      </View>
      <NormalText fontWeight="400" mrgnTop={responsiveHeight(2)} color="#ABB0B9" title={reviewData?.comment} />
    </TouchableOpacity>
  );
};

export default ReviewsCard;
