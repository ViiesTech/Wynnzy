/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight } from '../assets/responsive_dimensions';
import { BoldText, NormalText } from './Titles';
import { Button } from './Button';
import { Colors } from '../assets/colors';
import SvgIcons from './SvgIcons';
import { rating } from '../assets/icons';
import { useNavigation } from '@react-navigation/native';

interface ListHeadingProps {
  btnContainer?: boolean;
  title: string;
  title2?: string;
  title2Color?: string;
  fntWeight1?: string;
  fntWeight2?: string;
  mrgnTop: number;
  showSeeAll?: boolean;
  icon?: boolean;
  isRating?: boolean;
  rightIcon?: string;
  avgRating?: number;
  totalReviews?: number;
  onEditIconPress?: () => void;
  onSeeAllPress?: () => void;
}

export const ListHeading: FC<ListHeadingProps> = ({
  btnContainer = false, // You can set default value for btnContainer
  title,
  title2,
  title2Color,
  fntWeight1,
  fntWeight2,
  mrgnTop,
  isRating = false,
  icon,
  avgRating,
  totalReviews,
  rightIcon,
  showSeeAll = true,
  onSeeAllPress,
  onEditIconPress,
}) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: mrgnTop }}>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1.8), alignItems: 'center' }}>
        <BoldText color={Colors.labelText} alignSelf="center" fontWeight={fntWeight1} fontSize={responsiveFontSize(2.5)} title={title} />
        {isRating && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <SvgIcons xml={rating} height={15} width={15} />
            <NormalText fontSize={responsiveFontSize(2.2)} fontWeight="700" title={`${avgRating} (${totalReviews})`} />
          </View>
        )}

        {btnContainer && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
            <NormalText alignSelf="center" color={Colors.black} title="Ends in" />
            <Button
              borderRadius={responsiveHeight(0.9)}
              alignSelf="center"
              height={responsiveHeight(4)}
              width={responsiveHeight(10.7)}
              textFont={responsiveFontSize(2.1)}
              textColor={Colors.white}
              bgColor="#52B4E9"
              title="03:04:18" borderColor={''} xml={''} handlePress={function (): void {
                console.log('abc');
              }} />
          </View>
        )}
      </View>
      {showSeeAll ? (
        <TouchableOpacity onPress={() => {
          if (onSeeAllPress) {
            onSeeAllPress();
          } else if (!title2) {
            navigation.navigate('Reviews', { totalReviews, ratings: avgRating });
          }
        }} style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
          {icon ? (<SvgIcons xml={rating} height={15} width={15} />) : null}
          <NormalText
            txtDecoration={title2 ? '' : 'underline'}
            fontWeight={fntWeight2 ? fntWeight2 : '700'}
            fontSize={responsiveFontSize(2.1)}
            color={title2Color ? title2Color : Colors.labelText}
            alignSelf="center"
            title={title2 ? title2 : 'See All'}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity onPress={onEditIconPress}>
          <SvgIcons xml={rightIcon} height={20} width={20} />
        </TouchableOpacity>) : null}
    </View>
  );
};

export default ListHeading;
