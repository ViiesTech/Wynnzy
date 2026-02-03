/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, FlatList, Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackIcon from '../../Components/BackIcon';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../assets/responsive_dimensions';
import ListHeading from '../../Components/ListHeading';
import ReviewsCard from '../../Components/ReviewsCard';
import { Colors } from '../../assets/colors';
import Modal from 'react-native-modal';
import SvgIcons from '../../Components/SvgIcons';
import { chevronDown, rating, starUnFilled } from '../../assets/icons';
import { NormalText } from '../../Components/Titles';
import Rating from '../../Components/Rating';
import { Button } from '../../Components/Button';
import { images } from '../../assets/images';
import { getAllReviews } from '../../GlobalFunctions';
import { useSelector } from 'react-redux';

const Reviews = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Poor');
  const [activeCategory2, setActiveCategory2] = useState<string>('Poor');
  const [activeCategory3, setActiveCategory3] = useState<string>('Poor');
  const [FeedBackGiven, setFeedBackGiven] = useState<boolean>(true);
  const [allReviews, setAllReviews] = useState([]);
  const { _id } = useSelector(state => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const { businessProfileData } = useSelector(state => state.user);
  const { type, managerId } = route?.params;
  console.log('rpute.paras', route?.params);

  // console.log('totalReviews,ratings', totalReviews,ratings);
  const getAllReviewsHandler = async () => {
    setIsLoading(true);
    const response = await getAllReviews(type === 'user' ? managerId : businessProfileData.managerId);
    console.log("Reessponseeee", response);
    setIsLoading(false);
    setAllReviews(response.data.review);
  };
  useEffect(() => {
    getAllReviewsHandler();
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: responsiveHeight(2), paddingTop: responsiveHeight(4), flexGrow: 1, backgroundColor: Colors.white }}>
      <BackIcon />
      <ListHeading icon title="Reviews" title2={`${route?.params?.ratings} (${route?.params?.totalReviews})`} fntWeight2="500" mrgnTop={responsiveHeight(2)} />
      {isLoading ? (
        <View style={{ flex: 0.8, justifyContent: 'center' }}>
          <ActivityIndicator size={50} color={Colors.buttonBg} />
        </View>
      ) : (
        <View style={{ marginTop: responsiveHeight(2), gap: responsiveHeight(2) }}>
          {/* <ReviewsCard  handlePress={() => setModalVisible(!modalVisible)} />
        <ReviewsCard handlePress={() => setModalVisible(!modalVisible)} />
        <ReviewsCard handlePress={() => setModalVisible(!modalVisible)} />
        <ReviewsCard handlePress={() => setModalVisible(!modalVisible)} />
        <ReviewsCard handlePress={() => setModalVisible(!modalVisible)} /> */}
          {allReviews.length > 0 ? (
            <FlatList contentContainerStyle={{ marginTop: responsiveHeight(2), gap: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} data={allReviews} renderItem={(item) => <ReviewsCard handlePress={() => navigation.navigate('ReviewDetails', { reviewId: item?.item?._id })} reviewData={item?.item} />} />

          ) : (
            <NormalText fontSize={responsiveFontSize(2.5)} mrgnTop={responsiveHeight(10)} alignSelf="center" txtAlign="center" title="No Reviews Yet For This Business Profile" />
          )}
        </View>
      )}

      <Modal animationInTiming={600} animationOutTiming={600} style={{ margin: 0, marginTop: responsiveHeight(7), overflow: 'hidden', borderTopLeftRadius: responsiveHeight(2), borderTopRightRadius: responsiveHeight(2) }} onBackdropPress={() => setModalVisible(!modalVisible)} isVisible={modalVisible}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: Colors.white, flexGrow: 1, bottom: 0, width: responsiveWidth(100) }}>
          {FeedBackGiven ? (
            <View>
              <View style={{ padding: responsiveHeight(2) }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignItems: 'center' }}>

                  <SvgIcons xml={chevronDown} height={18} width={18} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', gap: responsiveHeight(2.5), marginTop: responsiveHeight(4) }}>
                  <NormalText alignSelf="center" fontWeight="700" fontSize={responsiveFontSize(2.3)} title="Give a star" />
                  <FlatList contentContainerStyle={{ gap: responsiveHeight(1.3) }} horizontal data={['filled', 'unfilled', 'unfilled', 'unfilled', 'unfilled']} renderItem={({ item }) => (
                    <SvgIcons xml={item === 'filled' ? rating : starUnFilled} height={25} width={25} />
                  )} />
                </View>
              </View>
              <View style={{ gap: responsiveHeight(3), marginTop: responsiveHeight(4) }}>
                <Rating activeCategory={activeCategory} setCategory={(value) => setActiveCategory(value)} headerTitle="Overall Satisfaction" />
                <Rating activeCategory={activeCategory2} setCategory={(value) => setActiveCategory2(value)} headerTitle="Landlord Responsiveness" />
                <Rating activeCategory={activeCategory3} setCategory={(value) => setActiveCategory3(value)} headerTitle="Amenities" />
              </View>

              <TextInput placeholder="Note" placeholderTextColor={'#969AA8'} multiline textAlignVertical="top" style={{ height: responsiveHeight(20), color: '#000', padding: responsiveHeight(2), borderWidth: 2, borderColor: '#EFEFEF', margin: responsiveHeight(2), borderRadius: responsiveHeight(1) }} />
              <View style={{ padding: responsiveHeight(2) }}>

                <Button handlePress={() => setFeedBackGiven(!FeedBackGiven)} title="Submit" textColor={Colors.white} bgColor={Colors.buttonBg} xml={''} />
              </View>
            </View>
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: responsiveHeight(2), flex: 1 }}>
              <Image source={images.green} style={{ height: responsiveHeight(13), width: responsiveWidth(23) }} />
              <NormalText mrgnTop={responsiveFontSize(1.5)} alignSelf="center" fontSize={responsiveFontSize(3)} fontWeight="900" title="Submitted!" />
              <NormalText lineHeight={23} mrgnTop={responsiveHeight(1.5)} alignSelf="center" width={responsiveWidth(40)} txtAlign="center" fontWeight="600" title="Thanks for sharing your feedback with us!" />
              <Button mrgnTop={responsiveHeight(4)} handlePress={() => setModalVisible(!modalVisible)} title="Continue" bgColor={Colors.buttonBg} textColor={Colors.white} xml={''} />
            </View>
          )}
        </ScrollView>

      </Modal>
    </ScrollView>
  );
};

export default Reviews;
