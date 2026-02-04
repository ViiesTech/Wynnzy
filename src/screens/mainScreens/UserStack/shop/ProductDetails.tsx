/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Header from '../../../../Components/Header';
import SearchInput from '../../../../Components/SearchInput';
import TitleContainer from '../../../../Components/TitleContainer';
import {BoldText, NormalText} from '../../../../Components/Titles';
import {Colors} from '../../../../assets/colors';
import {images} from '../../../../assets/images';
import {notification, search} from '../../../../assets/icons';
import {ImageBaseUrl} from '../../../../BaseUrl';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../assets/responsive_dimensions';

const ProductDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const item = route.params || {};
  const refRBSheet = useRef(null);

  const [activeVariation, setActiveVariation] = useState(
    item?.variations?.[0]?._id || 1,
  );
  const [currentValue, setCurrentValue] = useState(1);

  const productDetailsData = [
    {id: 1, title: 'Category', value: item?.category || 'N/A'},
    {id: 2, title: 'Brand', value: item?.brand || 'N/A'},
    {id: 3, title: 'Pet Type', value: item?.petType || 'N/A'},
    {id: 4, title: 'Age Group', value: item?.ageGroup || 'N/A'},
    {id: 5, title: 'Ingredients', value: item?.ingredients || 'N/A'},
  ];

  const slides =
    item?.images?.length > 0
      ? item.images.map((img: string, index: number) => ({
          id: index + 1,
          image: {uri: `${ImageBaseUrl}${img}`},
        }))
      : [{id: 1, image: images.product2}];

  const selectedVariation =
    item?.variations?.find((v: any) => v._id === activeVariation) ||
    item?.variations?.[0];

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScroll}>
        <View style={{paddingHorizontal: responsiveHeight(2)}}>
          <Header
            handleFilterPress={() => navigation.navigate('Filter2')}
            iconName={notification}
            handleNotificationPress={() => navigation.navigate('Notification')}
            handlePress={() => navigation.navigate('Location')}
            bgColor={''}
            whiteNotification={false}
          />

          <SearchInput
            txtColor={Colors.black}
            xml={search}
            placeHolder="Find best Hotels and Pet Care"
            placeHolderColor="#CACACA"
            bgColor="#F6F6F6"
          />

          <BoldText
            color={Colors.labelText}
            title="Products"
            mrgnTop={responsiveHeight(3)}
            fontSize={responsiveFontSize(2.3)}
            alignSelf="left"
          />

          {/* Swiper Section - Added key to force re-render on item change */}
          <View style={styles.swiperContainer}>
            <Swiper
              key={item?._id}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={{bottom: responsiveHeight(-0.1)}}>
              {slides.map((slideItem: any) => (
                <View key={slideItem.id} style={styles.slide}>
                  <Image
                    source={slideItem.image}
                    style={{width: '90%', height: '90%'}}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={{marginTop: responsiveHeight(2)}}>
            <View style={styles.headerRow}>
              <View style={{flex: 1}}>
                <BoldText
                  fontSize={responsiveFontSize(2.3)}
                  color={Colors.labelText}
                  title={item?.productName || 'Product Name'}
                />
                <BoldText
                  fontSize={responsiveFontSize(2.3)}
                  color={Colors.buttonBg}
                  title={`USD ${item?.variations?.[0]?.price || '0.00'}`}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Ionicons size={25} name="heart" color="#F04D96" />
                <NormalText fontWeight="700" title="308" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <TitleContainer
                title={`${item?.averageRating || 0} ⭑`}
                subTitle={`${item?.reviewCount || 0} Ratings`}
              />
              <TitleContainer title={item?.sold || '0'} subTitle="Sold" />
              <TitleContainer
                title="Free Shipping"
                subTitle="Orders above USD 99"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={{marginTop: responsiveHeight(2)}}>
            <NormalText
              fontSize={responsiveFontSize(2.1)}
              fontWeight="600"
              color={Colors.black}
              title="Product Details"
            />
            <NormalText
              fontSize={responsiveFontSize(1.8)}
              color={Colors.themeText}
              mrgnTop={responsiveHeight(1)}
              title={item?.description || 'No description available'}
            />

            {/* Conversion: FlatList -> .map() */}
            <View
              style={{
                marginTop: responsiveHeight(2),
                gap: responsiveHeight(2),
              }}>
              {productDetailsData.map(detail => (
                <View key={detail.id} style={styles.specRow}>
                  <NormalText
                    color="#40434D"
                    title={detail.title}
                    fontSize={responsiveFontSize(2.2)}
                  />
                  <NormalText
                    color={Colors.labelText}
                    title={detail.value}
                    fontSize={responsiveFontSize(2.2)}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#3A8DFF', '#00E0C6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.button}>
                <Text style={styles.btnText}>Add To Cart</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* RBSheet Section */}
      <RBSheet
        ref={refRBSheet}
        height={responsiveHeight(60)}
        draggable
        customStyles={{
          container: {borderTopLeftRadius: 20, borderTopRightRadius: 20},
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: responsiveHeight(2)}}>
          <TouchableOpacity
            onPress={() => refRBSheet.current.close()}
            style={{alignSelf: 'flex-end'}}>
            <Ionicons name="close" color={Colors.black} size={30} />
          </TouchableOpacity>

          <View style={styles.sheetHeader}>
            <Image
              style={styles.sheetProductImage}
              source={
                item?.images?.length > 0
                  ? {uri: `${ImageBaseUrl}${item.images[0]}`}
                  : images.product
              }
              resizeMode="contain"
            />
            <View style={{flex: 1, justifyContent: 'space-around'}}>
              <View>
                <NormalText
                  fontWeight="800"
                  fontSize={responsiveFontSize(2.1)}
                  title={item?.productName}
                />
                <BoldText
                  color="#4C69FF"
                  fontSize={responsiveFontSize(2.1)}
                  title={`USD ${selectedVariation?.price || '0.00'}`}
                />
              </View>
              <View>
                <NormalText
                  fontSize={responsiveFontSize(1.8)}
                  title={`Variation: ${selectedVariation?.value}`}
                />
                <NormalText
                  fontSize={responsiveFontSize(1.8)}
                  title={`Weight: ${selectedVariation?.weight}`}
                />
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Conversion: Variation FlatList -> .map() in a Horizontal ScrollView */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <NormalText title="Variation" fontWeight="700" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 20, gap: 15}}>
              {item?.variations?.map((varItem: any) => (
                <TouchableOpacity
                  key={varItem._id}
                  onPress={() => setActiveVariation(varItem._id)}
                  style={[
                    styles.variationBtn,
                    {
                      borderColor:
                        varItem._id === activeVariation
                          ? '#4C69FF'
                          : 'transparent',
                      borderWidth: 1.5,
                    },
                  ]}>
                  <NormalText
                    title={varItem.value}
                    fontSize={responsiveFontSize(1.5)}
                    txtAlign="center"
                  />
                  {varItem._id === activeVariation && (
                    <View style={styles.checkBadge}>
                      <Ionicons
                        name="checkmark-sharp"
                        color={Colors.white}
                        size={12}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quantity and CTA */}
          <View style={styles.quantityContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <NormalText fontWeight="700" title="Quantity" />
              <NormalText
                color={selectedVariation?.stock < 10 ? '#F04D96' : '#9B9EA9'}
                title={
                  selectedVariation?.stock > 0
                    ? `Only ${selectedVariation?.stock} left`
                    : 'Out of Stock'
                }
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
              <TouchableOpacity
                onPress={() =>
                  currentValue > 1 && setCurrentValue(currentValue - 1)
                }
                style={[
                  styles.counterBtn,
                  {borderColor: currentValue > 1 ? '#4C69FF' : '#DBE1FF'},
                ]}>
                <AntDesign
                  name="minus"
                  color={currentValue > 1 ? '#4C69FF' : '#DBE1FF'}
                  size={20}
                />
              </TouchableOpacity>
              <NormalText title={currentValue} mrgnTop={10} />
              <TouchableOpacity
                onPress={() => setCurrentValue(currentValue + 1)}
                style={[styles.counterBtn, {borderColor: '#4C69FF'}]}>
                <AntDesign name="plus" color="#4C69FF" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              navigation.navigate('MyCart');
            }}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#3A8DFF', '#00E0C6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.button}>
              <Text style={styles.btnText}>Add To Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  mainScroll: {paddingVertical: responsiveHeight(2), flexGrow: 1},
  swiperContainer: {
    height: responsiveHeight(40),
    marginTop: responsiveHeight(2),
  },
  slide: {
    width: responsiveWidth(85),
    height: responsiveHeight(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dot: {backgroundColor: '#D9D9D9', width: 8, height: 8, borderRadius: 4},
  activeDot: {
    backgroundColor: '#557DFB',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {flexDirection: 'row', gap: 20, marginTop: 15},
  divider: {borderWidth: 0.5, borderColor: '#E5E5E5', marginVertical: 20},
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: responsiveHeight(7.5),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
  },
  btnText: {color: '#fff', fontSize: 18, fontWeight: '700'},
  sheetHeader: {flexDirection: 'row', gap: 15},
  sheetProductImage: {height: responsiveHeight(18), width: responsiveWidth(35)},
  variationBtn: {
    padding: 10,
    borderRadius: 10,
    width: responsiveWidth(22),
    height: responsiveHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  checkBadge: {
    height: 20,
    width: 20,
    backgroundColor: '#4C69FF',
    position: 'absolute',
    right: -5,
    top: -5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  counterBtn: {borderWidth: 1.5, padding: 8, borderRadius: 10},
});

export default ProductDetails;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useRef, useState} from 'react';
// import Header from '../../../../Components/Header';
// import {Colors} from '../../../../assets/colors';
// import {notification, search} from '../../../../assets/icons';
// import SearchInput from '../../../../Components/SearchInput';
// import {BoldText, NormalText} from '../../../../Components/Titles';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../../assets/responsive_dimensions';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import TitleContainer from '../../../../Components/TitleContainer';
// import Swiper from 'react-native-swiper';
// import {images} from '../../../../assets/images';
// import LinearGradient from 'react-native-linear-gradient';
// import RBSheet from 'react-native-raw-bottom-sheet';
// import {ImageBaseUrl} from '../../../../BaseUrl';

// const ProductDetails = ({navigation, route}: {navigation: any; route: any}) => {
//   const item = route.params || {};
//   const refRBSheet = useRef(null);

//   const [activeVariation, setActiveVariation] = useState(
//     item?.variations?.[0]?._id || 1,
//   );
//   const [currentValue, setCurrentValue] = useState(1);

//   const productDetailsData = [
//     {id: 1, title: 'Category', value: item?.category || 'N/A'},
//     {id: 2, title: 'Brand', value: item?.brand || 'N/A'},
//     {id: 3, title: 'Pet Type', value: item?.petType || 'N/A'},
//     {id: 4, title: 'Age Group', value: item?.ageGroup || 'N/A'},
//     {id: 5, title: 'Ingredients', value: item?.ingredients || 'N/A'},
//   ];

//   const slides =
//     item?.images?.length > 0
//       ? item.images.map((img: string, index: number) => ({
//           id: index + 1,
//           image: {uri: `${ImageBaseUrl}${img}`},
//         }))
//       : [
//           {
//             id: 1,
//             image: images.product2,
//           },
//         ];

//   const selectedVariation =
//     item?.variations?.find((v: any) => v._id === activeVariation) ||
//     item?.variations?.[0];

//   console.log('Params in ProductDetails:-', route.params);

//   return (
//     <>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           flexGrow: 1,
//           paddingVertical: responsiveHeight(4),
//           backgroundColor: Colors.white,
//         }}>
//         <View style={{paddingHorizontal: responsiveHeight(2)}}>
//           <Header
//             handleFilterPress={() => navigation.navigate('Filter2')}
//             iconName={notification}
//             handleNotificationPress={() => navigation.navigate('Notification')}
//             handlePress={() => navigation.navigate('Location')}
//             bgColor={''}
//             whiteNotification={false}
//           />
//           <SearchInput
//             txtColor={Colors.black}
//             xml={search}
//             placeHolder="Find best Hotels and Pet Care"
//             placeHolderColor="#CACACA"
//             bgColor="#F6F6F6"
//           />
//           <BoldText
//             color={Colors.labelText}
//             title="Products"
//             mrgnTop={responsiveHeight(3)}
//             fontSize={responsiveFontSize(2.3)}
//             alignSelf="left"
//           />
//           <View
//             style={{
//               height: responsiveHeight(40),
//               marginTop: responsiveHeight(4),
//               paddingHorizontal: responsiveWidth(5),
//             }}>
//             <Swiper
//               dotStyle={{
//                 backgroundColor: '#D9D9D9',
//                 width: 8,
//                 height: 8,
//                 borderRadius: 4,
//               }}
//               activeDotStyle={{
//                 backgroundColor: '#557DFB',
//                 width: 8,
//                 height: 8,
//                 borderRadius: 4,
//               }}
//               paginationStyle={{bottom: responsiveHeight(-0.1)}} // move dots below the image cards
//             >
//               {slides.map((slideItem: any) => (
//                 <View key={slideItem.id} style={styles.slide}>
//                   <Image
//                     source={slideItem.image}
//                     style={styles.image}
//                     resizeMode="contain"
//                   />
//                 </View>
//               ))}
//             </Swiper>
//           </View>
//           <View style={{marginTop: responsiveHeight(2)}}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <View style={{}}>
//                 <BoldText
//                   fontSize={responsiveFontSize(2.3)}
//                   color={Colors.labelText}
//                   title={item?.productName || 'Product Name'}
//                 />
//                 <BoldText
//                   fontSize={responsiveFontSize(2.3)}
//                   color={Colors.buttonBg}
//                   title={`USD ${item?.variations?.[0]?.price || '0.00'}`}
//                 />
//               </View>
//               <View style={{}}>
//                 <Ionicons size={25} name="heart" color="#F04D96" />
//                 <NormalText fontWeight="700" title="308" />
//               </View>
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 gap: responsiveHeight(4),
//                 marginTop: responsiveHeight(2),
//               }}>
//               <TitleContainer
//                 title={`${item?.averageRating || 0} ⭑`}
//                 subTitle={`${item?.reviewCount || 0} Ratings`}
//               />
//               <TitleContainer title={item?.sold || '0'} subTitle="Sold" />
//               <TitleContainer
//                 title="Free Shipping"
//                 subTitle="Orders above USD 99"
//               />
//             </View>
//           </View>
//           <View
//             style={{
//               borderWidth: 1.2,
//               borderColor: '#E5E5E5',
//               marginTop: responsiveHeight(3),
//             }}
//           />
//           <View style={{marginTop: responsiveHeight(2)}}>
//             <NormalText
//               fontSize={responsiveFontSize(2.1)}
//               fontWeight="600"
//               color={Colors.black}
//               title="Product Details"
//             />
//             <NormalText
//               fontSize={responsiveFontSize(1.8)}
//               color={Colors.themeText}
//               mrgnTop={responsiveHeight(1)}
//               title={item?.description || 'No description available'}
//             />
//             <View>
//               <FlatList
//                 scrollEnabled={false}
//                 contentContainerStyle={{
//                   gap: responsiveHeight(2),
//                   marginTop: responsiveHeight(2),
//                 }}
//                 data={productDetailsData}
//                 renderItem={({item: detailItem}) => {
//                   return (
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                       }}>
//                       <NormalText
//                         color="#40434D"
//                         title={detailItem?.title}
//                         fontSize={responsiveFontSize(2.2)}
//                       />
//                       <NormalText
//                         color={Colors.labelText}
//                         title={detailItem?.value}
//                         fontSize={responsiveFontSize(2.2)}
//                       />
//                     </View>
//                   );
//                 }}
//               />
//             </View>
//             <TouchableOpacity
//               onPress={() => refRBSheet.current.open()}
//               activeOpacity={0.8}>
//               <LinearGradient
//                 colors={['#3A8DFF', '#00E0C6']} // Blue → Teal gradient
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.button}>
//                 <Text style={styles.btnText}>Add To Cart</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       <RBSheet
//         ref={refRBSheet}
//         height={responsiveHeight(70)}
//         draggable={true}
//         openDuration={500}
//         closeDuration={500}
//         customStyles={{
//           container: {
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//           },
//         }}
//         enablePanDownToClose={true}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{padding: responsiveHeight(2), flexGrow: 1}}>
//           <TouchableOpacity
//             onPress={() => refRBSheet.current.close()}
//             style={{alignSelf: 'flex-end'}}>
//             <Ionicons name="close" color={Colors.black} size={30} />
//           </TouchableOpacity>

//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: responsiveHeight(2),
//             }}>
//             <Image
//               style={{height: responsiveHeight(19), width: responsiveWidth(35)}}
//               source={
//                 item?.images?.length > 0
//                   ? {uri: `${ImageBaseUrl}${item.images[0]}`}
//                   : images.product
//               }
//               resizeMode="contain"
//             />
//             <View
//               style={{
//                 height: responsiveHeight(16),
//                 justifyContent: 'space-around',
//               }}>
//               <View>
//                 <NormalText
//                   fontWeight="800"
//                   fontSize={responsiveFontSize(2.1)}
//                   title={item?.productName || 'Product Name'}
//                 />
//                 <BoldText
//                   mrgnTop={responsiveHeight(0.5)}
//                   color="#4C69FF"
//                   fontSize={responsiveFontSize(2.1)}
//                   title={`USD ${selectedVariation?.price || '0.00'}`}
//                 />
//               </View>
//               <View>
//                 <NormalText
//                   fontSize={responsiveFontSize(2.1)}
//                   title={`Variation: ${selectedVariation?.value || 'N/A'}`}
//                 />
//                 <NormalText
//                   mrgnTop={responsiveHeight(0.5)}
//                   fontSize={responsiveFontSize(2.1)}
//                   title={`Weight: ${selectedVariation?.weight || 'N/A'}`}
//                 />
//               </View>
//             </View>
//           </View>
//           <View
//             style={{
//               borderWidth: 1.2,
//               borderColor: '#E5E5E5',
//               marginTop: responsiveHeight(3),
//             }}
//           />
//           <View style={{}}>
//             <View style={{flexDirection: 'row', gap: responsiveHeight(2)}}>
//               <NormalText
//                 title="Variation"
//                 mrgnTop={responsiveHeight(3)}
//                 fontSize={responsiveFontSize(2)}
//                 fontWeight="700"
//                 alignSelf="center"
//               />
//               <FlatList
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{
//                   gap: responsiveHeight(2),
//                   marginTop: responsiveHeight(3),
//                   paddingHorizontal: responsiveHeight(3),
//                 }}
//                 horizontal
//                 data={item?.variations || []}
//                 renderItem={({item: varItem, index}) => {
//                   return (
//                     <TouchableOpacity
//                       onPress={() => setActiveVariation(varItem._id)}
//                       style={{
//                         padding: responsiveHeight(1),
//                         borderWidth: varItem._id === activeVariation ? 1.5 : 0,
//                         borderColor:
//                           varItem._id === activeVariation
//                             ? '#4C69FF'
//                             : 'transparent',
//                         borderRadius: responsiveHeight(1),
//                         width: responsiveWidth(20),
//                         height: responsiveHeight(12),
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         backgroundColor: '#F9F9F9',
//                       }}>
//                       <NormalText
//                         title={varItem.value}
//                         fontSize={responsiveFontSize(1.5)}
//                         txtAlign="center"
//                       />
//                       {varItem._id === activeVariation && (
//                         <View
//                           style={{
//                             backgroundColor: '#4C69FF',
//                             position: 'absolute',
//                             right: -5,
//                             top: -5,
//                             zIndex: 10,
//                             height: 20,
//                             width: 20,
//                             borderRadius: 10,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}>
//                           <Ionicons
//                             name="checkmark-sharp"
//                             color={Colors.white}
//                             size={12}
//                           />
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 }}
//               />
//             </View>
//           </View>
//           {/* <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginTop: responsiveHeight(4),
//             }}>
//             <NormalText
//               title="Size"
//               fontWeight="700"
//               fontSize={responsiveFontSize(2)}
//             />
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: responsiveHeight(2),
//               }}>
//               <NormalText
//                 title="UK 10"
//                 fontWeight="700"
//                 fontSize={responsiveFontSize(2)}
//               />
//               <TouchableOpacity>
//                 <Ionicons name="chevron-forward" color="#C9CFE5" size={25} />
//               </TouchableOpacity>
//             </View>
//           </View> */}
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginTop: responsiveHeight(4),
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: responsiveHeight(2),
//               }}>
//               <NormalText
//                 alignSelf="center"
//                 fontWeight="700"
//                 fontSize={responsiveFontSize(2)}
//                 title="Quantity"
//               />
//               <NormalText
//                 alignSelf="center"
//                 color={selectedVariation?.stock < 10 ? '#F04D96' : '#9B9EA9'}
//                 fontSize={responsiveFontSize(1.9)}
//                 title={
//                   selectedVariation?.stock > 0
//                     ? `Only ${selectedVariation?.stock} left`
//                     : 'Out of Stock'
//                 }
//               />
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: responsiveHeight(2),
//               }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   if (currentValue > 1) {
//                     setCurrentValue(currentValue - 1);
//                   }
//                 }}
//                 style={{
//                   borderWidth: 1.5,
//                   borderColor: currentValue > 1 ? '#4C69FF' : '#DBE1FF',
//                   padding: responsiveHeight(1),
//                   borderRadius: responsiveHeight(1),
//                 }}>
//                 <AntDesign
//                   name="minus"
//                   color={currentValue > 1 ? '#4C69FF' : '#DBE1FF'}
//                   size={20}
//                 />
//               </TouchableOpacity>
//               <NormalText
//                 fontSize={responsiveFontSize(2)}
//                 title={currentValue}
//                 alignSelf="center"
//               />
//               <TouchableOpacity
//                 onPress={() => setCurrentValue(currentValue + 1)}
//                 style={{
//                   borderWidth: 1.5,
//                   borderColor: '#4C69FF',
//                   padding: responsiveHeight(1),
//                   borderRadius: responsiveHeight(1),
//                 }}>
//                 <AntDesign name="plus" color="#4C69FF" size={20} />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <TouchableOpacity
//             onPress={() => {
//               refRBSheet.current.close();
//               navigation.navigate('MyCart');
//             }}
//             activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#3A8DFF', '#00E0C6']} // Blue → Teal gradient
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.button}>
//               <Text style={styles.btnText}>Add To Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </ScrollView>
//       </RBSheet>
//     </>
//   );
// };

// export default ProductDetails;
// const styles = StyleSheet.create({
//   slide: {
//     // flex: 1,
//     width: responsiveWidth(70),
//     height: responsiveHeight(35),
//     alignItems: 'center',
//     justifyContent: 'center',
//     // paddingHorizontal: 20,
//     backgroundColor: Colors.white,
//     margin: responsiveHeight(0.5),
//     borderRadius: responsiveHeight(2),
//     elevation: 5,
//   },
//   image: {
//     // width: 280,
//     // height: 280,
//     // marginBottom: 40,
//   },
//   title: {
//     fontSize: 24,
//     color: '#FFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 16,
//     color: '#DDD',
//     textAlign: 'center',
//   },
//   button: {
//     height: responsiveHeight(7.5),
//     borderRadius: responsiveHeight(1),
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: responsiveWidth(90),
//     marginTop: responsiveHeight(3),
//     alignSelf: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   btnText: {
//     color: '#fff',
//     fontSize: responsiveFontSize(2),
//     fontWeight: '600',
//   },
// });
