/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Colors} from '../../../../assets/colors';
import {BoldText, NormalText} from '../../../../Components/Titles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../Components/Header';
import {notification} from '../../../../assets/icons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../assets/responsive_dimensions';
import BackIcon from '../../../../Components/BackIcon';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../../redux/Store';
import {ShowToast} from '../../../../GlobalFunctions/Auth';
import {
  createOrder,
  getAllShippingAddresses,
  createShippingAddress,
  deleteShippingAddress,
} from '../../../../GlobalFunctions';
import {CommonActions} from '@react-navigation/native';
import {clearCart} from '../../../../redux/cartSlice';

const AddressInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: any) => (
  <View style={styles.inputWrapper}>
    <NormalText
      title={label}
      fontSize={responsiveFontSize(1.8)}
      color="#40434D"
      fontWeight="600"
    />
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9B9EA9"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        style={styles.textInput}
      />
    </View>
  </View>
);

const Checkout = ({navigation}: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const token = useSelector((state: RootState) => state.user.token);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const selectedItems = cartItems.filter(item => item.isSelected);
  const refRBSheet = useRef<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<any>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsFetchingAddresses(true);
    try {
      const res: any = await getAllShippingAddresses(token);
      console.log('Fetched Addresses:', res);
      if (res?.success) {
        setAddresses(res.data || []);
        if (res.data?.length > 0) {
          // If the selected address is not in the new list, select the first one
          const stillExists = res.data.find(
            (a: any) => a._id === selectedAddressId,
          );
          if (!stillExists) {
            setSelectedAddressId(res.data[0]._id);
          }
        } else {
          setSelectedAddressId(null);
        }
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
    } finally {
      setIsFetchingAddresses(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res: any = await deleteShippingAddress(id, token);
      if (res?.success) {
        ShowToast('success', 'Address deleted successfully');
        fetchAddresses();
      }
    } catch (error) {
      console.log('Error deleting address:', error);
      ShowToast('error', 'Failed to delete address');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = selectedItems.length > 5 ? 20.0 : 0.0;
  const total = subtotal + shippingFee;

  const paymentData = [
    {id: 1, title: 'Subtotal', value: subtotal.toFixed(2), isBold: false},
    {
      id: 2,
      title: 'Shipping Fee',
      value: shippingFee.toFixed(2),
      isBold: false,
    },
    {id: 3, title: 'Total', value: total.toFixed(2), isBold: true},
  ];

  const handleCheckOut = async () => {
    if (!selectedAddressId) {
      ShowToast('error', 'Please select a shipping address');
      return;
    }

    const orderPayload = {
      userId: userData?._id,
      items: selectedItems.map(item => ({
        productId: item.id,
        variationId: item.variationId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddressId: selectedAddressId,
      paymentMethod: 'Card',
      subtotal: subtotal,
      tax: 0,
      shippingFee: shippingFee,
      discount: 0,
      totalAmount: total,
    };

    console.log('Order Payload:', JSON.stringify(orderPayload, null, 2));

    setIsLoading(true);
    await createOrder(JSON.stringify(orderPayload), token)
      ?.then((res: any) => {
        console.log('Response in createOrder:-', res);
        ShowToast('success', 'Order created successfully');

        // Clear the cart after successful order
        dispatch(clearCart());

        // Reset navigation to clear the Shop stack and go to Home
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeStack'}],
          }),
        );
      })
      .catch((err: any) => {
        console.log('Error in createOrder:-', err);
        ShowToast('error', 'Failed to create order');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // console.log('Selected Address ID:-', selectedAddressId);

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={{paddingHorizontal: responsiveWidth(2)}}>
          <BackIcon title="Check Out" />

          {/* Payment Info Section */}
          <View style={{marginTop: responsiveHeight(3)}}>
            <BoldText
              title="Payment Information"
              color={Colors.black}
              fontSize={responsiveFontSize(2.3)}
            />
            {/* <NormalText
              mrgnTop={responsiveHeight(0.5)}
              title="12 Dec 2026, 08:08 • Credit / Debit Card"
              color="#9B9EA9"
            /> */}

            <View style={styles.paymentBox}>
              {paymentData.map(item => (
                <View key={item.id} style={styles.paymentRow}>
                  <NormalText
                    fontSize={responsiveFontSize(2)}
                    title={item.title}
                    fontWeight={item.isBold ? '800' : '400'}
                    color={item.isBold ? Colors.black : '#40434D'}
                  />
                  <NormalText
                    fontSize={responsiveFontSize(2)}
                    title={`USD ${item.value}`}
                    fontWeight={item.isBold ? '800' : '400'}
                    color={item.isBold ? Colors.buttonBg : '#40434D'}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Address Section */}
          <View style={{marginTop: responsiveHeight(2)}}>
            <View style={{marginBottom: responsiveHeight(3)}}>
              <View style={styles.sectionHeader}>
                <BoldText
                  color={Colors.black}
                  fontSize={responsiveFontSize(2.2)}
                  title={'Shipping Address'}
                />
                <TouchableOpacity onPress={() => refRBSheet.current?.open()}>
                  <NormalText
                    fontSize={responsiveFontSize(1.8)}
                    title="Add"
                    color="#4C69FF"
                    fontWeight="600"
                  />
                </TouchableOpacity>
              </View>

              {isFetchingAddresses ? (
                <ActivityIndicator
                  color={Colors.buttonBg}
                  style={{marginTop: responsiveHeight(2)}}
                />
              ) : addresses.length > 0 ? (
                <View style={{marginTop: responsiveHeight(2)}}>
                  {addresses.map((item: any) => {
                    const isActive = item._id === selectedAddressId;
                    return (
                      <TouchableOpacity
                        key={item._id}
                        onPress={() => setSelectedAddressId(item._id)}
                        activeOpacity={0.8}
                        style={[
                          styles.addressCard,
                          isActive && styles.activeAddressCard,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <View style={{flex: 1}}>
                          <NormalText
                            color={Colors.black}
                            fontSize={responsiveFontSize(2)}
                            title={item.fullName}
                            fontWeight="700"
                          />
                          <NormalText
                            color="#5F6063"
                            fontSize={responsiveFontSize(1.7)}
                            title={`${item.address}, ${item.city}, ${item.zipCode}`}
                            mrgnTop={responsiveHeight(0.5)}
                          />
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            gap: responsiveHeight(1),
                          }}>
                          {isActive && (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#4C69FF"
                            />
                          )}
                          <TouchableOpacity
                            onPress={() => handleDeleteAddress(item._id)}
                            style={{
                              padding: 5,
                              backgroundColor: '#4C69FF',
                              borderRadius: 20,
                            }}>
                            <Ionicons
                              name="trash-outline"
                              color="white"
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <NormalText
                  fontSize={responsiveFontSize(1.9)}
                  title="No saved addresses found. Please add one."
                  color="#9B9EA9"
                  mrgnTop={responsiveHeight(2)}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Section */}
      <View style={styles.bottomBar}>
        <View>
          <NormalText
            color="#7B7F8F"
            fontSize={responsiveFontSize(1.8)}
            title="Total Amount"
          />
          <BoldText
            color={Colors.black}
            fontSize={responsiveFontSize(2.4)}
            title={`USD ${total.toFixed(2)}`}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCheckOut}
          disabled={isLoading}>
          <LinearGradient
            colors={['#3A8DFF', '#00E0C6']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.btnText}>Check Out</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Shipping Address RBSheet */}
      <RBSheet
        ref={refRBSheet}
        height={responsiveHeight(80)}
        draggable
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{flex: 1}}>
          <View style={styles.sheetHeader}>
            <BoldText title="Edit Shipping Address" />
            <TouchableOpacity onPress={() => refRBSheet.current?.close()}>
              <Ionicons name="close" color={Colors.black} size={28} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}>
            <View style={styles.formContainer}>
              <AddressInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(txt: string) =>
                  handleInputChange('fullName', txt)
                }
              />
              <AddressInput
                label="Street Address"
                placeholder="Enter street address"
                value={formData.streetAddress}
                onChangeText={(txt: string) =>
                  handleInputChange('streetAddress', txt)
                }
              />
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <AddressInput
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChangeText={(txt: string) =>
                      handleInputChange('city', txt)
                    }
                  />
                </View>
                <View style={{flex: 1}}>
                  <AddressInput
                    label="State"
                    placeholder="State"
                    value={formData.state}
                    onChangeText={(txt: string) =>
                      handleInputChange('state', txt)
                    }
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <AddressInput
                    label="Zip Code"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChangeText={(txt: string) =>
                      handleInputChange('zipCode', txt)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={{flex: 1}}>
                  <AddressInput
                    label="Phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChangeText={(txt: string) =>
                      handleInputChange('phone', txt)
                    }
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={async () => {
                const {fullName, streetAddress, city, state, zipCode, phone} =
                  formData;
                if (
                  !fullName ||
                  !streetAddress ||
                  !city ||
                  !state ||
                  !zipCode ||
                  !phone
                ) {
                  ShowToast('error', 'Please fill all details');
                  return;
                }

                setIsLoading(true);
                try {
                  const addrPayload = {
                    userId: userData?._id,
                    fullName,
                    address: streetAddress,
                    city,
                    state,
                    zipCode,
                    phoneNumber: phone,
                  };
                  const res: any = await createShippingAddress(
                    JSON.stringify(addrPayload),
                    token,
                  );
                  if (res?.success) {
                    ShowToast('success', 'Address added successfully');
                    await fetchAddresses();
                    refRBSheet.current?.close();
                    setFormData({
                      fullName: '',
                      streetAddress: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      phone: '',
                    });
                  }
                } catch (error) {
                  console.log('Error creating address:', error);
                  ShowToast('error', 'Failed to add address');
                } finally {
                  setIsLoading(false);
                }
              }}
              activeOpacity={0.8}
              disabled={isLoading}
              style={{marginTop: responsiveHeight(4)}}>
              <LinearGradient
                colors={['#3A8DFF', '#00E0C6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.saveBtn}>
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.btnText}>Save Address</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(12), // Space for sticky button
    paddingTop: responsiveHeight(2),
  },
  paymentBox: {
    marginTop: responsiveHeight(2),
    backgroundColor: '#F9FAFB',
    padding: responsiveHeight(2),
    borderRadius: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: responsiveHeight(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2.5),
    borderTopWidth: 1,
    borderColor: '#EEE',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientButton: {
    height: responsiveHeight(6.5),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(40),
  },
  btnText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  sheetScroll: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(4),
  },
  formContainer: {
    marginTop: responsiveHeight(2),
    gap: responsiveHeight(2.5),
  },
  inputWrapper: {
    gap: responsiveHeight(1),
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth(4),
    height: responsiveHeight(6.5),
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  textInput: {
    color: Colors.black,
    fontSize: responsiveFontSize(1.9),
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
  },
  saveBtn: {
    height: responsiveHeight(7),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: '#F9FAFB',
    padding: responsiveHeight(1.5),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginBottom: responsiveHeight(1.5),
  },
  activeAddressCard: {
    borderColor: '#4C69FF',
    backgroundColor: '#F0F3FF',
  },
});

export default Checkout;

// /* eslint-disable react-native/no-inline-styles */
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import React from 'react';
// import {notification} from '../../../../assets/icons';
// import {Colors} from '../../../../assets/colors';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from '../../../../assets/responsive_dimensions';
// import Header from '../../../../Components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {BoldText, NormalText} from '../../../../Components/Titles';
// import LinearGradient from 'react-native-linear-gradient';

// const Checkout = ({navigation}: any) => {
//   const paymentData = [
//     {id: 1, title: 'Subtotal', value: '280.00', isBold: false},
//     {id: 2, title: 'Shipping Fee', value: '20.00', isBold: false},
//     {id: 3, title: 'Total', value: '300.00', isBold: true},
//   ];

//   const data = [
//     {
//       id: 1,
//       title: 'Shipping Address',
//       value: '22 Baker Street London MG91 9AF',
//       navigateTo: 'ChangeDetails',
//     },
//     {
//       id: 2,
//       title: 'Billing Address',
//       value: '22 Baker Street London MG91 9AF',
//       navigateTo: 'ChangeDetails',
//     },
//   ];

//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingVertical: responsiveHeight(4),
//         backgroundColor: Colors.white,
//       }}>
//       <View style={{flex: 1, paddingHorizontal: responsiveHeight(2)}}>
//         <Header
//           handleFilterPress={() => navigation.navigate('Filter2')}
//           iconName={notification}
//           handleNotificationPress={() => navigation.navigate('Notification')}
//           handlePress={() => navigation.navigate('Location')}
//           bgColor=""
//           whiteNotification={false}
//         />

//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={{marginTop: responsiveHeight(3.5)}}>
//           <Ionicons name="arrow-back" color={Colors.black} size={30} />
//         </TouchableOpacity>

//         <BoldText
//           mrgnTop={responsiveHeight(2)}
//           title="Check Out"
//           color={Colors.black}
//         />
//         <BoldText
//           mrgnTop={responsiveHeight(2)}
//           title="Payment Information"
//           color={Colors.black}
//           fontSize={responsiveFontSize(2.3)}
//           fontWeight="700"
//         />
//         <NormalText
//           mrgnTop={responsiveHeight(1)}
//           title="12 Dec 2018, 08:08 • Credit / Debit Card"
//           color="#9B9EA9"
//         />

//         {/* Payment Details */}
//         <View>
//           <FlatList
//             contentContainerStyle={{
//               gap: responsiveHeight(1.5),
//               marginTop: responsiveHeight(2),
//             }}
//             data={paymentData}
//             keyExtractor={item => item.id.toString()}
//             renderItem={({item}) => (
//               <View
//                 style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                 <NormalText
//                   fontSize={responsiveFontSize(2.1)}
//                   title={item.title}
//                   fontWeight={item.isBold ? '800' : '400'}
//                 />
//                 <NormalText
//                   fontSize={responsiveFontSize(2.1)}
//                   title={`USD ${item.value}`}
//                   fontWeight={item.isBold ? '800' : '400'}
//                 />
//               </View>
//             )}
//           />
//         </View>
//         {/* Address Section */}
//         <View style={{marginTop: responsiveHeight(3)}}>
//           <FlatList
//             contentContainerStyle={{gap: responsiveHeight(3)}}
//             data={data}
//             keyExtractor={item => item.id.toString()}
//             renderItem={({item}) => (
//               <View>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                   }}>
//                   <BoldText
//                     color={Colors.black}
//                     fontSize={responsiveFontSize(2.4)}
//                     title={item.title}
//                   />
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate(item.navigateTo)}>
//                     <NormalText
//                       fontSize={responsiveFontSize(2.2)}
//                       title="Change"
//                       color="#4C69FF"
//                     />
//                   </TouchableOpacity>
//                 </View>
//                 <NormalText
//                   fontSize={responsiveFontSize(2.2)}
//                   title={item.value}
//                   color={Colors.black}
//                   width={responsiveWidth(40)}
//                   mrgnTop={responsiveHeight(1)}
//                 />
//               </View>
//             )}
//           />
//         </View>

//         {/* Total + Checkout Button */}
//         <View style={{flex: 1, justifyContent: 'flex-end'}}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginTop: responsiveHeight(3),
//             }}>
//             <View>
//               <NormalText
//                 color="#7B7F8F"
//                 fontSize={responsiveFontSize(2.2)}
//                 title="Total"
//               />
//               <NormalText
//                 color={Colors.black}
//                 fontSize={responsiveFontSize(2.2)}
//                 fontWeight="700"
//                 title="USD 300.00"
//               />
//             </View>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('PaymentMethod')}
//               activeOpacity={0.8}>
//               <LinearGradient
//                 colors={['#3A8DFF', '#00E0C6']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.button}>
//                 <Text style={styles.btnText}>Check Out</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default Checkout;

// const styles = StyleSheet.create({
//   button: {
//     height: responsiveHeight(6.2),
//     borderRadius: responsiveHeight(1),
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: responsiveWidth(37),
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
