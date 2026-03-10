import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Assets & Utils
import {Colors} from '../../../assets/colors';
import {ImageBaseUrl} from '../../../BaseUrl';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {arrowForwardSmall, visaMastercard} from '../../../assets/icons';

// Components
import {Button} from '../../../Components/Button';
import SvgIcons from '../../../Components/SvgIcons';
import {NormalText} from '../../../Components/Titles';
import {ShowToast, updateBookingStatus} from '../../../GlobalFunctions/Auth';
import UserHeader from '../../../Components/UserHeader';

const Payment = ({navigation, route}: any) => {
  const {
    allServices,
    total,
    selectDate,
    bookingId,
    address,
    managerId,
    petId,
    userId,
    serviceId,
    categoryId,
  } = route?.params;

  const [isLoading, setIsLoading] = useState(false);

  const handlePayNow = async (status: string) => {
    let payload = {
      bookingId: bookingId,
      status: status,
      paymentStatus: 'Succeeded',
    };
    console.log('payload:-', payload);
    try {
      setIsLoading(true);
      const response = await updateBookingStatus(
        bookingId,
        status,
        'Succeeded',
      );
      if (response?.success) {
        ShowToast('success', response.message);
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Update failed');
      }
    } catch (error) {
      ShowToast('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <UserHeader
          title="Payment"
          backIcon={true}
          navigation={navigation}
          centerText={true}
        />

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
            <Text style={styles.heading}>Booking Dates</Text>
            <Text style={styles.priceText}>
              {Array.isArray(selectDate) ? selectDate.length : 1} Days
            </Text>
          </View>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentMethod')}
          activeOpacity={0.7}
          style={styles.paymentSelector}>
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
          title="Pay Now"
          isLoading={isLoading}
          bgColor={Colors.buttonBg}
          textColor={Colors.white}
          handlePress={() => handlePayNow('Accept')}
        />
      </View>
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
