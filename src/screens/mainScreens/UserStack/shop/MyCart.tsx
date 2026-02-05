/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {store} from '../../../../assets/icons';
import {Colors} from '../../../../assets/colors';
import {BoldText, NormalText} from '../../../../Components/Titles';
import SvgIcons from '../../../../Components/SvgIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BackIcon from '../../../../Components/BackIcon';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../assets/responsive_dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/Store';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  toggleItemSelection,
} from '../../../../redux/cartSlice';

const MyCart = ({navigation}: any) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleIncrease = (
    id: string | number,
    variationId: string | number,
  ) => {
    dispatch(increaseQuantity({id, variationId}));
  };

  const handleDecrease = (
    id: string | number,
    variationId: string | number,
  ) => {
    dispatch(decreaseQuantity({id, variationId}));
  };

  const handleDelete = (id: string | number, variationId: string | number) => {
    dispatch(removeFromCart({id, variationId}));
  };

  const handleToggleSelection = (
    id: string | number,
    variationId: string | number,
  ) => {
    dispatch(toggleItemSelection({id, variationId}));
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => item.isSelected)
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const selectedCount = cartItems.filter(item => item.isSelected).length;

  const renderItem = ({item}: any) => (
    <View style={{marginBottom: responsiveHeight(2)}}>
      <View style={styles.cardContainer}>
        {/* Selection Checkmark */}
        <TouchableOpacity
          onPress={() => handleToggleSelection(item.id, item.variationId)}
          style={[
            styles.checkCircle,
            {backgroundColor: item.isSelected ? Colors.buttonBg : '#C9CFE5'},
          ]}
          activeOpacity={0.7}>
          <Ionicons name="checkmark-sharp" color={Colors.white} size={18} />
        </TouchableOpacity>

        {/* Product Info Card */}
        <View style={styles.productCard}>
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="contain"
          />

          <View style={{flex: 1, marginLeft: 10}}>
            <View style={styles.cardHeader}>
              <BoldText
                fontSize={responsiveFontSize(2)}
                title={item.title}
                color={Colors.black}
              />
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.variationId)}>
                <AntDesign name="delete" color="#F04D96" size={20} />
              </TouchableOpacity>
            </View>

            <BoldText
              fontSize={responsiveFontSize(2)}
              title={`USD ${item.price}`}
              color={Colors.buttonBg}
            />

            <View style={styles.cardFooter}>
              <NormalText
                title={item.subTitle}
                color="#40434D"
                fontSize={responsiveFontSize(1.6)}
              />

              {/* Quantity Selector */}
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => handleDecrease(item.id, item.variationId)}
                  style={styles.quantityBtn}>
                  <AntDesign
                    name="minus"
                    color={item.quantity > 1 ? Colors.buttonBg : '#DBE1FF'}
                    size={16}
                  />
                </TouchableOpacity>

                <NormalText
                  title={item.quantity}
                  fontSize={responsiveFontSize(1.8)}
                />

                <TouchableOpacity
                  onPress={() => handleIncrease(item.id, item.variationId)}
                  style={[styles.quantityBtn, {borderColor: Colors.buttonBg}]}>
                  <AntDesign name="plus" color={Colors.buttonBg} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Conditional Store Branding / Divider */}
      {item.isStore && (
        <View style={styles.storeContainer}>
          <SvgIcons xml={store} height={24} width={24} />
          <BoldText title={item.store} fontSize={responsiveFontSize(1.8)} />
        </View>
      )}
      {item.isHr && <View style={styles.divider} />}
    </View>
  );

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <NormalText title="Your cart is empty" alignSelf="center" />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={styles.scrollContent}>
        <BackIcon title="My Cart" cartCount={selectedCount} />

        <View style={styles.divider} />

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}-${item.variationId}`}
          scrollEnabled={false}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>

      {/* Bottom Sticky Checkout Bar */}
      <View style={styles.checkoutBar}>
        <View>
          <NormalText
            fontSize={responsiveFontSize(1.8)}
            color="#7B7F8F"
            title="Total Amount"
          />
          <BoldText
            color={Colors.black}
            fontSize={responsiveFontSize(2.4)}
            title={`USD ${calculateTotal()}`}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}>
          <Ionicons name="arrow-forward" color={Colors.white} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 100,
    paddingTop: 20,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  divider: {
    height: 1,
    marginTop: 20,
    backgroundColor: '#E5E5E5',
  },
  cardContainer: {flexDirection: 'row', alignItems: 'center', gap: 12},
  checkCircle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {height: responsiveHeight(10), width: responsiveWidth(20)},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControls: {flexDirection: 'row', alignItems: 'center', gap: 12},
  quantityBtn: {
    borderWidth: 1,
    borderColor: '#DBE1FF',
    borderRadius: 6,
    padding: 4,
  },
  storeContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
  },
  checkoutBtn: {
    backgroundColor: Colors.buttonBg,
    width: responsiveWidth(30),
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(64),
  },
  contentContainerStyle: {marginTop: 20, marginRight: 5},
});
