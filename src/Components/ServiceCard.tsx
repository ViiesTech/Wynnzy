import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {BoldText, NormalText} from './Titles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';
import {ImageBaseUrl} from '../BaseUrl';
import {images} from '../assets/images';

const ServiceCard = ({data, handlePress}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.cardContainer}>
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <Image
            style={styles.image}
            source={
              data?.images?.[0]
                ? {uri: `${ImageBaseUrl}${data?.images[0]}`}
                : images.userDummy
            }
          />

          <View style={styles.infoContainer}>
            <BoldText
              color={Colors.themeText}
              fontSize={responsiveFontSize(2.2)}
              fontWeight="700"
              title={data?.serviceName || 'N/A'}
            />

            <NormalText
              fontSize={responsiveFontSize(1.6)}
              color="#9DA5B3"
              numberOfLines={2}
              title={data?.description || 'No description provided'}
            />

            <View style={styles.statusBadge}>
              <NormalText
                fontWeight="800"
                fontSize={responsiveFontSize(1.4)}
                color={Colors.themeText}
                title={data?.status || 'Status'}
                txtAlign="center"
              />
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <BoldText
            fontSize={responsiveFontSize(2)}
            color={Colors.themeText}
            title={`$${data?.price?.toFixed(1) || 0}`}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: responsiveHeight(1.5),
    borderColor: '#EFEFEF',
    borderWidth: 2,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    backgroundColor: Colors.white,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1, // Takes up available space
    gap: responsiveWidth(3),
  },
  image: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    borderRadius: responsiveHeight(1),
    backgroundColor: '#F5F5F5',
  },
  infoContainer: {
    flex: 1, // Allows text to wrap within the bounds
    gap: responsiveHeight(0.5),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E8EAFE',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: responsiveWidth(2),
  },
});

export default ServiceCard;
