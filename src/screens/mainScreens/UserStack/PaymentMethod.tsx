/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../assets/responsive_dimensions';
import {images} from '../../../assets/images';
import BackIcon from '../../../Components/BackIcon';
import {Colors} from '../../../assets/colors';
import {Button} from '../../../Components/Button';
import {NormalText} from '../../../Components/Titles';
import SvgIcons from '../../../Components/SvgIcons';
import {tick} from '../../../assets/icons';
import TextHeader from '../../../Components/TextHeader';

const PaymentMethod = ({navigation}: any) => {
  const [saveInfo, setSaveInfo] = useState(true);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const cards = [1, 2, 3]; // Dummy data for cards

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TextHeader title="Payment Method" />
        </View>

        {/* Card Horizontal List */}
        <View style={styles.cardSelectorRow}>
          <TouchableOpacity
            style={styles.addCardBtn}
            onPress={() => navigation.navigate('AddCard')}>
            <Octicons name="plus" size={24} color={'#FFFFFF'} />
          </TouchableOpacity>

          <FlatList
            data={cards}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({index}) => {
              const isSelected = selectedCardIndex === index;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCardIndex(index)}
                  activeOpacity={0.9}>
                  <Image
                    source={images.Visa}
                    style={[
                      styles.visaCard,
                      {
                        borderColor: isSelected
                          ? Colors.buttonBg
                          : 'transparent',
                        borderWidth: 2,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Name on Card</Text>
            <TextInput
              placeholder="Jordan Delgado"
              textContentType="none"
              importantForAutofill="no"
              autoCorrect={false}
              placeholderTextColor={'#A6A6A6'}
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              placeholder="**** **** **** 7890"
              placeholderTextColor={'#A6A6A6'}
              keyboardType="numeric"
              textContentType="none" // iOS ke liye
              importantForAutofill="no" // Android ke liye
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputWrapper, {width: responsiveWidth(43)}]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                placeholder="10/27"
                placeholderTextColor={'#A6A6A6'}
                keyboardType="numeric"
                textContentType="none" // iOS ke liye
                importantForAutofill="no" // Android ke liye
                autoCorrect={false}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputWrapper, {width: responsiveWidth(43)}]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                placeholder="***"
                placeholderTextColor={'#A6A6A6'}
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
                textContentType="none" // iOS ke liye
                importantForAutofill="no" // Android ke liye
                autoCorrect={false}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Checkbox Section */}
          <TouchableOpacity
            onPress={() => setSaveInfo(!saveInfo)}
            style={styles.checkboxRow}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: saveInfo ? Colors.buttonBg : 'transparent',
                  borderColor: '#9da5b3',
                },
              ]}>
              {saveInfo && <SvgIcons xml={tick} height={15} width={15} />}
            </View>
            <NormalText
              color={'#9da5b3'}
              title="Save Detailed Information"
              fontWeight="400"
              fontSize={responsiveFontSize(1.8)}
            />
          </TouchableOpacity>

          <View style={styles.btnContainer}>
            <Button
              handlePress={() => navigation.navigate('SuccessScreen')} // or your final step
              textColor="white"
              title="Continue"
              bgColor={Colors.buttonBg}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: responsiveHeight(2),
    marginTop: responsiveHeight(1),
  },
  cardSelectorRow: {
    paddingLeft: responsiveHeight(2),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addCardBtn: {
    height: responsiveHeight(15),
    width: responsiveWidth(13),
    backgroundColor: Colors.buttonBg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaCard: {
    height: responsiveHeight(15),
    width: responsiveWidth(42),
    marginLeft: 10,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  formContainer: {
    paddingHorizontal: responsiveHeight(2),
    marginTop: 10,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DEDEDE',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#FAFAFA',
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.6),
    color: '#666',
    fontWeight: '500',
  },
  textInput: {
    height: 40,
    color: '#000',
    fontSize: responsiveFontSize(2),
    padding: 0,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: responsiveHeight(3),
    alignItems: 'center',
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 1,
  },
  btnContainer: {
    marginTop: responsiveHeight(5),
  },
});

export default PaymentMethod;
