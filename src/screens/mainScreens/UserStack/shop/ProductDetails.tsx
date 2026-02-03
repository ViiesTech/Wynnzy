/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../../../Components/Header';
import { Colors } from '../../../../assets/colors';
import { notification, search } from '../../../../assets/icons';
import SearchInput from '../../../../Components/SearchInput';
import { BoldText, NormalText } from '../../../../Components/Titles';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../../assets/responsive_dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TitleContainer from '../../../../Components/TitleContainer';
import Swiper from 'react-native-swiper';
import { images } from '../../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const ProductDetails = ({ navigation }) => {
  const data = [
    { id: 1, title: 'Category', value: 'Cat Foods' },
    { id: 2, title: 'Brand', value: 'Nike' },
    { id: 3, title: 'Model', value: 'Lorem ipsum ' },
  ];
  const refRBSheet = useRef(null);
  const slides = [
    {
      id: 1,
      image: images.product2,
    },
    {
      id: 2,
      image: images.product2,

    },
    {
      id: 3,
      image: images.product2,

    },
  ];

  const variationData = [
    { id: 1, image: images.product },
    { id: 2, image: images.product },
    { id: 3, image: images.product },
  ];
  const [activeVariation, setActiveVariation] = useState(1);
  const [currentValue, setCurrentValue] = useState(1);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingVertical: responsiveHeight(4), backgroundColor: Colors.white }}>
        <View style={{ paddingHorizontal: responsiveHeight(2) }}>
          <Header
            handleFilterPress={() => navigation.navigate('Filter2')}
            iconName={notification}
            handleNotificationPress={() => navigation.navigate('Notification')}
            handlePress={() => navigation.navigate('Location')}
            bgColor={''}
            whiteNotification={false}
          />
          <SearchInput txtColor={Colors.black} xml={search} placeHolder="Find best Hotels and Pet Care" placeHolderColor="#CACACA" bgColor="#F6F6F6" />
          <BoldText
            color={Colors.labelText}
            title="Products"
            mrgnTop={responsiveHeight(3)}
            fontSize={responsiveFontSize(2.3)}
            alignSelf="left"
          />
          <View style={{ height: responsiveHeight(40), marginTop: responsiveHeight(4), paddingHorizontal: responsiveWidth(5) }}>
            <Swiper
              dotStyle={{ backgroundColor: '#D9D9D9', width: 8, height: 8, borderRadius: 4 }}
              activeDotStyle={{ backgroundColor: '#557DFB', width: 8, height: 8, borderRadius: 4 }}
              paginationStyle={{ bottom: responsiveHeight(-0.1) }} // move dots below the image cards
            >
              {slides.map(item => (
                <View key={item.id} style={styles.slide}>
                  <Image source={item.image} style={styles.image} resizeMode="contain" />
                </View>
              ))}
            </Swiper>
          </View>
          <View style={{ marginTop: responsiveHeight(2) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{}}>
                <BoldText fontSize={responsiveFontSize(2.3)} color={Colors.labelText} title="Lorem ipusm Lorem ipusm" />
                <BoldText fontSize={responsiveFontSize(2.3)} color={Colors.buttonBg} title="USD 180.00" />
              </View>
              <View style={{}}>
                <Ionicons size={25} name="heart" color="#F04D96" />
                <NormalText fontWeight="700" title="308" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: responsiveHeight(4), marginTop: responsiveHeight(2) }}>
              <TitleContainer title="4.8 ⭑" subTitle="Ratings" />
              <TitleContainer title="63" subTitle="Sold" />
              <TitleContainer title="Free Shipping" subTitle="Orders above USD 99" />
            </View>
          </View>
          <View style={{ borderWidth: 1.2, borderColor: '#E5E5E5', marginTop: responsiveHeight(3) }} />
          <View style={{ marginTop: responsiveHeight(2) }}>
            <NormalText fontSize={responsiveFontSize(2.1)} fontWeight="600" color={Colors.black} title="Product Details" />
            <View>
              <FlatList contentContainerStyle={{ gap: responsiveHeight(2), marginTop: responsiveHeight(2) }} data={data} renderItem={({ item, indeex }) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <NormalText color="#40434D" title={item?.title} fontSize={responsiveFontSize(2.2)} />
                    <NormalText color={Colors.labelText} title={item?.value} fontSize={responsiveFontSize(2.2)} />
                  </View>
                );
              }} />
            </View>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#3A8DFF', '#00E0C6']} // Blue → Teal gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.btnText}>Add To Cart</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        height={responsiveHeight(70)}
        draggable={true}
        openDuration={500}
        closeDuration={500}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        enablePanDownToClose={true}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: responsiveHeight(2), flexGrow: 1 }}>

          <TouchableOpacity onPress={() => refRBSheet.current.close()} style={{ alignSelf: 'flex-end' }}>
            <Ionicons name="close" color={Colors.black} size={30} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
            <Image style={{ height: responsiveHeight(19) }} source={images.product} />
            <View style={{ height: responsiveHeight(16), justifyContent: 'space-around' }}>
              <View >
                <NormalText fontWeight="800" fontSize={responsiveFontSize(2.1)} title="Lorem ipsum " />
                <BoldText mrgnTop={responsiveHeight(0.5)} color="#4C69FF" fontSize={responsiveFontSize(2.1)} title="USD 180.00" />
              </View>
              <View>
                <NormalText fontSize={responsiveFontSize(2.1)} title="Color: Laser Fuschia" />
                <NormalText mrgnTop={responsiveHeight(0.5)} fontSize={responsiveFontSize(2.1)} title="Style: 538416-021" />
              </View>
            </View>
          </View>
          <View style={{ borderWidth: 1.2, borderColor: '#E5E5E5', marginTop: responsiveHeight(3) }} />
          <View style={{}}>
            <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
              <NormalText fontWeight="700" mrgnTop={responsiveHeight(3)} fontSize={responsiveFontSize(2)} title="Variation" alignSelf="center" />
              <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: responsiveHeight(2), marginTop: responsiveHeight(3), paddingHorizontal: responsiveHeight(3) }} horizontal data={variationData} renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => setActiveVariation(item.id)} style={{ padding: responsiveHeight(1), borderWidth: item.id === activeVariation ? 1.5 : null, borderColor: item.id === activeVariation ? '#4C69FF' : null, borderRadius: responsiveHeight(1) }}>
                    <Image source={images.product} />
                    {item.id === activeVariation && (
                      <View style={{ backgroundColor: '#4C69FF', position: 'absolute', right: -10, top: -11, zIndex: 10, height: responsiveHeight(4.2), width: responsiveWidth(7.8), borderRadius: responsiveHeight(2), justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="checkmark-sharp" color={Colors.white} size={20} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(4) }}>
            <NormalText fontWeight="700" fontSize={responsiveFontSize(2)} title="Size" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
              <NormalText fontWeight="700" fontSize={responsiveFontSize(2)} title="UK 10" />
              <TouchableOpacity>
                <Ionicons name="chevron-forward" color="#C9CFE5" size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveHeight(4) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
              <NormalText alignSelf='center' fontWeight="700" fontSize={responsiveFontSize(2)} title="Quantity" />
              <NormalText alignSelf='center' color="#9B9EA9" fontSize={responsiveFontSize(1.9)} title="Only 3 left" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
              <TouchableOpacity onPress={() => {
                if (currentValue > 1) {
                  setCurrentValue(currentValue - 1);
                }
              }} style={{ borderWidth: 1.5, borderColor: currentValue > 1 ? '#4C69FF' : '#DBE1FF', padding: responsiveHeight(1), borderRadius: responsiveHeight(1) }}>
                <AntDesign name="minus" color={currentValue > 1 ? '#4C69FF' : '#DBE1FF'} size={20} />
              </TouchableOpacity>
              <NormalText fontSize={responsiveFontSize(2)} title={currentValue} alignSelf="center" />
              <TouchableOpacity onPress={() => setCurrentValue(currentValue + 1)} style={{ borderWidth: 1.5, borderColor: '#4C69FF', padding: responsiveHeight(1), borderRadius: responsiveHeight(1) }}>
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
              colors={['#3A8DFF', '#00E0C6']} // Blue → Teal gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.btnText}>Add To Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </RBSheet>
    </>
  );
};

export default ProductDetails;
const styles = StyleSheet.create({
  slide: {
    // flex: 1,
    width: responsiveWidth(70),
    height: responsiveHeight(35),
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 20,
    backgroundColor: Colors.white,
    margin: responsiveHeight(0.5),
    borderRadius: responsiveHeight(2),
    elevation: 5,
  },
  image: {
    // width: 280,
    // height: 280,
    // marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#DDD',
    textAlign: 'center',
  },
  button: {
    height: responsiveHeight(7.5),
    borderRadius: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(90),
    marginTop: responsiveHeight(3),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },
});
