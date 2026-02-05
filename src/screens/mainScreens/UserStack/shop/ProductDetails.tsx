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

import TitleContainer from '../../../../Components/TitleContainer';
import {BoldText, NormalText} from '../../../../Components/Titles';
import {Colors} from '../../../../assets/colors';
import {images} from '../../../../assets/images';
import {ImageBaseUrl} from '../../../../BaseUrl';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../../../redux/cartSlice';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../assets/responsive_dimensions';
import BackIcon from '../../../../Components/BackIcon';

const ProductDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const item = route.params || {};
  const refRBSheet = useRef<any>(null);
  const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    const cartItem = {
      id: item._id,
      variationId: selectedVariation?._id,
      title: item.productName,
      subTitle: item.brandName || '',
      image:
        item.images?.length > 0
          ? {uri: `${ImageBaseUrl}${item.images[0]}`}
          : images.product,
      price: selectedVariation?.price || 0,
      quantity: currentValue,
    };
    dispatch(addToCart(cartItem));
    refRBSheet.current?.close();
    navigation.goBack();
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScroll}>
        <View style={{paddingHorizontal: responsiveHeight(2)}}>
          <BackIcon title={item?.productName} />

          {/* Swiper Section */}
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
              onPress={() => refRBSheet.current?.open()}
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
            onPress={() => refRBSheet.current?.close()}
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

          <TouchableOpacity onPress={handleAddToCart} activeOpacity={0.8}>
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

export default ProductDetails;

const styles = StyleSheet.create({
  mainScroll: {paddingVertical: responsiveHeight(2), flexGrow: 1},
  swiperContainer: {
    height: responsiveHeight(40),
    marginTop: responsiveHeight(2),
  },
  slide: {
    height: responsiveHeight(35),
    width: responsiveWidth(85),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 10,
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
