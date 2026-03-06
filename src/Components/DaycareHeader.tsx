import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../assets/responsive_dimensions';
import {edit, notification} from '../assets/icons';
import SvgIcons from './SvgIcons';
import {Colors} from '../assets/colors';
import {useSelector} from 'react-redux';
import {ImageBaseUrl} from '../BaseUrl';
import {NormalText} from './Titles';

const DaycareHeader = ({
  home,
  title,
  bellIcon,
  editProfile,
  navigation,
}: any) => {
  const {businessProfileData} = useSelector((state: any) => state.user);
  const {profileImage, fullName} = businessProfileData || {};

  return (
    <View style={styles.headerView}>
      {home && (
        <View style={styles.profileContainer}>
          <Image
            source={{uri: `${ImageBaseUrl}${profileImage}`}}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <NormalText
              title="Hello,"
              fontSize={responsiveFontSize(1.8)}
              color="#666"
            />
            <NormalText
              title={fullName || 'Guest'}
              fontWeight="700"
              fontSize={responsiveFontSize(2.2)}
            />
          </View>
        </View>
      )}

      {title && (
        <NormalText
          title={title}
          color={Colors.themeText2}
          alignSelf="center"
          fontWeight="900"
          fontSize={responsiveFontSize(2.7)}
        />
      )}

      {bellIcon && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={styles.notificationContainer}>
          <SvgIcons xml={notification} height={25} width={25} />
        </TouchableOpacity>
      )}

      {editProfile && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateBussProfile', {type: 'edit'})
          }
          style={styles.editContainer}>
          <SvgIcons xml={edit} height={25} width={25} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DaycareHeader;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  profileImage: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    borderRadius: responsiveHeight(3),
    backgroundColor: '#f0f0f0',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  notificationContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.buttonBg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
