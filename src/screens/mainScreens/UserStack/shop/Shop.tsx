import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../../../assets/colors';
import {BoldText, NormalText} from '../../../../Components/Titles';
import {images} from '../../../../assets/images';
import {notification, search} from '../../../../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../assets/responsive_dimensions';
import {getAllProducts} from '../../../../GlobalFunctions/Auth';
import {ImageBaseUrl} from '../../../../BaseUrl';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../../../redux/cartSlice';
import {RootState} from '../../../../redux/Store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserHeader from '../../../../Components/UserHeader';
import FastImage from 'react-native-fast-image';

const PRODUCT_DATA = [1, 2, 3, 4, 5, 6, 7, 8]; // Replace with real data later

const Shop = ({navigation}: {navigation: any}) => {
  const [products, setProducts] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    _getAllProducts();
  }, []);

  const _getAllProducts = async () => {
    setLoader(true);
    await getAllProducts()
      ?.then((res: any) => {
        setProducts(res?.data);
        setLoader(false);
      })
      ?.catch((err: any) => {
        console.log('err in getAllProducts:-', err);
        setLoader(false);
      });
  };

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item._id,
      variationId: item.variations?.[0]?._id,
      title: item.productName,
      subTitle: item.brandName || '',
      image:
        item.images?.length > 0
          ? {uri: `${ImageBaseUrl}${item.images[0]}`}
          : images.product,
      price: item.variations?.[0]?.price || 0,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
    console.log('Added to cart', cartItem);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    let productImage =
      item?.images?.length > 0 ? `${ImageBaseUrl}${item?.images?.[0]}` : '';
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', {...item})}
        activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <FastImage
            source={
              productImage ? {uri: productImage} : (images.product as any)
            }
            style={styles.productImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View style={{padding: responsiveHeight(1)}}>
          <BoldText
            color={Colors.labelText}
            title={item?.productName}
            fontSize={responsiveFontSize(1.8)}
          />

          <View style={styles.priceRow}>
            <View style={styles.priceBadge}>
              <NormalText
                color={Colors.buttonBg}
                alignSelf="center"
                title={`$${item?.variations?.[0]?.price?.toFixed(1)}`}
              />
            </View>

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddToCart(item)}>
              <NormalText color={Colors.white} title="Add to Cart" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleAddPress = (item: any) => {
    handleAddToCart(item);
  };

  if (loader) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.buttonBg} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <UserHeader title="Products" navigation={navigation} centerText={true} />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('MyCart')}
        activeOpacity={0.8}>
        <Ionicons name="cart-outline" size={28} color={Colors.white} />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <NormalText
              title={totalItems.toString()}
              color={Colors.white}
              fontSize={responsiveFontSize(1.2)}
              alignSelf="center"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: responsiveHeight(2),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(3),
  },
  productCard: {
    width: responsiveWidth(44),
    borderRadius: responsiveHeight(2),
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // borderColor: Colors?.buttonBg,
    // borderWidth: 0.3,
    // backgroundColor: 'red',
  },
  imageContainer: {
    height: responsiveHeight(20),
    width: '100%',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
  },
  productImage: {
    height: '90%',
    width: '90%',
  },
  priceRow: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    padding: responsiveHeight(1),
    backgroundColor: Colors.buttonBg,
    borderRadius: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    right: responsiveWidth(6),
    backgroundColor: Colors.buttonBg,
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderRadius: responsiveWidth(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default Shop;
