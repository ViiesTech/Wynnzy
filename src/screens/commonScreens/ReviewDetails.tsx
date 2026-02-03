/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { deleteReview, getReviewById } from '../../GlobalFunctions';
import { images } from '../../assets/images';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../assets/responsive_dimensions';
import moment from 'moment';
import { NormalText } from '../../Components/Titles';
import SvgIcons from '../../Components/SvgIcons';
import { rating } from '../../assets/icons';
import { Colors } from '../../assets/colors';
import BackIcon from '../../Components/BackIcon';
import { Button } from '../../Components/Button';

const ReviewDetails = ({ navigation, route }) => {
  const { reviewId } = route?.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log('reviewId', reviewId);
  console.log('data', data);
  const getReviewDetails = async () => {
    setLoading(true);
    const response = await getReviewById(reviewId);
    setLoading(false);
    setData(response.data);
  };
  
  const deleteReviewHandler = async () => {
    setLoading(true);
    await deleteReview(reviewId, navigation);
    setLoading(false);
  };
  useEffect(() => {
    getReviewDetails();
  }, []);

  return (
    loading ? (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.white }}>
        <ActivityIndicator size={50} color={Colors.buttonBg} />
      </View>
    ) : (
      <View style={{ padding: responsiveHeight(2), flex: 1, backgroundColor: Colors.white }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackIcon />
          <NormalText alignSelf="center" fontWeight="900" fontSize={responsiveFontSize(2.7)} title="Review Details" />
          <Text style={{ color: Colors.white }}>a</Text>
        </View>
        <View style={{ padding: responsiveHeight(1), marginTop: responsiveHeight(4), borderRadius: responsiveHeight(1.5) }}>
          <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
            <Image source={images.pfp2} style={{ height: responsiveHeight(9), width: responsiveWidth(20) }} resizeMode="contain" />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
              <View>
                <NormalText title={data?.userId?.fullName} fontWeight="800" fontSize={responsiveFontSize(2)} />
                <NormalText title={moment(data?.createdAt).fromNow()} fontWeight="400" color="#202D43" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                <SvgIcons xml={rating} height={15} width={15} />
                <NormalText title={data?.stars} />
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <NormalText width={responsiveWidth(30)} fontWeight="400" color="#000" title="Email:   " />
            <NormalText fontWeight="400" color="#000" title={data?.userId?.email} />
          </View>
          <View style={styles.rowContainer}>
            <NormalText width={responsiveWidth(30)} fontWeight="400" color="#000" title="Comment:   " />
            <NormalText fontWeight="400" color="#000" title={data?.comment} />
          </View>
          <View style={styles.rowContainer}>
            <NormalText width={responsiveWidth(30)} fontWeight="400" color="#000" title="Amenities:   " />
            <NormalText fontWeight="400" color="#000" title={data?.amenities} />
          </View>
          <View style={styles.rowContainer}>
            <NormalText width={responsiveWidth(30)} fontWeight="400" color="#000" title="Responsiveness:   " />
            <NormalText fontWeight="400" color="#000" title={data?.responsiveness} />
          </View>
          <View style={styles.rowContainer}>
            <NormalText width={responsiveWidth(30)} fontWeight="400" color="#000" title="Satisfaction:   " />
            <NormalText fontWeight="400" color="#000" title={data?.satisfaction} />
          </View>
        </View>
        <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
          <Button title={'Delete This Review'} handlePress={deleteReviewHandler} bgColor={Colors.buttonBg} textColor={Colors.white} />
        </View>
      </View>
    )

  );
};

export default ReviewDetails;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    gap: responsiveHeight(2),
    marginTop: responsiveHeight(2),
  },
});

