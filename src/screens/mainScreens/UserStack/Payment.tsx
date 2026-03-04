/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating-widget';

// Assets & Utils
import {images} from '../../../assets/images';
import {Colors} from '../../../assets/colors';
import {ImageBaseUrl} from '../../../BaseUrl';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {
  arrowForwardSmall,
  chevronDown,
  visaMastercard,
} from '../../../assets/icons';

// Components
import {Button} from '../../../Components/Button';
import TextHeader from '../../../Components/TextHeader';
import SvgIcons from '../../../Components/SvgIcons';
import Rating from '../../../Components/Rating';
import {BoldText, NormalText} from '../../../Components/Titles';
import {ShowToast} from '../../../GlobalFunctions/Auth';
import {addReview, bookService} from '../../../GlobalFunctions';

const Payment = ({navigation, route}: any) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackGiven, setFeedBackGiven] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewDetails, setReviewDetails] = useState({
    satisfaction: 'Good',
    responsiveness: 'Good',
    amenities: 'Good',
  });

  const bookServiceHandler = async () => {
    setIsLoading(true);
    try {
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
      if (response.success) {
        ShowToast('success', response.message);
        navigation.navigate('BottomStack');
        // setModalVisible(true);
      } else {
        ShowToast('error', response.message || 'Booking failed');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong with the booking');
    } finally {
      setIsLoading(false);
    }
  };

  const addReviewHandler = async () => {
    if (rating === 0) {
      return ShowToast('error', 'Please provide a star rating');
    }

    const {satisfaction, responsiveness, amenities} = reviewDetails;
    setReviewLoading(true);
    try {
      const response = await addReview(
        userId,
        managerId,
        rating,
        satisfaction,
        responsiveness,
        amenities,
        comment,
      );
      if (response.success) {
        setFeedBackGiven(true);
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      ShowToast('error', 'Could not submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TextHeader title="Payment" />

        <View style={styles.serviceContainer}>
          <FlatList
            horizontal
            data={allServices}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.contentView}>
                <Image
                  source={{uri: `${ImageBaseUrl}${item?.images?.[0]}`}}
                  style={styles.imageStyle}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.serviceTitle} numberOfLines={1}>
                    {item?.serviceName}
                  </Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {item?.description}
                  </Text>
                  <Text style={styles.price}>${item?.price}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.heading}>Subtotal</Text>
            <Text style={styles.priceText}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.heading, {color: Colors.buttonBg}]}>
              Total to pay
            </Text>
            <Text
              style={[styles.priceText, {fontSize: responsiveFontSize(2.2)}]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Method Selector */}
        <TouchableOpacity activeOpacity={0.7} style={styles.paymentSelector}>
          <NormalText
            title="Payment Method"
            color="#2A2A2A"
            fontWeight="800"
            alignSelf="center"
            fontSize={responsiveFontSize(2)}
          />
          <View style={styles.paymentIcons}>
            <SvgIcons xml={visaMastercard} height={60} width={60} />
            <View style={styles.arrowIcon}>
              <SvgIcons xml={arrowForwardSmall} height={15} width={15} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Action Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.termsText}>
          By Booking, you acknowledge and accept our{' '}
          <Text style={styles.linkText}>terms</Text> &{' '}
          <Text style={styles.linkText}>privacy policy</Text>
        </Text>
        <Button
          isLoading={isLoading}
          handlePress={bookServiceHandler}
          title="Pay Now"
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
        />
      </View>

      {/* Success & Review Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => !reviewLoading && setModalVisible(false)}
        style={styles.modalStyle}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {feedbackGiven ? (
              <View style={styles.successContainer}>
                <Image source={images.green} style={styles.successImage} />
                <BoldText title="Submitted!" fontSize={responsiveFontSize(3)} />
                <NormalText
                  mrgnTop={10}
                  txtAlign="center"
                  title="Thanks for sharing your feedback with us!"
                />
                <Button
                  mrgnTop={30}
                  handlePress={() => {
                    setModalVisible(false);
                    navigation.navigate('BottomStack');
                  }}
                  title="Go to Home"
                  bgColor={Colors.buttonBg}
                  textColor={Colors.white}
                />
              </View>
            ) : (
              <View style={{paddingBottom: 30}}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeModal}>
                  <SvgIcons xml={chevronDown} height={20} width={20} />
                </TouchableOpacity>

                <View style={styles.ratingSection}>
                  <NormalText fontWeight="700" title="Rate your experience" />
                  <StarRating
                    rating={rating}
                    onChange={setRating}
                    starSize={30}
                  />
                </View>

                <View style={styles.ratingsList}>
                  <Rating
                    activeCategory={reviewDetails.satisfaction}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, satisfaction: v}))
                    }
                    headerTitle="Overall Satisfaction"
                  />
                  <Rating
                    activeCategory={reviewDetails.responsiveness}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, responsiveness: v}))
                    }
                    headerTitle="Responsiveness"
                  />
                  <Rating
                    activeCategory={reviewDetails.amenities}
                    setCategory={v =>
                      setReviewDetails(p => ({...p, amenities: v}))
                    }
                    headerTitle="Amenities"
                  />
                </View>

                <TextInput
                  onChangeText={setComment}
                  placeholder="Tell us more about the service..."
                  placeholderTextColor={'#969AA8'}
                  multiline
                  style={styles.commentInput}
                />

                <Button
                  isLoading={reviewLoading}
                  handlePress={addReviewHandler}
                  title="Submit Review"
                  bgColor={Colors.buttonBg}
                  textColor={Colors.white}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  subContainer: {padding: responsiveHeight(2)},
  serviceContainer: {
    height: responsiveHeight(20),
    marginTop: responsiveHeight(2),
  },
  contentView: {
    height: responsiveHeight(15),
    width: responsiveWidth(90),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 15,
  },
  imageStyle: {
    height: responsiveHeight(12),
    width: responsiveHeight(12),
    borderRadius: 10,
  },
  serviceTitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  desc: {color: '#888', fontSize: responsiveFontSize(1.5), marginTop: 4},
  price: {
    marginTop: 5,
    color: Colors.buttonBg,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  summaryContainer: {marginTop: 20},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#EEE',
    marginTop: 10,
    paddingTop: 10,
  },
  heading: {
    color: '#333',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  priceText: {
    color: Colors.black,
    fontWeight: '800',
    fontSize: responsiveFontSize(1.8),
  },
  paymentSelector: {
    height: responsiveHeight(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EEE',
    paddingHorizontal: responsiveWidth(3),
    // backgroundColor: 'red',
    // padding: 15,
    // alignItems: 'center',
  },
  paymentIcons: {flexDirection: 'row', alignItems: 'center', gap: 10},
  arrowIcon: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    padding: 5,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
    gap: 20,
  },
  termsText: {
    color: '#666',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  linkText: {color: Colors.buttonBg, fontWeight: '700'},
  modalStyle: {margin: 0, justifyContent: 'flex-end'},
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    padding: 20,
  },
  successContainer: {alignItems: 'center', paddingVertical: 40},
  successImage: {height: 80, width: 80, marginBottom: 20},
  closeModal: {alignSelf: 'center', padding: 10},
  ratingSection: {alignItems: 'center', gap: 15, marginVertical: 20},
  ratingsList: {gap: 20},
  commentInput: {
    height: 120,
    color: '#000',
    padding: 15,
    backgroundColor: '#F5F5F5',
    marginVertical: 20,
    borderRadius: 12,
    textAlignVertical: 'top',
  },
});

export default Payment;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useState} from 'react';
// import {images} from '../../../assets/images';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../assets/responsive_dimensions';
// import {Colors} from '../../../assets/colors';
// import {Button} from '../../../Components/Button';
// import BackIcon from '../../../Components/BackIcon';
// import {BoldText, NormalText} from '../../../Components/Titles';
// import SvgIcons from '../../../Components/SvgIcons';
// import {
//   arrowForwardSmall,
//   chevronDown,
//   rating,
//   starUnFilled,
//   visaMastercard,
// } from '../../../assets/icons';
// import {ImageBaseUrl} from '../../../BaseUrl';
// import {addReview, bookService} from '../../../GlobalFunctions';
// import Modal from 'react-native-modal';
// import Rating from '../../../Components/Rating';
// import {ShowToast} from '../../../GlobalFunctions/Auth';
// import StarRating from 'react-native-star-rating-widget';
// import TextHeader from '../../../Components/TextHeader';

// interface servicesType {
//   id: number;
//   text: string;
//   price: number;
// }

// const Payment = ({navigation, route}) => {
//   const {
//     allServices,
//     total,
//     address,
//     managerId,
//     petId,
//     userId,
//     serviceId,
//     selectDate,
//     categoryId,
//   } = route?.params;
//   console.log('all data', categoryId);
//   const [isLoading, setIsLoading] = useState(false);
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [feedbackGiven, setFeedBackGiven] = useState(false);
//   const [comment, setComment] = useState();
//   const [reviewDetails, setReviewDetails] = useState({
//     satisfaction: 'Good',
//     responsiveness: 'Good',
//     amenities: 'Good',
//   });
//   const [rating, setRating] = useState(0);

//   const services: servicesType[] = [
//     // {
//     //   id: 1,
//     //   text: 'Service Name',
//     //   price: 88.00,
//     // },
//     {
//       id: 1,
//       text: 'Subtotal',
//       price: total,
//     },
//     {
//       id: 2,
//       text: 'Total to pay',
//       price: total,
//     },
//   ];

//   const bookServiceHandler = async () => {
//     setIsLoading(true);
//     const response = await bookService(
//       userId,
//       petId,
//       managerId,
//       serviceId,
//       categoryId,
//       total,
//       address,
//       selectDate,
//     );
//     setIsLoading(false);
//     if (response.success) {
//       ShowToast('success', response.message);
//       setModalVisible(true);
//     } else {
//       ShowToast('error', response.message);
//     }
//     console.log('repsonse:-', response);
//   };

//   const addReviewHandler = async () => {
//     const {satisfaction, responsiveness, amenities} = reviewDetails;
//     setReviewLoading(true);
//     const response = await addReview(
//       userId,
//       managerId,
//       rating,
//       satisfaction,
//       responsiveness,
//       amenities,
//       comment,
//     );
//     setReviewLoading(false);
//     console.log('response in add review:-', response);
//     if (response.success) {
//       ShowToast('success', response.message);
//       setFeedBackGiven(true);
//     } else {
//       ShowToast('error', response.message);
//       setModalVisible(false);
//     }
//   };

//   // console.log('feedbackGiven:-', feedbackGiven);
//   // console.log('comment:-', comment);

//   return (
//     <View style={styles.container}>
//       <View style={styles.subContainer}>
//         <TextHeader title="Payment" />
//         <FlatList
//           horizontal
//           data={allServices}
//           contentContainerStyle={{gap: responsiveHeight(1)}}
//           showsHorizontalScrollIndicator={false}
//           renderItem={({item}) => {
//             return (
//               <View style={styles.contentView}>
//                 <Image
//                   source={{uri: `${ImageBaseUrl}${item?.images[0]}`}}
//                   style={styles.imageStyle}
//                 />
//                 <View>
//                   <Text
//                     style={[
//                       styles.heading,
//                       {
//                         fontSize: responsiveFontSize(2),
//                         width: responsiveWidth(60),
//                       },
//                     ]}>
//                     {item?.serviceName}
//                   </Text>
//                   <Text style={styles.desc}>{item?.description}</Text>
//                   <Text style={styles.price}>${item?.price}</Text>
//                 </View>
//               </View>
//             );
//           }}
//         />

//         <View style={{paddingTop: responsiveHeight(2)}}>
//           {services.map(item => {
//             return (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   paddingTop: responsiveHeight(2.5),
//                 }}>
//                 <Text style={styles.heading}>{item.text}</Text>
//                 <Text style={styles.priceText}>$ {item.price.toFixed(2)}</Text>
//               </View>
//             );
//           })}
//         </View>
//         <TouchableOpacity
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             marginTop: responsiveHeight(4),
//             height: responsiveHeight(8),
//             borderRadius: responsiveHeight(1.5),
//             paddingHorizontal: responsiveHeight(1),
//             borderWidth: 1.5,
//             borderColor: '#BFBFBF',
//             alignItems: 'center',
//             width: '100%',
//           }}>
//           <NormalText
//             fontSize={responsiveFontSize(2.5)}
//             alignSelf="center"
//             fontWeight="800"
//             color="#2A2A2A"
//             title="Payment Method"
//           />
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: responsiveHeight(1),
//             }}>
//             <SvgIcons xml={visaMastercard} height={90} width={90} />
//             <TouchableOpacity
//               style={{
//                 borderWidth: 2,
//                 borderColor: '#CBCBCB',
//                 padding: 4,
//                 borderRadius: responsiveHeight(2.5),
//               }}>
//               <SvgIcons xml={arrowForwardSmall} height={20} width={20} />
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </View>
//       <View
//         style={{
//           position: 'absolute',
//           bottom: responsiveHeight(2),
//           width: responsiveWidth(90),
//           alignSelf: 'center',
//           gap: responsiveHeight(3.5),
//         }}>
//         <Text
//           style={{
//             color: '#2A2A2A',
//             fontWeight: '600',
//             fontSize: responsiveFontSize(2),
//             width: responsiveWidth(75),
//             alignSelf: 'center',
//             textAlign: 'center',
//           }}>
//           By Booking, you acknowledge and accept{' '}
//           <Text style={styles.uniqueText}>our terms</Text> &{' '}
//           <Text style={styles.uniqueText}>privacy policy</Text>
//         </Text>
//         <Button
//           textColor={Colors.white}
//           bgColor={Colors.buttonBg}
//           title={
//             isLoading ? (
//               <ActivityIndicator size={'large'} color={Colors.white} />
//             ) : (
//               'Pay Now'
//             )
//           }
//           borderColor={''}
//           borderRadius={0}
//           xml={''}
//           width={0}
//           height={0}
//           textFont={0}
//           handlePress={bookServiceHandler}
//         />
//       </View>
//       <Modal
//         animationInTiming={600}
//         animationOutTiming={600}
//         style={{
//           margin: 0,
//           marginTop: responsiveHeight(7),
//           overflow: 'hidden',
//           borderTopLeftRadius: responsiveHeight(2),
//           borderTopRightRadius: responsiveHeight(2),
//         }}
//         onBackdropPress={() => setModalVisible(!modalVisible)}
//         isVisible={modalVisible}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{
//             backgroundColor: Colors.white,
//             flexGrow: 1,
//             bottom: 0,
//             width: responsiveWidth(100),
//           }}>
//           {feedbackGiven ? (
//             <View
//               style={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: responsiveHeight(2),
//                 flex: 1,
//               }}>
//               <Image
//                 source={images.green}
//                 style={{
//                   height: responsiveHeight(13),
//                   width: responsiveWidth(23),
//                 }}
//               />
//               <NormalText
//                 mrgnTop={responsiveFontSize(1.5)}
//                 alignSelf="center"
//                 fontSize={responsiveFontSize(3)}
//                 fontWeight="900"
//                 title="Submitted!"
//               />
//               <NormalText
//                 lineHeight={23}
//                 mrgnTop={responsiveHeight(1.5)}
//                 alignSelf="center"
//                 width={responsiveWidth(40)}
//                 txtAlign="center"
//                 fontWeight="600"
//                 title="Thanks for sharing your feedback with us!"
//               />
//               <Button
//                 mrgnTop={responsiveHeight(4)}
//                 handlePress={() => {
//                   setModalVisible(!modalVisible);
//                   navigation.navigate('BottomStack');
//                 }}
//                 title="Continue"
//                 bgColor={Colors.buttonBg}
//                 textColor={Colors.white}
//                 xml={''}
//               />
//             </View>
//           ) : (
//             <View>
//               <View style={{padding: responsiveHeight(2)}}>
//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={{alignItems: 'center'}}>
//                   <SvgIcons xml={chevronDown} height={18} width={18} />
//                 </TouchableOpacity>
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     gap: responsiveHeight(2.5),
//                     marginTop: responsiveHeight(4),
//                   }}>
//                   <NormalText
//                     alignSelf="center"
//                     fontWeight="700"
//                     fontSize={responsiveFontSize(2.3)}
//                     title="Give a star"
//                   />
//                   {/* <FlatList contentContainerStyle={{ gap: responsiveHeight(1.3) }} horizontal data={['filled', 'unfilled', 'unfilled', 'unfilled', 'unfilled']} renderItem={({ item }) => (
//                     <SvgIcons xml={item === 'filled' ? rating : starUnFilled} height={25} width={25} />
//                   )} /> */}
//                   <StarRating rating={rating} onChange={setRating} />
//                 </View>
//               </View>
//               <View
//                 style={{
//                   gap: responsiveHeight(3),
//                   marginTop: responsiveHeight(4),
//                 }}>
//                 <Rating
//                   activeCategory={reviewDetails.satisfaction}
//                   setCategory={value =>
//                     setReviewDetails(prevData => ({
//                       ...prevData,
//                       satisfaction: value,
//                     }))
//                   }
//                   headerTitle="Overall Satisfaction"
//                 />
//                 <Rating
//                   activeCategory={reviewDetails.responsiveness}
//                   setCategory={value =>
//                     setReviewDetails(prevData => ({
//                       ...prevData,
//                       responsiveness: value,
//                     }))
//                   }
//                   headerTitle="Responsiveness"
//                 />
//                 <Rating
//                   activeCategory={reviewDetails.amenities}
//                   setCategory={value =>
//                     setReviewDetails(prevData => ({
//                       ...prevData,
//                       amenities: value,
//                     }))
//                   }
//                   headerTitle="Amenities"
//                 />{' '}
//               </View>

//               <TextInput
//                 onChangeText={(e: any) => setComment(e)}
//                 placeholder="Note"
//                 placeholderTextColor={'#969AA8'}
//                 multiline
//                 textAlignVertical="top"
//                 style={{
//                   height: responsiveHeight(20),
//                   color: '#000',
//                   padding: responsiveHeight(2),
//                   borderWidth: 2,
//                   borderColor: '#EFEFEF',
//                   margin: responsiveHeight(2),
//                   borderRadius: responsiveHeight(1),
//                 }}
//               />
//               <View style={{padding: responsiveHeight(2)}}>
//                 <Button
//                   handlePress={addReviewHandler}
//                   title="Submit"
//                   isLoading={reviewLoading} // Pass the boolean state directly
//                   textColor={Colors.white}
//                   bgColor={Colors.buttonBg}
//                   xml={''}
//                 />
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </Modal>
//     </View>
//   );
// };

// export default Payment;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   subContainer: {
//     padding: responsiveHeight(2),
//   },
//   backView: {
//     borderRadius: 10,
//     backgroundColor: Colors.buttonBg,
//     height: responsiveHeight(5),
//     width: responsiveHeight(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uniqueText: {
//     color: Colors.buttonBg,
//   },
//   heading: {
//     color: Colors.black,
//     fontSize: responsiveFontSize(2.4),
//     fontWeight: 'bold',
//   },
//   contentView: {
//     paddingTop: responsiveHeight(7),
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 20,
//   },
//   imageStyle: {
//     height: responsiveHeight(18),
//     width: responsiveHeight(18),
//     borderRadius: responsiveHeight(1),
//   },
//   desc: {
//     color: '#A1A1A1',
//     fontSize: responsiveFontSize(1.7),
//     marginTop: responsiveHeight(0.5),
//     width: responsiveWidth(50),
//   },
//   price: {
//     marginTop: responsiveHeight(1),
//     color: Colors.black,
//     fontWeight: 'bold',
//     fontSize: responsiveFontSize(1.8),
//   },
//   priceText: {
//     marginTop: responsiveHeight(1),
//     color: Colors.black,
//     fontWeight: 'bold',
//     fontSize: responsiveFontSize(1.8),
//   },
// });
