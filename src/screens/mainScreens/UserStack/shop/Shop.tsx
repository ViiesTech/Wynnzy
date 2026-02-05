import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Header from '../../../../Components/Header';
import SearchInput from '../../../../Components/SearchInput';
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

const PRODUCT_DATA = [1, 2, 3, 4, 5, 6, 7, 8]; // Replace with real data later

const Shop = ({navigation}: {navigation: any}) => {
  const [products, setProducts] = useState<any>([]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    _getAllProducts();
  }, []);

  const _getAllProducts = async () => {
    await getAllProducts()
      ?.then((res: any) => setProducts(res?.data))
      ?.catch((err: any) => console.log('err in getAllProducts:-', err));
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
          <Image
            style={styles.productImage}
            source={productImage ? {uri: productImage} : images.product}
            resizeMode="contain"
          />
        </View>

        <BoldText
          color={Colors.labelText}
          title={item?.productName}
          mrgnTop={responsiveHeight(1.2)}
          fontSize={responsiveFontSize(2)}
          alignSelf="left"
        />

        <View style={styles.priceRow}>
          <View style={styles.priceBadge}>
            <NormalText
              color="#5F6063"
              alignSelf="center"
              title={`$${item?.variations?.[0]?.price}`}
            />
          </View>
          <TouchableOpacity onPress={() => handleAddToCart(item)}>
            <NormalText
              alignSelf="center"
              color={Colors.buttonBg}
              title="Add to Cart"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleAddPress = (item: any) => {
    handleAddToCart(item);
  };

  // Move everything above the list here to maintain scrolling
  const ListHeader = () => {
    return (
      <View style={styles.header}>
        {/* <Header
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
        /> */}

        <BoldText
          color={Colors.labelText}
          title="Products"
          mrgnTop={responsiveHeight(3)}
          fontSize={responsiveFontSize(2.3)}
          alignSelf="left"
        />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={ListHeader}
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
  },
  imageContainer: {
    borderWidth: 1.5,
    width: '100%',
    height: responsiveHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors?.buttonBg || '#EEE',
    borderRadius: responsiveHeight(2),
    backgroundColor: '#FAFAFA',
  },
  productImage: {
    height: '80%',
    width: '80%',
  },
  priceRow: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Shop;
