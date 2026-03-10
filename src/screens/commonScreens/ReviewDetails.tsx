import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import {deleteReview, getReviewById} from '../../GlobalFunctions';
import {images} from '../../assets/images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../assets/responsive_dimensions';
import {NormalText, BoldText} from '../../Components/Titles';
import SvgIcons from '../../Components/SvgIcons';
import {rating} from '../../assets/icons';
import {Colors} from '../../assets/colors';
import BackIcon from '../../Components/BackIcon';
import {Button} from '../../Components/Button';
import {ImageBaseUrl} from '../../BaseUrl';
import UserHeader from '../../Components/UserHeader';

const ReviewDetails = ({navigation, route}: any) => {
  const {reviewId} = route?.params;
  const [data, setData] = useState<any>(null); // Changed to null for easier loading checks
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [reviewId]);

  const fetchDetails = async () => {
    setLoading(true);
    const response = await getReviewById(reviewId);
    setData(response?.data || null);
    setLoading(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review permanently?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: deleteReviewHandler},
      ],
    );
  };

  const deleteReviewHandler = async () => {
    setActionLoading(true);
    try {
      await deleteReview(reviewId, navigation);
    } catch (error) {
      console.log('Delete error', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  const userImage = data?.userId?.profileImage
    ? {uri: `${ImageBaseUrl}${data.userId.profileImage}`}
    : images.pfp2;

  return (
    <View style={styles.container}>
      {/* Header */}
      <UserHeader
        backIcon={true}
        title={'Reviews Details'}
        navigation={navigation}
        centerText={true}
        mT={10}
      />

      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        {/* User Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={userImage}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileInfo}>
            <View>
              <NormalText
                title={data?.userId?.fullName || 'User'}
                fontWeight="800"
                fontSize={responsiveFontSize(2.2)}
              />
              <NormalText
                title={moment(data?.createdAt).format('MMMM Do YYYY')}
                fontWeight="400"
                color="#6A7683"
              />
            </View>
            <View style={styles.ratingBadge}>
              <SvgIcons xml={rating} height={16} width={16} />
              <NormalText fontWeight="700" title={data?.stars || '0'} />
            </View>
          </View>
        </View>

        <View style={styles.detailsBox}>
          <DetailRow label="Email" value={data?.userId?.email} />
          <DetailRow label="Amenities" value={data?.amenities} />
          <DetailRow label="Responsiveness" value={data?.responsiveness} />
          <DetailRow label="Satisfaction" value={data?.satisfaction} />

          <View style={{marginTop: responsiveHeight(2)}}>
            <NormalText
              fontWeight="700"
              color="#202D43"
              title="Review Comment:"
            />
            <View style={styles.commentBox}>
              <NormalText
                lineHeight={22}
                color="#4A5468"
                title={data?.comment || 'No comment provided.'}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Action */}
      {/* <View style={styles.footer}>
        <Button
          isLoading={actionLoading}
          title={'Delete This Review'}
          handlePress={confirmDelete}
          bgColor="#FF4D4D" // Red for destructive actions
          textColor={Colors.white}
        />
      </View> */}
    </View>
  );
};

// Reusable Sub-component for clean JSX
const DetailRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.rowContainer}>
    <NormalText
      width={responsiveWidth(35)}
      fontWeight="600"
      color="#6A7683"
      title={label}
    />
    <NormalText fontWeight="500" color="#202D43" title={value || 'N/A'} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(3),
  },
  profileSection: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },
  profileImage: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
    borderRadius: responsiveHeight(4.5),
    backgroundColor: '#F5F5F5',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  detailsBox: {
    backgroundColor: '#FBFBFC',
    padding: responsiveHeight(2),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F2F4',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F4',
  },
  commentBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footer: {
    paddingVertical: responsiveHeight(3),
  },
});

export default ReviewDetails;
