import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BoldText, NormalText} from './Titles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {Colors} from '../assets/colors';
import {ImageBaseUrl} from '../BaseUrl';
import {images} from '../assets/images';

import {edit} from '../assets/icons';
import SvgIcons from './SvgIcons';

const ServiceCard = ({
  data,
  handlePress,
  handleEdit,
  activeOpacity = 0.7,
}: any) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      style={styles.cardContainer}>
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <FastImage
            style={styles.image}
            source={
              data?.images?.[0]
                ? {uri: `${ImageBaseUrl}${data?.images[0]}` as any}
                : (images.userDummy as any)
            }
            resizeMode={FastImage.resizeMode.cover}
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

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    data?.status === 'Active' ? Colors.buttonBg : '#E8EAFE',
                },
              ]}>
              <NormalText
                fontWeight="500"
                fontSize={responsiveFontSize(1.4)}
                color={
                  data?.status === 'Active' ? Colors.white : Colors.themeText
                }
                title={data?.status || 'Status'}
                txtAlign="center"
              />
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={e => {
              e.stopPropagation();
              handleEdit();
            }}>
            <SvgIcons xml={edit} height={20} width={20} />
          </TouchableOpacity>

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
    alignItems: 'stretch',
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
    justifyContent: 'space-between',
  },
  editIconBtn: {},
});

export default ServiceCard;
