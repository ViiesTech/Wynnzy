import React, {FC} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../assets/responsive_dimensions';
import {BoldText, NormalText} from './Titles';
import {Button} from './Button';
import {Colors} from '../assets/colors';
import SvgIcons from './SvgIcons';
import {rating as RatingIcon} from '../assets/icons';
import {useNavigation} from '@react-navigation/native';

interface ListHeadingProps {
  btnContainer?: boolean;
  title: string;
  title2?: string;
  title2Color?: string;
  fntWeight1?: string;
  fntWeight2?: string;
  mrgnTop?: number; // Made optional with default
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
  btnContainer = false,
  title,
  title2,
  title2Color,
  fntWeight1 = '800',
  fntWeight2 = '700',
  mrgnTop = 0,
  isRating = false,
  icon,
  avgRating = 0,
  totalReviews = 0,
  rightIcon,
  showSeeAll = true,
  onSeeAllPress,
  onEditIconPress,
}) => {
  const navigation = useNavigation<any>();

  const handleRightPress = () => {
    if (onSeeAllPress) {
      onSeeAllPress();
    } else if (!title2) {
      // Default behavior for "See All"
      navigation.navigate('Reviews', {
        totalReviews,
        ratings: avgRating,
      });
    }
  };

  return (
    <View style={[styles.container, {marginTop: mrgnTop}]}>
      {/* Left Section: Title & Stats/Timers */}
      <View style={styles.leftSection}>
        <BoldText
          color={Colors.labelText}
          fontWeight={fntWeight1}
          fontSize={responsiveFontSize(2.4)}
          title={title}
        />

        {isRating && (
          <View style={styles.ratingRow}>
            <SvgIcons xml={RatingIcon} height={15} width={15} />
            <NormalText
              fontSize={responsiveFontSize(2)}
              fontWeight="700"
              title={`${avgRating} (${totalReviews})`}
            />
          </View>
        )}

        {btnContainer && (
          <View style={styles.timerRow}>
            <NormalText color={Colors.black} title="Ends in" />
            <Button
              borderRadius={responsiveHeight(0.8)}
              height={responsiveHeight(3.5)}
              width={responsiveHeight(10)}
              textFont={responsiveFontSize(1.8)}
              textColor={Colors.white}
              bgColor="#52B4E9"
              title="03:04:18"
              handlePress={() => {}}
            />
          </View>
        )}
      </View>

      {/* Right Section: Action Link or Icon */}
      {showSeeAll ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleRightPress}
          style={styles.rightAction}>
          {icon && <SvgIcons xml={RatingIcon} height={14} width={14} />}
          <NormalText
            txtDecoration={title2 ? 'none' : 'underline'}
            fontWeight={fntWeight2}
            fontSize={responsiveFontSize(1.9)}
            color={title2Color || Colors.labelText}
            title={title2 || 'See All'}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity onPress={onEditIconPress} style={styles.iconButton}>
          <SvgIcons xml={rightIcon} height={20} width={20} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    gap: responsiveHeight(1.5),
    alignItems: 'center',
    flexShrink: 1, // Prevents text from pushing right content off screen
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  iconButton: {
    padding: 5,
  },
});

export default ListHeading;
