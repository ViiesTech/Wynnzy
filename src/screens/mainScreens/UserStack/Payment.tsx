/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {images} from '../../../assets/images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {Colors} from '../../../assets/colors';
import {Button} from '../../../Components/Button';
import BackIcon from '../../../Components/BackIcon';
import {BoldText, NormalText} from '../../../Components/Titles';
import SvgIcons from '../../../Components/SvgIcons';
import {
  arrowForwardSmall,
  chevronDown,
  rating,
  starUnFilled,
  visaMastercard,
} from '../../../assets/icons';
import {ImageBaseUrl} from '../../../BaseUrl';
import {addReview, bookService} from '../../../GlobalFunctions';
import Modal from 'react-native-modal';
import Rating from '../../../Components/Rating';
import {ShowToast} from '../../../GlobalFunctions/Auth';
import StarRating from 'react-native-star-rating-widget';

interface servicesType {
  id: number;
  text: string;
  price: number;
}

const Payment = ({navigation, route}) => {
  const {
    allServices,
    total,
    address,
    managerId,
    petId,
    userId,
    serviceId,
    selectDate,
    categoryId,
  } = route?.params;
  console.log('all data', categoryId);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackGiven, setFeedBackGiven] = useState(false);
  const [comment, setComment] = useState();
  const [reviewDetails, setReviewDetails] = useState({
    satisfaction: 'Good',
    responsiveness: 'Good',
    amenities: 'Good',
  });
  console.log('feedbackGiven', feedbackGiven);
  const [rating, setRating] = useState(0);
  console.log('comment', comment);
  const services: servicesType[] = [
    // {
    //   id: 1,
    //   text: 'Service Name',
    //   price: 88.00,
    // },
    {
      id: 1,
      text: 'Subtotal',
      price: total,
    },
    {
      id: 2,
      text: 'Total to pay',
      price: total,
    },
  ];

  const bookServiceHandler = async () => {
    setIsLoading(true);
    const response = await bookService(
      userId,
      petId,
      managerId,
      serviceId,
      categoryId,
      total,
      address,
      selectDate,
    );
    setIsLoading(false);
    if (response.success) {
      ShowToast('success', response.message);
      setModalVisible(true);
    } else {
      ShowToast('error', response.message);
    }
    console.log('repsonse', response);
  };
  const addReviewHandler = async () => {
    const {satisfaction, responsiveness, amenities} = reviewDetails;
    setReviewLoading(true);
    const response = await addReview(
      userId,
      managerId,
      rating,
      satisfaction,
      responsiveness,
      amenities,
      comment,
    );
    setReviewLoading(false);
    console.log('response in add review:-', response);
    if (response.success) {
      ShowToast('success', response.message);
      setFeedBackGiven(true);
    } else {
      ShowToast('error', response.message);
      setModalVisible(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <BackIcon />
        <FlatList
          horizontal
          data={allServices}
          contentContainerStyle={{gap: responsiveHeight(1)}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View style={styles.contentView}>
                <Image
                  source={{uri: `${ImageBaseUrl}${item?.images[0]}`}}
                  style={styles.imageStyle}
                />
                <View>
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontSize: responsiveFontSize(2),
                        width: responsiveWidth(60),
                      },
                    ]}>
                    {item?.serviceName}
                  </Text>
                  <Text style={styles.desc}>{item?.description}</Text>
                  <Text style={styles.price}>${item?.price}</Text>
                </View>
              </View>
            );
          }}
        />

        <View style={{paddingTop: responsiveHeight(2)}}>
          {services.map(item => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: responsiveHeight(2.5),
                }}>
                <Text style={styles.heading}>{item.text}</Text>
                <Text style={styles.priceText}>$ {item.price.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: responsiveHeight(4),
            height: responsiveHeight(8),
            borderRadius: responsiveHeight(1.5),
            paddingHorizontal: responsiveHeight(1),
            borderWidth: 1.5,
            borderColor: '#BFBFBF',
            alignItems: 'center',
            width: '100%',
          }}>
          <NormalText
            fontSize={responsiveFontSize(2.5)}
            alignSelf="center"
            fontWeight="800"
            color="#2A2A2A"
            title="Payment Method"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveHeight(1),
            }}>
            <SvgIcons xml={visaMastercard} height={90} width={90} />
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: '#CBCBCB',
                padding: 4,
                borderRadius: responsiveHeight(2.5),
              }}>
              <SvgIcons xml={arrowForwardSmall} height={20} width={20} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: responsiveHeight(2),
          width: responsiveWidth(90),
          alignSelf: 'center',
          gap: responsiveHeight(3.5),
        }}>
        <Text
          style={{
            color: '#2A2A2A',
            fontWeight: '600',
            fontSize: responsiveFontSize(2),
            width: responsiveWidth(75),
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          By Booking, you acknowledge and accept{' '}
          <Text style={styles.uniqueText}>our terms</Text> &{' '}
          <Text style={styles.uniqueText}>privacy policy</Text>
        </Text>
        <Button
          textColor={Colors.white}
          bgColor={Colors.buttonBg}
          title={
            isLoading ? (
              <ActivityIndicator size={'large'} color={Colors.white} />
            ) : (
              'Pay Now'
            )
          }
          borderColor={''}
          borderRadius={0}
          xml={''}
          width={0}
          height={0}
          textFont={0}
          handlePress={bookServiceHandler}
        />
      </View>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        style={{
          margin: 0,
          marginTop: responsiveHeight(7),
          overflow: 'hidden',
          borderTopLeftRadius: responsiveHeight(2),
          borderTopRightRadius: responsiveHeight(2),
        }}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        isVisible={modalVisible}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: Colors.white,
            flexGrow: 1,
            bottom: 0,
            width: responsiveWidth(100),
          }}>
          {feedbackGiven ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: responsiveHeight(2),
                flex: 1,
              }}>
              <Image
                source={images.green}
                style={{
                  height: responsiveHeight(13),
                  width: responsiveWidth(23),
                }}
              />
              <NormalText
                mrgnTop={responsiveFontSize(1.5)}
                alignSelf="center"
                fontSize={responsiveFontSize(3)}
                fontWeight="900"
                title="Submitted!"
              />
              <NormalText
                lineHeight={23}
                mrgnTop={responsiveHeight(1.5)}
                alignSelf="center"
                width={responsiveWidth(40)}
                txtAlign="center"
                fontWeight="600"
                title="Thanks for sharing your feedback with us!"
              />
              <Button
                mrgnTop={responsiveHeight(4)}
                handlePress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate('BottomStack');
                }}
                title="Continue"
                bgColor={Colors.buttonBg}
                textColor={Colors.white}
                xml={''}
              />
            </View>
          ) : (
            <View>
              <View style={{padding: responsiveHeight(2)}}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{alignItems: 'center'}}>
                  <SvgIcons xml={chevronDown} height={18} width={18} />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    gap: responsiveHeight(2.5),
                    marginTop: responsiveHeight(4),
                  }}>
                  <NormalText
                    alignSelf="center"
                    fontWeight="700"
                    fontSize={responsiveFontSize(2.3)}
                    title="Give a star"
                  />
                  {/* <FlatList contentContainerStyle={{ gap: responsiveHeight(1.3) }} horizontal data={['filled', 'unfilled', 'unfilled', 'unfilled', 'unfilled']} renderItem={({ item }) => (
                    <SvgIcons xml={item === 'filled' ? rating : starUnFilled} height={25} width={25} />
                  )} /> */}
                  <StarRating rating={rating} onChange={setRating} />
                </View>
              </View>
              <View
                style={{
                  gap: responsiveHeight(3),
                  marginTop: responsiveHeight(4),
                }}>
                <Rating
                  activeCategory={reviewDetails.satisfaction}
                  setCategory={value =>
                    setReviewDetails(prevData => ({
                      ...prevData,
                      satisfaction: value,
                    }))
                  }
                  headerTitle="Overall Satisfaction"
                />
                <Rating
                  activeCategory={reviewDetails.responsiveness}
                  setCategory={value =>
                    setReviewDetails(prevData => ({
                      ...prevData,
                      responsiveness: value,
                    }))
                  }
                  headerTitle="Responsiveness"
                />
                <Rating
                  activeCategory={reviewDetails.amenities}
                  setCategory={value =>
                    setReviewDetails(prevData => ({
                      ...prevData,
                      amenities: value,
                    }))
                  }
                  headerTitle="Amenities"
                />{' '}
              </View>

              <TextInput
                onChangeText={e => setComment(e)}
                placeholder="Note"
                placeholderTextColor={'#969AA8'}
                multiline
                textAlignVertical="top"
                style={{
                  height: responsiveHeight(20),
                  color: '#000',
                  padding: responsiveHeight(2),
                  borderWidth: 2,
                  borderColor: '#EFEFEF',
                  margin: responsiveHeight(2),
                  borderRadius: responsiveHeight(1),
                }}
              />
              <View style={{padding: responsiveHeight(2)}}>
                <Button
                  handlePress={addReviewHandler}
                  title={
                    reviewLoading ? (
                      <ActivityIndicator size={'large'} color={Colors.white} />
                    ) : (
                      'Submit'
                    )
                  }
                  textColor={Colors.white}
                  bgColor={Colors.buttonBg}
                  xml={''}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  subContainer: {
    padding: responsiveHeight(2),
  },
  backView: {
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uniqueText: {
    color: Colors.buttonBg,
  },
  heading: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },
  contentView: {
    paddingTop: responsiveHeight(7),
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  imageStyle: {
    height: responsiveHeight(18),
    width: responsiveHeight(18),
    borderRadius: responsiveHeight(1),
  },
  desc: {
    color: '#A1A1A1',
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(0.5),
    width: responsiveWidth(50),
  },
  price: {
    marginTop: responsiveHeight(1),
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  priceText: {
    marginTop: responsiveHeight(1),
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
});
