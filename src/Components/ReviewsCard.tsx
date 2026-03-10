import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';

import {NormalText} from './Titles';
import {rating as RatingIcon} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {images} from '../assets/images';
import {ImageBaseUrl} from '../BaseUrl'; // Assuming you have this constant

interface ReviewCardProps {
  handlePress?: () => void;
  reviewData?: any; // Changed from object to any for easier property access
  cardWidth?: number;
  numberOfLines?: any;
}

const ReviewsCard: React.FC<ReviewCardProps> = ({
  handlePress,
  reviewData,
  cardWidth = 70,
  numberOfLines = 1,
}) => {
  // Extracting data for cleaner JSX
  const userName = reviewData?.userId?.fullName || 'Anonymous User';
  const userImage = reviewData?.userId?.profileImage
    ? {uri: `${ImageBaseUrl}${reviewData.userId.profileImage}`}
    : images.pfp2; // Fallback to local asset

  const timeAgo = reviewData?.createdAt
    ? moment(reviewData.createdAt).fromNow()
    : 'Recently';

  const starCount = reviewData?.stars || '0.0';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={!handlePress}
      style={[styles.cardContainer, {width: responsiveWidth(cardWidth)}]}>
      <View style={styles.headerRow}>
        {/* Profile Picture */}
        <Image
          source={userImage}
          style={styles.profileImage}
          resizeMode="cover"
        />

        {/* Name and Rating Row */}
        <View style={styles.infoContent}>
          <View style={styles.nameContainer}>
            <NormalText
              title={userName}
              fontWeight="800"
              fontSize={responsiveFontSize(2)}
              numberOfLines={1}
            />
            <NormalText
              title={timeAgo}
              fontWeight="400"
              color="#6A7683"
              fontSize={responsiveFontSize(1.6)}
            />
          </View>

          {/* Star Rating */}
          <View style={styles.ratingBadge}>
            <SvgIcons xml={RatingIcon} height={14} width={14} />
            <NormalText
              title={starCount}
              fontWeight="700"
              fontSize={responsiveFontSize(1.8)}
            />
          </View>
        </View>
      </View>

      {/* Review Comment */}
      <NormalText
        fontWeight="400"
        mrgnTop={responsiveHeight(1.5)}
        color="#5A6371"
        numberOfLines={numberOfLines}
        title={reviewData?.comment || 'No comment provided.'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: '#FFF',
    marginBottom: responsiveHeight(1.5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  profileImage: {
    height: responsiveHeight(7),
    width: responsiveHeight(7), // Keep it square for consistent circles
    borderRadius: responsiveHeight(3.5),
    backgroundColor: '#F5F5F5',
  },
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default ReviewsCard;
